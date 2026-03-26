import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  alpha,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  createPage,
  cloneVersionForNext,
  createWorkspaceProject,
  initialReportWorkspaceState,
  reorderItems,
} from '../../mock/reportWorkspaceData';
import {
  AttendanceExpectedMember,
  AttendanceRecord,
  DepartmentReportBlock,
  ReportFieldLimits,
  ReportFields,
  ReportWorkspaceProject,
  ReportWorkspaceState,
  LockAuditEvent,
  WorkspaceChatMessage,
  WorkspaceDepartment,
  WorkspaceImageItem,
  WorkspacePage,
  WorkspacePageType,
} from '../../types/reportWorkspace';
import { meetingHeaderSx, meetingHintTextSx, meetingSurfaceSx } from '../../styles/meetingSurface';
import { DEFAULT_REPORT_FIELD_LIMITS } from '../../constants/reportFieldLimits';

type AttendanceRosterImportMode = 'replace' | 'append';

interface ParsedAttendanceRosterMember {
  departmentId: string;
  departmentName: string;
  name: string;
}

interface AttendanceRosterPreviewState {
  mode: AttendanceRosterImportMode;
  parsedMembers: ParsedAttendanceRosterMember[];
  errors: string[];
  summary: string;
}

const fieldsMeta: Array<{ key: keyof ReportFields; label: string; multiline?: number }> = [
  { key: 'workItem', label: '工作項目' },
  { key: 'plannedBuildDate', label: '預計完成日(掛建日)' },
  { key: 'approvalDate', label: '預計完成日(核准日)' },
  { key: 'weeklyStatusAndRisk', label: '本周、下周辦理情形暨工作預警狀況說明', multiline: 3 },
  { key: 'supportPlan', label: '建請協助方案（公關機制/跨部門協調test）', multiline: 3 },
  { key: 'executiveDiscussion', label: '待層峰討論 & 決議', multiline: 3 },
];

const fieldLimitLabels: Record<keyof ReportFields, string> = {
  workItem: '工作項目',
  plannedBuildDate: '預計完成日(掛建日)',
  approvalDate: '預計完成日(核准日)',
  weeklyStatusAndRisk: '本周、下周辦理情形暨工作預警狀況說明',
  supportPlan: '建請協助方案',
  executiveDiscussion: '待層峰討論 & 決議',
};

// 統一產生目前時間的 ISO 字串，供版本與簽到事件留痕使用。
const nowIso = () => new Date().toISOString();
const STORAGE_KEY = 'report-workspace-state';

// 從 localStorage 還原工作台狀態；讀取失敗時回退到初始 mock 資料。
const loadPersistedState = (): ReportWorkspaceState => {
  if (typeof window === 'undefined') {
    return initialReportWorkspaceState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialReportWorkspaceState;
  }

  try {
    const parsed = JSON.parse(raw) as ReportWorkspaceState;
    if (!parsed || !Array.isArray(parsed.projects) || typeof parsed.activeProjectId !== 'string') {
      return initialReportWorkspaceState;
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse persisted report workspace state.', error);
    return initialReportWorkspaceState;
  }
};

// 依目前選取的版本與頁面內容，回傳簡單的助理回覆模擬結果。
const getAssistantReply = (project: ReportWorkspaceProject, userInput: string): string => {
  const activeVersion = project.versions.find((version) => version.id === project.activeVersionId);
  const activePage = activeVersion?.pages.find((page) => page.id === project.activePageId);
  if (!activeVersion || !activePage) {
    return '目前沒有可分析內容，請先選擇版本與頁面。';
  }

  if (activePage.type === 'report') {
    const completedCount = activePage.blocks.filter((block) => block.isCompleted).length;
    const pendingNames = activePage.blocks
      .filter((block) => !block.isCompleted)
      .map((block) => project.departments.find((department) => department.id === block.departmentId)?.name ?? block.departmentId);

    if (userInput.includes('風險') || userInput.includes('預警')) {
      if (pendingNames.length === 0) {
        return `目前版本 v${activeVersion.versionNo} 的一般報表頁已全部完成，暫無明顯填報風險。建議聚焦跨部門協作與決議追蹤。`;
      }

      return `目前版本 v${activeVersion.versionNo} 在此頁已完成 ${completedCount}/${activePage.blocks.length}。建議優先追蹤未完成部門：${pendingNames.join('、')}。`;
    }

    return `已分析一般報表頁：完成 ${completedCount}/${activePage.blocks.length}。可先確認「本周、下周辦理情形暨工作預警」與「待層峰討論 & 決議」欄位是否齊全。`;
  }

  const activeGroup = activePage.groups.find((group) => group.departmentId === project.currentDepartmentId);
  const imageCount = activeGroup?.images.length ?? 0;

  if (imageCount === 0) {
    return `目前版本 v${activeVersion.versionNo} 的圖片頁尚未上傳圖片，建議先上傳現況照片再進行分析。`;
  }

  const departmentName =
    project.departments.find((department) => department.id === project.currentDepartmentId)?.name ?? project.currentDepartmentId;
  return `已分析圖片頁（${departmentName}）：共有 ${imageCount} 張圖片。可優先補齊關鍵圖片註解，方便跨部門同步。`;
};

// 判斷當前角色是否能編輯指定部門的一般報表區塊。
const canEditDepartmentBlock = (
  currentRole: ReportWorkspaceState['currentRole'],
  currentDepartmentId: string,
  block: DepartmentReportBlock,
  canEditCurrentVersion: boolean
): boolean => {
  if (!canEditCurrentVersion) {
    return false;
  }

  if (currentRole === 'admin') {
    return true;
  }

  return currentDepartmentId === block.departmentId;
};

// 判斷版本在當下是否可編輯，包含未鎖定與外掛時間中的情況。
const isVersionEditableAt = (version: ReportWorkspaceProject['versions'][number], now: Date): boolean => {
  if (!version.isLocked) {
    return true;
  }

  if (!version.overtimeUnlockUntil) {
    return false;
  }

  const unlockUntilMs = Date.parse(version.overtimeUnlockUntil);
  if (!Number.isFinite(unlockUntilMs)) {
    return false;
  }

  return now.getTime() < unlockUntilMs;
};

// 取得專案中最新、尚可編輯的版本，供自動鎖定排程使用。
const getLatestEditableVersion = (project: ReportWorkspaceProject) => {
  return project.versions
    .filter((version) => !version.isLocked)
    .sort((a, b) => b.versionNo - a.versionNo)[0];
};

// 判斷目前使用者是否有權操作指定部門範圍的資料。
const canEditDepartmentScope = (
  currentRole: ReportWorkspaceState['currentRole'],
  currentDepartmentId: string,
  targetDepartmentId: string
): boolean => {
  if (currentRole === 'admin') {
    return true;
  }
  return currentDepartmentId === targetDepartmentId;
};

// 將欄位上限設定補齊預設值，避免缺欄導致驗證不一致。
const normalizeFieldLimits = (limits?: Partial<ReportFieldLimits>): ReportFieldLimits => {
  return {
    ...DEFAULT_REPORT_FIELD_LIMITS,
    ...limits,
  };
};

// 掃描版本內所有一般報表欄位，找出超過字數限制的內容。
const getVersionFieldLimitViolations = (
  version: ReportWorkspaceProject['versions'][number],
  fieldLimits: ReportFieldLimits
) => {
  const violations: Array<{ pageId: string; departmentId: string; field: keyof ReportFields; length: number; limit: number }> = [];

  version.pages.forEach((page) => {
    if (page.type !== 'report') {
      return;
    }

    page.blocks.forEach((block) => {
      fieldsMeta.forEach((meta) => {
        const value = block.fields[meta.key];
        const limit = fieldLimits[meta.key];
        if (value.length > limit) {
          violations.push({
            pageId: page.id,
            departmentId: block.departmentId,
            field: meta.key,
            length: value.length,
            limit,
          });
        }
      });
    });
  });

  return violations;
};

// 將簽到 ledger 正規化後整理成準時、遲到與缺席三組摘要資料。
const buildAttendanceSummary = (expectedRoster: AttendanceExpectedMember[], records: AttendanceRecord[]) => {
  const activeRecords = records.filter((record) => !record.voidedAt);
  const canonicalByMemberId = new Map<string, AttendanceRecord>();

  activeRecords.forEach((record) => {
    const existing = canonicalByMemberId.get(record.memberId);
    if (!existing) {
      canonicalByMemberId.set(record.memberId, record);
      return;
    }

    const existingTime = Date.parse(existing.signedAt);
    const nextTime = Date.parse(record.signedAt);
    if (Number.isFinite(nextTime) && (!Number.isFinite(existingTime) || nextTime >= existingTime)) {
      canonicalByMemberId.set(record.memberId, record);
    }
  });

  const canonicalRecords = Array.from(canonicalByMemberId.values());
  const activeByMemberId = new Map(canonicalRecords.map((record) => [record.memberId, record]));

  const onTime = canonicalRecords.filter((record) => record.status === 'on_time');
  const late = canonicalRecords.filter((record) => record.status === 'late');
  const absent = expectedRoster.filter((member) => !activeByMemberId.has(member.id));

  return {
    activeRecords: canonicalRecords,
    onTime,
    late,
    absent,
  };
};

const buildAttendanceRosterDraft = (
  roster: AttendanceExpectedMember[],
  departments: WorkspaceDepartment[]
) => roster
  .map((member) => {
    const departmentName = departments.find((department) => department.id === member.departmentId)?.name ?? member.departmentId;
    return `${departmentName},${member.name}`;
  })
  .join('\n');

const parseAttendanceRosterDraft = (
  draft: string,
  departments: WorkspaceDepartment[],
  mode: AttendanceRosterImportMode,
  existingRoster: AttendanceExpectedMember[]
): AttendanceRosterPreviewState => {
  const departmentByName = new Map(departments.map((department) => [department.name, department]));
  const lines = draft
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
  const errors: string[] = [];
  const parsedMembers: ParsedAttendanceRosterMember[] = [];
  const seenKeys = new Set<string>();
  const existingKeys = new Set(existingRoster.map((member) => `${member.departmentId}::${member.name}`));

  if (lines.length === 0) {
    errors.push('請至少輸入一筆名單');
  }

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const [departmentNameRaw = '', memberNameRaw = '', ...extra] = line.split(',').map((part) => part.trim());

    if (departmentNameRaw === '' || extra.length > 0) {
      errors.push(`第 ${lineNumber} 行：格式需為「部門,姓名」`);
      return;
    }

    const department = departmentByName.get(departmentNameRaw);
    if (!department) {
      errors.push(`第 ${lineNumber} 行：找不到部門「${departmentNameRaw}」`);
      return;
    }

    if (memberNameRaw === '') {
      errors.push(`第 ${lineNumber} 行：姓名不可空白`);
      return;
    }

    const duplicateKey = `${department.id}::${memberNameRaw}`;
    if (seenKeys.has(duplicateKey)) {
      errors.push(`第 ${lineNumber} 行：名單重複（${department.name} / ${memberNameRaw}）`);
      return;
    }

    if (mode === 'append' && existingKeys.has(duplicateKey)) {
      errors.push(`第 ${lineNumber} 行：名單已存在（${department.name} / ${memberNameRaw}）`);
      return;
    }

    seenKeys.add(duplicateKey);
    parsedMembers.push({
      departmentId: department.id,
      departmentName: department.name,
      name: memberNameRaw,
    });
  });

  const summary = mode === 'append'
    ? `預覽 ${parsedMembers.length} 筆，將追加 ${parsedMembers.length} 筆到現有 ${existingRoster.length} 筆名單。`
    : `預覽 ${parsedMembers.length} 筆，將覆蓋現有 ${existingRoster.length} 筆名單。`;

  return {
    mode,
    parsedMembers,
    errors,
    summary,
  };
};

