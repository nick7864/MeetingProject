import React, { useMemo, useState } from 'react';
import {
  Alert,
  alpha,
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
  DepartmentReportBlock,
  ReportFields,
  ReportWorkspaceProject,
  ReportWorkspaceState,
  WorkspaceChatMessage,
  WorkspaceDepartment,
  WorkspaceImageItem,
  WorkspacePage,
  WorkspacePageType,
} from '../../types/reportWorkspace';

const fieldsMeta: Array<{ key: keyof ReportFields; label: string; multiline?: number }> = [
  { key: 'workItem', label: '工作項目' },
  { key: 'plannedBuildDate', label: '預計完成日(掛建日)' },
  { key: 'approvalDate', label: '預計完成日(核准日)' },
  { key: 'weeklyStatusAndRisk', label: '本周、下周辦理情形暨工作預警狀況說明', multiline: 3 },
  { key: 'supportPlan', label: '建請協助方案（公關機制/跨部門協調）', multiline: 3 },
  { key: 'executiveDiscussion', label: '待層峰討論 & 決議', multiline: 3 },
];

const nowIso = () => new Date().toISOString();

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

const canEditDepartmentBlock = (
  currentRole: ReportWorkspaceState['currentRole'],
  currentDepartmentId: string,
  block: DepartmentReportBlock,
  isLocked: boolean
): boolean => {
  if (isLocked) {
    return false;
  }

  if (currentRole === 'admin') {
    return true;
  }

  return currentDepartmentId === block.departmentId;
};

