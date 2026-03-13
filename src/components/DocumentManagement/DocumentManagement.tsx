import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, alpha, useTheme, Chip, Collapse, IconButton, Snackbar, Alert, Button, TextField, Grid, DialogActions } from '@mui/material';
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CloudUpload as UploadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Document, DocumentVersion, Project, ProjectStatus } from '../../types';
import { mockProjects, mockDocuments, getVersionsByDocument } from '../../mock/data';
import { VersionHistory } from '../VersionHistory/VersionHistory';
import { Dialog, DialogTitle, DialogContent, IconButton as CloseIconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';

interface DocumentManagementPageProps { }

export const DocumentManagementPage: React.FC<DocumentManagementPageProps> = () => {
  const theme = useTheme();
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>('all');
  const [expandedDocumentId, setExpandedDocumentId] = React.useState<string | null>(null);
  
  // 上傳 Modal 控制狀態
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [uploadTargetDoc, setUploadTargetDoc] = React.useState<Document | null>(null);
  
  // ===== 版本狀態 =====
  const [versionsMap] = React.useState<Record<string, DocumentVersion[]>>({});

  // ===== 新增專案 Dialog 狀態 =====
  const [projectDialogOpen, setProjectDialogOpen] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>(mockProjects);
  const [projectForm, setProjectForm] = React.useState({
    code: '',
    name: '',
    owner: '',
    department: '',
    status: ProjectStatus.Planning,
    baselineStartDate: '',
    baselineEndDate: '',
    budget: '',
    description: '',
  });
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const getDocumentsForProject = (): Document[] => {
    if (selectedProjectId === 'all') {
      return mockDocuments;
    }
    return mockDocuments.filter((doc: Document) => doc.projectId === selectedProjectId);
  };

  const documents = getDocumentsForProject();

  // 取得專案名稱
  const getProjectName = (projectId: string): string => {
    const project = projects.find((p) => p.id === projectId);
    return project ? `${project.name} (${project.code})` : '未知專案';
  };

  // 依專案分組文件
  const documentsByProject = documents.reduce((acc: Record<string, Document[]>, doc: Document) => {
    if (!acc[doc.projectId]) {
      acc[doc.projectId] = [];
    }
    acc[doc.projectId].push(doc);
    return acc;
  }, {});

  const toggleDocument = (documentId: string) => {
    setExpandedDocumentId(expandedDocumentId === documentId ? null : documentId);
  };

  // 開啟上傳 Modal
  const handleOpenUploadDialog = (doc: Document) => {
    setUploadTargetDoc(doc);
    setUploadDialogOpen(true);
  };

  // 關閉上傳 Modal
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setUploadTargetDoc(null);
  };

  // 上傳完成後的回調
  const handleUploadComplete = () => {
    handleCloseUploadDialog();
    console.log('上傳完成，可在此刷新列表');
  };

  // 取得文件的版本（優先從狀態中取得）
  const getDocumentVersions = (documentId: string): DocumentVersion[] => {
    return versionsMap[documentId] || getVersionsByDocument(documentId);
  };

  const handleDownload = (version: DocumentVersion) => {
    console.log('下載版本:', version);
  };

  const handleCompare = (version: DocumentVersion) => {
    console.log('比對版本:', version);
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting_ppt':
        return '📊';
      case 'progress_excel':
        return '📈';
      case 'report':
        return '📄';
      default:
        return '📁';
    }
  };

  // 建立專案
  const handleCreateProject = () => {
    // 驗證必填欄位
    if (!projectForm.code || !projectForm.name || !projectForm.owner || !projectForm.department) {
      setSnackbar({ open: true, message: '請填寫所有必填欄位' });
      return;
    }
    // 建立新專案
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      code: projectForm.code,
      name: projectForm.name,
      owner: projectForm.owner,
      department: projectForm.department,
      status: projectForm.status,
      baselineStartDate: new Date(projectForm.baselineStartDate),
      baselineEndDate: new Date(projectForm.baselineEndDate),
      currentStartDate: new Date(projectForm.baselineStartDate),
      currentEndDate: new Date(projectForm.baselineEndDate),
      progress: 0,
      budget: Number(projectForm.budget) || 0,
      description: projectForm.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([...projects, newProject]);
    setProjectDialogOpen(false);
    setProjectForm({
      code: '',
      name: '',
      owner: '',
      department: '',
      status: ProjectStatus.Planning,
      baselineStartDate: '',
      baselineEndDate: '',
      budget: '',
      description: '',
    });
    setSnackbar({ open: true, message: `專案「${newProject.name}」建立成功！` });
  };

  return (
    <Box className="animate-fade-in-up">
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            文件管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            依專案管理文件版本，支援分支標籤顯示
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setProjectDialogOpen(true)}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: theme.shadows[2],
            '&:hover': { boxShadow: theme.shadows[4] },
          }}
        >
          新增專案
        </Button>
      </Box>

      {/* Project Selector */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>選擇專案</InputLabel>
            <Select
              value={selectedProjectId}
              label="選擇專案"
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setExpandedDocumentId(null);
              }}
            >
              <MenuItem value="all">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FolderIcon fontSize="small" />
                  全部專案
                </Box>
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FolderIcon fontSize="small" />
                    {project.name} ({project.code})
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Chip
            label={`${documents.length} 個文件`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Documents List by Project */}
      {Object.entries(documentsByProject).map(([projectId, projectDocs]) => (
        <Paper
          key={projectId}
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {/* Project Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <FolderIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={700}>
              {getProjectName(projectId)}
            </Typography>
            <Chip
              label={`${(projectDocs as Document[]).length} 個文件`}
              size="small"
              sx={{ ml: 'auto' }}
            />
          </Box>

          {/* Document Cards */}
          <Box sx={{ p: 2 }}>
            {(projectDocs as Document[]).map((doc) => {
              const isExpanded = expandedDocumentId === doc.id;
              const versions = getDocumentVersions(doc.id);
              const currentVersion = versions.find((v: DocumentVersion) => v.isCurrent) || versions[0];

              return (
                <Box key={doc.id} sx={{ mb: 2 }}>
                  {/* Document Card */}
                  <Paper
                    elevation={0}
                    onClick={() => toggleDocument(doc.id)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isExpanded ? 'primary.main' : 'divider',
                      bgcolor: isExpanded ? alpha(theme.palette.primary.main, 0.02) : 'background.paper',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                        <Typography variant="h5">{getFileTypeIcon(doc.type)}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {doc.name}
                            </Typography>
                            {currentVersion?.branch && (
                              <Chip
                                label={currentVersion.branch}
                                size="small"
                                color="secondary"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                            <Chip
                              label={`v${doc.currentVersion}`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {doc.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              最新版本: {currentVersion ? new Date(currentVersion.uploadedAt).toLocaleDateString('zh-TW') : '-'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              建立者: {doc.createdBy}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUploadDialog(doc);
                          }}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                          }}
                        >
                          <UploadIcon fontSize="small" color="primary" />
                        </IconButton>
                        <IconButton size="small">
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Version History (Collapsible) */}
                  <Collapse in={isExpanded}>
                    <Box sx={{ mt: 2, pl: 4 }}>
                      <VersionHistory
                        versions={versions}
                        onDownload={handleDownload}
                        onCompare={handleCompare}
                        canRollback={true}
                      />
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Paper>
      ))}

      {/* Empty State */}
      {documents.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <FileIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            此專案尚無文件
          </Typography>
          <Typography variant="body2" color="text.disabled">
            請先上傳文件或選擇其他專案
          </Typography>
        </Paper>
      )}

      {/* 上傳 Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleCloseUploadDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h6" fontWeight={700}>
            上傳新版本
          </Typography>
          <CloseIconButton
            size="small"
            onClick={handleCloseUploadDialog}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </CloseIconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {uploadTargetDoc && (
            <DocumentUpload
              documentName={uploadTargetDoc.name}
              documentId={uploadTargetDoc.id}
              onUploadComplete={handleUploadComplete}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 新增專案 Dialog */}
      <Dialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h6" fontWeight={700}>
            新增專案
          </Typography>
          <CloseIconButton
            size="small"
            onClick={() => setProjectDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </CloseIconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="專案編號 *"
                value={projectForm.code}
                onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value })}
                placeholder="PRJ-2024-XXX"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="專案名稱 *"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="負責人 *"
                value={projectForm.owner}
                onChange={(e) => setProjectForm({ ...projectForm, owner: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="部門 *"
                value={projectForm.department}
                onChange={(e) => setProjectForm({ ...projectForm, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>專案狀態</InputLabel>
                <Select
                  value={projectForm.status}
                  label="專案狀態"
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })}
                >
                  <MenuItem value={ProjectStatus.Planning}>規劃中</MenuItem>
                  <MenuItem value={ProjectStatus.InProgress}>進行中</MenuItem>
                  <MenuItem value={ProjectStatus.OnHold}>暫停</MenuItem>
                  <MenuItem value={ProjectStatus.Completed}>已完成</MenuItem>
                  <MenuItem value={ProjectStatus.Delayed}>延遲</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="專案預算 *"
                type="number"
                value={projectForm.budget}
                onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="預計開始日期 *"
                type="date"
                value={projectForm.baselineStartDate}
                onChange={(e) => setProjectForm({ ...projectForm, baselineStartDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="預計結束日期 *"
                type="date"
                value={projectForm.baselineEndDate}
                onChange={(e) => setProjectForm({ ...projectForm, baselineEndDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="專案描述"
                multiline
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setProjectDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleCreateProject}>
            建立
          </Button>
        </DialogActions>
      </Dialog>

      {/* 成功訊息 Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
