import {
  Project,
  ProjectStatus,
  Milestone,
  MilestoneStatus,
  RedLightStatus,
  RedLightState,
  Document,
  DocumentType,
  DocumentVersion,
  ChangeType,
  FieldDiff,
  PendingAction,
  PendingActionStatus,
  Notification,
  NotificationType,
  // ===== Phase 1: 樂觀併發控制 =====
  ConflictResolutionAction,
  ConflictInfo,
  ConflictAuditLog,
} from '../types';

// ===== 專案假資料 =====

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    code: 'PRJ-2024-001',
    name: '低碳建築示範專案',
    owner: '王小明',
    department: '工程一處',
    status: ProjectStatus.InProgress,
    baselineStartDate: new Date('2024-01-01'),
    baselineEndDate: new Date('2024-06-30'),
    currentStartDate: new Date('2024-01-01'),
    currentEndDate: new Date('2024-07-15'),
    progress: 65,
    budget: 15000000,
    description: '位於台北市信義區的低碳建築示範專案，預計取得鑽石級綠建築標章。',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'proj-002',
    code: 'PRJ-2024-002',
    name: '智慧工廠建置專案',
    owner: '李大華',
    department: '工程二處',
    status: ProjectStatus.Delayed,
    baselineStartDate: new Date('2024-02-01'),
    baselineEndDate: new Date('2024-08-31'),
    currentStartDate: new Date('2024-02-15'),
    currentEndDate: new Date('2024-10-15'),
    progress: 35,
    budget: 25000000,
    description: '於桃園市新建智慧工廠，導入物聯網與 AI 生產管理系統。',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-22'),
  },
  {
    id: 'proj-003',
    code: 'PRJ-2024-003',
    name: '辦公大樓新建工程',
    owner: '張美玲',
    department: '工程一處',
    status: ProjectStatus.InProgress,
    baselineStartDate: new Date('2024-03-01'),
    baselineEndDate: new Date('2025-02-28'),
    currentStartDate: new Date('2024-03-01'),
    currentEndDate: new Date('2025-02-28'),
    progress: 20,
    budget: 80000000,
    description: '台中市精華地段辦公大樓新建工程，地上15層地下3層。',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-02-18'),
  },
];

// ===== 里程碑假資料 =====

export const mockMilestones: Milestone[] = [
  // 專案 1 的里程碑
  {
    id: 'ms-001',
    projectId: 'proj-001',
    name: '設計審查完成',
    baselineDate: new Date('2024-02-15'),
    forecastDate: new Date('2024-02-15'),
    actualDate: new Date('2024-02-15'),
    status: MilestoneStatus.Completed,
    delayDays: 0,
    delayCount: 0,
    owner: '王小明',
    description: '完成建築設計圖說審查',
  },
  {
    id: 'ms-002',
    projectId: 'proj-001',
    name: '基礎工程完成',
    baselineDate: new Date('2024-03-30'),
    forecastDate: new Date('2024-04-10'),
    status: MilestoneStatus.Delayed,
    delayDays: 11,
    delayCount: 2,
    owner: '陳工程',
    description: '基礎開挖與結構體施作',
  },
  {
    id: 'ms-003',
    projectId: 'proj-001',
    name: '結構體完成',
    baselineDate: new Date('2024-05-15'),
    forecastDate: new Date('2024-06-01'),
    status: MilestoneStatus.AtRisk,
    delayDays: 17,
    delayCount: 3,
    owner: '陳工程',
    description: '主結構體完成',
  },
  // 專案 2 的里程碑
  {
    id: 'ms-004',
    projectId: 'proj-002',
    name: '土地取得完成',
    baselineDate: new Date('2024-03-01'),
    forecastDate: new Date('2024-03-20'),
    status: MilestoneStatus.Delayed,
    delayDays: 20,
    delayCount: 1,
    owner: '李大華',
    description: '完成土地變更與取得',
  },
  {
    id: 'ms-005',
    projectId: 'proj-002',
    name: '建照取得',
    baselineDate: new Date('2024-04-15'),
    forecastDate: new Date('2024-05-30'),
    status: MilestoneStatus.Delayed,
    delayDays: 45,
    delayCount: 4,
    owner: '李大華',
    description: '取得建造執照',
  },
  // 專案 3 的里程碑
  {
    id: 'ms-006',
    projectId: 'proj-003',
    name: '設計招標',
    baselineDate: new Date('2024-04-01'),
    forecastDate: new Date('2024-04-01'),
    status: MilestoneStatus.InProgress,
    delayDays: 0,
    delayCount: 0,
    owner: '張美玲',
    description: '建築師與顧問公司招標',
  },
];

