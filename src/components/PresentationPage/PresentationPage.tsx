import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  MenuItem,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { initialReportWorkspaceState } from '../../mock/reportWorkspaceData';
import { ReportFields, ReportWorkspaceProject, ReportWorkspaceState, WorkspaceDepartment, WorkspacePage } from '../../types/reportWorkspace';
import {
  meetingFieldContentGapSx,
  meetingDesktopNoticeSx,
  meetingFieldHeadingSx,
  meetingHeaderSx,
  meetingHintTextSx,
  meetingSlideSectionSx,
  meetingSurfaceSx,
} from '../../styles/meetingSurface';
import coverBgImg from '../../assets/images/cover.jpg';
import endBgImg from '../../assets/images/End.jpg';

interface PresentationPageProps {
  project?: ReportWorkspaceProject;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

type SignInMode = 'self' | 'proxy' | 'correction' | 'backfill';

interface PresentationSlide {
  id: string;
  department: WorkspaceDepartment;
  page: WorkspacePage;
}

const STORAGE_KEY = 'report-workspace-state';

// 從 localStorage 取出目前作用中的專案，供獨立開啟呈現頁時使用。
const resolveProjectFromStorage = (): ReportWorkspaceProject => {
  if (typeof window === 'undefined') {
    return initialReportWorkspaceState.projects[0];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialReportWorkspaceState.projects[0];
  }

  try {
    const parsed = JSON.parse(raw) as ReportWorkspaceState;
    const project = parsed.projects.find((item) => item.id === parsed.activeProjectId) ?? parsed.projects[0];
    return project ?? initialReportWorkspaceState.projects[0];
  } catch (error) {
    console.warn('Failed to read presentation project from storage.', error);
    return initialReportWorkspaceState.projects[0];
  }
};

// 取得目前專案最新的已鎖定版本，作為會議呈現快照來源。
const getLatestLockedVersion = (project: ReportWorkspaceProject) => {
  return project.versions
    .filter((version) => version.isLocked)
    .sort((a, b) => b.versionNo - a.versionNo)[0];
};

// 篩出仍啟用中的部門並依排序回傳。
const getActiveDepartments = (project: ReportWorkspaceProject): WorkspaceDepartment[] => {
  return [...project.departments].filter((department) => department.active).sort((a, b) => a.order - b.order);
};

// 依頁面順序整理投影片來源頁。
const getSortedPages = (pages: WorkspacePage[]): WorkspacePage[] => {
  return [...pages].sort((a, b) => a.order - b.order);
};

// 將簽到狀態代碼轉成畫面顯示文字。
const getAttendanceStatusLabel = (status: 'on_time' | 'late' | 'absent') => {
  if (status === 'late') {
    return '遲到';
  }
  if (status === 'absent') {
    return '缺席';
  }
  return '準時';
};

// 依簽到模式決定前台要顯示的狀態文案，例如補簽與逾期補簽。
const getDisplayStatusLabel = (
  status: 'on_time' | 'late' | 'absent',
  mode: 'self' | 'proxy' | 'correction' | 'backfill',
  isOverdueBackfill?: boolean
) => {
  if (mode === 'backfill') {
    return isOverdueBackfill ? '逾期補簽' : '補簽';
  }
  return getAttendanceStatusLabel(status);
};

export const PresentationPage: React.FC<PresentationPageProps> = ({ project, onFullscreenChange }) => {
  const resolvedProject = useMemo(() => project ?? resolveProjectFromStorage(), [project]);
  const latestLockedVersion = useMemo(() => getLatestLockedVersion(resolvedProject), [resolvedProject]);
  const [snapshotVersionId, setSnapshotVersionId] = useState<string>(latestLockedVersion?.id ?? '');
  const snapshotVersion = useMemo(
    () => resolvedProject.versions.find((version) => version.id === snapshotVersionId),
    [resolvedProject.versions, snapshotVersionId]
  );
  const lockedSnapshotVersion = snapshotVersion?.isLocked ? snapshotVersion : latestLockedVersion;
  const departments = useMemo(() => getActiveDepartments(resolvedProject), [resolvedProject]);
  const sortedPages = useMemo(() => getSortedPages(lockedSnapshotVersion?.pages ?? []), [lockedSnapshotVersion?.pages]);
  const slides = useMemo<PresentationSlide[]>(() => {
    return departments.flatMap((department) =>
      sortedPages.map((page) => ({
        id: `${department.id}:${page.id}`,
        department,
        page,
      }))
    );
  }, [departments, sortedPages]);
  const [mode, setMode] = useState<'cover' | 'report' | 'end'>('cover');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontMode, setFontMode] = useState<'normal' | 'large'>('normal');
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(false);
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id ?? '');
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [signInMode, setSignInMode] = useState<SignInMode>('self');
  const [signInName, setSignInName] = useState('');
  const [signInDepartmentId, setSignInDepartmentId] = useState(resolvedProject.currentDepartmentId);
  const [signInActorName, setSignInActorName] = useState('');
  const [signInReason, setSignInReason] = useState('');
  const [signInCorrectionTargetId, setSignInCorrectionTargetId] = useState('');
  const [signInFeedback, setSignInFeedback] = useState('');
  const [attendanceState, setAttendanceState] = useState(resolvedProject.attendance);

  const toolbarHideTimerRef = useRef<number | null>(null);

  // 清除全螢幕工具列自動隱藏計時器。
  const clearToolbarTimer = () => {
    if (toolbarHideTimerRef.current !== null) {
      window.clearTimeout(toolbarHideTimerRef.current);
      toolbarHideTimerRef.current = null;
    }
  };

  // 重新排程全螢幕工具列的自動隱藏時間。
  const scheduleToolbarHide = () => {
    clearToolbarTimer();
    toolbarHideTimerRef.current = window.setTimeout(() => {
      setIsToolbarVisible(false);
    }, 1600);
  };

  // 顯示全螢幕工具列，並重新開始隱藏倒數。
  const revealToolbar = () => {
    setIsToolbarVisible(true);
    scheduleToolbarHide();
  };

  // 切換全螢幕模式，並同步調整工具列顯示狀態。
  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      clearToolbarTimer();
      setIsToolbarVisible(!next);
      if (next) {
        scheduleToolbarHide();
      }
      return next;
    });
  };

  useEffect(() => {
    onFullscreenChange?.(isFullscreen);
  }, [isFullscreen, onFullscreenChange]);

  useEffect(() => {
    return () => {
      clearToolbarTimer();
    };
  }, []);

  useEffect(() => {
    setSnapshotVersionId(latestLockedVersion?.id ?? '');
  }, [resolvedProject.id]);

  useEffect(() => {
    if (!slides.some((slide) => slide.id === activeSlideId)) {
      setActiveSlideId(slides[0]?.id ?? '');
    }
  }, [activeSlideId, slides]);

  useEffect(() => {
    if (mode !== 'report' && mode !== 'end') {
      return undefined;
    }

    // 監聽左右方向鍵，讓報告模式可快速切換投影片。
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle end slide navigation
      if (mode === 'end') {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          setMode('report');
        }
        return;
      }

      const currentIndex = slides.findIndex((slide) => slide.id === activeSlideId);

      if (event.key === 'ArrowRight' && currentIndex >= 0) {
        event.preventDefault();
        if (currentIndex < slides.length - 1) {
          setActiveSlideId(slides[currentIndex + 1]?.id ?? activeSlideId);
        } else {
          // Last slide - go to end slide
          setMode('end');
        }
      }

      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        setActiveSlideId(slides[currentIndex - 1]?.id ?? activeSlideId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideId, mode, slides]);

  useEffect(() => {
    setAttendanceState(resolvedProject.attendance);
    setSignInMode(resolvedProject.attendance.signInClosedAt ? 'backfill' : 'self');
    setSignInDepartmentId(resolvedProject.currentDepartmentId);
    setSignInDialogOpen(false);
    setSignInName('');
    setSignInActorName('');
    setSignInReason('');
    setSignInCorrectionTargetId('');
    setSignInFeedback('');
  }, [resolvedProject]);

  const activeSlideIndex = slides.findIndex((slide) => slide.id === activeSlideId);
  const activeSlide = activeSlideIndex >= 0 ? slides[activeSlideIndex] : slides[0];

  const summaryLines = Math.max(1, resolvedProject.presentation.summaryLines || 4);

  // 判斷報表欄位是否需要顯示展開全文按鈕。
  const shouldShowExpand = (value: string) => {
    if (!value.trim()) {
      return false;
    }
    return value.length > summaryLines * 40;
  };

  // 產生欄位展開狀態的唯一 key，避免不同頁面互相影響。
  const buildFieldExpansionKey = (
    departmentId: string,
    pageId: string,
    field: keyof ReportFields
  ): string => `${departmentId}:${pageId}:${field}`;

  const activeAttendanceSession =
    attendanceState.sessions.find((session) => session.id === attendanceState.activeSessionId) ?? attendanceState.sessions[0];
  const isSignInClosed = !!attendanceState.signInClosedAt;
  const isNormalSignInAvailable = !!attendanceState.signInOpenedAt && !isSignInClosed;
  const latestAttendanceRecord = activeAttendanceSession?.records[activeAttendanceSession.records.length - 1];
  const activePrimaryRecords = (activeAttendanceSession?.records ?? []).filter((record) => !record.voidedAt);
  const voidedAttendanceCount = activeAttendanceSession?.records.filter((record) => !!record.voidedAt).length ?? 0;
  const latestAttendanceDepartmentName =
    departments.find((department) => department.id === latestAttendanceRecord?.departmentId)?.name ??
    latestAttendanceRecord?.departmentId ??
    '--';

  // 依當前簽到狀態初始化對話框，並開啟簽到 / 補簽 / 更正入口。
  const openSignInDialog = () => {
    setSignInMode(isSignInClosed ? 'backfill' : 'self');
    setSignInActorName('');
    setSignInReason('');
    setSignInCorrectionTargetId(activePrimaryRecords[0]?.id ?? '');
    setSignInFeedback('');
    setSignInDialogOpen(true);
  };

  // 以名單對應既有 memberId；若找不到則建立臨時識別值供本次場次使用。
  const resolveMemberId = (departmentId: string, memberName: string) => {
    const rosterMatch = activeAttendanceSession?.expectedRoster.find(
      (member) => member.departmentId === departmentId && member.name === memberName
    );

    return rosterMatch?.id ?? `member-ad-hoc-${departmentId}-${memberName}`;
  };

  // 驗證並寫入簽到 ledger，處理一般簽到、代簽、補簽與更正流程。
  const handleConfirmSignIn = () => {
    const name = signInName.trim();
    const actorName = signInActorName.trim();
    const reason = signInReason.trim();
    if (!name) {
      setSignInFeedback('請輸入簽到姓名');
      return;
    }

    if (!activeAttendanceSession) {
      setSignInFeedback('目前無可用簽到場次');
      return;
    }

    if (!isNormalSignInAvailable && !isSignInClosed) {
      setSignInFeedback('目前尚未開放簽到');
      return;
    }

    if (signInMode === 'proxy' && (!actorName || !reason)) {
      setSignInFeedback('代簽需填寫代簽者與原因');
      return;
    }

    if (signInMode === 'backfill' && !reason) {
      setSignInFeedback('補簽需填寫原因');
      return;
    }

    const meetingStartMs = Date.parse(resolvedProject.presentation.cover.meetingDateTime);
    const nowIsoString = new Date().toISOString();
    const status = Number.isFinite(meetingStartMs) && Date.now() > meetingStartMs ? 'late' : 'on_time';
    const memberId = resolveMemberId(signInDepartmentId, name);
    const activePrimaryRecord = activeAttendanceSession.records.find((record) => record.memberId === memberId && !record.voidedAt);
    const correctionTargetRecord = activeAttendanceSession.records.find(
      (record) => record.id === signInCorrectionTargetId && !record.voidedAt
    );

    if (signInMode === 'backfill' && !isSignInClosed) {
      setSignInFeedback('補簽僅能在結束簽到後執行');
      return;
    }

    if ((signInMode === 'self' || signInMode === 'proxy' || signInMode === 'backfill') && activePrimaryRecord) {
      setSignInFeedback('此人員已存在主簽到紀錄，請改用更正流程');
      return;
    }

    if (signInMode === 'correction' && !correctionTargetRecord) {
      setSignInFeedback('找不到可更正的原始簽到紀錄');
      return;
    }

    if (signInMode === 'correction' && !reason) {
      setSignInFeedback('更正需填寫原因');
      return;
    }

    const signInClosedAtMs = attendanceState.signInClosedAt ? Date.parse(attendanceState.signInClosedAt) : Number.NaN;
    const isOverdueBackfill =
      signInMode === 'backfill' &&
      Number.isFinite(signInClosedAtMs) &&
      Date.now() - signInClosedAtMs > 24 * 60 * 60 * 1000;

    setAttendanceState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === prev.activeSessionId
          ? {
            ...session,
            records: session.records
              .map((record) =>
                signInMode === 'correction' && correctionTargetRecord && record.id === correctionTargetRecord.id
                  ? {
                    ...record,
                    voidedAt: nowIsoString,
                    voidReason: reason,
                  }
                  : record
              )
              .concat({
                id: `attendance-${Date.now()}`,
                sessionId: session.id,
                memberId,
                departmentId: signInDepartmentId,
                memberName: name,
                signedAt: nowIsoString,
                status,
                actorRole: 'department_user',
                actorName: signInMode === 'proxy' ? actorName : name,
                mode: signInMode,
                reason: reason || undefined,
                isOverdueBackfill,
                correctionOfRecordId: signInMode === 'correction' ? correctionTargetRecord?.id : undefined,
              }),
          }
          : session
      ),
    }));

    if (signInMode === 'correction') {
      setSignInFeedback('已完成更正（作廢重建）');
    } else if (signInMode === 'backfill') {
      setSignInFeedback(isOverdueBackfill ? '已完成補簽（逾期）' : '已完成補簽');
    } else {
      setSignInFeedback(`已完成簽到（${getAttendanceStatusLabel(status)}）`);
    }

    setSignInName('');
    setSignInActorName('');
    setSignInReason('');
    if (signInMode === 'correction') {
      setSignInCorrectionTargetId('');
    }
  };

  if (!lockedSnapshotVersion) {
    return (
      <Paper elevation={0} sx={{ p: 3, ...meetingSurfaceSx }}>
        <Typography variant="h5" sx={{ ...meetingHeaderSx, mb: 1 }}>
          會議呈現頁面
        </Typography>
        <Typography sx={{ ...meetingHintTextSx, mb: 1 }}>
          尚未有鎖定版本
        </Typography>
        <Typography variant="body2" sx={meetingHintTextSx}>
          請先在後台鎖定版本後再進入會議呈現。
        </Typography>
      </Paper>
    );
  }

  const isCoverReady =
    (resolvedProject.presentation?.cover?.meetingDateTime ?? '').trim() !== '' &&
    (resolvedProject.presentation?.cover?.versionInfo ?? '').trim() !== '';

  if (mode === 'cover') {
    return (
      <Paper
        data-testid="presentation-cover-surface"
        data-meeting-surface="true"
        elevation={0}
        sx={{ p: { xs: 0, md: 4 }, overflow: 'hidden', ...meetingSurfaceSx }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1080px',
            mx: 'auto',
            borderRadius: { xs: 0, md: 2 },
            boxShadow: { xs: 'none', md: '0 12px 32px rgba(0,0,0,0.15)' },
            overflow: 'hidden',
            aspectRatio: '16/9',
            backgroundImage: `url(${coverBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              px: { xs: 3, md: 8 },
              textAlign: 'center',
              zIndex: 1,
              letterSpacing: '0.05em',
            }}
          >
            {resolvedProject.presentation.cover.versionInfo || '--'}
          </Typography>

          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 24, md: 48 },
              right: { xs: 24, md: 64 },
              textAlign: 'right',
              zIndex: 1,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
              {resolvedProject.presentation.cover.meetingDateTime || '--'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {!isCoverReady && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              請先完成封面設定
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => setMode('report')} disabled={!isCoverReady}>
              開始報告
            </Button>
            <Button variant="outlined" onClick={openSignInDialog}>
              {isSignInClosed ? '補簽/更正' : '我要簽到'}
            </Button>
          </Box>
          {activeAttendanceSession && (
            <>
              <Typography sx={{ ...meetingHintTextSx, mt: 1 }}>
                已簽到 {activeAttendanceSession.records.length} 人
              </Typography>
              {latestAttendanceRecord && (
                <>
                  <Typography sx={{ ...meetingHintTextSx, mt: 0.5 }}>
                    最近簽到：{latestAttendanceRecord.memberName}
                  </Typography>
                  <Typography sx={{ ...meetingHintTextSx, mt: 0.25 }}>
                    部門：{latestAttendanceDepartmentName}｜時間：{new Date(latestAttendanceRecord.signedAt).toLocaleString()}｜狀態：
                    {getDisplayStatusLabel(
                      latestAttendanceRecord.status,
                      latestAttendanceRecord.mode,
                      latestAttendanceRecord.isOverdueBackfill
                    )}
                    ｜操作者：{latestAttendanceRecord.actorName}
                    {latestAttendanceRecord.mode === 'proxy' ? '（代簽）' : ''}
                  </Typography>
                  <Typography sx={{ ...meetingHintTextSx, mt: 0.25 }}>
                    總紀錄 {activeAttendanceSession.records.length} 筆（含作廢 {voidedAttendanceCount} 筆）
                  </Typography>
                </>
              )}
            </>
          )}
        </Box>

        <Dialog open={signInDialogOpen} onClose={() => setSignInDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{isSignInClosed ? '補簽/更正' : '手動簽到'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              size="small"
              select
              label="簽到方式"
              value={signInMode}
              onChange={(event) => {
                const nextMode = event.target.value as SignInMode;
                setSignInMode(nextMode);
                if (nextMode === 'correction') {
                  setSignInCorrectionTargetId(activePrimaryRecords[0]?.id ?? '');
                }
                setSignInFeedback('');
              }}
              fullWidth
            >
              {!isSignInClosed && <MenuItem value="self">一般簽到</MenuItem>}
              {!isSignInClosed && <MenuItem value="proxy">代簽</MenuItem>}
              <MenuItem value="correction">更正</MenuItem>
              {isSignInClosed && <MenuItem value="backfill">補簽</MenuItem>}
            </TextField>
            {signInMode === 'correction' && (
              <TextField
                margin="dense"
                size="small"
                select
                label="更正目標"
                value={signInCorrectionTargetId}
                onChange={(event) => setSignInCorrectionTargetId(event.target.value)}
                fullWidth
              >
                {activePrimaryRecords.map((record) => {
                  const departmentName =
                    departments.find((department) => department.id === record.departmentId)?.name ?? record.departmentId;
                  return (
                    <MenuItem key={record.id} value={record.id}>
                      {record.memberName}（{departmentName}）
                    </MenuItem>
                  );
                })}
              </TextField>
            )}
            <TextField
              margin="dense"
              size="small"
              select
              label="簽到部門"
              value={signInDepartmentId}
              onChange={(event) => setSignInDepartmentId(event.target.value)}
              fullWidth
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              size="small"
              label="簽到姓名"
              value={signInName}
              onChange={(event) => setSignInName(event.target.value)}
              fullWidth
            />
            {signInMode === 'proxy' && (
              <TextField
                margin="dense"
                size="small"
                label="代簽者"
                value={signInActorName}
                onChange={(event) => setSignInActorName(event.target.value)}
                fullWidth
              />
            )}
            {(signInMode === 'proxy' || signInMode === 'correction' || signInMode === 'backfill') && (
              <TextField
                margin="dense"
                size="small"
                label={signInMode === 'proxy' ? '代簽原因' : signInMode === 'correction' ? '更正原因' : '補簽原因'}
                value={signInReason}
                onChange={(event) => setSignInReason(event.target.value)}
                fullWidth
              />
            )}
            {!isNormalSignInAvailable && !isSignInClosed && (
              <Alert severity="info" sx={{ mt: 1 }}>
                目前尚未開放簽到
              </Alert>
            )}
            {signInFeedback && (
              <Typography sx={{ ...meetingHintTextSx, mt: 1 }}>{signInFeedback}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSignInDialogOpen(false)}>關閉</Button>
            <Button variant="contained" onClick={handleConfirmSignIn}>
              確認簽到
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }

  // Define shared variables and handlers before mode-specific rendering
  const fontScale = fontMode === 'large' ? 1.2 : 1;
  const currentSlide = activeSlide ?? slides[0];
  const canGoPrev = activeSlideIndex > 0;
  const canGoNext = activeSlideIndex >= 0 && activeSlideIndex < slides.length - 1;
  const canGoToEnd = activeSlideIndex === slides.length - 1 && slides.length > 0;

  // Handle going to the next slide or end slide
  const handleNextSlide = () => {
    if (canGoNext) {
      setActiveSlideId(slides[activeSlideIndex + 1]?.id ?? activeSlideId);
    } else if (canGoToEnd) {
      setMode('end');
    }
  };

  // Handle going to the previous slide
  const handlePrevSlide = () => {
    if (canGoPrev) {
      setActiveSlideId(slides[activeSlideIndex - 1]?.id ?? activeSlideId);
    }
  };

  // Handle returning to cover
  const handleReturnToCover = () => {
    setMode('cover');
    setIsFullscreen(false);
    setIsToolbarVisible(true);
    clearToolbarTimer();
  };

  // Handle restart presentation from first slide
  const handleRestart = () => {
    setMode('report');
    setActiveSlideId(slides[0]?.id ?? '');
    setIsFullscreen(false);
    setIsToolbarVisible(true);
    clearToolbarTimer();
  };

  // End slide mode
  if (mode === 'end') {
    const endSlideSettings = resolvedProject.presentation?.endSlide;
    const endSlideTitle = endSlideSettings?.title?.trim() || '簡報結束';
    const endSlideSubtitle = endSlideSettings?.subtitle?.trim() || '感謝聆聽';
    const endSlideSupportingText = endSlideSettings?.supportingText?.trim() || '';

    return (
      <Box
        data-font-mode={fontMode}
        onMouseMove={isFullscreen ? revealToolbar : undefined}
        sx={{
          display: 'grid',
          gap: 2,
          py: isFullscreen ? 2 : 0,
          px: isFullscreen ? { xs: 1, md: 2 } : 0,
        }}
      >
        {isFullscreen && (
          <Box
            data-testid="fullscreen-toolbar-reveal"
            onMouseEnter={revealToolbar}
            onMouseMove={revealToolbar}
            sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 20, zIndex: 1201 }}
          />
        )}

        <Paper
          data-testid="presentation-end-toolbar"
          data-meeting-surface="true"
          hidden={isFullscreen && !isToolbarVisible}
          elevation={0}
          sx={{
            p: 2,
            ...meetingSurfaceSx,
            position: isFullscreen ? 'sticky' : 'static',
            top: 0,
            zIndex: 1200,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
            <Typography variant="h6" sx={meetingHeaderSx}>
              會議呈現頁面
            </Typography>
            <Chip size="small" color="warning" label={`v${lockedSnapshotVersion.versionNo} (已鎖定)`} />
          </Box>
          <Typography variant="body2" sx={{ ...meetingHintTextSx, mb: 0.5 }}>
            {resolvedProject.projectName}
          </Typography>
          <Typography sx={meetingDesktopNoticeSx}>此頁優先針對桌機與投影會議閱讀體驗設計。</Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
            <Button variant="outlined" size="small" onClick={() => setMode('report')}>
              上一張
            </Button>
            <Button variant="outlined" size="small" onClick={handleToggleFullscreen}>
              {isFullscreen ? '離開全螢幕' : '全螢幕'}
            </Button>
            <Button variant="outlined" size="small" onClick={() => setFontMode((prev) => (prev === 'normal' ? 'large' : 'normal'))}>
              {fontMode === 'normal' ? '大字' : '一般字'}
            </Button>
            <Button variant="text" size="small" onClick={handleReturnToCover}>
              回封面
            </Button>
            <Button variant="text" size="small" onClick={handleRestart}>
              重新開始
            </Button>
          </Box>
        </Paper>

        <Paper
          data-testid="presentation-end-surface"
          data-meeting-surface="true"
          elevation={0}
          sx={{
            p: { xs: 0, md: 4 },
            overflow: 'hidden',
            ...meetingSurfaceSx,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '1080px',
              mx: 'auto',
              borderRadius: { xs: 0, md: 2 },
              boxShadow: { xs: 'none', md: '0 12px 32px rgba(0,0,0,0.15)' },
              overflow: 'hidden',
              aspectRatio: '16/9',
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.52), rgba(15, 23, 42, 0.52)), url(${endBgImg})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: '#fff',
              px: { xs: 3, md: 8 },
              py: { xs: 5, md: 8 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: `${2.6 * fontScale}rem`,
                textShadow: '0 2px 10px rgba(0,0,0,0.35)',
              }}
            >
              {endSlideTitle}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: endSlideSupportingText ? 3 : 0,
                fontSize: `${1.55 * fontScale}rem`,
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 8px rgba(0,0,0,0.28)',
              }}
            >
              {endSlideSubtitle}
            </Typography>

            {endSlideSupportingText && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: `${1.1 * fontScale}rem`,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  maxWidth: 640,
                  color: 'rgba(255, 255, 255, 0.92)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.24)',
                }}
              >
                {endSlideSupportingText}
              </Typography>
            )}
          </Box>
        </Paper>

        <Paper data-meeting-surface="true" elevation={0} sx={{ p: 1.5, ...meetingSurfaceSx, position: 'sticky', bottom: 0 }}>
          <Typography variant="body2" color="text.secondary" data-testid="presentation-footer">
            結束頁
          </Typography>
        </Paper>
      </Box>
    );
  }

  // 渲染單一報表欄位，包含摘要截斷與展開收合控制。
  const renderReportField = (departmentId: string, pageId: string, field: keyof ReportFields, label: string, value: string) => {
    const safeValue = typeof value === 'string' ? value : '';
    const expansionKey = buildFieldExpansionKey(departmentId, pageId, field);
    const isExpanded = expandedFields[expansionKey] ?? false;
    return (
      <Box sx={meetingSlideSectionSx}>
        <Typography data-presentation-field-heading="true" sx={meetingFieldHeadingSx}>
          {label}
        </Typography>
        <Typography
          data-presentation-field-content="true"
          variant="body2"
          sx={{
            ...meetingFieldContentGapSx,
            fontSize: `${0.95 * fontScale}rem`,
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            ...(isExpanded
              ? {}
              : {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: summaryLines,
              }),
          }}
        >
          {safeValue.trim() || '（未填寫）'}
        </Typography>
        {shouldShowExpand(safeValue) && (
          <Button
            variant="text"
            size="small"
            sx={{ mt: 0.5, px: 0 }}
            onClick={() =>
              setExpandedFields((prev) => ({
                ...prev,
                [expansionKey]: !isExpanded,
              }))
            }
          >
            {isExpanded ? '收合全文' : '展開全文'}
          </Button>
        )}
      </Box>
    );
  };

  // 依目前投影片型別渲染一般報表或圖片頁內容。
  const renderSlideContent = () => {
    if (!currentSlide) {
      return null;
    }

    const { department, page } = currentSlide;

    if (page.type === 'report') {
      const block = page.blocks.find((item) => item.departmentId === department.id);
      if (!block) {
        return <Typography color="text.secondary">此部門尚無報表內容。</Typography>;
      }

      return (
        <Box sx={{ display: 'grid', gap: 0 }}>
          {renderReportField(department.id, page.id, 'workItem', '工作項目', block.fields.workItem)}
          {renderReportField(
            department.id,
            page.id,
            'weeklyStatusAndRisk',
            '本周、下周辦理情形暨工作預警狀況說明',
            block.fields.weeklyStatusAndRisk
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, ...meetingSlideSectionSx }}>
            <Box>
              <Typography data-presentation-field-heading="true" sx={meetingFieldHeadingSx}>
                預計完成日(掛建日)
              </Typography>
              <Typography
                data-presentation-field-content="true"
                variant="body1"
                sx={{
                  ...meetingFieldContentGapSx,
                  fontSize: `${1.05 * fontScale}rem`,
                  fontWeight: 600,
                }}
              >
                {block.fields.plannedBuildDate?.trim() || '（未填寫）'}
              </Typography>
            </Box>
            <Box>
              <Typography data-presentation-field-heading="true" sx={meetingFieldHeadingSx}>
                預計完成日(核准日)
              </Typography>
              <Typography
                data-presentation-field-content="true"
                variant="body1"
                sx={{
                  ...meetingFieldContentGapSx,
                  fontSize: `${1.05 * fontScale}rem`,
                  fontWeight: 600,
                }}
              >
                {block.fields.approvalDate?.trim() || '（未填寫）'}
              </Typography>
            </Box>
          </Box>
          {renderReportField(department.id, page.id, 'supportPlan', '建請協助方案（公關機制/跨部門協調）', block.fields.supportPlan)}
          {renderReportField(department.id, page.id, 'executiveDiscussion', '待層峰討論 & 決議', block.fields.executiveDiscussion)}
        </Box>
      );
    }

    const group = page.groups.find((item) => item.departmentId === department.id);
    const image = [...(group?.images ?? [])].sort((a, b) => a.order - b.order)[0];

    if (!image) {
      return <Typography color="text.secondary">尚未上傳圖片。</Typography>;
    }

    return (
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Box
          component="img"
          src={image.url}
          alt={image.name}
          sx={{ width: '100%', minHeight: 320, maxHeight: '60vh', objectFit: 'contain', borderRadius: 2, bgcolor: 'grey.50' }}
        />
        <Divider />
        <Box>
          <Typography variant="body2" sx={{ fontSize: `${0.95 * fontScale}rem`, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            圖片備註：{image.note?.trim() || '（無）'}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      data-font-mode={fontMode}
      onMouseMove={isFullscreen ? revealToolbar : undefined}
      sx={{
        display: 'grid',
        gap: 2,
        py: isFullscreen ? 2 : 0,
        px: isFullscreen ? { xs: 1, md: 2 } : 0,
      }}
    >
      {isFullscreen && (
        <Box
          data-testid="fullscreen-toolbar-reveal"
          onMouseEnter={revealToolbar}
          onMouseMove={revealToolbar}
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 20, zIndex: 1201 }}
        />
      )}

      <Paper
        data-testid="presentation-toolbar"
        data-meeting-surface="true"
        hidden={isFullscreen && !isToolbarVisible}
        elevation={0}
        sx={{
          p: 2,
          ...meetingSurfaceSx,
          position: isFullscreen ? 'sticky' : 'static',
          top: 0,
          zIndex: 1200,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography variant="h6" sx={meetingHeaderSx}>
            會議呈現頁面
          </Typography>
          <Chip size="small" color="warning" label={`v${lockedSnapshotVersion.versionNo} (已鎖定)`} />
        </Box>
        <Typography variant="body2" sx={{ ...meetingHintTextSx, mb: 0.5 }}>
          {resolvedProject.projectName}
        </Typography>
        <Typography sx={meetingDesktopNoticeSx}>此頁優先針對桌機與投影會議閱讀體驗設計。</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          <Button variant="outlined" size="small" onClick={handlePrevSlide} disabled={!canGoPrev}>
            上一張
          </Button>
          <Button variant="outlined" size="small" onClick={handleNextSlide} disabled={!canGoNext && !canGoToEnd}>
            {canGoToEnd ? '結束頁' : '下一張'}
          </Button>
          <Button variant="outlined" size="small" onClick={() => setIsSlideDrawerOpen(true)}>
            投影片目錄
          </Button>
          <Button variant="outlined" size="small" onClick={handleToggleFullscreen}>
            {isFullscreen ? '離開全螢幕' : '全螢幕'}
          </Button>
          <Button variant="outlined" size="small" onClick={() => setFontMode((prev) => (prev === 'normal' ? 'large' : 'normal'))}>
            {fontMode === 'normal' ? '大字' : '一般字'}
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={handleReturnToCover}
          >
            回封面
          </Button>
        </Box>
      </Paper>

      <Drawer anchor="left" open={isSlideDrawerOpen} onClose={() => setIsSlideDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            投影片目錄
          </Typography>
          <List>
            {slides.map((slide, index) => (
              <ListItemButton
                key={slide.id}
                selected={slide.id === currentSlide?.id}
                onClick={() => {
                  setActiveSlideId(slide.id);
                  setIsSlideDrawerOpen(false);
                }}
              >
                <ListItemText primary={`${index + 1}. ${slide.department.name} / ${slide.page.name}`} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Paper elevation={0} sx={{ p: 3, ...meetingSurfaceSx }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: `${1.4 * fontScale}rem` }}>
          {currentSlide?.department.name ?? '-'}
        </Typography>
        {/* <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2 }}>
          {currentSlide?.page.name ?? '-'}
        </Typography> */}
        {renderSlideContent()}
      </Paper>

      <Paper data-meeting-surface="true" elevation={0} sx={{ p: 1.5, ...meetingSurfaceSx, position: 'sticky', bottom: 0 }}>
        <Typography variant="body2" color="text.secondary" data-testid="presentation-footer">
          {activeSlideIndex + 1}/{slides.length}
        </Typography>
      </Paper>
    </Box>
  );
};
