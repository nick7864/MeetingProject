import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWorkspaceProject } from '../../mock/reportWorkspaceData';
import { PresentationPage } from './PresentationPage';

describe('PresentationPage', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('blocks content when no locked version exists', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    render(<PresentationPage project={project} />);

    expect(screen.getByText('尚未有鎖定版本')).toBeInTheDocument();
  });

  it('renders toolbar and department flow for latest locked version', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    const lockedVersion = {
      ...project.versions[0],
      isLocked: true,
      versionNo: 3,
    };
    project.versions = [project.versions[0], lockedVersion];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v3 (已鎖定)';

    render(<PresentationPage project={project} />);

    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    expect(screen.getByRole('button', { name: '全螢幕' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '大字' })).toBeInTheDocument();
    expect(screen.getByText('v3 (已鎖定)')).toBeInTheDocument();

    const tablist = screen.getByRole('tablist', { name: '部門導覽' });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual(['業務部', '研發部', '營運部', '公關部']);
  });

  it('blocks report start when cover metadata is incomplete', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 2 }];
    project.presentation.cover.meetingDateTime = '';
    project.presentation.cover.versionInfo = '';

    render(<PresentationPage project={project} />);

    expect(screen.getByText('請先完成封面設定')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '開始報告' })).toBeDisabled();
  });

  it('shows cover sign-in entry and return-to-cover flow', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 4 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v4 (已鎖定)';

    render(<PresentationPage project={project} />);

    expect(screen.getByRole('button', { name: '我要簽到' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));
    expect(screen.getByRole('button', { name: '回封面' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '回封面' }));
    expect(screen.getByRole('button', { name: '開始報告' })).toBeInTheDocument();
  });

  it('scrolls to department section when department tab clicked', () => {
    const scrollSpy = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollSpy;

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [
      {
        ...project.versions[0],
        isLocked: true,
        versionNo: 2,
      },
    ];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v2 (已鎖定)';

    render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));
    fireEvent.click(screen.getByRole('tab', { name: '研發部' }));

    expect(scrollSpy).toHaveBeenCalled();
  });

  it('auto-hides toolbar in fullscreen and reveals it from top boundary', () => {
    vi.useFakeTimers();

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 5 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v5 (已鎖定)';

    render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    const toolbar = screen.getByTestId('presentation-toolbar');
    expect(toolbar).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByRole('button', { name: '全螢幕' }));
    vi.advanceTimersByTime(1700);

    expect(toolbar).toHaveAttribute('hidden');

    fireEvent.mouseEnter(screen.getByTestId('fullscreen-toolbar-reveal'));
    expect(toolbar).not.toHaveAttribute('hidden');
  });

  it('toggles between normal and large font modes', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 6 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v6 (已鎖定)';

    const { container } = render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    const root = container.querySelector('[data-font-mode]');
    expect(root).toHaveAttribute('data-font-mode', 'normal');

    fireEvent.click(screen.getByRole('button', { name: '大字' }));
    expect(root).toHaveAttribute('data-font-mode', 'large');
    expect(screen.getByRole('button', { name: '一般字' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '一般字' }));
    expect(root).toHaveAttribute('data-font-mode', 'normal');
    expect(screen.getByRole('button', { name: '大字' })).toBeInTheDocument();
  });

  it('uses configurable summary lines with expand/collapse actions', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    const reportPage = project.versions[0].pages.find((page) => page.type === 'report');
    if (!reportPage || reportPage.type !== 'report') {
      throw new Error('report page not found in fixture');
    }

    reportPage.blocks = reportPage.blocks.map((block) =>
      block.departmentId === 'dept-1'
        ? {
          ...block,
          fields: {
            ...block.fields,
            weeklyStatusAndRisk:
              '這是一段很長的會議說明內容，'.repeat(12) +
              '用來驗證呈現頁會依照 summaryLines 設定先顯示摘要，再提供展開全文操作。',
          },
        }
        : block
    );

    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 7 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v7 (已鎖定)';
    project.presentation.summaryLines = 1;

    render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    const expandButton = screen.getAllByRole('button', { name: '展開全文' })[0];
    fireEvent.click(expandButton);
    expect(screen.getAllByRole('button', { name: '收合全文' })[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: '收合全文' })[0]);
    expect(screen.getAllByRole('button', { name: '展開全文' })[0]).toBeInTheDocument();
  });

  it('shows image previews and lightbox notes by default', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    const imagePage = project.versions[0].pages.find((page) => page.type === 'image');
    if (!imagePage || imagePage.type !== 'image') {
      throw new Error('image page not found in fixture');
    }

    imagePage.groups = imagePage.groups.map((group) =>
      group.departmentId === 'dept-1'
        ? {
          ...group,
          images: [1, 2, 3, 4, 5].map((index) => ({
            id: `img-${index}`,
            url: `https://example.com/${index}.jpg`,
            name: `會議圖片${index}`,
            note: `備註 ${index}`,
            order: index,
            uploadedAt: '2026-03-25T00:00:00.000Z',
          })),
        }
        : group
    );

    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 8 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v8 (已鎖定)';

    render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    expect(screen.getByRole('button', { name: '查看全部 (5)' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '會議圖片1' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: '會議圖片5' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '查看全部 (5)' }));
    expect(screen.getByText('圖片備註：備註 1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '下一張' }));
    expect(screen.getByText('圖片備註：備註 2')).toBeInTheDocument();
  });

  it('keeps cover in minimalist style without logo, attendance stats, or note input', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 9 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v9 (已鎖定)';

    render(<PresentationPage project={project} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /logo/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/出席統計/)).not.toBeInTheDocument();
  });

  it('keeps the originally loaded locked snapshot during the same session', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    const lockedV1 = {
      ...project.versions[0],
      id: 'ver-1-locked',
      isLocked: true,
      versionNo: 1,
    };
    const lockedV2 = {
      ...project.versions[0],
      id: 'ver-2-locked',
      isLocked: true,
      versionNo: 2,
    };

    project.versions = [lockedV1];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v1 (已鎖定)';

    const { rerender } = render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));
    expect(screen.getByText('v1 (已鎖定)')).toBeInTheDocument();

    const projectWithNewerLock = {
      ...project,
      versions: [lockedV1, lockedV2],
      presentation: {
        ...project.presentation,
        cover: {
          ...project.presentation.cover,
          versionInfo: 'v2 (已鎖定)',
        },
      },
    };

    rerender(<PresentationPage project={projectWithNewerLock} />);
    expect(screen.getByText('v1 (已鎖定)')).toBeInTheDocument();
    expect(screen.queryByText('v2 (已鎖定)')).not.toBeInTheDocument();
  });

  it('shows desktop and projector first readability guidance in report mode', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 10 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v10 (已鎖定)';

    render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    expect(screen.getByText('此頁優先針對桌機與投影會議閱讀體驗設計。')).toBeInTheDocument();
  });

  it('keeps a fixed footer with minimal context fields only', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 20 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v20 (已鎖定)';

    render(<PresentationPage project={project} />);
    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    expect(screen.getByText('部門：業務部 | 章節：一般報表-page1 | 版本：v20 | 狀態：已鎖定')).toBeInTheDocument();
    expect(screen.queryByText(/頁碼|時鐘/)).not.toBeInTheDocument();
  });

  it('uses unified meeting surface marker across cover and report toolbar', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 11 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v11 (已鎖定)';

    render(<PresentationPage project={project} />);
    expect(screen.getByTestId('presentation-cover-surface')).toHaveAttribute('data-meeting-surface', 'true');

    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));
    expect(screen.getByTestId('presentation-toolbar')).toHaveAttribute('data-meeting-surface', 'true');
  });

  it('reflects cover sign-in entry state before and after sign-in close', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 12 }];
    project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
    project.presentation.cover.versionInfo = 'v12 (已鎖定)';

    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';
    render(<PresentationPage project={project} />);
    expect(screen.getByRole('button', { name: '我要簽到' })).toBeInTheDocument();

    const closedProject = {
      ...project,
      attendance: {
        ...project.attendance,
        signInClosedAt: '2026-03-25T14:10:00.000Z',
      },
    };

    render(<PresentationPage project={closedProject} />);
    expect(screen.getByRole('button', { name: '補簽/更正' })).toBeInTheDocument();
  });

  it('limits closed sign-in dialog modes to correction and backfill only', () => {
    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 21 }];
    project.presentation.cover.meetingDateTime = '2026-03-25T14:00:00.000Z';
    project.presentation.cover.versionInfo = 'v21 (已鎖定)';
    project.attendance.signInOpenedAt = '2026-03-25T13:00:00.000Z';
    project.attendance.signInClosedAt = '2026-03-25T14:00:00.000Z';

    render(<PresentationPage project={project} />);

    fireEvent.click(screen.getByRole('button', { name: '補簽/更正' }));
    fireEvent.mouseDown(screen.getByLabelText('簽到方式'));

    expect(screen.queryByRole('option', { name: '代簽' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: '更正' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '補簽' })).toBeInTheDocument();
  });

  it('supports manual sign-in from cover during active sign-in period', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-25T13:30:00.000Z'));

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 13 }];
    project.presentation.cover.meetingDateTime = '2026-03-25T14:00:00.000Z';
    project.presentation.cover.versionInfo = 'v13 (已鎖定)';
    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';

    render(<PresentationPage project={project} />);

    fireEvent.click(screen.getByRole('button', { name: '我要簽到' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '王小明' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));

    expect(screen.getByText('已完成簽到（準時）')).toBeInTheDocument();
    expect(screen.getByText(/最近簽到：王小明/)).toBeInTheDocument();
    expect(screen.getByText(/部門：業務部｜時間：/)).toBeInTheDocument();
    expect(screen.getByText(/操作者：王小明/)).toBeInTheDocument();
  });

  it('marks sign-in as late when timestamp is after meeting start', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-25T14:30:00.000Z'));

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 14 }];
    project.presentation.cover.meetingDateTime = '2026-03-25T14:00:00.000Z';
    project.presentation.cover.versionInfo = 'v14 (已鎖定)';
    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';

    render(<PresentationPage project={project} />);

    fireEvent.click(screen.getByRole('button', { name: '我要簽到' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '陳小華' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));

    expect(screen.getByText('已完成簽到（遲到）')).toBeInTheDocument();
    expect(screen.getByText(/狀態：遲到/)).toBeInTheDocument();
  });

  it('requires proxy actor and reason for proxy sign-in', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-25T13:30:00.000Z'));

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 15 }];
    project.presentation.cover.meetingDateTime = '2026-03-25T14:00:00.000Z';
    project.presentation.cover.versionInfo = 'v15 (已鎖定)';
    project.attendance.signInOpenedAt = '2026-03-25T13:00:00.000Z';

    render(<PresentationPage project={project} />);

    fireEvent.click(screen.getByRole('button', { name: '我要簽到' }));
    fireEvent.mouseDown(screen.getByLabelText('簽到方式'));
    fireEvent.click(screen.getByRole('option', { name: '代簽' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '王小明' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));

    expect(screen.getByText('代簽需填寫代簽者與原因')).toBeInTheDocument();
    expect(screen.getByText('已簽到 0 人')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('代簽者'), { target: { value: '王代理' } });
    fireEvent.change(screen.getByLabelText('代簽原因'), { target: { value: '出差由同仁代簽' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));

    expect(screen.getByText('已完成簽到（準時）')).toBeInTheDocument();
    expect(screen.getByText(/操作者：王代理（代簽）/)).toBeInTheDocument();
  });

  it('prevents duplicate primary sign-in and supports void-and-replace correction', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-25T13:35:00.000Z'));

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 16 }];
    project.presentation.cover.meetingDateTime = '2026-03-25T14:00:00.000Z';
    project.presentation.cover.versionInfo = 'v16 (已鎖定)';
    project.attendance.signInOpenedAt = '2026-03-25T13:00:00.000Z';

    render(<PresentationPage project={project} />);

    fireEvent.click(screen.getByRole('button', { name: '我要簽到' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '王小明' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));
    expect(screen.getByText('已完成簽到（準時）')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '王小明' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));
    expect(screen.getByText('此人員已存在主簽到紀錄，請改用更正流程')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText('簽到方式'));
    fireEvent.click(screen.getByRole('option', { name: '更正' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '王小明-更正' } });
    fireEvent.change(screen.getByLabelText('更正原因'), { target: { value: '更正姓名格式' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));

    expect(screen.getByText('已完成更正（作廢重建）')).toBeInTheDocument();
    expect(screen.getByText(/總紀錄 2 筆（含作廢 1 筆）/)).toBeInTheDocument();
    expect(screen.getByText(/最近簽到：王小明-更正/)).toBeInTheDocument();
  });

  it('allows same-name attendees from different departments without duplicate conflict', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-25T13:40:00.000Z'));

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 18 }];
    project.presentation.cover.meetingDateTime = '2026-03-25T14:00:00.000Z';
    project.presentation.cover.versionInfo = 'v18 (已鎖定)';
    project.attendance.signInOpenedAt = '2026-03-25T13:00:00.000Z';

    const session = project.attendance.sessions[0];
    if (!session) {
      throw new Error('attendance session missing in fixture');
    }
    session.expectedRoster = [
      { id: 'expected-dept-1', departmentId: 'dept-1', name: '王小明' },
      { id: 'expected-dept-2', departmentId: 'dept-2', name: '王小明' },
    ];

    render(<PresentationPage project={project} />);

    fireEvent.click(screen.getByRole('button', { name: '我要簽到' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '王小明' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));
    expect(screen.getByText('已完成簽到（準時）')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText('簽到部門'));
    fireEvent.click(screen.getByRole('option', { name: '研發部' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '王小明' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));

    expect(screen.getByText('已簽到 2 人')).toBeInTheDocument();
    expect(screen.queryByText('此人員已存在主簽到紀錄，請改用更正流程')).not.toBeInTheDocument();
  });

  it('allows backfill after close and marks overdue when beyond 24 hours', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-26T16:30:00.000Z'));

    const project = createWorkspaceProject('project-test', '專案測試');
    project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 17 }];
    project.presentation.cover.meetingDateTime = '2026-03-25T14:00:00.000Z';
    project.presentation.cover.versionInfo = 'v17 (已鎖定)';
    project.attendance.signInOpenedAt = '2026-03-25T13:00:00.000Z';
    project.attendance.signInClosedAt = '2026-03-25T14:00:00.000Z';

    render(<PresentationPage project={project} />);

    expect(screen.getByRole('button', { name: '補簽/更正' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '補簽/更正' }));
    fireEvent.change(screen.getByLabelText('簽到姓名'), { target: { value: '陳小華' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));
    expect(screen.getByText('補簽需填寫原因')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('補簽原因'), { target: { value: '會後補登' } });
    fireEvent.click(screen.getByRole('button', { name: '確認簽到' }));

    expect(screen.getByText('已完成補簽（逾期）')).toBeInTheDocument();
    expect(screen.getByText(/狀態：逾期補簽/)).toBeInTheDocument();
  });
});