// ===== 紅燈狀態假資料 =====

export const mockRedLights: RedLightStatus[] = [
  {
    id: 'rl-001',
    projectId: 'proj-001',
    milestoneId: 'ms-003',
    milestoneName: '結構體完成',
    projectName: '低碳建築示範專案',
    redLightStartDate: new Date('2024-05-16'),
    currentDelayDays: 8,
    status: RedLightState.Active,
    owner: '陳工程',
    department: '工程一處',
  },
  {
    id: 'rl-002',
    projectId: 'proj-002',
    milestoneId: 'ms-005',
    milestoneName: '建照取得',
    projectName: '智慧工廠建置專案',
    redLightStartDate: new Date('2024-04-16'),
    currentDelayDays: 9,
    status: RedLightState.Escalated7,
    escalated7At: new Date('2024-04-23'),
    owner: '李大華',
    department: '工程二處',
  },
  {
    id: 'rl-003',
    projectId: 'proj-002',
    milestoneId: 'ms-004',
    milestoneName: '土地取得完成',
    projectName: '智慧工廠建置專案',
    redLightStartDate: new Date('2024-03-02'),
    currentDelayDays: 21,
    status: RedLightState.Escalated14,
    escalated7At: new Date('2024-03-09'),
    escalated14At: new Date('2024-03-16'),
    owner: '李大華',
    department: '工程二處',
  },
];

// ===== 文件假資料 =====

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    projectId: 'proj-001',
    name: '專案進度報告',
    type: DocumentType.MeetingPPT,
    description: '雙週進度追蹤會議簡報',
    currentVersion: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    createdBy: '王小明',
  },
  {
    id: 'doc-002',
    projectId: 'proj-001',
    name: '預算執行明細',
    type: DocumentType.ProgressExcel,
    description: '每月預算執行狀況',
    currentVersion: 3,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
    createdBy: '李會計',
  },
  {
    id: 'doc-003',
    projectId: 'proj-002',
    name: '會議紀錄',
    type: DocumentType.Report,
    description: '設計審查會議紀錄',
    currentVersion: 2,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-22'),
    createdBy: '李大華',
  },
  {
    id: 'doc-004',
    projectId: 'proj-003',
    name: '設計審查報告',
    type: DocumentType.MeetingPPT,
    description: '辦公大樓設計審查會議簡報',
    currentVersion: 2,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-10'),
    createdBy: '張美玲',
  },
];

// ===== 文件版本假資料 (含 baseVersionId) =====

const diffSummary1: FieldDiff[] = [
  {
    fieldName: '工項A 預計完成日',
    oldValue: '2024/02/15',
    newValue: '2024/02/28',
    isCritical: true,
    changeType: 'delayed',
    delayDays: 13,
  },
  {
    fieldName: '工項B 預計完成日',
    oldValue: '2024/03/01',
    newValue: '2024/03/01',
    isCritical: false,
    changeType: 'modified',
  },
  {
    fieldName: '工項C 預計完成日',
    oldValue: '2024/03/15',
    newValue: '2024/04/01',
    isCritical: true,
    changeType: 'delayed',
    delayDays: 17,
  },
];

const diffSummary2: FieldDiff[] = [
  {
    fieldName: '基礎工程完成日',
    oldValue: '2024/03/30',
    newValue: '2024/04/10',
    isCritical: true,
    changeType: 'delayed',
    delayDays: 11,
  },
  {
    fieldName: '備註',
    oldValue: '依原定計畫執行',
    newValue: '因雨延誤，已調整工期',
    isCritical: false,
    changeType: 'modified',
  },
];

