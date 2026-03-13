// ===== 專案相關型別 =====

export interface Project {
  id: string;
  code: string;
  name: string;
  owner: string;
  department: string;
  status: ProjectStatus;
  baselineStartDate: Date;
  baselineEndDate: Date;
  currentStartDate: Date;
  currentEndDate: Date;
  progress: number;
  budget: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  Planning = 'planning',
  InProgress = 'in_progress',
  OnHold = 'on_hold',
  Completed = 'completed',
  Delayed = 'delayed',
}

// ===== 工項/里程碑型別 =====

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  baselineDate: Date;
  forecastDate: Date;
  actualDate?: Date;
  status: MilestoneStatus;
  delayDays: number;
  delayCount: number;
  owner: string;
  description: string;
}

export enum MilestoneStatus {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
  Delayed = 'delayed',
  AtRisk = 'at_risk',
}

// ===== 紅燈狀態型別 =====

export interface RedLightStatus {
  id: string;
  projectId: string;
  milestoneId: string;
  milestoneName: string;
  projectName: string;
  redLightStartDate: Date;
  currentDelayDays: number;
  status: RedLightState;
  escalated7At?: Date;
  escalated14At?: Date;
  escalated30At?: Date;
  owner: string;
  department: string;
  resolutionNote?: string;
}

export enum RedLightState {
  Active = 'active',
  Escalated7 = 'escalated_7',
  Escalated14 = 'escalated_14',
  Escalated30 = 'escalated_30',
  Resolved = 'resolved',
}

// ===== 文件版本控制型別 =====

export interface Document {
  id: string;
  projectId: string;
  meetingId?: string;
  name: string;
  type: DocumentType;
  description: string;
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum DocumentType {
  MeetingPPT = 'meeting_ppt',
  ProgressExcel = 'progress_excel',
  ContractPDF = 'contract_pdf',
  Report = 'report',
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNo: number;
  fileName: string;
  fileSize: number;
  fileHash: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
  changeReason: string;
  changeType: ChangeType;
  extractedFields: Record<string, any>;
  diffSummary?: FieldDiff[];
  isCurrent: boolean;
  branch?: string; // 分支名稱（預設為 'main'）
  // ===== Phase 1: 樂觀併發控制 =====
  baseVersionId?: string; // 此版本基於哪個版本建立（用於衝突檢測）
  slideFingerprints?: SlideFingerprint[]; // Slide 層級指紋（用於差異比對）
}

export enum ChangeType {
  Initial = 'initial',
  MinorUpdate = 'minor_update',
  MajorUpdate = 'major_update',
  Correction = 'correction',
}

export interface FieldDiff {
  fieldName: string;
  oldValue: string;
  newValue: string;
  isCritical: boolean;
  changeType: 'added' | 'modified' | 'removed' | 'delayed';
  delayDays?: number;
}

// ===== Phase 1: 樂觀併發控制 - 衝突處理型別 =====

export interface SlideFingerprint {
  slideIndex: number;
  slideName?: string;
  contentHash: string; // 該 slide 內容的 hash
  lastModified: Date;
}

export enum ConflictResolutionAction {
  ViewDiff = 'view_diff', // 查看差異（比對 slide/欄位層級）
  ForceOverwrite = 'force_overwrite', // 強制覆蓋（需說明原因）
  DownloadLatest = 'download_latest', // 下載最新版本重整
  CreateBranch = 'create_branch', // 建立分支版本
}

export interface ConflictInfo {
  baseVersion: DocumentVersion; // 用戶基於的版本
  latestVersion: DocumentVersion; // 目前伺服器最新版本
  document: Document; // 文件資訊
}

export interface ConflictDialogProps {
  open: boolean;
  conflictInfo: ConflictInfo | null;
  onResolve: (action: ConflictResolutionAction, reason?: string) => void;
  onClose: () => void;
}

export interface ConflictAuditLog {
  id: string;
  documentId: string;
  documentName: string;
  conflictType: 'version_conflict';
  baseVersionNo: number;
  latestVersionNo: number;
  resolutionAction: ConflictResolutionAction;
  overwriteReason?: string;
  resolvedBy: string;
  resolvedByName: string;
  resolvedAt: Date;
}

// ===== 稽核軌跡型別 =====

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  reason?: string;
  changedBy: string;
  changedByName: string;
  changedAt: Date;
  userIP: string;
}

// ===== 通知型別 =====

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  projectId?: string;
  milestoneId?: string;
  recipient: string;
  recipientName: string;
  sentAt: Date;
  isRead: boolean;
  escalationLevel?: number;
}

export enum NotificationType {
  RedLight = 'red_light',
  Escalation7 = 'escalation_7',
  Escalation14 = 'escalation_14',
  Escalation30 = 'escalation_30',
  DocumentUpload = 'document_upload',
  ExceptionRequest = 'exception_request',
}

// ===== 例外申請型別 =====

export interface ExceptionRequest {
  id: string;
  projectId: string;
  baselineId: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: Date;
  reasonCategory: ExceptionReasonCategory;
  reasonDetail: string;
  oldBaselineDate: Date;
  newBaselineDate: Date;
  status: ExceptionRequestStatus;
  firstApprover?: string;
  firstApprovedAt?: Date;
  secondApprover?: string;
  secondApprovedAt?: Date;
}

export enum ExceptionReasonCategory {
  PolicyChange = 'policy_change',
  BudgetChange = 'budget_change',
  ForceMajeure = 'force_majeure',
  UpperLevelInstruction = 'upper_level_instruction',
}

export enum ExceptionRequestStatus {
  Pending = 'pending',
  FirstApproved = 'first_approved',
  Approved = 'approved',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
}

// ===== 待辦事項型別 =====

export interface PendingAction {
  id: string;
  projectId: string;
  milestoneId?: string;
  description: string;
  owner: string;
  ownerName: string;
  dueDate: Date;
  status: PendingActionStatus;
  createdAt: Date;
  completedAt?: Date;
  completionNote?: string;
}

export enum PendingActionStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Completed = 'completed',
  Overdue = 'overdue',
}
