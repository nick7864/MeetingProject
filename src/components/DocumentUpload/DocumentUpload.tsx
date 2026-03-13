import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Chip,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Grid,
  Snackbar,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { ConflictInfo, ConflictResolutionAction } from '../../types';
import { createConflictInfo, mockConflictScenario } from '../../mock/data';
import { ConflictDialog } from '../ConflictDialog';

interface DocumentUploadProps {
  documentName?: string;
  documentId?: string;
  onUploadComplete?: () => void;
  onCreateBranch?: (documentId: string, baseVersionId: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentName = '專案進度報告',
  documentId = 'doc-001',
  onUploadComplete,
  onCreateBranch,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changeType, setChangeType] = useState<string>('minor_update');
  const [changeReason, setChangeReason] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [diffDetected, setDiffDetected] = useState(false);

  // ===== Phase 2: 衝突檢測狀態 =====
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<ConflictInfo | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 模擬解析檔案
      setTimeout(() => {
        setShowPreview(true);
        setDiffDetected(true);
      }, 500);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.pptx') || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file);
      setTimeout(() => {
        setShowPreview(true);
        setDiffDetected(true);
      }, 500);
    }
  };

  // ===== Phase 2: 衝突檢測邏輯 =====
  const handleUpload = async () => {
    if (!selectedFile || !changeReason.trim()) return;

    // 模擬從 localStorage 取得用戶下載的版本 ID
    // 實際應用中應該在用戶下載檔案時記錄
    const userBaseVersionId = mockConflictScenario.userBaseVersionId; // 模擬用戶基於 v3 修改

    // 檢查版本衝突
    const conflict = createConflictInfo(documentId, userBaseVersionId);

    if (conflict) {
      // 有衝突，顯示衝突對話框
      setConflictInfo(conflict);
      setConflictDialogOpen(true);
      return;
    }

    // 無衝突，直接上傳
    await performUpload();
  };

  const performUpload = async (resolutionAction?: ConflictResolutionAction, reason?: string) => {
    setIsUploading(true);
    // 模擬上傳進度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setIsUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
    setChangeReason('');
    setShowPreview(false);
    setDiffDetected(false);

    // 顯示成功訊息
    if (resolutionAction) {
      const actionMessages: Record<ConflictResolutionAction, string> = {
        [ConflictResolutionAction.ViewDiff]: '已開啟差異比對',
        [ConflictResolutionAction.ForceOverwrite]: `已強制覆蓋（原因：${reason}）`,
        [ConflictResolutionAction.DownloadLatest]: '已下載最新版本',
        [ConflictResolutionAction.CreateBranch]: '已建立分支版本',
      };
      setSnackbar({ open: true, message: actionMessages[resolutionAction] });
    }

    onUploadComplete?.();
  };

  // ===== Phase 2: 衝突解決處理 =====
  const handleConflictResolve = async (action: ConflictResolutionAction, reason?: string) => {
    setConflictDialogOpen(false);

    switch (action) {
      case ConflictResolutionAction.ViewDiff:
        // 模擬開啟差異比對頁面
        setSnackbar({ open: true, message: '差異比對功能開發中...' });
        break;

      case ConflictResolutionAction.ForceOverwrite:
        // 強制覆蓋，繼續上傳
        await performUpload(action, reason);
        break;

      case ConflictResolutionAction.DownloadLatest:
        // 模擬下載最新版本
        setSnackbar({ open: true, message: '正在下載最新版本...' });
        break;

      case ConflictResolutionAction.CreateBranch:
        //建立分支版本
        if (conflictInfo && onCreateBranch) {
          onCreateBranch(documentId, conflictInfo.baseVersion.id);
        }
        // 重置表單狀態
        setSelectedFile(null);
        setShowPreview(false);
        setDiffDetected(false);
        setChangeReason('');
        break;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pptx') return '📊';
    if (ext === 'xlsx') return '📈';
    if (ext === 'docx') return '📄';
    return '📁';
  };

  // 模擬解析出的差異
  const mockDiffs = [
    { field: '工項A 預計完成日', oldValue: '2024/02/15', newValue: '2024/02/28', delayDays: 13 },
    { field: '工項B 預計完成日', oldValue: '2024/03/01', newValue: '2024/03/01', delayDays: 0 },
    { field: '工項C 預計完成日', oldValue: '2024/03/15', newValue: '2024/04/01', delayDays: 17 },
  ];

  const criticalDiffs = mockDiffs.filter((d) => d.delayDays > 0);

  return (
    <>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            上傳文件 - {documentName}
          </Typography>

          {/* 拖放區域 */}
          <Box
            sx={{
              border: '2px dashed',
              borderColor: selectedFile ? 'success.main' : 'grey.400',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              bgcolor: selectedFile ? 'success.lighter' : 'grey.50',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.lighter',
              },
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pptx,.xlsx,.docx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {!selectedFile ? (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  拖放檔案到此處，或點擊選擇
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  支援 .pptx, .xlsx, .docx 格式
                </Typography>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="h4">{getFileIcon(selectedFile.name)}</Typography>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(selectedFile.size)}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setShowPreview(false);
                    setDiffDetected(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* 上傳進度條 */}
          {isUploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                上傳中... {uploadProgress}%
              </Typography>
            </Box>
          )}

          {/* 解析預覽 */}
          <Collapse in={showPreview}>
            <Box sx={{ mt: 3 }}>
              <Alert
                severity="info"
                icon={<AnalyticsIcon />}
                sx={{ mb: 2 }}
              >
                <AlertTitle>系統已自動解析文件內容</AlertTitle>
                偵測到 {mockDiffs.length} 個欄位，其中 {criticalDiffs.length} 個關鍵變更
              </Alert>

              {/* 關鍵變更警示 */}
              {diffDetected && criticalDiffs.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon />
                    偵測到關鍵變更
                  </AlertTitle>
                  <Box sx={{ mt: 1 }}>
                    {criticalDiffs.map((diff, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>{diff.field}</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: 'line-through', color: 'error.main' }}
                          >
                            {diff.oldValue}
                          </Typography>
                          <Typography variant="body2">→</Typography>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            {diff.newValue}
                          </Typography>
                          <Chip
                            label={`延後 ${diff.delayDays} 天`}
                            color="error"
                            size="small"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Alert>
              )}

              {/* 變更類型與原因 */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>變更類型 *</InputLabel>
                    <Select
                      value={changeType}
                      label="變更類型 *"
                      onChange={(e) => setChangeType(e.target.value)}
                    >
                      <MenuItem value="initial">初次上傳</MenuItem>
                      <MenuItem value="minor_update">小幅更新（錯字修正等）</MenuItem>
                      <MenuItem value="major_update">重大更新（內容變更）</MenuItem>
                      <MenuItem value="correction">更正（修正錯誤）</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="變更說明 *"
                    multiline
                    rows={2}
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    placeholder="請說明此次更新的主要變更內容"
                    error={criticalDiffs.length > 0 && !changeReason.trim()}
                    helperText={
                      criticalDiffs.length > 0 && !changeReason.trim()
                        ? '偵測到延誤，必須填寫變更說明'
                        : ''
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          {/* 操作按鈕 */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedFile(null);
                setShowPreview(false);
                setDiffDetected(false);
                setChangeReason('');
              }}
              disabled={!selectedFile || isUploading}
            >
              取消
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
              disabled={!selectedFile || !changeReason.trim() || isUploading}
            >
              {isUploading ? '上傳中...' : '上傳'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 衝突對話框 */}
      <ConflictDialog
        open={conflictDialogOpen}
        conflictInfo={conflictInfo}
        onResolve={handleConflictResolve}
        onClose={() => setConflictDialogOpen(false)}
      />

      {/* 成功訊息 Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default DocumentUpload;