export const mockDocumentVersions: DocumentVersion[] = [
  {
    id: 'ver-001',
    documentId: 'doc-001',
    versionNo: 5,
    fileName: '專案進度報告_v5.pptx',
    fileSize: 2456789,
    fileHash: 'a1b2c3d4e5f6...',
    uploadedBy: 'user001',
    uploadedByName: '王小明',
    uploadedAt: new Date('2024-02-20T10:30:00'),
    changeReason: '更新工項A、工項C的預計完成日，因廠商物料延遲及現場條件變更',
    changeType: ChangeType.MajorUpdate,
    extractedFields: {
      meetingDate: '2024-02-20',
      caseId: 'PRJ-2024-001',
      owner: '王小明',
      status: '進行中',
      progressDates: [
        { item: '工項A', original: '2024/02/15', current: '2024/02/28' },
        { item: '工項B', original: '2024/03/01', current: '2024/03/01' },
        { item: '工項C', original: '2024/03/15', current: '2024/04/01' },
      ],
    },
    diffSummary: diffSummary1,
    isCurrent: true,
    branch: 'main',
  },
  {
    id: 'ver-002',
    documentId: 'doc-001',
    versionNo: 4,
    fileName: '專案進度報告_v4.pptx',
    fileSize: 2345678,
    fileHash: 'b2c3d4e5f6g7...',
    uploadedBy: 'user001',
    uploadedByName: '王小明',
    uploadedAt: new Date('2024-02-06T14:20:00'),
    changeReason: '更新基礎工程進度，因連日降雨影響施作',
    changeType: ChangeType.MinorUpdate,
    extractedFields: {
      meetingDate: '2024-02-06',
      caseId: 'PRJ-2024-001',
      owner: '王小明',
      status: '進行中',
      progressDates: [
        { item: '基礎工程', original: '2024/03/30', current: '2024/04/10' },
      ],
    },
    diffSummary: diffSummary2,
    isCurrent: false,
    branch: 'main',
  },
  {
    id: 'ver-003',
    documentId: 'doc-001',
    versionNo: 3,
    fileName: '專案進度報告_v3.pptx',
    fileSize: 2234567,
    fileHash: 'c3d4e5f6g7h8...',
    uploadedBy: 'user001',
    uploadedByName: '王小明',
    uploadedAt: new Date('2024-01-23T09:15:00'),
    changeReason: '例行雙週更新',
    changeType: ChangeType.MinorUpdate,
    extractedFields: {
      meetingDate: '2024-01-23',
      caseId: 'PRJ-2024-001',
      owner: '王小明',
      status: '進行中',
    },
    isCurrent: false,
    branch: 'main',
  },
  {
    id: 'ver-004',
    documentId: 'doc-001',
    versionNo: 2,
    fileName: '專案進度報告_v2.pptx',
    fileSize: 2123456,
    fileHash: 'd4e5f6g7h8i9...',
    uploadedBy: 'user001',
    uploadedByName: '王小明',
    uploadedAt: new Date('2024-01-09T11:00:00'),
    changeReason: '新增設計變更說明',
    changeType: ChangeType.MinorUpdate,
    extractedFields: {
      meetingDate: '2024-01-09',
      caseId: 'PRJ-2024-001',
      owner: '王小明',
      status: '進行中',
    },
    isCurrent: false,
    branch: 'main',
  },
  {
    id: 'ver-005',
    documentId: 'doc-001',
    versionNo: 1,
    fileName: '專案進度報告_v1.pptx',
    fileSize: 2012345,
    fileHash: 'e5f6g7h8i9j0...',
    uploadedBy: 'user001',
    uploadedByName: '王小明',
    uploadedAt: new Date('2024-01-02T13:45:00'),
    changeReason: '初次建立進度報告',
    changeType: ChangeType.Initial,
    extractedFields: {
      meetingDate: '2024-01-02',
      caseId: 'PRJ-2024-001',
      owner: '王小明',
      status: '規劃中',
    },
    isCurrent: false,
    branch: 'main',
    baseVersionId: undefined, // v1 是初始版本，沒有基礎版本
  },
  // ===== doc-002 (預算執行明細) 的版本 =====
  {
    id: 'ver-006',
    documentId: 'doc-002',
    versionNo: 3,
    fileName: '預算執行明細_v3.xlsx',
    fileSize: 856789,
    fileHash: 'f1g2h3i4j5...',
    uploadedBy: 'user004',
    uploadedByName: '李會計',
    uploadedAt: new Date('2024-02-15T16:00:00'),
    changeReason: '更新 2 月預算執行狀況',
    changeType: ChangeType.MinorUpdate,
    extractedFields: {},
    isCurrent: true,
    branch: 'main',
    baseVersionId: 'ver-007',
  },
  {
    id: 'ver-007',
    documentId: 'doc-002',
    versionNo: 2,
    fileName: '預算執行明細_v2.xlsx',
    fileSize: 823456,
    fileHash: 'g2h3i4j5k6...',
    uploadedBy: 'user004',
    uploadedByName: '李會計',
    uploadedAt: new Date('2024-01-31T14:30:00'),
    changeReason: '更新 1 月預算執行狀況',
    changeType: ChangeType.MinorUpdate,
    extractedFields: {},
    isCurrent: false,
    branch: 'main',
    baseVersionId: 'ver-008',
  },
  {
    id: 'ver-008',
    documentId: 'doc-002',
    versionNo: 1,
    fileName: '預算執行明細_v1.xlsx',
    fileSize: 798234,
    fileHash: 'h3i4j5k6l7...',
    uploadedBy: 'user004',
    uploadedByName: '李會計',
    uploadedAt: new Date('2024-01-20T10:00:00'),
    changeReason: '初次建立預算明細',
    changeType: ChangeType.Initial,
    extractedFields: {},
    isCurrent: false,
    branch: 'main',
    baseVersionId: undefined,
  },
  // ===== doc-003 (會議紀錄 - proj-002) 的版本 =====
  {
    id: 'ver-009',
    documentId: 'doc-003',
    versionNo: 2,
    fileName: '會議紀錄_v2.docx',
    fileSize: 245678,
    fileHash: 'i4j5k6l7m8...',
    uploadedBy: 'user003',
    uploadedByName: '李大華',
    uploadedAt: new Date('2024-02-22T11:00:00'),
    changeReason: '更新會議結論與行動項目',
    changeType: ChangeType.MinorUpdate,
    extractedFields: {},
    isCurrent: true,
    branch: 'main',
    baseVersionId: 'ver-010',
  },
  {
    id: 'ver-010',
    documentId: 'doc-003',
    versionNo: 1,
    fileName: '會議紀錄_v1.docx',
    fileSize: 234567,
    fileHash: 'j5k6l7m8n9...',
    uploadedBy: 'user003',
    uploadedByName: '李大華',
    uploadedAt: new Date('2024-02-10T15:30:00'),
    changeReason: '初次建例會議紀錄',
    changeType: ChangeType.Initial,
    extractedFields: {},
    isCurrent: false,
    branch: 'main',
    baseVersionId: undefined,
  },
  // ===== doc-004 (設計審查報告 - proj-003) 的版本 =====
  {
    id: 'ver-011',
    documentId: 'doc-004',
    versionNo: 2,
    fileName: '設計審查報告_v2.pptx',
    fileSize: 3567890,
    fileHash: 'k6l7m8n9o0...',
    uploadedBy: 'user005',
    uploadedByName: '張美玲',
    uploadedAt: new Date('2024-03-10T09:00:00'),
    changeReason: '更新設計方案與成本分析',
    changeType: ChangeType.MajorUpdate,
    extractedFields: {},
    isCurrent: true,
    branch: 'main',
    baseVersionId: 'ver-012',
  },
  {
    id: 'ver-012',
    documentId: 'doc-004',
    versionNo: 1,
    fileName: '設計審查報告_v1.pptx',
    fileSize: 3456789,
    fileHash: 'l7m8n9o0p1...',
    uploadedBy: 'user005',
    uploadedByName: '張美玲',
    uploadedAt: new Date('2024-03-05T14:00:00'),
    changeReason: '初次建立設計審查報告',
    changeType: ChangeType.Initial,
    extractedFields: {},
    isCurrent: false,
    branch: 'main',
    baseVersionId: undefined,
  },
];

