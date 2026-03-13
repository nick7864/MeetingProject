import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  Alert,
  AlertTitle,
  Grid,
  Divider,
  Card,
  CardContent,
  IconButton,
  alpha,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Warning as WarningIcon,
  ErrorOutline as ErrorIcon,
  Compare as CompareIcon,
  CloudUpload as OverwriteIcon,
  Download as DownloadIcon,
  CallSplit as BranchIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import {
  ConflictDialogProps,
  ConflictResolutionAction,
  DocumentVersion,
} from '../../types';

export const ConflictDialog: React.FC<ConflictDialogProps> = ({
  open,
  conflictInfo,
  onResolve,
  onClose,
}) => {
  const theme = useTheme();
  const [forceReason, setForceReason] = useState('');
  const [showForceInput, setShowForceInput] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ConflictResolutionAction | null>(null);

  if (!conflictInfo) return null;

  const { baseVersion, latestVersion, document } = conflictInfo;
  const versionGap = latestVersion.versionNo - baseVersion.versionNo;

  const handleActionClick = (action: ConflictResolutionAction) => {
    setSelectedAction(action);
    
    if (action === ConflictResolutionAction.ForceOverwrite) {
      setShowForceInput(true);
    } else {
      setShowForceInput(false);
      onResolve(action);
    }
  };

  const handleForceConfirm = () => {
    if (forceReason.trim()) {
      onResolve(ConflictResolutionAction.ForceOverwrite, forceReason);
      setForceReason('');
      setShowForceInput(false);
    }
  };


  const actionOptions = [
    {
      action: ConflictResolutionAction.ViewDiff,
      icon: CompareIcon,
      label: '查看差異',
      description: '比對您的版本與最新版本的內容差異',
      color: 'primary',
      buttonText: '查看差異',
    },
    {
      action: ConflictResolutionAction.ForceOverwrite,
      icon: OverwriteIcon,
      label: '強制覆蓋',
      description: '上傳您的版本並覆蓋最新版本（需填寫原因）',
      color: 'error',
      buttonText: '強制覆蓋',
    },
    {
      action: ConflictResolutionAction.DownloadLatest,
      icon: DownloadIcon,
      label: '下載最新版本',
      description: '下載最新版本，合併您的變更後重新上傳',
      color: 'warning',
      buttonText: '下載最新',
    },
    {
      action: ConflictResolutionAction.CreateBranch,
      icon: BranchIcon,
      label: '建立分支版本',
      description: '將您的版本建立為獨立分支，不影響主線版本',
      color: 'info',
      buttonText: '建立分支',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `2px solid ${theme.palette.warning.main}`,
          maxWidth: 640,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 1,
          bgcolor: alpha(theme.palette.warning.light, 0.5),
        }}
      >
        <WarningIcon color="warning" sx={{ fontSize: 28 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            版本衝突警示
          </Typography>
          <Typography variant="body2" color="text.secondary">
            檔案：{document.name}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {/* Warning Alert */}
        <Alert
          severity="warning"
          icon={<ErrorIcon />}
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
        >
          <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
            偵測到版本衝突
          </AlertTitle>
          <Typography variant="body2">
            您基於 <strong>v{baseVersion.versionNo}</strong> 進行修改，但目前最新版本已更新為{' '}
            <strong>v{latestVersion.versionNo}</strong>（相差 {versionGap} 個版本）。
            <br />
            請選擇以下處理方式：
          </Typography>
        </Alert>

        {/* Version Comparison Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* User's Base Version */}
          <Grid item xs={6}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: alpha(theme.palette.grey[500], 0.3),
                bgcolor: alpha(theme.palette.grey[50], 0.5),
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <HistoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                    您基於的版本
                  </Typography>
                </Box>
                <VersionInfoCard version={baseVersion} isUserVersion />
              </CardContent>
            </Card>
          </Grid>

          {/* Latest Version */}
          <Grid item xs={6}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: theme.palette.error.main,
                bgcolor: alpha(theme.palette.error.light, 0.3),
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <WarningIcon sx={{ fontSize: 18, color: 'error.main' }} />
                  <Typography variant="subtitle2" fontWeight={600} color="error.main">
                    目前最新版本
                  </Typography>
                  <Chip
                    label={`+${versionGap} 版`}
                    color="error"
                    size="small"
                    sx={{ ml: 'auto', height: 20, fontSize: '0.65rem' }}
                  />
                </Box>
                <VersionInfoCard version={latestVersion} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Options */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          請選擇處理方式：
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {actionOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card
                key={option.action}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderColor:
                    selectedAction === option.action
                      ? theme.palette[option.color as 'primary' | 'error' | 'warning' | 'info'].main
                      : 'divider',
                  bgcolor:
                    selectedAction === option.action
                      ? alpha(theme.palette[option.color as 'primary' | 'error' | 'warning' | 'info'].light, 0.3)
                      : 'background.paper',
                  '&:hover': {
                    borderColor: theme.palette[option.color as 'primary' | 'error' | 'warning' | 'info'].main,
                    bgcolor: alpha(theme.palette[option.color as 'primary' | 'error' | 'warning' | 'info'].light, 0.2),
                  },
                }}
                onClick={() => handleActionClick(option.action)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(
                          theme.palette[option.color as 'primary' | 'error' | 'warning' | 'info'].main,
                          0.1
                        ),
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 20,
                          color: theme.palette[option.color as 'primary' | 'error' | 'warning' | 'info'].main,
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      color={option.color as 'primary' | 'error' | 'warning' | 'info'}
                      sx={{ minWidth: 80 }}
                    >
                      {option.buttonText}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Force Overwrite Reason Input */}
        <Collapse in={showForceInput}>
          <Alert
            severity="error"
            icon={false}
            sx={{
              mt: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.error.light, 0.3),
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              強制覆蓋須知
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              強制覆蓋將使 v{latestVersion.versionNo} 的變更被您的版本取代，此操作會被記錄在稽核軌跡中。
              請說明必須強制覆蓋的原因：
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="請輸入強制覆蓋的原因（必填）"
              value={forceReason}
              onChange={(e) => setForceReason(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button
                size="small"
                onClick={() => {
                  setShowForceInput(false);
                  setSelectedAction(null);
                  setForceReason('');
                }}
              >
                取消
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                disabled={!forceReason.trim()}
                onClick={handleForceConfirm}
              >
                確認強制覆蓋
              </Button>
            </Box>
          </Alert>
        </Collapse>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto' }}>
          <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            此操作將被記錄在稽核軌跡中
          </Typography>
        </Box>
        <Button variant="outlined" onClick={onClose}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ===== Sub Components =====

const VersionInfoCard: React.FC<{ version: DocumentVersion; isUserVersion?: boolean }> = ({
  version,
  isUserVersion = false,
}) => {


  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip
          label={`v${version.versionNo}`}
          size="small"
          color={isUserVersion ? 'default' : 'error'}
          sx={{ fontWeight: 600 }}
        />
        {version.isCurrent && (
          <Chip label="最新" size="small" color="success" variant="outlined" />
        )}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary">
          {version.uploadedByName}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary">
          {new Date(version.uploadedAt).toLocaleDateString('zh-TW')}{' '}
          {new Date(version.uploadedAt).toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {version.changeReason}
      </Typography>
    </Box>
  );
};

export default ConflictDialog;
