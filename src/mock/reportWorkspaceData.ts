import {
  DepartmentReportBlock,
  EmphasisCapableContent,
  ReportFields,
  ReportWorkspaceProject,
  ReportWorkspaceState,
  WorkspaceDepartment,
  WorkspaceImagePage,
  WorkspacePage,
  WorkspacePageType,
  WorkspaceReportPage,
  WorkspaceVersion,
} from '../types/reportWorkspace';
import { DEFAULT_REPORT_FIELD_LIMITS } from '../constants/reportFieldLimits';

const nowIso = () => new Date().toISOString();

const createEmptyFields = (): ReportFields => ({
  workItem: '',
  plannedBuildDate: '',
  approvalDate: '',
  // Three narrative fields use structured content (empty segments)
  weeklyStatusAndRisk: [] as EmphasisCapableContent,
  supportPlan: [] as EmphasisCapableContent,
  executiveDiscussion: [] as EmphasisCapableContent,
});

const createReportBlocks = (departments: WorkspaceDepartment[]): DepartmentReportBlock[] =>
  departments
    .filter((department) => department.active)
    .sort((a, b) => a.order - b.order)
    .map((department) => ({
      departmentId: department.id,
      fields: createEmptyFields(),
      isCompleted: false,
      updatedAt: nowIso(),
    }));

const createImageGroups = (departments: WorkspaceDepartment[]) =>
  departments
    .filter((department) => department.active)
    .sort((a, b) => a.order - b.order)
    .map((department) => ({
      departmentId: department.id,
      images: [],
    }));

const initialDepartments: WorkspaceDepartment[] = [
  { id: 'dept-1', name: '業務部', order: 1, active: true },
  { id: 'dept-2', name: '研發部', order: 2, active: true },
  { id: 'dept-3', name: '營運部', order: 3, active: true },
  { id: 'dept-4', name: '公關部', order: 4, active: true },
];

const initialPages = (departments: WorkspaceDepartment[]): WorkspacePage[] => [
  {
    id: 'page-1',
    name: '一般報表-page1',
    type: 'report',
    order: 1,
    blocks: createReportBlocks(departments),
  },
  {
    id: 'page-2',
    name: '純圖片顯示-page2',
    type: 'image',
    order: 2,
    groups: createImageGroups(departments),
  },
];

const createInitialAttendanceSession = (id: string, departments: WorkspaceDepartment[]) => {
  const expectedRoster = departments
    .filter((department) => department.active)
    .map((department, index) => ({
      id: `expected-${id}-${index + 1}`,
      departmentId: department.id,
      name: `${department.name}代表`,
    }));

  return {
    id,
    expectedRoster,
    records: [],
  };
};

export const createWorkspaceProject = (id: string, projectName: string): ReportWorkspaceProject => ({
  id,
  projectName,
  isArchived: false,
  currentDepartmentId: 'dept-1',
  departments: initialDepartments.map((department) => ({ ...department })),
  versions: [
    {
      id: `ver-1-${id}`,
      versionNo: 1,
      isLocked: false,
      createdAt: nowIso(),
      pages: initialPages(initialDepartments),
    },
  ],
  activeVersionId: `ver-1-${id}`,
  activePageId: 'page-1',
  chat: {
    messages: [
      {
        id: `sys-${id}`,
        role: 'system',
        content: '你是專案分析助理，請根據目前頁面內容協助摘要與風險判斷。',
        createdAt: nowIso(),
      },
    ],
    isLoading: false,
  },
  presentation: {
    cover: {
      meetingDateTime: '',
      versionInfo: '',
    },
    summaryLines: 4,
  },
  fieldLimits: { ...DEFAULT_REPORT_FIELD_LIMITS },
  meetingLock: {
    lockAt: '',
    timezone: 'Asia/Taipei',
  },
  lockAuditEvents: [],
  attendance: {
    activeSessionId: `session-${id}-1`,
    sessions: [createInitialAttendanceSession(`session-${id}-1`, initialDepartments)],
  },
});