// ===== 待辦事項假資料 =====

export const mockPendingActions: PendingAction[] = [
  {
    id: 'pa-001',
    projectId: 'proj-001',
    milestoneId: 'ms-003',
    description: '聯繫鋼筋供應商確認交期',
    owner: 'user002',
    ownerName: '陳工程',
    dueDate: new Date('2024-02-25'),
    status: PendingActionStatus.Open,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'pa-002',
    projectId: 'proj-001',
    milestoneId: 'ms-003',
    description: '提出工期展延申請',
    owner: 'user001',
    ownerName: '王小明',
    dueDate: new Date('2024-02-28'),
    status: PendingActionStatus.InProgress,
    createdAt: new Date('2024-02-18'),
  },
  {
    id: 'pa-003',
    projectId: 'proj-002',
    milestoneId: 'ms-004',
    description: '與地主協調土地變更事宜',
    owner: 'user003',
    ownerName: '李大華',
    dueDate: new Date('2024-02-22'),
    status: PendingActionStatus.Overdue,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'pa-004',
    projectId: 'proj-002',
    milestoneId: 'ms-005',
    description: '準備建照申請文件',
    owner: 'user003',
    ownerName: '李大華',
    dueDate: new Date('2024-03-05'),
    status: PendingActionStatus.Open,
    createdAt: new Date('2024-02-20'),
  },
];