export const ReportWorkspacePage: React.FC = () => {
  const theme = useTheme();
  const [state, setState] = useState<ReportWorkspaceState>(loadPersistedState);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newPageType, setNewPageType] = useState<WorkspacePageType>('report');
  const [expandedDepartmentId, setExpandedDepartmentId] = useState<string>('');
  const [projectDialogMode, setProjectDialogMode] = useState<'create' | 'rename' | null>(null);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [workspaceTab, setWorkspaceTab] = useState<'content' | 'chat' | 'admin'>('content');
  const [adminTab, setAdminTab] = useState<'presentation' | 'lock' | 'attendance' | 'field'>('presentation');
  const [chatInput, setChatInput] = useState('');
  const [previewImage, setPreviewImage] = useState<WorkspaceImageItem | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [nowTick, setNowTick] = useState(Date.now());
  const [overtimeMinutes, setOvertimeMinutes] = useState('15');
  const [overtimeReason, setOvertimeReason] = useState('');
  const [overtimeReasonError, setOvertimeReasonError] = useState('');
  const [attendanceRosterDraft, setAttendanceRosterDraft] = useState('');
  const [attendanceRosterImportMode, setAttendanceRosterImportMode] = useState<AttendanceRosterImportMode>('replace');
  const [attendanceRosterPreview, setAttendanceRosterPreview] = useState<AttendanceRosterPreviewState | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const visibleProjects = useMemo(
    () => state.projects.filter((project) => !project.isArchived),
    [state.projects]
  );

  const activeProject = useMemo(
    () => visibleProjects.find((project) => project.id === state.activeProjectId) ?? visibleProjects[0],
    [state.activeProjectId, visibleProjects]
  );

  const activeVersion = useMemo(
    () => activeProject?.versions.find((version) => version.id === activeProject.activeVersionId),
    [activeProject]
  );

  const activePage = useMemo(
    () => activeVersion?.pages.find((page) => page.id === activeProject?.activePageId),
    [activeProject?.activePageId, activeVersion]
  );

  const activeVersionCanEdit = useMemo(
    () => (activeVersion ? isVersionEditableAt(activeVersion, new Date(nowTick)) : false),
    [activeVersion, nowTick]
  );

  const sortedDepartments = useMemo(
    () => [...(activeProject?.departments ?? [])].filter((department) => department.active).sort((a, b) => a.order - b.order),
    [activeProject?.departments]
  );

  const activeAttendanceSession = useMemo(() => {
    if (!activeProject) {
      return undefined;
    }
    return (
      activeProject.attendance.sessions.find((session) => session.id === activeProject.attendance.activeSessionId) ??
      activeProject.attendance.sessions[0]
    );
  }, [activeProject]);

  const activeFieldLimits = useMemo(
    () => normalizeFieldLimits(activeProject?.fieldLimits),
    [activeProject?.fieldLimits]
  );

  useEffect(() => {
    if (!activeAttendanceSession) {
      setAttendanceRosterDraft('');
      return;
    }

    setAttendanceRosterDraft(buildAttendanceRosterDraft(activeAttendanceSession.expectedRoster, activeProject?.departments ?? []));
    setAttendanceRosterPreview(null);
  }, [activeAttendanceSession, activeProject?.departments]);

  useEffect(() => {
    let didAutoLock = false;

    setState((prev) => {
      const nowMs = nowTick;
      let changed = false;

      const projects = prev.projects.map((project) => {
        if (!project.meetingLock.lockAt) {
          return project;
        }

        const lockAtMs = Date.parse(project.meetingLock.lockAt);
        if (!Number.isFinite(lockAtMs) || nowMs < lockAtMs) {
          return project;
        }

        const targetVersion = getLatestEditableVersion(project);
        if (!targetVersion) {
          changed = true;
          return {
            ...project,
            meetingLock: {
              ...project.meetingLock,
              lockAt: '',
            },
          };
        }

        const { lockedVersion, nextVersion, nextActivePageId } = cloneVersionForNext(
          targetVersion,
          project.activePageId,
          { lockedAt: nowIso(), lockType: 'scheduled' }
        );

        changed = true;
        didAutoLock = true;

        return {
          ...project,
          lockAuditEvents: project.lockAuditEvents.concat({
            id: `audit-${Date.now()}`,
            action: 'scheduled_lock',
            actorRole: 'admin',
            versionId: lockedVersion.id,
            at: lockedVersion.lockedAt ?? nowIso(),
          } satisfies LockAuditEvent),
          versions: project.versions.map((version) => (version.id === lockedVersion.id ? lockedVersion : version)).concat(nextVersion),
          activeVersionId: nextVersion.id,
          activePageId: nextActivePageId,
          meetingLock: {
            ...project.meetingLock,
            lockAt: '',
          },
        };
      });

      if (!changed) {
        return prev;
      }

      return {
        ...prev,
        projects,
      };
    });

    if (didAutoLock) {
      setSnackbar({ open: true, message: '已依排程自動鎖定目前版本，並建立下一版。' });
    }
  }, [nowTick]);

  useEffect(() => {
    let didExpire = false;

    setState((prev) => {
      const now = new Date(nowTick);
      const projects = prev.projects.map((project) => {
        let changed = false;
        const expiredVersionIds: string[] = [];
        const nextVersions = project.versions.map((version) => {
          if (!version.overtimeUnlockUntil) {
            return version;
          }

          const expiresAtMs = Date.parse(version.overtimeUnlockUntil);
          if (!Number.isFinite(expiresAtMs) || now.getTime() < expiresAtMs) {
            return version;
          }

          changed = true;
          didExpire = true;
          expiredVersionIds.push(version.id);
          return {
            ...version,
            overtimeUnlockUntil: undefined,
            overtimeReason: undefined,
          };
        });

        if (!changed) {
          return project;
        }

        return {
          ...project,
          versions: nextVersions,
          lockAuditEvents: project.lockAuditEvents.concat(
            expiredVersionIds.map((versionId, index) => ({
              id: `audit-expire-${Date.now()}-${index}`,
              action: 'overtime_expire',
              actorRole: 'admin',
              versionId,
              at: now.toISOString(),
            }))
          ),
        };
      });

      const hasProjectChange = projects.some((project, index) => project !== prev.projects[index]);
      if (!hasProjectChange) {
        return prev;
      }

      return {
        ...prev,
        projects,
      };
    });

    if (didExpire) {
      setSnackbar({ open: true, message: '外掛時間已到，系統已立即回鎖。' });
    }
  }, [nowTick]);

  // 只更新目前作用中的專案，避免每個 handler 都重寫整段 setState 邏輯。
  const updateActiveProject = (
    updater: (project: ReportWorkspaceProject) => ReportWorkspaceProject
  ) => {
    if (!activeProject) {
      return;
    }

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === prev.activeProjectId ? updater(project) : project
      ),
    }));
  };

  // 開啟建立專案對話框並重設輸入欄位。
  const openCreateProjectDialog = () => {
    setProjectDialogMode('create');
    setProjectNameInput('');
  };

  // 開啟重新命名專案對話框，並帶入目前專案名稱。
  const openRenameProjectDialog = () => {
    if (!activeProject) {
      return;
    }

    setProjectDialogMode('rename');
    setProjectNameInput(activeProject.projectName);
  };

  // 關閉專案對話框並清掉暫存輸入。
  const closeProjectDialog = () => {
    setProjectDialogMode(null);
    setProjectNameInput('');
  };

  // 依對話框模式建立新專案或更新現有專案名稱。
  const handleSaveProjectDialog = () => {
    const name = projectNameInput.trim();
    if (!name) {
      return;
    }

    if (projectDialogMode === 'create') {
      setState((prev) => {
        const projectId = `project-${Date.now()}`;
        const newProject = createWorkspaceProject(projectId, name);
        return {
          ...prev,
          activeProjectId: projectId,
          projects: [...prev.projects, newProject],
        };
      });
      setSnackbar({ open: true, message: '新專案已建立。' });
    }

    if (projectDialogMode === 'rename' && activeProject) {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project.id === activeProject.id ? { ...project, projectName: name } : project
        ),
      }));
      setSnackbar({ open: true, message: '專案名稱已更新。' });
    }

    closeProjectDialog();
  };

  // 封存目前專案，並切換到其他仍可用的專案。
  const handleArchiveProject = () => {
    if (!activeProject) {
      return;
    }

    const remainingProjects = visibleProjects.filter((project) => project.id !== activeProject.id);
    if (remainingProjects.length === 0) {
      setSnackbar({ open: true, message: '至少需保留一個可用專案。' });
      return;
    }

    const fallbackProjectId = remainingProjects[0].id;

    setState((prev) => ({
      ...prev,
      activeProjectId: fallbackProjectId,
      projects: prev.projects.map((project) =>
        project.id === activeProject.id ? { ...project, isArchived: true } : project
      ),
    }));

    setSnackbar({ open: true, message: '專案已封存。' });
  };

  // 僅針對目前作用中的版本更新頁面資料，並帶入版本是否可編輯的判斷結果。
  const updateStateVersions = (updater: (pages: WorkspacePage[], isEditable: boolean) => WorkspacePage[]) => {
    updateActiveProject((project) => ({
      ...project,
      versions: project.versions.map((version) => {
        if (version.id !== project.activeVersionId) {
          return version;
        }

        return {
          ...version,
          pages: updater(version.pages, isVersionEditableAt(version, new Date())),
        };
      }),
    }));
  };

  // 新增部門，並同步補上各版本對應的報表區塊與圖片群組。
  const handleAddDepartment = () => {
    const name = newDepartmentName.trim();
    if (!name || !activeProject) {
      return;
    }

    updateActiveProject((project) => {
      const nextOrder = project.departments.length + 1;
      const newDepartment: WorkspaceDepartment = {
        id: `dept-${Date.now()}`,
        name,
        order: nextOrder,
        active: true,
      };

      const versions = project.versions.map((version) => ({
        ...version,
        pages: version.pages.map((page) => {
          if (page.type !== 'report') {
            return page;
          }

          return {
            ...page,
            blocks: [
              ...page.blocks,
              {
                departmentId: newDepartment.id,
                fields: {
                  workItem: '',
                  plannedBuildDate: '',
                  approvalDate: '',
                  weeklyStatusAndRisk: '',
                  supportPlan: '',
                  executiveDiscussion: '',
                },
                isCompleted: false,
                updatedAt: nowIso(),
              },
            ],
          };
        }),
      }));

      const withImageGroups = versions.map((version) => ({
        ...version,
        pages: version.pages.map((page) => {
          if (page.type !== 'image') {
            return page;
          }

          return {
            ...page,
            groups: [...page.groups, { departmentId: newDepartment.id, images: [] }],
          };
        }),
      }));

      return {
        ...project,
        departments: [...project.departments, newDepartment],
        versions: withImageGroups,
      };
    });

    setNewDepartmentName('');
  };

  // 更新部門名稱，供報表與簽到顯示共用。
  const handleDepartmentRename = (departmentId: string, name: string) => {
    updateActiveProject((project) => ({
      ...project,
      departments: project.departments.map((department) =>
        department.id === departmentId ? { ...department, name } : department
      ),
    }));
  };

  // 在目前可編輯版本新增一頁，並切到新建立的頁面。
  const handleAddPage = () => {
    if (!activeProject) {
      return;
    }

    updateActiveProject((project) => {
      const updatedVersions = project.versions.map((version) => {
        if (version.id !== project.activeVersionId || !isVersionEditableAt(version, new Date())) {
          return version;
        }

        const nextPageNumber = version.pages.length + 1;
        const page = createPage(newPageType, nextPageNumber, project.departments);

        return {
          ...version,
          pages: [...version.pages, page],
        };
      });

      const latestActiveVersion = updatedVersions.find((version) => version.id === project.activeVersionId);
      const lastPageId = latestActiveVersion?.pages[latestActiveVersion.pages.length - 1]?.id ?? project.activePageId;

      return {
        ...project,
        versions: updatedVersions,
        activePageId: lastPageId,
      };
    });
  };

  // 手動鎖定目前版本、建立下一版，並同步凍結當前簽到場次名單。
  const handleLockAndClone = () => {
    if (!activeProject) {
      return;
    }

    let blockedByFieldLimit = false;
    let lockSucceeded = false;

    updateActiveProject((project) => {
      const currentVersion = project.versions.find((version) => version.id === project.activeVersionId);
      if (!currentVersion || !isVersionEditableAt(currentVersion, new Date())) {
        return project;
      }

      const violations = getVersionFieldLimitViolations(currentVersion, normalizeFieldLimits(project.fieldLimits));
      if (violations.length > 0) {
        blockedByFieldLimit = true;
        setSnackbar({ open: true, message: '仍有欄位超過字數上限，請先修正再鎖定。' });
        return project;
      }

      const { lockedVersion, nextVersion, nextActivePageId } = cloneVersionForNext(currentVersion, project.activePageId, {
        lockedAt: nowIso(),
        lockType: 'manual',
      });

      const activeSessionId = project.attendance.activeSessionId;
      const lockedAt = lockedVersion.lockedAt ?? nowIso();
      lockSucceeded = true;

      return {
        ...project,
        lockAuditEvents: project.lockAuditEvents.concat({
          id: `audit-manual-${Date.now()}`,
          action: 'manual_lock',
          actorRole: state.currentRole,
          versionId: lockedVersion.id,
          at: lockedVersion.lockedAt ?? nowIso(),
        }),
        versions: project.versions.map((version) =>
          version.id === lockedVersion.id ? lockedVersion : version
        ).concat(nextVersion),
        activeVersionId: nextVersion.id,
        activePageId: nextActivePageId,
        attendance: {
          ...project.attendance,
          sessions: project.attendance.sessions.map((session) =>
            session.id === activeSessionId
              ? {
                ...session,
                rosterFrozenAt: session.rosterFrozenAt ?? lockedAt,
              }
              : session
          ),
        },
      };
    });

    if (!blockedByFieldLimit && lockSucceeded) {
      setSnackbar({ open: true, message: '版本已鎖定，並自動建立新版本供部門編輯。' });
    }
  };

  // 更新欄位字數上限設定，並將輸入限制在允許範圍內。
  const handleFieldLimitChange = (field: keyof ReportFields, rawValue: string) => {
    if (!isAdmin) {
      return;
    }

    const parsed = Number.parseInt(rawValue, 10);
    const fallback = activeFieldLimits[field];
    const nextValue = Number.isFinite(parsed) ? Math.min(1000, Math.max(50, parsed)) : fallback;

    updateActiveProject((project) => ({
      ...project,
      fieldLimits: {
        ...normalizeFieldLimits(project.fieldLimits),
        [field]: nextValue,
      },
    }));
  };

  // 更新一般報表欄位內容，同時套用字數限制與歷史超限保護。
  const handleFieldChange = (
    pageId: string,
    departmentId: string,
    field: keyof ReportFields,
    value: string
  ) => {
    if (!activeProject) {
      return;
    }

    const fieldLimit = activeFieldLimits[field];
    const targetPage = activeVersion?.pages.find((page) => page.id === pageId);
    const targetBlock = targetPage && targetPage.type === 'report'
      ? targetPage.blocks.find((block) => block.departmentId === departmentId)
      : undefined;
    const currentValue = targetBlock?.fields[field];
    if (currentValue === undefined) {
      return;
    }

    const isLegacyOverLimit = currentValue.length > fieldLimit;
    if (isLegacyOverLimit && value.length >= currentValue.length) {
      setSnackbar({ open: true, message: '此欄位為歷史超限內容，請先手動刪減。' });
      return;
    }

    const nextValue = isLegacyOverLimit ? value : (value.length > fieldLimit ? value.slice(0, fieldLimit) : value);
    if (!isLegacyOverLimit && nextValue !== value) {
      setSnackbar({ open: true, message: '內容超過上限，已自動截斷。' });
    }

    updateStateVersions((pages, isEditable) => {
      if (!isEditable) {
        return pages;
      }

      return pages.map((page) => {
        if (page.id !== pageId || page.type !== 'report') {
          return page;
        }

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.departmentId === departmentId
              ? {
                ...block,
                fields: {
                  ...block.fields,
                  [field]: nextValue,
                },
                updatedAt: nowIso(),
              }
              : block
          ),
        };
      });
    });
  };

  // 切換指定部門報表區塊的完成狀態。
  const handleToggleCompleted = (pageId: string, departmentId: string) => {
    updateStateVersions((pages, isEditable) => {
      if (!isEditable) {
        return pages;
      }

      return pages.map((page) => {
        if (page.id !== pageId || page.type !== 'report') {
          return page;
        }

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.departmentId === departmentId
              ? {
                ...block,
                isCompleted: !block.isCompleted,
                updatedAt: nowIso(),
              }
              : block
          ),
        };
      });
    });
  };

  // 上傳指定部門的圖片頁內容，並限制每頁每部門僅保留一張圖片。
  const handleUploadImages = (pageId: string, departmentId: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    if (!canEditDepartmentScope(state.currentRole, activeProject?.currentDepartmentId ?? '', departmentId)) {
      return;
    }

    updateStateVersions((pages, isEditable) => {
      if (!isEditable) {
        return pages;
      }

      return pages.map((page) => {
        if (page.id !== pageId || page.type !== 'image') {
          return page;
        }

        const groupIndex = page.groups.findIndex((group) => group.departmentId === departmentId);
        const currentGroup = groupIndex >= 0 ? page.groups[groupIndex] : { departmentId, images: [] };
        if (currentGroup.images.length >= 1) {
          setSnackbar({ open: true, message: '每個純圖片頁面只能上傳一張圖片，請新增頁面放置其他圖片。' });
          return page;
        }
        const lastOrder = currentGroup.images.reduce((max, image) => Math.max(max, image.order), 0);
        const uploaded: WorkspaceImageItem[] = Array.from(files).slice(0, 1).map((file, index) => ({
          id: `img-${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          name: file.name,
          note: '',
          order: lastOrder + index + 1,
          uploadedAt: nowIso(),
        }));

        const nextGroup = {
          ...currentGroup,
          images: [...currentGroup.images, ...uploaded],
        };

        const nextGroups = groupIndex >= 0
          ? page.groups.map((group, index) => (index === groupIndex ? nextGroup : group))
          : [...page.groups, nextGroup];

        return {
          ...page,
          groups: nextGroups,
        };
      });
    });
  };

  // 更新圖片註解內容。
  const handleImageNoteChange = (pageId: string, departmentId: string, imageId: string, note: string) => {
    if (!canEditDepartmentScope(state.currentRole, activeProject?.currentDepartmentId ?? '', departmentId)) {
      return;
    }

    updateStateVersions((pages, isEditable) => {
      if (!isEditable) {
        return pages;
      }

      return pages.map((page) => {
        if (page.id !== pageId || page.type !== 'image') {
          return page;
        }

        return {
          ...page,
          groups: page.groups.map((group) => {
            if (group.departmentId !== departmentId) {
              return group;
            }

            return {
              ...group,
              images: group.images.map((image) => (image.id === imageId ? { ...image, note } : image)),
            };
          }),
        };
      });
    });
  };

  // 刪除圖片並重新整理同群組的排序編號。
  const handleDeleteImage = (pageId: string, departmentId: string, imageId: string) => {
    if (!canEditDepartmentScope(state.currentRole, activeProject?.currentDepartmentId ?? '', departmentId)) {
      return;
    }

    updateStateVersions((pages, isEditable) => {
      if (!isEditable) {
        return pages;
      }

      return pages.map((page) => {
        if (page.id !== pageId || page.type !== 'image') {
          return page;
        }

        return {
          ...page,
          groups: page.groups.map((group) => {
            if (group.departmentId !== departmentId) {
              return group;
            }

            return {
              ...group,
              images: group.images
                .filter((image) => image.id !== imageId)
                .sort((a, b) => a.order - b.order)
                .map((image, index) => ({ ...image, order: index + 1 })),
            };
          }),
        };
      });
    });
  };

  // 調整同群組內圖片的上下排序。
  const handleReorderImage = (
    pageId: string,
    departmentId: string,
    imageId: string,
    direction: 'up' | 'down'
  ) => {
    if (!canEditDepartmentScope(state.currentRole, activeProject?.currentDepartmentId ?? '', departmentId)) {
      return;
    }

    updateStateVersions((pages, isEditable) => {
      if (!isEditable) {
        return pages;
      }

      return pages.map((page) => {
        if (page.id !== pageId || page.type !== 'image') {
          return page;
        }

        return {
          ...page,
          groups: page.groups.map((group) => {
            if (group.departmentId !== departmentId) {
              return group;
            }

            return {
              ...group,
              images: reorderItems(group.images, imageId, direction),
            };
          }),
        };
      });
    });
  };

  // 送出工作台聊天訊息，並以延遲回覆模擬助理分析流程。
  const handleSendChat = () => {
    const message = chatInput.trim();
    if (!message || !activeProject) {
      return;
    }

    const userMessage: WorkspaceChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: nowIso(),
    };

    updateActiveProject((project) => ({
      ...project,
      chat: {
        ...project.chat,
        isLoading: true,
        messages: [...project.chat.messages, userMessage],
      },
    }));

    setChatInput('');

    window.setTimeout(() => {
      updateActiveProject((project) => {
        const assistantMessage: WorkspaceChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: getAssistantReply(project, message),
          createdAt: nowIso(),
        };

        return {
          ...project,
          chat: {
            isLoading: false,
            messages: [...project.chat.messages, assistantMessage],
          },
        };
      });
    }, 500);
  };

  // 對已鎖定版本開啟限時外掛編輯時間，並記錄審計事件。
  const handleGrantOvertime = () => {
    if (!activeProject || !activeVersion || !isAdmin) {
      return;
    }

    if (!activeVersion.isLocked) {
      setSnackbar({ open: true, message: '僅可對已鎖定版本開啟外掛時間。' });
      return;
    }

    const reason = overtimeReason.trim();
    if (!reason) {
      setOvertimeReasonError('請填寫外掛原因');
      return;
    }

    const minutes = Number.parseInt(overtimeMinutes, 10);
    const validMinutes = [5, 10, 15, 30].includes(minutes) ? minutes : 15;
    const expiresAt = new Date(Date.now() + validMinutes * 60 * 1000).toISOString();

    updateActiveProject((project) => ({
      ...project,
      versions: project.versions.map((version) =>
        version.id === project.activeVersionId
          ? {
            ...version,
            overtimeUnlockUntil: expiresAt,
            overtimeReason: reason,
          }
          : version
      ),
      lockAuditEvents: project.lockAuditEvents.concat({
        id: `audit-overtime-${Date.now()}`,
        action: 'overtime_grant',
        actorRole: state.currentRole,
        versionId: project.activeVersionId,
        at: nowIso(),
        reason,
        expiresAt,
      }),
    }));

    setOvertimeReasonError('');
    setOvertimeReason('');
    setSnackbar({ open: true, message: `已開啟 ${validMinutes} 分鐘外掛時間。` });
  };

  // 先解析並預覽名單匯入結果，確認無誤後才允許正式寫入。
  const handleAttendanceRosterPreview = () => {
    if (
      !activeProject
      || !activeAttendanceSession
      || !isAdmin
      || !!activeProject.attendance.signInOpenedAt
      || activeVersion?.isLocked
      || !!activeAttendanceSession.rosterFrozenAt
      || !!activeProject.attendance.signInClosedAt
    ) {
      return;
    }

    const preview = parseAttendanceRosterDraft(
      attendanceRosterDraft,
      activeProject.departments,
      attendanceRosterImportMode,
      activeAttendanceSession.expectedRoster
    );

    setAttendanceRosterPreview(preview);
  };

  // 將已預覽且通過驗證的名單正式寫入當前場次。
  const handleAttendanceRosterSave = () => {
    if (
      !activeProject
      || !activeAttendanceSession
      || !attendanceRosterPreview
      || attendanceRosterPreview.errors.length > 0
      || attendanceRosterPreview.parsedMembers.length === 0
      || !isAdmin
      || !!activeProject.attendance.signInOpenedAt
      || activeVersion?.isLocked
      || !!activeAttendanceSession.rosterFrozenAt
      || !!activeProject.attendance.signInClosedAt
    ) {
      return;
    }

    const baseRoster = attendanceRosterPreview.mode === 'append' ? activeAttendanceSession.expectedRoster : [];
    const nextRoster = baseRoster.concat(
      attendanceRosterPreview.parsedMembers.map((member, index) => ({
        id: `expected-${activeAttendanceSession.id}-${baseRoster.length + index + 1}`,
        departmentId: member.departmentId,
        name: member.name,
      }))
    );

    updateActiveProject((project) => ({
      ...project,
      attendance: {
        ...project.attendance,
          sessions: project.attendance.sessions.map((session) =>
            session.id === project.attendance.activeSessionId
              ? {
                  ...session,
                  expectedRoster: nextRoster,
                }
              : session
          ),
      },
    }));

    setAttendanceRosterPreview(null);
    setAttendanceRosterDraft(buildAttendanceRosterDraft(nextRoster, activeProject.departments));
    setSnackbar({
      open: true,
      message: attendanceRosterPreview.mode === 'append'
        ? `應到名單已更新（追加 ${attendanceRosterPreview.parsedMembers.length} 筆，總計 ${nextRoster.length} 筆）。`
        : `應到名單已更新（覆蓋 ${nextRoster.length} 筆）。`,
    });
  };

  // 開啟一般簽到，並為目前場次補上開始時間。
  const handleOpenSignIn = () => {
    if (!activeProject || !activeAttendanceSession || !isAdmin) {
      return;
    }

    if (activeProject.attendance.signInClosedAt) {
      setSnackbar({ open: true, message: '此場次簽到已關閉，不可重新開啟一般簽到。' });
      return;
    }

    if (activeProject.attendance.signInOpenedAt) {
      setSnackbar({ open: true, message: '簽到已在進行中。' });
      return;
    }

    const openedAt = nowIso();

    updateActiveProject((project) => ({
      ...project,
      attendance: {
        ...project.attendance,
        signInOpenedAt: openedAt,
        sessions: project.attendance.sessions.map((session) =>
          session.id === project.attendance.activeSessionId
            ? {
              ...session,
              startedAt: session.startedAt ?? openedAt,
            }
            : session
        ),
      },
    }));

    setSnackbar({ open: true, message: '已開啟一般簽到。' });
  };

  // 關閉一般簽到，並將當前場次標記為已結束且凍結名單。
  const handleCloseSignIn = () => {
    if (!activeProject || !activeAttendanceSession || !isAdmin) {
      return;
    }

    if (!activeProject.attendance.signInOpenedAt) {
      setSnackbar({ open: true, message: '尚未開啟簽到。' });
      return;
    }

    if (activeProject.attendance.signInClosedAt) {
      setSnackbar({ open: true, message: '簽到已結束。' });
      return;
    }

    const closedAt = nowIso();

    updateActiveProject((project) => ({
      ...project,
      attendance: {
        ...project.attendance,
        signInClosedAt: closedAt,
        sessions: project.attendance.sessions.map((session) =>
          session.id === project.attendance.activeSessionId
            ? {
              ...session,
              closedAt,
              rosterFrozenAt: session.rosterFrozenAt ?? closedAt,
            }
            : session
        ),
      },
    }));

    setSnackbar({ open: true, message: '已關閉簽到，後續僅可補簽或更正。' });
  };

  // 將結束後的簽到摘要匯出成 CSV，方便後續留存與檢查。
  const handleExportAttendanceCsv = () => {
    if (!activeProject || !activeAttendanceSession || !activeProject.attendance.signInClosedAt) {
      return;
    }

    const summary = buildAttendanceSummary(activeAttendanceSession.expectedRoster, activeAttendanceSession.records);
    const escaped = (value: string) => `"${String(value).replace(/"/g, '""')}"`;

    const header = [
      'sessionId',
      'department',
      'memberName',
      'group',
      'status',
      'signedAt',
      'mode',
      'actorName',
      'reason',
      'overdueBackfill',
    ];

    const rows: string[][] = [];

    summary.onTime.forEach((record) => {
      const departmentName =
        activeProject.departments.find((department) => department.id === record.departmentId)?.name ?? record.departmentId;
      rows.push([
        activeAttendanceSession.id,
        departmentName,
        record.memberName,
        'on_time',
        record.status,
        record.signedAt,
        record.mode,
        record.actorName,
        record.reason ?? '',
        record.isOverdueBackfill ? 'true' : 'false',
      ]);
    });

    summary.late.forEach((record) => {
      const departmentName =
        activeProject.departments.find((department) => department.id === record.departmentId)?.name ?? record.departmentId;
      rows.push([
        activeAttendanceSession.id,
        departmentName,
        record.memberName,
        'late',
        record.status,
        record.signedAt,
        record.mode,
        record.actorName,
        record.reason ?? '',
        record.isOverdueBackfill ? 'true' : 'false',
      ]);
    });

    summary.absent.forEach((member) => {
      const departmentName =
        activeProject.departments.find((department) => department.id === member.departmentId)?.name ?? member.departmentId;
      rows.push([
        activeAttendanceSession.id,
        departmentName,
        member.name,
        'absent',
        'absent',
        '',
        '',
        '',
        '',
        'false',
      ]);
    });

    const csv = [header.join(','), ...rows.map((row) => row.map(escaped).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `attendance-${activeAttendanceSession.id}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: '簽到 CSV 已匯出。' });
  };

  const canAddPage = !!activeVersion && activeVersionCanEdit;
  const isAdmin = state.currentRole === 'admin';
  const attendanceSummary = activeAttendanceSession
    ? buildAttendanceSummary(activeAttendanceSession.expectedRoster, activeAttendanceSession.records)
    : undefined;
  const isAttendanceRosterFrozen =
    !isAdmin
    || !!activeProject?.attendance.signInOpenedAt
    || !!activeAttendanceSession?.rosterFrozenAt
    || !!activeProject?.attendance.signInClosedAt
    || !!activeVersion?.isLocked;

  return (
    <Box className="animate-fade-in-up">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          報表工作台
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          版本化部門報表與圖片頁管理（前端 Demo）
        </Typography> */}
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Select
          size="small"
          value={activeProject?.id ?? ''}
          onChange={(event) => setState((prev) => ({ ...prev, activeProjectId: event.target.value }))}
          sx={{ minWidth: 220 }}
        >
          {visibleProjects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.projectName}
            </MenuItem>
          ))}
        </Select>

        {isAdmin && (
          <Button variant="outlined" onClick={openCreateProjectDialog} disabled={!isAdmin || !activeProject}>
            新增專案
          </Button>
        )}

        {isAdmin && (
          <Button variant="outlined" onClick={openRenameProjectDialog} disabled={!isAdmin || !activeProject}>
            重新命名
          </Button>
        )}

        {isAdmin && (
          <Button variant="outlined" color="warning" onClick={handleArchiveProject} disabled={!isAdmin || !activeProject}>
            封存專案
          </Button>
        )}
        <Select
          size="small"
          value={state.currentRole}
          onChange={(event) => {
            const nextRole = event.target.value as ReportWorkspaceState['currentRole'];
            setState((prev) => ({
              ...prev,
              currentRole: nextRole,
            }));
            if (nextRole !== 'admin' && workspaceTab === 'admin') {
              setWorkspaceTab('content');
            }
          }}
        >
          <MenuItem value="admin">管理員</MenuItem>
          <MenuItem value="department_user">部門使用者</MenuItem>
        </Select>

        <Select
          size="small"
          value={activeProject?.currentDepartmentId ?? ''}
          onChange={(event) =>
            updateActiveProject((project) => ({
              ...project,
              currentDepartmentId: event.target.value,
            }))
          }
          disabled={!isAdmin}
        >
          {sortedDepartments.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={activeProject?.activeVersionId ?? ''}
          onChange={(event) => {
            updateActiveProject((project) => {
              const targetVersion = project.versions.find((version) => version.id === event.target.value);
              return {
                ...project,
                activeVersionId: event.target.value,
                activePageId: targetVersion?.pages[0]?.id ?? project.activePageId,
              };
            });
          }}
        >
          {activeProject?.versions.map((version) => (
            <MenuItem key={version.id} value={version.id}>
              v{version.versionNo} {isVersionEditableAt(version, new Date()) ? '(編輯中)' : '(已鎖定)'}
            </MenuItem>
          ))}
        </Select>

        {isAdmin && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={activeVersionCanEdit ? <LockIcon /> : <LockOpenIcon />}
            onClick={handleLockAndClone}
            disabled={!isAdmin || !activeVersion || !activeVersionCanEdit}
          >
            鎖定目前版本
          </Button>
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          px: 1,
        }}
      >
        <Tabs value={workspaceTab} onChange={(_, value) => setWorkspaceTab(value)}>
          <Tab value="content" label="報表內容" />
          <Tab value="chat" label="聊天分析" />
          {isAdmin && <Tab value="admin" label="後台管理" />}
        </Tabs>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg:
              workspaceTab === 'admin'
                ? '1fr'
                : workspaceTab === 'chat' || !isAdmin
                  ? '280px 1fr'
                  : '280px 1fr 320px',
          },
          gap: 2,
        }}
      >
        {workspaceTab !== 'admin' && <Stack spacing={2}>
          {isAdmin && (
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                部門設定
              </Typography>
              <Stack spacing={1.25}>
                {sortedDepartments.map((department) => (
                  <TextField
                    key={department.id}
                    size="small"
                    label={`部門 ${department.order}`}
                    value={department.name}
                    onChange={(event) => handleDepartmentRename(department.id, event.target.value)}
                    disabled={!isAdmin || !activeVersionCanEdit}
                  />
                ))}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="新增部門"
                    value={newDepartmentName}
                    onChange={(event) => setNewDepartmentName(event.target.value)}
                    disabled={!isAdmin || !activeVersionCanEdit}
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddDepartment}
                    disabled={!isAdmin || !activeVersionCanEdit}
                  >
                    {/* 新增 */}
                  </Button>
                </Box>
              </Stack>
            </Paper>
          )}

          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              頁面管理
            </Typography>
            <Stack spacing={1}>
              {activeVersion?.pages
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((page) => (
                  <Button
                    key={page.id}
                    variant={activeProject?.activePageId === page.id ? 'contained' : 'outlined'}
                    onClick={() =>
                      updateActiveProject((project) => ({
                        ...project,
                        activePageId: page.id,
                      }))
                    }
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {page.name}
                  </Button>
                ))}

              <Divider sx={{ my: 1 }} />
              <Select
                size="small"
                value={newPageType}
                onChange={(event) => setNewPageType(event.target.value as WorkspacePageType)}
                disabled={!canAddPage}
              >
                <MenuItem value="report">一般報表</MenuItem>
                <MenuItem value="image">純圖片顯示</MenuItem>
              </Select>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddPage} disabled={!canAddPage}>
                新增頁面
              </Button>
            </Stack>
          </Paper>
        </Stack>}

        {workspaceTab === 'admin' ? (
          <Paper
            data-testid="workspace-admin-surface"
            data-meeting-surface="true"
            elevation={0}
            sx={{
              p: 2,
              ...meetingSurfaceSx,
            }}
          >
            <Typography variant="h6" sx={{ ...meetingHeaderSx, mb: 1.5 }}>
              後台管理
            </Typography>
            <Tabs
              aria-label="後台管理子選單"
              value={adminTab}
              onChange={(_, value) => setAdminTab(value)}
              sx={{ mb: 2 }}
            >
              <Tab value="presentation" label="呈現設定" />
              <Tab value="lock" label="鎖定與外掛" />
              <Tab value="attendance" label="簽到設定" />
              <Tab value="field" label="字數治理" />
            </Tabs>

            {adminTab === 'presentation' && (
              <Stack spacing={1.5}>
                <Typography sx={meetingHintTextSx}>會議封面與頁底顯示設定。</Typography>
                <TextField
                  size="small"
                  label="封面會議時間"
                  value={activeProject?.presentation.cover.meetingDateTime ?? ''}
                  onChange={(event) =>
                    updateActiveProject((project) => ({
                      ...project,
                      presentation: {
                        ...project.presentation,
                        cover: {
                          ...project.presentation.cover,
                          meetingDateTime: event.target.value,
                        },
                      },
                    }))
                  }
                  fullWidth
                />
                <TextField
                  size="small"
                  label="封面版本資訊"
                  value={activeProject?.presentation.cover.versionInfo ?? ''}
                  onChange={(event) =>
                    updateActiveProject((project) => ({
                      ...project,
                      presentation: {
                        ...project.presentation,
                        cover: {
                          ...project.presentation.cover,
                          versionInfo: event.target.value,
                        },
                      },
                    }))
                  }
                  fullWidth
                />
              </Stack>
            )}
            {adminTab === 'lock' && (
              <Stack spacing={1.5}>
                <Typography sx={meetingHintTextSx}>會議鎖定時間與外掛時間治理設定。</Typography>
                <TextField
                  size="small"
                  type="datetime-local"
                  label="自動鎖定時間"
                  value={activeProject?.meetingLock.lockAt ?? ''}
                  onChange={(event) =>
                    updateActiveProject((project) => ({
                      ...project,
                      meetingLock: {
                        ...project.meetingLock,
                        lockAt: event.target.value,
                      },
                    }))
                  }
                  fullWidth
                />
                <TextField
                  size="small"
                  label="時區"
                  value={activeProject?.meetingLock.timezone ?? 'Asia/Taipei'}
                  onChange={(event) =>
                    updateActiveProject((project) => ({
                      ...project,
                      meetingLock: {
                        ...project.meetingLock,
                        timezone: event.target.value,
                      },
                    }))
                  }
                  fullWidth
                />
                <TextField
                  size="small"
                  select
                  label="外掛分鐘數"
                  value={overtimeMinutes}
                  onChange={(event) => setOvertimeMinutes(event.target.value)}
                >
                  {[5, 10, 15, 30].map((minute) => (
                    <MenuItem key={minute} value={String(minute)}>
                      {minute} 分鐘
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  label="外掛原因"
                  value={overtimeReason}
                  onChange={(event) => {
                    setOvertimeReason(event.target.value);
                    if (overtimeReasonError) {
                      setOvertimeReasonError('');
                    }
                  }}
                  error={overtimeReasonError !== ''}
                  helperText={overtimeReasonError || '請填寫本次外掛治理原因'}
                  fullWidth
                />
                <Button variant="contained" onClick={handleGrantOvertime}>
                  開啟外掛時間
                </Button>
                <Typography sx={meetingHintTextSx}>
                  {activeVersion?.overtimeUnlockUntil
                    ? `外掛進行中，至 ${new Date(activeVersion.overtimeUnlockUntil).toLocaleString()}。`
                    : '目前未開啟外掛時間。'}
                </Typography>
              </Stack>
            )}
            {adminTab === 'attendance' && (
              <Stack spacing={1.5}>
                <Typography sx={meetingHintTextSx}>簽到名單、開關與補簽治理設定。</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleOpenSignIn}
                    disabled={!isAdmin || !!activeProject?.attendance.signInClosedAt}
                  >
                    開始簽到
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCloseSignIn}
                    disabled={!isAdmin || !activeProject?.attendance.signInOpenedAt || !!activeProject?.attendance.signInClosedAt}
                  >
                    結束簽到
                  </Button>
                </Box>
                <Typography sx={meetingHintTextSx}>
                  {activeProject?.attendance.signInClosedAt
                    ? `簽到已結束（${new Date(activeProject.attendance.signInClosedAt).toLocaleString()}）。`
                    : activeProject?.attendance.signInOpenedAt
                      ? '簽到進行中（一般簽到開啟）'
                      : '簽到尚未開始。'}
                </Typography>
                {activeProject?.attendance.signInClosedAt && attendanceSummary && (
                  <Stack spacing={0.5}>
                    <Typography sx={meetingHintTextSx}>準時 ({attendanceSummary.onTime.length})</Typography>
                    <Typography sx={meetingHintTextSx}>遲到 ({attendanceSummary.late.length})</Typography>
                    <Typography sx={meetingHintTextSx}>缺席 ({attendanceSummary.absent.length})</Typography>
                    {attendanceSummary.absent.slice(0, 5).map((member) => (
                      <Typography key={member.id} sx={meetingHintTextSx}>
                        - {member.name}
                      </Typography>
                    ))}
                    <Button variant="outlined" onClick={handleExportAttendanceCsv}>
                      匯出簽到 CSV
                    </Button>
                  </Stack>
                )}
                <TextField
                  size="small"
                  select
                  label="匯入方式"
                  value={attendanceRosterImportMode}
                  onChange={(event) => {
                    setAttendanceRosterImportMode(event.target.value as AttendanceRosterImportMode);
                    setAttendanceRosterPreview(null);
                  }}
                  fullWidth
                  disabled={isAttendanceRosterFrozen}
                >
                  <MenuItem value="replace">覆蓋現有名單</MenuItem>
                  <MenuItem value="append">追加至現有名單</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  label="名單貼上區"
                  value={attendanceRosterDraft}
                  onChange={(event) => {
                    setAttendanceRosterDraft(event.target.value);
                    setAttendanceRosterPreview(null);
                  }}
                  multiline
                  minRows={4}
                  helperText="每行格式：部門,姓名。請先預覽，確認後再匯入。"
                  fullWidth
                  disabled={isAttendanceRosterFrozen}
                />
                <Button variant="outlined" onClick={handleAttendanceRosterPreview} disabled={isAttendanceRosterFrozen}>
                  預覽匯入
                </Button>
                {attendanceRosterPreview && !isAttendanceRosterFrozen && (
                  <Stack spacing={1} sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={meetingHintTextSx}>{attendanceRosterPreview.summary}</Typography>
                    {attendanceRosterPreview.errors.length > 0 ? (
                      <Alert severity="error">
                        <Stack spacing={0.5}>
                          {attendanceRosterPreview.errors.map((error) => (
                            <Typography key={error} variant="body2">
                              {error}
                            </Typography>
                          ))}
                        </Stack>
                      </Alert>
                    ) : (
                      <Stack spacing={0.5}>
                        {attendanceRosterPreview.parsedMembers.map((member) => (
                          <Typography key={`${member.departmentId}-${member.name}`} variant="body2">
                            {member.departmentName} / {member.name}
                          </Typography>
                        ))}
                        <Button variant="contained" onClick={handleAttendanceRosterSave}>
                          確認匯入
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                )}
                <Typography sx={meetingHintTextSx}>
                  {activeAttendanceSession?.rosterFrozenAt
                    ? `名單已於 ${new Date(activeAttendanceSession.rosterFrozenAt).toLocaleString()} 鎖定。`
                    : '名單尚未鎖定，管理員可於鎖定前調整。'}
                </Typography>
              </Stack>
            )}
            {adminTab === 'field' && (
              <Stack spacing={1.5}>
                <Typography sx={meetingHintTextSx}>各欄位字數限制與驗證設定（50～1000）。</Typography>
                {fieldsMeta.map((meta) => (
                  <TextField
                    key={meta.key}
                    size="small"
                    type="number"
                    label={`${fieldLimitLabels[meta.key]}上限`}
                    value={activeFieldLimits[meta.key]}
                    onChange={(event) => handleFieldLimitChange(meta.key, event.target.value)}
                    inputProps={{ min: 50, max: 1000 }}
                    fullWidth
                  />
                ))}
              </Stack>
            )}
          </Paper>
        ) : workspaceTab === 'content' ? (
          <>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              {!activeVersion || !activePage ? (
                <Typography color="text.secondary">請先選擇版本與頁面。</Typography>
              ) : (
                <>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {activePage.name}
                    </Typography>
                    <Chip
                      size="small"
                      color={activeVersionCanEdit ? 'success' : 'warning'}
                      label={activeVersionCanEdit ? '此版本可編輯' : '此版本已鎖定（唯讀）'}
                    />
                  </Box>

                  {activePage.type === 'report' && (
                    <Stack spacing={2}>
                      {activePage.blocks
                        .filter((block) =>
                          isAdmin ? true : block.departmentId === (activeProject?.currentDepartmentId ?? '')
                        )
                        .slice()
                        .sort((a, b) => {
                          const orderA = activeProject?.departments.find((department) => department.id === a.departmentId)?.order ?? 999;
                          const orderB = activeProject?.departments.find((department) => department.id === b.departmentId)?.order ?? 999;
                          return orderA - orderB;
                        })
                        .map((block) => {
                          const departmentName =
                            activeProject?.departments.find((department) => department.id === block.departmentId)?.name ?? block.departmentId;
                          const editable = canEditDepartmentBlock(
                            state.currentRole,
                            activeProject?.currentDepartmentId ?? '',
                            block,
                            activeVersionCanEdit
                          );

                          return (
                            <Accordion
                              key={block.departmentId}
                              disableGutters
                              expanded={expandedDepartmentId === block.departmentId}
                              onChange={(_, expanded) => setExpandedDepartmentId(expanded ? block.departmentId : '')}
                              sx={{
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: block.isCompleted ? 'success.main' : 'divider',
                                bgcolor: block.isCompleted
                                  ? alpha(theme.palette.success.main, 0.04)
                                  : alpha(theme.palette.background.paper, 0.9),
                                '&:before': { display: 'none' },
                                overflow: 'hidden',
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                  {departmentName}
                                </Typography>
                              </AccordionSummary>

                              <AccordionDetails sx={{ pt: 0 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                  <Button
                                    size="small"
                                    variant={block.isCompleted ? 'outlined' : 'contained'}
                                    color={block.isCompleted ? 'success' : 'primary'}
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => handleToggleCompleted(activePage.id, block.departmentId)}
                                    disabled={!editable}
                                  >
                                    {block.isCompleted ? '已完成（可反悔）' : '編輯完畢'}
                                  </Button>
                                </Box>
                                <Stack spacing={1}>
                                  {fieldsMeta.map((meta) => {
                                    const fieldValue = block.fields[meta.key];
                                    const fieldLimit = activeFieldLimits[meta.key];
                                    const fieldLength = fieldValue.length;
                                    const nearLimit = fieldLength >= Math.floor(fieldLimit * 0.8);
                                    const overLimit = fieldLength > fieldLimit;

                                    return (
                                      <TextField
                                        key={meta.key}
                                        label={meta.label}
                                        size="small"
                                        value={fieldValue}
                                        onChange={(event) =>
                                          handleFieldChange(activePage.id, block.departmentId, meta.key, event.target.value)
                                        }
                                        multiline={!!meta.multiline}
                                        minRows={meta.multiline}
                                        disabled={!editable}
                                        error={overLimit}
                                        helperText={
                                          <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            <span>{`${fieldLength}/${fieldLimit}`}</span>
                                            {nearLimit && <span>已達 80% 警戒</span>}
                                            {overLimit && <span>此欄位已超限，需修正後才能鎖定版本</span>}
                                          </Box>
                                        }
                                        fullWidth
                                      />
                                    );
                                  })}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                    </Stack>
                  )}

                  {activePage.type === 'image' && (
                    <Stack spacing={2}>
                      {(() => {
                        const activeImageGroup =
                          activePage.groups.find((group) => group.departmentId === activeProject?.currentDepartmentId) ?? {
                            departmentId: activeProject?.currentDepartmentId ?? '',
                            images: [],
                          };
                        const currentDepartmentName =
                          activeProject?.departments.find((department) => department.id === activeProject.currentDepartmentId)?.name ??
                          activeProject?.currentDepartmentId;

                        return (
                          <>
                            <Typography variant="body2" color="text.secondary">
                              目前檢視部門：{currentDepartmentName}
                            </Typography>

                            <Button
                              component="label"
                              variant="outlined"
                              disabled={!activeVersionCanEdit}
                              sx={{ width: 'fit-content' }}
                            >
                              上傳圖片
                              <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                  handleUploadImages(activePage.id, activeProject?.currentDepartmentId ?? '', event.target.files);
                                  event.target.value = '';
                                }}
                              />
                            </Button>

                            {activeImageGroup.images
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((image, index, sorted) => (
                                <Paper key={image.id} elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
                                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' }, gap: 1.5 }}>
                                    <Box
                                      component="img"
                                      src={image.url}
                                      alt={image.name}
                                      onClick={() => setPreviewImage(image)}
                                      sx={{
                                        width: '100%',
                                        height: 100,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        cursor: 'zoom-in',
                                      }}
                                    />
                                    <Stack spacing={1}>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {image.name}
                                      </Typography>
                                      <TextField
                                        size="small"
                                        label="註解"
                                        value={image.note}
                                        onChange={(event) =>
                                          handleImageNoteChange(activePage.id, activeProject?.currentDepartmentId ?? '', image.id, event.target.value)
                                        }
                                        disabled={!activeVersionCanEdit}
                                      />
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleReorderImage(activePage.id, activeProject?.currentDepartmentId ?? '', image.id, 'up')
                                          }
                                          disabled={!activeVersionCanEdit || index === 0}
                                        >
                                          <ArrowUpwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleReorderImage(activePage.id, activeProject?.currentDepartmentId ?? '', image.id, 'down')
                                          }
                                          disabled={!activeVersionCanEdit || index === sorted.length - 1}
                                        >
                                          <ArrowDownwardIcon fontSize="small" />
                                        </IconButton>
                                        <Button
                                          size="small"
                                          color="error"
                                          onClick={() =>
                                            handleDeleteImage(activePage.id, activeProject?.currentDepartmentId ?? '', image.id)
                                          }
                                          disabled={!activeVersionCanEdit}
                                        >
                                          刪除
                                        </Button>
                                      </Box>
                                    </Stack>
                                  </Box>
                                </Paper>
                              ))}
                          </>
                        );
                      })()}
                    </Stack>
                  )}
                </>
              )}
            </Paper>

            {isAdmin && (
              <Stack spacing={2}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                    部門完成度
                  </Typography>
                  {activePage?.type === 'report' ? (
                    <Stack spacing={1}>
                      {activePage.blocks.map((block) => {
                        const departmentName =
                          activeProject?.departments.find((department) => department.id === block.departmentId)?.name ?? block.departmentId;
                        return (
                          <Box
                            key={block.departmentId}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1,
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.background.default, 0.6),
                            }}
                          >
                            <Typography variant="body2">{departmentName}</Typography>
                            <Chip
                              size="small"
                              color={block.isCompleted ? 'success' : 'default'}
                              label={block.isCompleted ? '已完成' : '未完成'}
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      目前頁面為圖片模式，無部門完成度欄位。
                    </Typography>
                  )}
                </Paper>
              </Stack>
            )}
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              minHeight: 560,
              gridColumn: { xs: 'auto', lg: '2 / span 1' },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              AI 聊天分析
            </Typography>
            <Stack spacing={1} sx={{ maxHeight: 460, overflow: 'auto', mb: 1 }}>
              {activeProject?.chat.messages.map((message) => (
                <Box key={message.id} sx={{ textAlign: message.role === 'user' ? 'right' : 'left' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      display: 'inline-block',
                      p: 1,
                      borderRadius: 1.5,
                      maxWidth: '100%',
                      bgcolor:
                        message.role === 'user'
                          ? alpha(theme.palette.primary.main, 0.12)
                          : alpha(theme.palette.background.default, 0.8),
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                  </Paper>
                </Box>
              ))}
              {activeProject?.chat.isLoading && (
                <Typography variant="caption" color="text.secondary">
                  AI 分析中...
                </Typography>
              )}
            </Stack>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="輸入分析需求..."
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <IconButton color="primary" onClick={handleSendChat} disabled={!!activeProject?.chat.isLoading}>
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={projectDialogMode !== null} onClose={closeProjectDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{projectDialogMode === 'create' ? '新增專案' : '重新命名專案'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="專案名稱"
            fullWidth
            value={projectNameInput}
            onChange={(event) => setProjectNameInput(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProjectDialog}>取消</Button>
          <Button onClick={handleSaveProjectDialog} variant="contained">
            確認
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{previewImage?.name ?? '圖片預覽'}</DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box
              component="img"
              src={previewImage.url}
              alt={previewImage.name}
              sx={{ width: '100%', maxHeight: '75vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