export const initialReportWorkspaceState: ReportWorkspaceState = {
  currentRole: 'admin',
  activeProjectId: 'project-1',
  projects: [
    createWorkspaceProject('project-1', '專案 Alpha'),
    createWorkspaceProject('project-2', '專案 Beta'),
    createWorkspaceProject('project-3', '專案 Gamma'),
  ],
};

export const createPage = (
  pageType: WorkspacePageType,
  pageNumber: number,
  departments: WorkspaceDepartment[]
): WorkspacePage => {
  if (pageType === 'report') {
    const reportPage: WorkspaceReportPage = {
      id: `page-${Date.now()}`,
      name: `一般報表-page${pageNumber}`,
      type: 'report',
      order: pageNumber,
      blocks: createReportBlocks(departments),
    };

    return reportPage;
  }

  const imagePage: WorkspaceImagePage = {
    id: `page-${Date.now()}`,
    name: `純圖片顯示-page${pageNumber}`,
    type: 'image',
    order: pageNumber,
    groups: createImageGroups(departments),
  };

  return imagePage;
};

export const cloneVersionForNext = (
  currentVersion: WorkspaceVersion,
  activePageId: string,
  lockMeta?: { lockedAt: string; lockType: 'manual' | 'scheduled' }
): { lockedVersion: WorkspaceVersion; nextVersion: WorkspaceVersion; nextActivePageId: string } => {
  const lockedVersion: WorkspaceVersion = {
    ...currentVersion,
    isLocked: true,
    lockedAt: lockMeta?.lockedAt ?? nowIso(),
    lockType: lockMeta?.lockType ?? 'manual',
    overtimeUnlockUntil: undefined,
    overtimeReason: undefined,
  };

  const nextVersionNo = currentVersion.versionNo + 1;
  const nextVersion: WorkspaceVersion = {
    ...currentVersion,
    id: `ver-${nextVersionNo}-${Date.now()}`,
    versionNo: nextVersionNo,
    isLocked: false,
    createdAt: nowIso(),
    sourceVersionId: currentVersion.id,
    pages: currentVersion.pages.map((page) => {
      if (page.type === 'report') {
        return {
          ...page,
          blocks: page.blocks.map((block) => ({
            ...block,
            // Deep-copy fields to preserve structured content (TextSegment[])
            fields: {
              workItem: block.fields.workItem,
              plannedBuildDate: block.fields.plannedBuildDate,
              approvalDate: block.fields.approvalDate,
              // Deep-copy structured content arrays
              weeklyStatusAndRisk: Array.isArray(block.fields.weeklyStatusAndRisk)
                ? [...block.fields.weeklyStatusAndRisk]
                : block.fields.weeklyStatusAndRisk,
              supportPlan: Array.isArray(block.fields.supportPlan)
                ? [...block.fields.supportPlan]
                : block.fields.supportPlan,
              executiveDiscussion: Array.isArray(block.fields.executiveDiscussion)
                ? [...block.fields.executiveDiscussion]
                : block.fields.executiveDiscussion,
            },
          })),
        };
      }

      return {
        ...page,
        groups: page.groups.map((group) => ({
          ...group,
          images: group.images.map((image) => ({ ...image })),
        })),
      };
    }),
  };

  const hasActivePage = nextVersion.pages.some((page) => page.id === activePageId);
  const nextActivePageId = hasActivePage && activePageId ? activePageId : nextVersion.pages[0]?.id ?? '';

  return {
    lockedVersion,
    nextVersion,
    nextActivePageId,
  };
};

export const reorderItems = <T extends { id: string; order: number }>(
  items: T[],
  fromId: string,
  direction: 'up' | 'down'
): T[] => {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((item) => item.id === fromId);

  if (index < 0) {
    return sorted;
  }

  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= sorted.length) {
    return sorted;
  }

  const current = sorted[index];
  const target = sorted[targetIndex];
  sorted[index] = { ...target, order: current.order };
  sorted[targetIndex] = { ...current, order: target.order };

  return sorted.sort((a, b) => a.order - b.order);
};