// ===== 通知假資料 =====

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: NotificationType.Escalation7,
    title: '【延誤警示】智慧工廠建置專案 - 建照取得',
    content: '專案「智慧工廠建置專案」的工項「建照取得」已延誤 9 天',
    projectId: 'proj-002',
    milestoneId: 'ms-005',
    recipient: 'manager001',
    recipientName: '張處長',
    sentAt: new Date('2024-02-23T08:00:00'),
    isRead: false,
    escalationLevel: 7,
  },
  {
    id: 'notif-002',
    type: NotificationType.Escalation14,
    title: '【嚴重延誤】智慧工廠建置專案 - 土地取得完成',
    content: '專案「智慧工廠建置專案」的工項「土地取得完成」已延誤 21 天',
    projectId: 'proj-002',
    milestoneId: 'ms-004',
    recipient: 'director001',
    recipientName: '陳主任',
    sentAt: new Date('2024-02-22T08:00:00'),
    isRead: true,
    escalationLevel: 14,
  },
  {
    id: 'notif-003',
    type: NotificationType.RedLight,
    title: '【紅燈警示】低碳建築示範專案 - 結構體完成',
    content: '專案「低碳建築示範專案」的工項「結構體完成」進度落後',
    projectId: 'proj-001',
    milestoneId: 'ms-003',
    recipient: 'manager001',
    recipientName: '張處長',
    sentAt: new Date('2024-02-21T08:00:00'),
    isRead: true,
    escalationLevel: 0,
  },
  {
    id: 'notif-004',
    type: NotificationType.DocumentUpload,
    title: '文件更新通知',
    content: '王小明 已更新「專案進度報告」至 v5',
    projectId: 'proj-001',
    recipient: 'team001',
    recipientName: '專案團隊',
    sentAt: new Date('2024-02-20T10:35:00'),
    isRead: false,
  },
];

// ===== 輔助函數 =====

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getMilestonesByProject(projectId: string): Milestone[] {
  return mockMilestones.filter((m) => m.projectId === projectId);
}

export function getRedLightsByProject(projectId: string): RedLightStatus[] {
  return mockRedLights.filter((r) => r.projectId === projectId);
}

export function getDocumentsByProject(projectId: string): Document[] {
  return mockDocuments.filter((d) => d.projectId === projectId);
}

export function getVersionsByDocument(documentId: string): DocumentVersion[] {
  return mockDocumentVersions.filter((v) => v.documentId === documentId);
}

export function getPendingActionsByProject(projectId: string): PendingAction[] {
  return mockPendingActions.filter((p) => p.projectId === projectId);
}

export function getStatusColor(status: ProjectStatus | MilestoneStatus): string {
  switch (status) {
    case ProjectStatus.Completed:
    case MilestoneStatus.Completed:
      return 'success';
    case ProjectStatus.Delayed:
    case MilestoneStatus.Delayed:
    case MilestoneStatus.AtRisk:
      return 'error';
    case ProjectStatus.OnHold:
      return 'warning';
    case ProjectStatus.InProgress:
    case MilestoneStatus.InProgress:
      return 'primary';
    default:
      return 'default';
  }
}

export function getStatusLabel(status: ProjectStatus | MilestoneStatus): string {
  const labels: Record<string, string> = {
    [ProjectStatus.Planning]: '規劃中',
    [ProjectStatus.InProgress]: '進行中',
    [ProjectStatus.OnHold]: '暫停',
    [ProjectStatus.Completed]: '已完成',
    [ProjectStatus.Delayed]: '延誤',
    [MilestoneStatus.NotStarted]: '未開始',
    [MilestoneStatus.AtRisk]: '風險',
  };
  return labels[status] || status;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ===== Phase 1: 樂觀併發控制 - 輔助函式 =====

/**
 * 檢查版本衝突（樂觀併發控制）
 * @param baseVersionId 用戶基於的版本 ID
 * @param latestVersionId 伺服器最新版本 ID
 * @returns 是否有衝突
 */
export function checkVersionConflict(
  baseVersionId: string | undefined,
  latestVersionId: string
): boolean {
  return baseVersionId !== undefined && baseVersionId !== latestVersionId;
}

/**
 * 獲取文件的最新版本
 * @param documentId 文件 ID
 * @returns 最新版本（按 versionNo 降序）
 */
export function getLatestVersion(documentId: string): DocumentVersion | undefined {
  const versions = mockDocumentVersions.filter(v => v.documentId === documentId);
  return versions.sort((a, b) => b.versionNo - a.versionNo)[0];
}

/**
 * 獲取指定版本的資訊
 * @param versionId 版本 ID
 * @returns 版本資訊
 */
export function getVersionById(versionId: string): DocumentVersion | undefined {
  return mockDocumentVersions.find(v => v.id === versionId);
}

/**
 * 記錄用戶下載的版本（用於追蹤 baseVersionId）
 * 實際應用中應使用 localStorage 或後端 session
 */
export function recordUserBaseVersion(documentId: string, versionId: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(`doc_${documentId}_baseVersion`, versionId);
  }
}