export const ReportWorkspacePage: React.FC = () => {
  const theme = useTheme();
  const [state, setState] = useState<ReportWorkspaceState>(initialReportWorkspaceState);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newPageType, setNewPageType] = useState<WorkspacePageType>('report');
  const [projectDialogMode, setProjectDialogMode] = useState<'create' | 'rename' | null>(null);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [workspaceTab, setWorkspaceTab] = useState<'content' | 'chat'>('content');
  const [chatInput, setChatInput] = useState('');
  const [previewImage, setPreviewImage] = useState<WorkspaceImageItem | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

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

  const sortedDepartments = useMemo(
    () => [...(activeProject?.departments ?? [])].filter((department) => department.active).sort((a, b) => a.order - b.order),
    [activeProject?.departments]
  );

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

  const openCreateProjectDialog = () => {
    setProjectDialogMode('create');
    setProjectNameInput('');
  };

  const openRenameProjectDialog = () => {
    if (!activeProject) {
      return;
    }

    setProjectDialogMode('rename');
    setProjectNameInput(activeProject.projectName);
  };

  const closeProjectDialog = () => {
    setProjectDialogMode(null);
    setProjectNameInput('');
  };

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

  const updateStateVersions = (updater: (pages: WorkspacePage[], isLocked: boolean) => WorkspacePage[]) => {
    updateActiveProject((project) => ({
      ...project,
      versions: project.versions.map((version) => {
        if (version.id !== project.activeVersionId) {
          return version;
        }

        return {
          ...version,
          pages: updater(version.pages, version.isLocked),
        };
      }),
    }));
  };

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

  const handleDepartmentRename = (departmentId: string, name: string) => {
    updateActiveProject((project) => ({
      ...project,
      departments: project.departments.map((department) =>
        department.id === departmentId ? { ...department, name } : department
      ),
    }));
  };

  const handleAddPage = () => {
    if (!activeProject) {
      return;
    }

    updateActiveProject((project) => {
      const updatedVersions = project.versions.map((version) => {
        if (version.id !== project.activeVersionId || version.isLocked) {
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

  const handleLockAndClone = () => {
    if (!activeProject) {
      return;
    }

    updateActiveProject((project) => {
      const currentVersion = project.versions.find((version) => version.id === project.activeVersionId);
      if (!currentVersion || currentVersion.isLocked) {
        return project;
      }

      const { lockedVersion, nextVersion, nextActivePageId } = cloneVersionForNext(currentVersion, project.activePageId);

      return {
        ...project,
        versions: project.versions.map((version) =>
          version.id === lockedVersion.id ? lockedVersion : version
        ).concat(nextVersion),
        activeVersionId: nextVersion.id,
        activePageId: nextActivePageId,
      };
    });

    setSnackbar({ open: true, message: '版本已鎖定，並自動建立新版本供部門編輯。' });
  };

  const handleFieldChange = (
    pageId: string,
    departmentId: string,
    field: keyof ReportFields,
    value: string
  ) => {
    updateStateVersions((pages, isLocked) => {
      if (isLocked) {
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
                  [field]: value,
                },
                updatedAt: nowIso(),
              }
              : block
          ),
        };
      });
    });
  };

  const handleToggleCompleted = (pageId: string, departmentId: string) => {
    updateStateVersions((pages, isLocked) => {
      if (isLocked) {
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

  const handleUploadImages = (pageId: string, departmentId: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    updateStateVersions((pages, isLocked) => {
      if (isLocked) {
        return pages;
      }

      return pages.map((page) => {
        if (page.id !== pageId || page.type !== 'image') {
          return page;
        }

        const groupIndex = page.groups.findIndex((group) => group.departmentId === departmentId);
        const currentGroup = groupIndex >= 0 ? page.groups[groupIndex] : { departmentId, images: [] };
        const lastOrder = currentGroup.images.reduce((max, image) => Math.max(max, image.order), 0);
        const uploaded: WorkspaceImageItem[] = Array.from(files).map((file, index) => ({
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

  const handleImageNoteChange = (pageId: string, departmentId: string, imageId: string, note: string) => {
    updateStateVersions((pages, isLocked) => {
      if (isLocked) {
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

  const handleDeleteImage = (pageId: string, departmentId: string, imageId: string) => {
    updateStateVersions((pages, isLocked) => {
      if (isLocked) {
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

  const handleReorderImage = (
    pageId: string,
    departmentId: string,
    imageId: string,
    direction: 'up' | 'down'
  ) => {
    updateStateVersions((pages, isLocked) => {
      if (isLocked) {
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

  const canAddPage = !!activeVersion && !activeVersion.isLocked;
  const isAdmin = state.currentRole === 'admin';

  return (
    <Box className="animate-fade-in-up">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          報表工作台
        </Typography>
        <Typography variant="body2" color="text.secondary">
          版本化部門報表與圖片頁管理（前端 Demo）
        </Typography>
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

        <Button variant="outlined" onClick={openCreateProjectDialog} disabled={!isAdmin}>
          新增專案
        </Button>

        <Button variant="outlined" onClick={openRenameProjectDialog} disabled={!isAdmin || !activeProject}>
          重新命名
        </Button>

        <Button variant="outlined" color="warning" onClick={handleArchiveProject} disabled={!isAdmin || !activeProject}>
          封存專案
        </Button>
        <Select
          size="small"
          value={state.currentRole}
          onChange={(event) =>
            setState((prev) => ({
              ...prev,
              currentRole: event.target.value as ReportWorkspaceState['currentRole'],
            }))
          }
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
              v{version.versionNo} {version.isLocked ? '(已鎖定)' : '(編輯中)'}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="secondary"
          startIcon={activeVersion?.isLocked ? <LockOpenIcon /> : <LockIcon />}
          onClick={handleLockAndClone}
          disabled={!isAdmin || !activeVersion || activeVersion.isLocked}
        >
          鎖定目前版本
        </Button>
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
        </Tabs>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: workspaceTab === 'chat' ? '280px 1fr' : '280px 1fr 320px',
          },
          gap: 2,
        }}
      >
        <Stack spacing={2}>
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
                  disabled={!isAdmin || !!activeVersion?.isLocked}
                />
              ))}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="新增部門"
                  value={newDepartmentName}
                  onChange={(event) => setNewDepartmentName(event.target.value)}
                  disabled={!isAdmin || !!activeVersion?.isLocked}
                  fullWidth
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddDepartment}
                  disabled={!isAdmin || !!activeVersion?.isLocked}
                >
                  {/* 新增 */}
                </Button>
              </Box>
            </Stack>
          </Paper>

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
        </Stack>

        {workspaceTab === 'content' ? (
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
                      color={activeVersion.isLocked ? 'warning' : 'success'}
                      label={activeVersion.isLocked ? '此版本已鎖定（唯讀）' : '此版本可編輯'}
                    />
                  </Box>

                  {activePage.type === 'report' && (
                    <Stack spacing={2}>
                      {activePage.blocks
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
                            activeVersion.isLocked
                          );

                          return (
                            <Paper
                              key={block.departmentId}
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: block.isCompleted ? 'success.main' : 'divider',
                                bgcolor: block.isCompleted
                                  ? alpha(theme.palette.success.main, 0.04)
                                  : alpha(theme.palette.background.paper, 0.9),
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  mb: 1,
                                  gap: 1,
                                }}
                              >
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                  {departmentName}
                                </Typography>
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
                                {fieldsMeta.map((meta) => (
                                  <TextField
                                    key={meta.key}
                                    label={meta.label}
                                    size="small"
                                    value={block.fields[meta.key]}
                                    onChange={(event) =>
                                      handleFieldChange(activePage.id, block.departmentId, meta.key, event.target.value)
                                    }
                                    multiline={!!meta.multiline}
                                    minRows={meta.multiline}
                                    disabled={!editable}
                                    fullWidth
                                  />
                                ))}
                              </Stack>
                            </Paper>
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
                              disabled={activeVersion.isLocked}
                              sx={{ width: 'fit-content' }}
                            >
                              上傳圖片
                              <input
                                hidden
                                multiple
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
                                        disabled={activeVersion.isLocked}
                                      />
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleReorderImage(activePage.id, activeProject?.currentDepartmentId ?? '', image.id, 'up')
                                          }
                                          disabled={activeVersion.isLocked || index === 0}
                                        >
                                          <ArrowUpwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleReorderImage(activePage.id, activeProject?.currentDepartmentId ?? '', image.id, 'down')
                                          }
                                          disabled={activeVersion.isLocked || index === sorted.length - 1}
                                        >
                                          <ArrowDownwardIcon fontSize="small" />
                                        </IconButton>
                                        <Button
                                          size="small"
                                          color="error"
                                          onClick={() =>
                                            handleDeleteImage(activePage.id, activeProject?.currentDepartmentId ?? '', image.id)
                                          }
                                          disabled={activeVersion.isLocked}
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
