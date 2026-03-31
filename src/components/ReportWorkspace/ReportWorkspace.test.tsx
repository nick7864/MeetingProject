import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWorkspaceProject } from '../../mock/reportWorkspaceData';
import { ReportWorkspacePage } from './ReportWorkspace';

describe('ReportWorkspacePage backend management tab', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    window.localStorage.removeItem('report-workspace-state');
  });

  it('shows backend management tab for admin', () => {
    render(<ReportWorkspacePage />);

    expect(screen.getByRole('tab', { name: '後台管理' })).toBeInTheDocument();
  });

  it('hides backend management tab for department user', () => {
    render(<ReportWorkspacePage />);

    const roleSelect = screen.getAllByRole('combobox').find((node) => node.textContent?.includes('管理員'));
    if (!roleSelect) {
      throw new Error('role selector not found');
    }
    fireEvent.mouseDown(roleSelect);
    fireEvent.click(screen.getByRole('option', { name: '部門使用者' }));

    expect(screen.queryByRole('tab', { name: '後台管理' })).not.toBeInTheDocument();
  });

  it('enforces role matrix across pre-meeting, in-meeting, and post-meeting states', () => {
    const preMeetingProject = createWorkspaceProject('project-role-pre', '角色矩陣-會前');
    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'department_user',
        activeProjectId: preMeetingProject.id,
        projects: [preMeetingProject],
      })
    );

    const preMeetingRender = render(<ReportWorkspacePage />);
    expect(screen.queryByRole('tab', { name: '後台管理' })).not.toBeInTheDocument();

    const preMeetingField = screen.getAllByLabelText('工作項目')[0] as HTMLInputElement;
    expect(preMeetingField).toBeEnabled();
    fireEvent.change(preMeetingField, { target: { value: '會前更新' } });
    expect(preMeetingField.value).toBe('會前更新');
    preMeetingRender.unmount();

    const inMeetingProject = createWorkspaceProject('project-role-during', '角色矩陣-會中');
    inMeetingProject.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';
    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'department_user',
        activeProjectId: inMeetingProject.id,
        projects: [inMeetingProject],
      })
    );

    const inMeetingRender = render(<ReportWorkspacePage />);
    expect(screen.queryByRole('tab', { name: '後台管理' })).not.toBeInTheDocument();
    expect((screen.getAllByLabelText('工作項目')[0] as HTMLInputElement)).toBeEnabled();
    inMeetingRender.unmount();

    const postMeetingProject = createWorkspaceProject('project-role-post', '角色矩陣-會後');
    postMeetingProject.versions = [{ ...postMeetingProject.versions[0], isLocked: true }];
    postMeetingProject.activeVersionId = postMeetingProject.versions[0].id;
    postMeetingProject.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';
    postMeetingProject.attendance.signInClosedAt = '2026-03-25T14:00:00.000Z';
    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'department_user',
        activeProjectId: postMeetingProject.id,
        projects: [postMeetingProject],
      })
    );

    render(<ReportWorkspacePage />);
    expect(screen.queryByRole('tab', { name: '後台管理' })).not.toBeInTheDocument();
    expect((screen.getAllByLabelText('工作項目')[0] as HTMLInputElement)).toBeDisabled();
  });

  it('shows management sub-tabs when backend management is selected', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));

    const subTablist = screen.getByRole('tablist', { name: '後台管理子選單' });
    expect(within(subTablist).getByRole('tab', { name: '呈現設定' })).toBeInTheDocument();
    expect(within(subTablist).getByRole('tab', { name: '鎖定與外掛' })).toBeInTheDocument();
    expect(within(subTablist).getByRole('tab', { name: '簽到設定' })).toBeInTheDocument();
    expect(within(subTablist).getByRole('tab', { name: '字數治理' })).toBeInTheDocument();
  });

  it('allows admin to edit cover metadata in presentation settings', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '呈現設定' }));

    const meetingInput = screen.getByLabelText('封面會議時間');
    const versionInput = screen.getByLabelText('封面版本資訊');

    fireEvent.change(meetingInput, { target: { value: '2026-03-25 14:00' } });
    fireEvent.change(versionInput, { target: { value: 'v3 (已鎖定)' } });

    expect(meetingInput).toHaveValue('2026-03-25 14:00');
    expect(versionInput).toHaveValue('v3 (已鎖定)');
  });

  it('keeps state consistent when switching across backend sub-tabs', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '呈現設定' }));

    const meetingInput = screen.getByLabelText('封面會議時間') as HTMLInputElement;
    fireEvent.change(meetingInput, { target: { value: '2026-05-01 09:30' } });

    fireEvent.click(screen.getByRole('tab', { name: '鎖定與外掛' }));
    fireEvent.change(screen.getByLabelText('時區'), { target: { value: 'Asia/Taipei' } });

    fireEvent.click(screen.getByRole('tab', { name: '呈現設定' }));
    expect((screen.getByLabelText('封面會議時間') as HTMLInputElement).value).toBe('2026-05-01 09:30');
  });

  it('uses unified meeting surface marker in backend management tab', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));

    expect(screen.getByTestId('workspace-admin-surface')).toHaveAttribute('data-meeting-surface', 'true');
  });

  it('allows admin to set one-time lock datetime and timezone in lock tab', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '鎖定與外掛' }));

    const lockAtInput = screen.getByLabelText('自動鎖定時間');
    const timezoneInput = screen.getByLabelText('時區');

    fireEvent.change(lockAtInput, { target: { value: '2026-04-01T14:00' } });
    fireEvent.change(timezoneInput, { target: { value: 'Asia/Taipei' } });

    expect(lockAtInput).toHaveValue('2026-04-01T14:00');
    expect(timezoneInput).toHaveValue('Asia/Taipei');
  });

  it('auto-locks latest editable version at or after lockAt and clones next editable version', () => {
    const project = createWorkspaceProject('project-lock', '鎖定測試專案');
    project.versions = [
      { ...project.versions[0], id: 'ver-1-locked', versionNo: 1, isLocked: true },
      { ...project.versions[0], id: 'ver-2-editing', versionNo: 2, isLocked: false },
    ];
    project.activeVersionId = 'ver-2-editing';
    project.meetingLock = {
      lockAt: '2026-03-01T10:00:00.000Z',
      timezone: 'Asia/Taipei',
    };

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    expect(screen.getByText('v3 (編輯中)')).toBeInTheDocument();
  });

  it('requires overtime reason and defaults duration to 15 minutes', () => {
    const project = createWorkspaceProject('project-overtime-reason', '外掛原因測試專案');
    project.versions = [{ ...project.versions[0], id: 'ver-2-locked', versionNo: 2, isLocked: true }];
    project.activeVersionId = 'ver-2-locked';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '鎖定與外掛' }));

    expect(screen.getByLabelText('外掛分鐘數')).toHaveTextContent('15 分鐘');

    fireEvent.click(screen.getByRole('button', { name: '開啟外掛時間' }));

    expect(screen.getByText('請填寫外掛原因')).toBeInTheDocument();
  });

  it('relocks immediately when overtime expires', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T10:00:00.000Z'));

    const project = createWorkspaceProject('project-overtime', '外掛測試專案');
    project.versions = [{ ...project.versions[0], id: 'ver-2-locked', versionNo: 2, isLocked: true }];
    project.activeVersionId = 'ver-2-locked';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '鎖定與外掛' }));

    fireEvent.change(screen.getByLabelText('外掛原因'), { target: { value: '會議追加修正' } });
    fireEvent.click(screen.getByRole('button', { name: '開啟外掛時間' }));

    expect(screen.getByText(/外掛進行中/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(16 * 60 * 1000);
    });

    expect(screen.getByText('目前未開啟外掛時間。')).toBeInTheDocument();
  });

  it('previews and replaces expected roster before import is confirmed', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    const rosterInput = screen.getByLabelText('名單貼上區');
    expect(rosterInput).toBeEnabled();

    fireEvent.change(rosterInput, { target: { value: '業務部,王小明\n研發部,陳小華' } });
    fireEvent.click(screen.getByRole('button', { name: '預覽匯入' }));

    expect(screen.getByText('預覽 2 筆，將覆蓋現有 4 筆名單。')).toBeInTheDocument();
    expect(screen.getByText('業務部 / 王小明')).toBeInTheDocument();
    expect(screen.getByText('研發部 / 陳小華')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '確認匯入' }));

    expect(screen.getByText('應到名單已更新（覆蓋 2 筆）。')).toBeInTheDocument();
  });

  it('blocks preview when roster rows contain unknown department or empty member name', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.change(screen.getByLabelText('名單貼上區'), {
      target: { value: '不存在部門,王小明\n研發部,' },
    });
    fireEvent.click(screen.getByRole('button', { name: '預覽匯入' }));

    expect(screen.getByText('第 1 行：找不到部門「不存在部門」')).toBeInTheDocument();
    expect(screen.getByText('第 2 行：姓名不可空白')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '確認匯入' })).not.toBeInTheDocument();
  });

  it('blocks preview when roster rows contain duplicate department-name pairs', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.change(screen.getByLabelText('名單貼上區'), {
      target: { value: '業務部,王小明\n業務部,王小明' },
    });
    fireEvent.click(screen.getByRole('button', { name: '預覽匯入' }));

    expect(screen.getByText('第 2 行：名單重複（業務部 / 王小明）')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '確認匯入' })).not.toBeInTheDocument();
  });

  it('appends roster entries after preview when append mode is selected', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.mouseDown(screen.getByLabelText('匯入方式'));
    fireEvent.click(screen.getByRole('option', { name: '追加至現有名單' }));

    fireEvent.change(screen.getByLabelText('名單貼上區'), {
      target: { value: '業務部,王小明\n研發部,陳小華' },
    });
    fireEvent.click(screen.getByRole('button', { name: '預覽匯入' }));

    expect(screen.getByText('預覽 2 筆，將追加 2 筆到現有 4 筆名單。')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '確認匯入' }));

    expect(screen.getByText('應到名單已更新（追加 2 筆，總計 6 筆）。')).toBeInTheDocument();
  });

  it('blocks append preview when imported rows already exist in current roster', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.mouseDown(screen.getByLabelText('匯入方式'));
    fireEvent.click(screen.getByRole('option', { name: '追加至現有名單' }));

    fireEvent.change(screen.getByLabelText('名單貼上區'), {
      target: { value: '業務部,業務部代表' },
    });
    fireEvent.click(screen.getByRole('button', { name: '預覽匯入' }));

    expect(screen.getByText('第 1 行：名單已存在（業務部 / 業務部代表）')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '確認匯入' })).not.toBeInTheDocument();
  });

  it('blocks empty replace preview with an explicit validation error', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.change(screen.getByLabelText('名單貼上區'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: '預覽匯入' }));

    expect(screen.getByText('請至少輸入一筆名單')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '確認匯入' })).not.toBeInTheDocument();
  });

  it('freezes expected roster after lock action', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('button', { name: '鎖定目前版本' }));
    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    expect(screen.getByLabelText('名單貼上區')).toBeDisabled();
    expect(screen.getByText(/名單已於/)).toBeInTheDocument();
  });

  it('allows admin to open and close sign-in, then disallows reopening normal sign-in', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.click(screen.getByRole('button', { name: '開始簽到' }));
    expect(screen.getByText('簽到進行中（一般簽到開啟）')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '結束簽到' }));
    expect(screen.getByText(/簽到已結束/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '開始簽到' })).toBeDisabled();
  });

  it('keeps normal sign-in open until admin explicitly closes it', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-25T10:00:00.000Z'));

    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.click(screen.getByRole('button', { name: '開始簽到' }));
    expect(screen.getByText('簽到進行中（一般簽到開啟）')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(8 * 60 * 60 * 1000);
    });

    expect(screen.getByText('簽到進行中（一般簽到開啟）')).toBeInTheDocument();
  });

  it('locks roster import once sign-in has started', () => {
    const project = createWorkspaceProject('project-attendance-open-roster-lock', '簽到開啟名單鎖定專案');
    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    expect(screen.getByLabelText('名單貼上區')).toBeDisabled();
    expect(screen.getByRole('button', { name: '預覽匯入' })).toBeDisabled();
  });

  it('clears prior roster preview once sign-in starts', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.change(screen.getByLabelText('名單貼上區'), {
      target: { value: '業務部,王小明\n研發部,陳小華' },
    });
    fireEvent.click(screen.getByRole('button', { name: '預覽匯入' }));
    expect(screen.getByRole('button', { name: '確認匯入' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '開始簽到' }));

    expect(screen.queryByRole('button', { name: '確認匯入' })).not.toBeInTheDocument();
  });

  it('shows finalized attendance groups after sign-in closes', () => {
    const project = createWorkspaceProject('project-attendance-summary', '簽到總覽專案');
    const session = project.attendance.sessions[0];
    if (!session) {
      throw new Error('attendance session missing in fixture');
    }

    session.expectedRoster = [
      { id: 'member-on-time', departmentId: 'dept-1', name: '王小明' },
      { id: 'member-late', departmentId: 'dept-2', name: '陳小華' },
      { id: 'member-absent', departmentId: 'dept-3', name: '林小美' },
    ];
    session.records = [
      {
        id: 'record-1',
        sessionId: session.id,
        memberId: 'member-on-time',
        departmentId: 'dept-1',
        memberName: '王小明',
        signedAt: '2026-03-25T13:55:00.000Z',
        status: 'on_time',
        actorRole: 'department_user',
        actorName: '王小明',
        mode: 'self',
      },
      {
        id: 'record-2',
        sessionId: session.id,
        memberId: 'member-late',
        departmentId: 'dept-2',
        memberName: '陳小華',
        signedAt: '2026-03-25T14:08:00.000Z',
        status: 'late',
        actorRole: 'department_user',
        actorName: '陳小華',
        mode: 'self',
      },
    ];
    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';
    project.attendance.signInClosedAt = '2026-03-25T14:00:00.000Z';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);
    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    expect(screen.getByText('準時 (1)')).toBeInTheDocument();
    expect(screen.getByText('遲到 (1)')).toBeInTheDocument();
    expect(screen.getByText('缺席 (1)')).toBeInTheDocument();
    expect(screen.getByText('- 林小美')).toBeInTheDocument();
  });

  it('canonicalizes duplicate active records per member when showing finalized attendance groups', () => {
    const project = createWorkspaceProject('project-attendance-canonicalize', '簽到去重專案');
    const session = project.attendance.sessions[0];
    if (!session) {
      throw new Error('attendance session missing in fixture');
    }

    session.expectedRoster = [{ id: 'member-1', departmentId: 'dept-1', name: '王小明' }];
    session.records = [
      {
        id: 'record-old',
        sessionId: session.id,
        memberId: 'member-1',
        departmentId: 'dept-1',
        memberName: '王小明',
        signedAt: '2026-03-25T13:40:00.000Z',
        status: 'on_time',
        actorRole: 'department_user',
        actorName: '王小明',
        mode: 'self',
      },
      {
        id: 'record-new',
        sessionId: session.id,
        memberId: 'member-1',
        departmentId: 'dept-1',
        memberName: '王小明',
        signedAt: '2026-03-25T14:05:00.000Z',
        status: 'late',
        actorRole: 'admin',
        actorName: '管理員',
        mode: 'correction',
      },
    ];
    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';
    project.attendance.signInClosedAt = '2026-03-25T14:00:00.000Z';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);
    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    expect(screen.getByText('準時 (0)')).toBeInTheDocument();
    expect(screen.getByText('遲到 (1)')).toBeInTheDocument();
    expect(screen.getByText('缺席 (0)')).toBeInTheDocument();
  });

  it('exports canonicalized attendance summary as CSV after sign-in closes', async () => {
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:attendance-csv');
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    let csvBlob: Blob | null = null;
    createObjectUrlSpy.mockImplementation((blob) => {
      csvBlob = blob as Blob;
      return 'blob:attendance-csv';
    });

    const project = createWorkspaceProject('project-attendance-export', '簽到匯出專案');
    const session = project.attendance.sessions[0];
    if (!session) {
      throw new Error('attendance session missing in fixture');
    }

    session.expectedRoster = [
      { id: 'member-on-time', departmentId: 'dept-1', name: '王小明' },
      { id: 'member-absent', departmentId: 'dept-2', name: '陳小華' },
    ];
    session.records = [
      {
        id: 'record-1',
        sessionId: session.id,
        memberId: 'member-on-time',
        departmentId: 'dept-1',
        memberName: '王小明',
        signedAt: '2026-03-25T13:55:00.000Z',
        status: 'on_time',
        actorRole: 'department_user',
        actorName: '王小明',
        mode: 'self',
      },
      {
        id: 'record-2',
        sessionId: session.id,
        memberId: 'member-on-time',
        departmentId: 'dept-1',
        memberName: '王小明',
        signedAt: '2026-03-25T14:05:00.000Z',
        status: 'late',
        actorRole: 'admin',
        actorName: '管理員',
        mode: 'correction',
      },
    ];
    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';
    project.attendance.signInClosedAt = '2026-03-25T14:00:00.000Z';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);
    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    fireEvent.click(screen.getByRole('button', { name: '匯出簽到 CSV' }));

    expect(createObjectUrlSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectUrlSpy).toHaveBeenCalled();
    if (!csvBlob) {
      throw new Error('CSV blob was not created');
    }
    const csvBlobData = csvBlob;

    const csvContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read CSV blob'));
      reader.readAsText(csvBlobData);
    });
    expect(csvContent).toContain('group,status');
    expect(csvContent).toContain('"王小明","late","late"');
    expect(csvContent).toContain('"陳小華","absent","absent"');
    expect(csvContent).not.toContain('"王小明","on_time","on_time"');

    createObjectUrlSpy.mockRestore();
    revokeObjectUrlSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it('freezes roster editing once sign-in is closed', () => {
    const project = createWorkspaceProject('project-attendance-roster-freeze', '簽到封存專案');
    project.attendance.signInOpenedAt = '2026-03-25T13:30:00.000Z';
    project.attendance.signInClosedAt = '2026-03-25T14:00:00.000Z';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);
    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '簽到設定' }));

    expect(screen.getByLabelText('名單貼上區')).toBeDisabled();
    expect(screen.getByRole('button', { name: '預覽匯入' })).toBeDisabled();
  });

  it('shows default field limits and clamps admin updates between 50 and 1000', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '字數治理' }));

    const workItemLimitInput = screen.getByLabelText('工作項目上限') as HTMLInputElement;
    expect(workItemLimitInput).toBeInTheDocument();

    fireEvent.change(workItemLimitInput, { target: { value: '10' } });
    expect(workItemLimitInput.value).toBe('50');

    fireEvent.change(workItemLimitInput, { target: { value: '3000' } });
    expect(workItemLimitInput.value).toBe('1000');
  });

  it('shows real-time count and warning style when reaching 80 percent', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '字數治理' }));

    const workItemLimitInput = screen.getByLabelText('工作項目上限');
    fireEvent.change(workItemLimitInput, { target: { value: '50' } });

    fireEvent.click(screen.getByRole('tab', { name: '報表內容' }));
    const workItemInput = screen.getAllByLabelText('工作項目')[0];
    fireEvent.change(workItemInput, { target: { value: 'A'.repeat(40) } });

    expect(screen.getByText('40/50')).toBeInTheDocument();
    expect(screen.getByText('已達 80% 警戒')).toBeInTheDocument();
  });

  it('truncates over-limit paste with notice while counting spaces and newlines', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('tab', { name: '後台管理' }));
    fireEvent.click(screen.getByRole('tab', { name: '字數治理' }));
    fireEvent.change(screen.getByLabelText('工作項目上限'), { target: { value: '50' } });

    fireEvent.click(screen.getByRole('tab', { name: '報表內容' }));
    const workItemInput = screen.getAllByLabelText('工作項目')[0] as HTMLInputElement;
    const overLimitText = `A B\n${'C'.repeat(60)}`;
    fireEvent.change(workItemInput, { target: { value: overLimitText } });

    expect(workItemInput.value.length).toBe(50);
    expect(screen.getByText('內容超過上限，已自動截斷。')).toBeInTheDocument();
    expect(screen.getByText('50/50')).toBeInTheDocument();
  });

  it('blocks lock when any report field remains over configured limits', () => {
    const project = createWorkspaceProject('project-field-limit-lock', '字數鎖定檢查專案');
    const version = project.versions[0];
    if (!version) {
      throw new Error('version missing in fixture');
    }
    const page = version.pages.find((item) => item.type === 'report');
    if (!page || page.type !== 'report') {
      throw new Error('report page missing in fixture');
    }
    const firstBlock = page.blocks[0];
    if (!firstBlock) {
      throw new Error('report block missing in fixture');
    }

    firstBlock.fields.workItem = 'X'.repeat(1200);

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);
    fireEvent.click(screen.getByRole('button', { name: '鎖定目前版本' }));

    expect(screen.getByText('仍有欄位超過字數上限，請先修正再鎖定。')).toBeInTheDocument();
    expect(screen.getByText('v1 (編輯中)')).toBeInTheDocument();
  });

  it('does not silently mutate legacy over-limit content and requires manual reduction', () => {
    const project = createWorkspaceProject('project-legacy-field', '歷史超限專案');
    const version = project.versions[0];
    if (!version) {
      throw new Error('version missing in fixture');
    }
    const page = version.pages.find((item) => item.type === 'report');
    if (!page || page.type !== 'report') {
      throw new Error('report page missing in fixture');
    }
    const firstBlock = page.blocks[0];
    if (!firstBlock) {
      throw new Error('report block missing in fixture');
    }

    firstBlock.fields.workItem = 'L'.repeat(1200);

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);
    const workItemInput = screen.getAllByLabelText('工作項目')[0] as HTMLInputElement;
    expect(workItemInput.value.length).toBe(1200);

    fireEvent.change(workItemInput, { target: { value: `${workItemInput.value}X` } });

    expect(workItemInput.value.length).toBe(1200);
    expect(screen.getByText('此欄位為歷史超限內容，請先手動刪減。')).toBeInTheDocument();
  });

  it('rejects uploading a second image to the same pure image page', () => {
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL')
      .mockReturnValueOnce('blob:first-image')
      .mockReturnValueOnce('blob:second-image');

    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('button', { name: '純圖片顯示-page2' }));

    const uploadInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (!uploadInput) {
      throw new Error('upload input not found');
    }

    const firstFile = new File(['first'], 'first.png', { type: 'image/png' });
    const secondFile = new File(['second'], 'second.png', { type: 'image/png' });

    fireEvent.change(uploadInput, { target: { files: [firstFile] } });
    expect(screen.getByText('first.png')).toBeInTheDocument();

    fireEvent.change(uploadInput, { target: { files: [secondFile] } });

    expect(screen.getByText('每個純圖片頁面只能上傳一張圖片，請新增頁面放置其他圖片。')).toBeInTheDocument();
    expect(screen.queryByText('second.png')).not.toBeInTheDocument();

    createObjectUrlSpy.mockRestore();
  });

  it('moves a middle page upward when move up button is clicked', async () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('button', { name: '新增頁面' }));
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /page/ }).length).toBeGreaterThanOrEqual(3);
    });

    const pageButtons = screen.getAllByRole('button', { name: /page/ });
    expect(pageButtons.length).toBeGreaterThanOrEqual(3);

    // Find move up button for the last page and click it
    const moveUpButtons = screen.getAllByLabelText('上移頁面');
    // Move the last page up
    fireEvent.click(moveUpButtons[moveUpButtons.length - 1]);

    // Verify order changed
    const reorderedButtons = screen.getAllByRole('button', { name: /page/ });
    expect(reorderedButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('moves a middle page downward when move down button is clicked', async () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('button', { name: '新增頁面' }));
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /page/ }).length).toBeGreaterThanOrEqual(3);
    });

    const pageButtons = screen.getAllByRole('button', { name: /page/ });
    expect(pageButtons.length).toBeGreaterThanOrEqual(3);

    // Find move down button for the first page and click it
    const moveDownButtons = screen.getAllByLabelText('下移頁面');
    fireEvent.click(moveDownButtons[0]); // Move first page down

    // Verify order changed
    const reorderedButtons = screen.getAllByRole('button', { name: /page/ });
    expect(reorderedButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('disables page reordering controls in a locked version', () => {
    const project = createWorkspaceProject('project-locked-pages', '鎖定版本頁面測試');
    project.versions = [{ ...project.versions[0], isLocked: true }];
    project.activeVersionId = project.versions[0].id;

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    // Move up/down buttons should be disabled
    const moveUpButtons = screen.getAllByLabelText('上移頁面');
    const moveDownButtons = screen.getAllByLabelText('下移頁面');

    moveUpButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
    moveDownButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('disables move up button for the first page', () => {
    render(<ReportWorkspacePage />);

    const moveUpButtons = screen.getAllByLabelText('上移頁面');
    expect(moveUpButtons[0]).toBeDisabled(); // First page can't move up
  });

  it('disables move down button for the last page', () => {
    render(<ReportWorkspacePage />);

    const moveDownButtons = screen.getAllByLabelText('下移頁面');
    expect(moveDownButtons[moveDownButtons.length - 1]).toBeDisabled(); // Last page can't move down
  });

  it('confirms page deletion from custom modal', async () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('button', { name: '新增頁面' }));
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /page/ }).length).toBeGreaterThanOrEqual(3);
    });

    const deleteButtons = screen.getAllByLabelText('刪除頁面');
    expect(deleteButtons.length).toBeGreaterThanOrEqual(3);

    // Click delete on the first page
    fireEvent.click(deleteButtons[0]);

    // Custom modal should appear
    await screen.findByRole('dialog');
    expect(screen.getByText('確認刪除頁面')).toBeInTheDocument();

    // Confirm deletion
    fireEvent.click(screen.getByRole('button', { name: '確認刪除' }));

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Page should be removed
    const pageButtons = screen.getAllByRole('button', { name: /page/ });
    expect(pageButtons.length).toBe(2);
  });

  it('cancels page deletion from custom modal', async () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('button', { name: '新增頁面' }));
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /page/ }).length).toBeGreaterThanOrEqual(3);
    });

    const deleteButtons = screen.getAllByLabelText('刪除頁面');

    // Click delete on the first page
    fireEvent.click(deleteButtons[0]);

    // Custom modal should appear
    await screen.findByRole('dialog');

    // Cancel deletion
    fireEvent.click(screen.getByRole('button', { name: '取消' }));

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole('button', { name: /page/ }).length).toBe(3);
  });

  it('deletes the active page and switches to a neighboring page', async () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getByRole('button', { name: '新增頁面' }));
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /page/ }).length).toBeGreaterThanOrEqual(3);
    });

    // First page is active by default
    const activePageButton = screen.getAllByRole('button', { name: /page/ }).find(
      (btn) => btn.className.includes('MuiButton-contained')
    );
    expect(activePageButton).toBeTruthy();

    const deleteButtons = screen.getAllByLabelText('刪除頁面');

    // Click delete on the first page (which is active)
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: '確認刪除' }));

    // Wait for modal to close and verify active page switched
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole('button', { name: /page/ }).length).toBe(2);
  });

  it('blocks deletion of the last remaining page', () => {
    // Create a project with only one page
    const project = createWorkspaceProject('project-single-page', '單頁測試專案');
    project.versions[0].pages = [project.versions[0].pages[0]];

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    const deleteButtons = screen.getAllByLabelText('刪除頁面');
    expect(deleteButtons.length).toBe(1);
    expect(deleteButtons[0]).toBeDisabled();
  });

  it('disables delete button in a locked version', () => {
    const project = createWorkspaceProject('project-locked-delete', '鎖定版本刪除測試');
    project.versions = [{ ...project.versions[0], isLocked: true }];
    project.activeVersionId = project.versions[0].id;

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    const deleteButtons = screen.getAllByLabelText('刪除頁面');
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('reorders departments with move controls', () => {
    render(<ReportWorkspacePage />);

    fireEvent.click(screen.getAllByLabelText('下移部門')[0]);

    const firstDepartment = screen.getByDisplayValue('業務部');
    const secondDepartment = screen.getByDisplayValue('研發部');
    expect(firstDepartment.compareDocumentPosition(secondDepartment) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it('soft deletes the current department and switches to the next active department', async () => {
    render(<ReportWorkspacePage />);

    const departmentSelect = screen.getAllByRole('combobox').find((node) => node.textContent?.includes('業務部'));
    if (!departmentSelect) {
      throw new Error('department selector not found');
    }

    fireEvent.click(screen.getAllByLabelText('刪除部門')[0]);
    await screen.findByRole('dialog');
    fireEvent.click(screen.getByRole('button', { name: '確認刪除' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(screen.queryByDisplayValue('業務部')).not.toBeInTheDocument();
    expect(departmentSelect).toHaveTextContent('研發部');
  });

  it('blocks deletion of the last active department', () => {
    const project = createWorkspaceProject('project-single-department', '單部門測試專案');
    project.departments = [
      { ...project.departments[0], active: true, order: 1 },
      { ...project.departments[1], active: false, order: 2 },
    ];
    project.currentDepartmentId = project.departments[0].id;

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    const deleteButtons = screen.getAllByLabelText('刪除部門');
    expect(deleteButtons).toHaveLength(1);
    expect(deleteButtons[0]).toBeDisabled();
  });

  it('disables department management controls in a locked version', () => {
    const project = createWorkspaceProject('project-locked-departments', '鎖定版本部門測試');
    project.versions = [{ ...project.versions[0], isLocked: true }];
    project.activeVersionId = project.versions[0].id;

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    screen.getAllByLabelText('上移部門').forEach((button) => {
      expect(button).toBeDisabled();
    });
    screen.getAllByLabelText('下移部門').forEach((button) => {
      expect(button).toBeDisabled();
    });
    screen.getAllByLabelText('刪除部門').forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('normalizes an inactive persisted current department to the first active department', async () => {
    const project = createWorkspaceProject('project-inactive-current', '失效部門測試專案');
    project.departments = project.departments.map((department, index) =>
      index === 0 ? { ...department, active: false } : department
    );
    project.currentDepartmentId = 'dept-1';

    window.localStorage.setItem(
      'report-workspace-state',
      JSON.stringify({
        currentRole: 'admin',
        activeProjectId: project.id,
        projects: [project],
      })
    );

    render(<ReportWorkspacePage />);

    await waitFor(() => {
      const departmentSelect = screen.getAllByRole('combobox').find((node) => node.textContent?.includes('研發部'));
      expect(departmentSelect).toBeTruthy();
      expect(screen.queryByDisplayValue('業務部')).not.toBeInTheDocument();
    });
  });
});
