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

export type ReportFieldLimits = Record<keyof ReportFields, number>;

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
  lockedAt?: string;
  lockType?: 'manual' | 'scheduled';
  overtimeUnlockUntil?: string;
  overtimeReason?: string;
  sourceVersionId?: string;
  pages: WorkspacePage[];
}

export interface ProjectMeetingLockConfig {
  lockAt: string;
  timezone: string;
}

export interface LockAuditEvent {
  id: string;
  action: 'manual_lock' | 'scheduled_lock' | 'overtime_grant' | 'overtime_expire';
  actorRole: WorkspaceRole;
  versionId: string;
  at: string;
  reason?: string;
  expiresAt?: string;
}

export interface AttendanceExpectedMember {
  id: string;
  departmentId: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  memberId: string;
  departmentId: string;
  memberName: string;
  signedAt: string;
  status: 'on_time' | 'late' | 'absent';
  actorRole: WorkspaceRole;
  actorName: string;
  mode: 'self' | 'proxy' | 'correction' | 'backfill';
  reason?: string;
  isOverdueBackfill?: boolean;
  correctionOfRecordId?: string;
  voidedAt?: string;
  voidReason?: string;
}

export interface AttendanceSession {
  id: string;
  startedAt?: string;
  closedAt?: string;
  rosterFrozenAt?: string;
  expectedRoster: AttendanceExpectedMember[];
  records: AttendanceRecord[];
}

export interface AttendanceState {
  activeSessionId: string;
  signInOpenedAt?: string;
  signInClosedAt?: string;
  sessions: AttendanceSession[];
}

export interface WorkspaceChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface PresentationCoverSettings {
  meetingDateTime: string;
  versionInfo: string;
}

export interface PresentationSettings {
  cover: PresentationCoverSettings;
  summaryLines: number;
}

/**
 * Authenticated identity derived from login context for self sign-in.
 * When present, self sign-in uses these values instead of manual input.
 * When absent or incomplete, self sign-in is blocked.
 */
export interface AuthenticatedIdentity {
  memberId: string;
  memberName: string;
  departmentId: string;
}

export interface ReportWorkspaceProject {
  id: string;
  projectName: string;
  isArchived: boolean;
  currentDepartmentId: string;
  departments: WorkspaceDepartment[];
  versions: WorkspaceVersion[];
  activeVersionId: string;
  activePageId: string;
  chat: {
    messages: WorkspaceChatMessage[];
    isLoading: boolean;
  };
  presentation: PresentationSettings;
  fieldLimits: ReportFieldLimits;
  meetingLock: ProjectMeetingLockConfig;
  lockAuditEvents: LockAuditEvent[];
  attendance: AttendanceState;
  authenticatedIdentity?: AuthenticatedIdentity;
}

export interface ReportWorkspaceState {
  currentRole: WorkspaceRole;
  activeProjectId: string;
  projects: ReportWorkspaceProject[];
}
