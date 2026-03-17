export type WorkspaceRole = 'admin' | 'department_user';

export type WorkspacePageType = 'report' | 'image';

export interface WorkspaceDepartment {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

export interface ReportFields {
  workItem: string;
  plannedBuildDate: string;
  approvalDate: string;
  weeklyStatusAndRisk: string;
  supportPlan: string;
  executiveDiscussion: string;
}

export interface DepartmentReportBlock {
  departmentId: string;
  fields: ReportFields;
  isCompleted: boolean;
  updatedAt: string;
}

export interface WorkspaceImageItem {
  id: string;
  url: string;
  name: string;
  note: string;
  order: number;
  uploadedAt: string;
}

export interface WorkspaceImageGroup {
  departmentId: string;
  images: WorkspaceImageItem[];
}

export interface WorkspaceBasePage {
  id: string;
  name: string;
  type: WorkspacePageType;
  order: number;
}

export interface WorkspaceReportPage extends WorkspaceBasePage {
  type: 'report';
  blocks: DepartmentReportBlock[];
}

export interface WorkspaceImagePage extends WorkspaceBasePage {
  type: 'image';
  groups: WorkspaceImageGroup[];
}

export type WorkspacePage = WorkspaceReportPage | WorkspaceImagePage;

export interface WorkspaceVersion {
  id: string;
  versionNo: number;
  isLocked: boolean;
  createdAt: string;
  sourceVersionId?: string;
  pages: WorkspacePage[];
}

export interface WorkspaceChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface ReportWorkspaceProject {
  id: string;
  projectName: string;
  currentDepartmentId: string;
  departments: WorkspaceDepartment[];
  versions: WorkspaceVersion[];
  activeVersionId: string;
  activePageId: string;
  chat: {
    messages: WorkspaceChatMessage[];
    isLoading: boolean;
  };
}

export interface ReportWorkspaceState {
  currentRole: WorkspaceRole;
  activeProjectId: string;
  projects: ReportWorkspaceProject[];
}