/**
 * 獲取用戶下載的版本 ID
 */
export function getUserBaseVersion(documentId: string): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(`doc_${documentId}_baseVersion`);
  }
  return null;
}

/**
 * 建立衝突資訊物件
 * @param documentId 文件 ID
 * @param userBaseVersionId 用戶基於的版本 ID
 * @returns ConflictInfo 或 null（如果無衝突）
 */
export function createConflictInfo(
  documentId: string,
  userBaseVersionId: string
): ConflictInfo | null {
  const document = mockDocuments.find(d => d.id === documentId);
  const latestVersion = getLatestVersion(documentId);
  const baseVersion = getVersionById(userBaseVersionId);

  if (!document || !latestVersion || !baseVersion) {
    return null;
  }

  // 檢查是否有衝突
  if (!checkVersionConflict(userBaseVersionId, latestVersion.id)) {
    return null; // 無衝突
  }

  return {
    baseVersion,
    latestVersion,
    document,
  };
}

// ===== 衝突場景測試資料 =====

/**
 * 模擬衝突場景：用戶基於 v3 修改，但現在最新是 v5
 * 用於測試 ConflictDialog 顯示
 */
export const mockConflictScenario = {
  documentId: 'doc-001',
  userBaseVersionId: 'ver-003',  // 用戶基於 v3
  latestVersionId: 'ver-001',    // 伺服器最新是 v5
  conflictDetected: true,
  conflictMessage: '您基於 v3 修改，但現在最新是 v5',
};

// ===== 衝突稽核記錄範例 =====

export const mockConflictAuditLogs: ConflictAuditLog[] = [
  {
    id: 'audit-conf-001',
    documentId: 'doc-001',
    documentName: '專案進度報告',
    conflictType: 'version_conflict',
    baseVersionNo: 3,
    latestVersionNo: 5,
    resolutionAction: ConflictResolutionAction.ForceOverwrite,
    overwriteReason: '緊急修正，必須立即生效',
    resolvedBy: 'user001',
    resolvedByName: '王小明',
    resolvedAt: new Date('2024-02-21T15:30:00'),
  },
];

// ===== 分支版本建立 =====

/**
 * 建立分支版本
 * @param baseVersionId 基礎版本 ID
 * @param documentId 文件 ID
 * @returns 新的分支版本
 */
export function createBranchVersion(
  baseVersionId: string,
  documentId: string
): DocumentVersion | null {
  const baseVersion = getVersionById(baseVersionId);
  const document = mockDocuments.find(d => d.id === documentId);

  if (!baseVersion || !document) {
    return null;
  }

  // 計算分支編號（基於現有分支數量）
  const existingBranches = mockDocumentVersions.filter(
    v => v.documentId === documentId && v.branch === 'branch' && v.baseVersionId === baseVersionId
  );
  const branchNo = existingBranches.length + 1;

  // 建立分支版本
  const branchVersion: DocumentVersion = {
    id: `ver-branch-${Date.now()}`,
    documentId,
    versionNo: baseVersion.versionNo,
    fileName: `${document.name}_v${baseVersion.versionNo}-branch-${branchNo}.pptx`,
    fileSize: baseVersion.fileSize,
    fileHash: `branch-${baseVersion.fileHash}-${Date.now()}`,
    uploadedBy: baseVersion.uploadedBy,
    uploadedByName: baseVersion.uploadedByName,
    uploadedAt: new Date(),
    changeReason: `基於 v${baseVersion.versionNo} 建立分支版本`,
    changeType: ChangeType.MinorUpdate,
    extractedFields: baseVersion.extractedFields || {},
    isCurrent: false,
    branch: 'branch',
    baseVersionId: baseVersionId,
  };

  return branchVersion;
}
