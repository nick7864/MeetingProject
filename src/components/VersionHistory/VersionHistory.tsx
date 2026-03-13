import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  Collapse,
  Divider,
  Tooltip,
  alpha,
  useTheme,
  keyframes,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Compare as CompareIcon,
  Restore as RestoreIcon,
  InsertDriveFile as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  CallSplit as BranchIcon,
} from '@mui/icons-material';
import { DocumentVersion, FieldDiff } from '../../types';
import { formatBytes } from '../../mock/data';

interface VersionHistoryProps {
  versions: DocumentVersion[];
  onDownload?: (version: DocumentVersion) => void;
  onCompare?: (version: DocumentVersion) => void;
  onRollback?: (version: DocumentVersion) => void;
  canRollback?: boolean;
  newBranchVersionId?: string | null;
}

// ===== 動畫定義 =====
const drawLineAnimation = keyframes`
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.8;
  }
`;

const slideInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  onDownload,
  onCompare,
  onRollback,
  canRollback = false,
  newBranchVersionId,
}) => {
  const theme = useTheme();
  const [expandedVersion, setExpandedVersion] = React.useState<string | null>(null);

  // ===== 排序版本：main + branches =====
  const sortVersionsWithBranches = (vers: DocumentVersion[]): DocumentVersion[] => {
    const mainVersions = vers
      .filter((v) => v.branch !== 'branch')
      .sort((a, b) => b.versionNo - a.versionNo);

    const branchVersions = vers.filter((v) => v.branch === 'branch');

    const result: DocumentVersion[] = [];
    for (const main of mainVersions) {
      result.push(main);
      // 插入基於此版本的分支
      const branches = branchVersions.filter((b) => b.baseVersionId === main.id);
      result.push(...branches);
    }
    return result;
  };

  const sortedVersions = sortVersionsWithBranches(versions);

  // ===== 顏色對應 =====
  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'initial':
        return 'info';
      case 'minor_update':
        return 'success';
      case 'major_update':
        return 'warning';
      case 'correction':
        return 'error';
      default:
        return 'default';
    }
  };

  const getChangeTypeLabel = (changeType: string) => {
    const labels: Record<string, string> = {
      initial: '初次建立',
      minor_update: '小幅更新',
      major_update: '重大更新',
      correction: '更正',
    };
    return labels[changeType] || changeType;
  };

  const toggleExpand = (versionId: string) => {
    setExpandedVersion(expandedVersion === versionId ? null : versionId);
  };

  // ===== SVG Git Graph 配置 =====
  const GRAPH_WIDTH = 60;
  const MAIN_LINE_X = 20;
  const BRANCH_LINE_X = 44;
  const DOT_RADIUS = 6;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <FileIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>
          版本歷史
        </Typography>
        <Chip label={`共 ${versions.length} 個版本`} size="small" />
      </Box>

      {/* Git Graph Container */}
      <Box sx={{ p: 2 }}>
        {sortedVersions.map((version, index) => {
          const isCurrent = index === 0 && version.branch !== 'branch';
          const hasDiff = version.diffSummary && version.diffSummary.length > 0;
          const criticalDiffs = version.diffSummary?.filter((d) => d.isCritical) || [];
          const isBranch = version.branch === 'branch';
          const isNewBranch = version.id === newBranchVersionId;

          // 計算分支位置（找到基礎版本的索引）
          const baseVersionIndex = isBranch
            ? sortedVersions.findIndex((v) => v.id === version.baseVersionId)
            : -1;
          const isRightAfterBase = isBranch && baseVersionIndex === index - 1;

          return (
            <Box
              key={version.id}
              sx={{
                display: 'flex',
                mb: 2,
                animation: isNewBranch ? `${slideInAnimation} 0.6s ease-out forwards` : 'none',
                opacity: isNewBranch ? 0 : 1,
              }}
            >
              {/* ===== 左側：版本資訊 ===== */}
              <Box
                sx={{
                  width: 100,
                  pr: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  pt: 1.5,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={isBranch ? 'secondary.main' : 'text.secondary'}
                >
                  v{version.versionNo}
                  {isBranch && '-branch-1'}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {new Date(version.uploadedAt).toLocaleDateString('zh-TW')}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {new Date(version.uploadedAt).toLocaleTimeString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              {/* ===== 中間：SVG Git Graph ===== */}
              <Box
                sx={{
                  width: GRAPH_WIDTH,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width={GRAPH_WIDTH}
                  height="100%"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'visible',
                  }}
                >
                  {/* ===== 主線連接線 ===== */}
                  {!isBranch && index > 0 && (
                    <line
                      x1={MAIN_LINE_X}
                      y1={0}
                      x2={MAIN_LINE_X}
                      y2="50%"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                    />
                  )}
                  
                  {!isBranch && index < sortedVersions.length - 1 && (
                    <line
                      x1={MAIN_LINE_X}
                      y1="50%"
                      x2={MAIN_LINE_X}
                      y2="100%"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                    />
                  )}

                  {/* ===== 分支線（從基礎版本分叉） ===== */}
                  {isRightAfterBase && (
                    <>
                      {/* 分叉曲線 */}
                      <path
                        d={`M ${MAIN_LINE_X} 0 
                            C ${MAIN_LINE_X} 20, ${BRANCH_LINE_X} 20, ${BRANCH_LINE_X} 50`}
                        stroke={theme.palette.secondary.main}
                        strokeWidth={2}
                        strokeDasharray="4 2"
                        fill="none"
                        style={{
                          animation: isNewBranch ? `${drawLineAnimation} 0.8s ease-out forwards` : 'none',
                          strokeDashoffset: isNewBranch ? 100 : 0,
                        }}
                      />
                      {/* 分支垂直線 */}
                      <line
                        x1={BRANCH_LINE_X}
                        y1="50%"
                        x2={BRANCH_LINE_X}
                        y2="100%"
                        stroke={theme.palette.secondary.main}
                        strokeWidth={2}
                        strokeDasharray="4 2"
                      />
                    </>
                  )}

                  {/* ===== 版本節點 ===== */}
                  <circle
                    cx={isBranch ? BRANCH_LINE_X : MAIN_LINE_X}
                    cy="50%"
                    r={DOT_RADIUS}
                    fill={isBranch ? theme.palette.secondary.main : isCurrent ? theme.palette.primary.main : 'white'}
                    stroke={isBranch ? theme.palette.secondary.main : theme.palette.primary.main}
                    strokeWidth={2}
                    style={{
                      animation: isNewBranch ? `${pulseAnimation} 0.8s ease-in-out 0.3s 3` : 'none',
                      transformOrigin: `${isBranch ? BRANCH_LINE_X : MAIN_LINE_X}px 50%`,
                    }}
                  />
                  
                  {/* 當前版本標記 */}
                  {isCurrent && !isBranch && (
                    <circle
                      cx={MAIN_LINE_X}
                      cy="50%"
                      r={DOT_RADIUS + 4}
                      fill="none"
                      stroke={theme.palette.primary.main}
                      strokeWidth={1}
                      opacity={0.5}
                    />
                  )}

                  {/* 分支節點標記 */}
                  {isBranch && (
                    <g transform={`translate(${BRANCH_LINE_X - 8}, 50%)`}>
                      <BranchIcon
                        sx={{
                          fontSize: 16,
                          color: theme.palette.secondary.main,
                          transform: 'translateY(-50%)',
                        }}
                      />
                    </g>
                  )}
                </svg>
              </Box>

              {/* ===== 右側：版本卡片 ===== */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isNewBranch
                      ? alpha(theme.palette.secondary.light, 0.1)
                      : isCurrent && !isBranch
                      ? alpha(theme.palette.primary.light, 0.2)
                      : 'grey.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isNewBranch
                      ? 'secondary.main'
                      : isCurrent && !isBranch
                      ? 'primary.main'
                      : 'grey.200',
                    transition: 'all 0.3s ease',
                    animation: isNewBranch ? `${fadeInAnimation} 0.6s ease-out forwards` : 'none',
                  }}
                >
                  {/* 版本標題 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      {isCurrent && !isBranch && (
                        <Chip label="目前版本" color="primary" size="small" sx={{ mb: 1 }} />
                      )}
                      {isNewBranch && (
                        <Chip 
                          label="新分支" 
                          color="secondary" 
                          size="small" 
                          icon={<BranchIcon />}
                          sx={{ mb: 1, animation: `${pulseAnimation} 1s ease-in-out infinite` }}
                        />
                      )}
                      <Typography variant="subtitle2" fontWeight="bold">
                        {version.fileName}
                      </Typography>
                      {isBranch && (
                        <Chip
                          label="branch"
                          size="small"
                          color="secondary"
                          sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                    <Chip
                      label={getChangeTypeLabel(version.changeType)}
                      color={getChangeTypeColor(version.changeType) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* 上傳者與檔案大小 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: isBranch ? 'secondary.main' : 'primary.main' }}>
                        {version.uploadedByName.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {version.uploadedByName}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      • {formatBytes(version.fileSize)}
                    </Typography>
                  </Box>

                  {/* 變更說明 */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {version.changeReason}
                  </Typography>

                  {/* 關鍵變更摘要 */}
                  {hasDiff && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        關鍵變更：
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {criticalDiffs.slice(0, 3).map((diff, i) => (
                          <Chip
                            key={i}
                            label={`${diff.fieldName.split(' ')[0]}: ${diff.delayDays}天`}
                            color="warning"
                            size="small"
                            icon={<WarningIcon />}
                          />
                        ))}
                        {criticalDiffs.length > 3 && (
                          <Chip
                            label={`+${criticalDiffs.length - 3} 更多`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* 展開/收合按鈕 */}
                  {hasDiff && (
                    <Button
                      size="small"
                      endIcon={
                        expandedVersion === version.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      }
                      onClick={() => toggleExpand(version.id)}
                      sx={{ mt: 1 }}
                    >
                      {expandedVersion === version.id ? '收合詳情' : '查看差異'}
                    </Button>
                  )}

                  {/* 差異詳情 */}
                  <Collapse in={expandedVersion === version.id}>
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 1 }} />
                      {version.diffSummary?.map((diff, i) => (
                        <DiffItem key={i} diff={diff} />
                      ))}
                    </Box>
                  </Collapse>

                  {/* 操作按鈕 */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Tooltip title="下載此版本">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => onDownload?.(version)}
                      >
                        下載
                      </Button>
                    </Tooltip>

                    {!isCurrent && !isBranch && (
                      <Tooltip title="與目前版本比對">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CompareIcon />}
                          onClick={() => onCompare?.(version)}
                        >
                          比對
                        </Button>
                      </Tooltip>
                    )}

                    {canRollback && !isCurrent && !isBranch && (
                      <Tooltip title="回復到此版本">
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<RestoreIcon />}
                          onClick={() => onRollback?.(version)}
                        >
                          回復
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// ===== 差異項目元件 =====
const DiffItem: React.FC<{ diff: FieldDiff }> = ({ diff }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        mb: 1,
        bgcolor: diff.isCritical ? 'warning.lighter' : 'grey.100',
        borderRadius: 1,
        borderLeft: 3,
        borderColor: diff.isCritical ? 'warning.main' : 'grey.300',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        {diff.isCritical && <WarningIcon color="warning" sx={{ fontSize: 16 }} />}
        <Typography variant="subtitle2" fontWeight="bold">
          {diff.fieldName}
        </Typography>
        {diff.changeType === 'delayed' && diff.delayDays && (
          <Chip
            label={`延後 ${diff.delayDays} 天`}
            color="error"
            size="small"
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="body2"
          sx={{ textDecoration: 'line-through', color: 'error.main' }}
        >
          {diff.oldValue}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          →
        </Typography>
        <Typography variant="body2" color="success.main" fontWeight="bold">
          {diff.newValue}
        </Typography>
      </Box>
    </Box>
  );
};
