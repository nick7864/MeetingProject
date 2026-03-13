import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Divider,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Milestone,
  RedLightStatus,
  Document,
  PendingAction,
  MilestoneStatus,
  RedLightState,
} from '../../types';
import {
  getProjectById,
  getMilestonesByProject,
  getRedLightsByProject,
  getDocumentsByProject,
  getPendingActionsByProject,
  getStatusColor,
  getStatusLabel,
  formatCurrency,
} from '../../mock/data';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index} style={{ paddingTop: 16 }}>
      {value === index && children}
    </div>
  );
};

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const project = getProjectById(projectId || '');
  const milestones = getMilestonesByProject(projectId || '');
  const redLights = getRedLightsByProject(projectId || '');
  const documents = getDocumentsByProject(projectId || '');
  const pendingActions = getPendingActionsByProject(projectId || '');

  if (!project) {
    return (
      <Box sx={{ p: 3 }} className="animate-fade-in-up">
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          找不到此專案，請確認專案 ID 是否正確
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          返回專案列表
        </Button>
      </Box>
    );
  }

  const delayDays = Math.ceil(
    (new Date(project.currentEndDate).getTime() - new Date(project.baselineEndDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const completedMilestones = milestones.filter((m) => m.status === MilestoneStatus.Completed).length;
  const delayedMilestones = milestones.filter((m) => m.status === MilestoneStatus.Delayed || m.status === MilestoneStatus.AtRisk).length;
  const totalDelayCount = milestones.reduce((sum, m) => sum + m.delayCount, 0);

  return (
    <Box className="animate-fade-in-up">
      {/* Breadcrumb */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          返回列表
        </Button>
        <Typography variant="caption" color="text.disabled">
          /
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {project.code}
        </Typography>
      </Box>

      {/* Project Header Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 4,
          border: '1px solid',
          borderColor: redLights.length > 0 ? alpha('#E05A47', 0.3) : 'divider',
          background: redLights.length > 0
            ? `linear-gradient(135deg, ${alpha('#E05A47', 0.03)} 0%, ${alpha('#E05A47', 0.01)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 100%)`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Chip
                  label={project.code}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={getStatusLabel(project.status)}
                  color={getStatusColor(project.status) as any}
                  size="small"
                />
                {redLights.length > 0 && (
                  <Chip
                    icon={<WarningIcon sx={{ fontSize: 16 }} />}
                    label={`${redLights.length} 紅燈`}
                    color="error"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                {project.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="outlined" startIcon={<EditIcon />}>
                編輯專案
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { icon: ScheduleIcon, label: '工期偏差', value: delayDays > 0 ? `+${delayDays}` : '0', suffix: '天', color: delayDays > 0 ? '#E05A47' : theme.palette.success.main, delay: true },
          { icon: FlagIcon, label: '完成里程碑', value: `${completedMilestones}/${milestones.length}`, suffix: '', color: theme.palette.primary.main },
          { icon: WarningIcon, label: '延期紀錄', value: totalDelayCount, suffix: '次', color: theme.palette.warning.main },
          { icon: AttachMoneyIcon, label: '專案預算', value: formatCurrency(project.budget), suffix: '', color: theme.palette.success.main },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(stat.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <stat.icon sx={{ fontSize: 20, color: stat.color }} />
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: stat.color }}
                >
                  {stat.value}
                  {stat.suffix && (
                    <Typography component="span" variant="body2" fontWeight={500}>
                      {' '}{stat.suffix}
                    </Typography>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Info Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Project Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                專案基本資訊
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[
                  { icon: PersonIcon, label: '負責人', value: project.owner },
                  { icon: BusinessIcon, label: '部門', value: project.department },
                  { icon: CalendarIcon, label: '基準開始日', value: new Date(project.baselineStartDate).toLocaleDateString('zh-TW') },
                  { icon: CalendarIcon, label: '基準完成日', value: new Date(project.baselineEndDate).toLocaleDateString('zh-TW') },
                  { icon: TrendingUpIcon, label: '目前預計完成', value: new Date(project.currentEndDate).toLocaleDateString('zh-TW'), highlight: delayDays > 0 },
                ].map((item, idx) => (
                  <Grid item xs={6} key={idx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <item.icon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={item.highlight ? 'error.main' : 'text.primary'}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                專案進度
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">整體進度</Typography>
                  <Typography variant="body2" fontWeight={700} color="primary">{project.progress}%</Typography>
                </Box>
                <Box
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${project.progress}%`,
                      borderRadius: 5,
                      background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                      transition: 'width 0.6s ease-out',
                    }}
                  />
                </Box>
              </Box>

              {delayDays > 0 && (
                <Alert
                  severity="warning"
                  icon={<WarningIcon />}
                  sx={{ borderRadius: 2, mb: 2 }}
                >
                  <Typography variant="body2">
                    工期警示：目前預計完成日較基準線延後 <strong>{delayDays} 天</strong>
                  </Typography>
                </Alert>
              )}

              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.08) }}>
                    <Typography variant="h6" fontWeight={700} color="success.main">{completedMilestones}</Typography>
                    <Typography variant="caption" color="text.secondary">已完成</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
                    <Typography variant="h6" fontWeight={700} color="warning.main">
                      {milestones.filter((m) => m.status === MilestoneStatus.InProgress).length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">進行中</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: alpha('#E05A47', 0.08) }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#E05A47' }}>{delayedMilestones}</Typography>
                    <Typography variant="caption" color="text.secondary">延誤/風險</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            px: 2,
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {[
            { icon: FlagIcon, label: '里程碑', count: milestones.length },
            { icon: WarningIcon, label: '紅燈', count: redLights.length, error: true },
            { icon: DescriptionIcon, label: '文件', count: documents.length },
            { icon: AssignmentIcon, label: '待辦', count: pendingActions.filter((p) => p.status !== 'completed').length },
            { icon: HistoryIcon, label: '稽核軌跡', count: 0 },
          ].map((tab, idx) => (
            <Tab
              key={idx}
              icon={<tab.icon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {tab.label}
                  {tab.count > 0 && (
                    <Chip
                      label={tab.count}
                      size="small"
                      color={tab.error ? 'error' : 'default'}
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        ml: 0.5,
                      }}
                    />
                  )}
                </Box>
              }
              sx={{ minHeight: 56 }}
            />
          ))}
        </Tabs>

        <CardContent sx={{ p: 2 }}>
          <TabPanel value={tabValue} index={0}>
            <MilestonesTable milestones={milestones} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <RedLightsTable redLights={redLights} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <DocumentsTable documents={documents} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <PendingActionsTable pendingActions={pendingActions} />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <AuditTrailTab />
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

// ===== Sub Components =====

const MilestonesTable: React.FC<{ milestones: Milestone[] }> = ({ milestones }) => {
  const theme = useTheme();
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>工項名稱</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>基準日期</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>預計日期</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">延誤天數</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">延期次數</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">狀態</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>負責人</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {milestones.map((m) => (
            <TableRow
              key={m.id}
              sx={{
                bgcolor: m.status === MilestoneStatus.Delayed || m.status === MilestoneStatus.AtRisk
                  ? alpha('#E05A47', 0.03)
                  : 'inherit',
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600}>{m.name}</Typography>
              </TableCell>
              <TableCell>{new Date(m.baselineDate).toLocaleDateString('zh-TW')}</TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  fontWeight={m.delayDays > 0 ? 600 : 400}
                  color={m.delayDays > 0 ? 'error.main' : 'text.primary'}
                >
                  {new Date(m.forecastDate).toLocaleDateString('zh-TW')}
                </Typography>
              </TableCell>
              <TableCell align="center">
                {m.delayDays > 0 ? (
                  <Chip label={`${m.delayDays} 天`} color="error" size="small" />
                ) : (
                  <Typography variant="body2" color="text.disabled">-</Typography>
                )}
              </TableCell>
              <TableCell align="center">
                {m.delayCount > 0 ? (
                  <Chip label={`${m.delayCount} 次`} color="warning" size="small" variant="outlined" />
                ) : '0'}
              </TableCell>
              <TableCell align="center">
                <Chip label={getStatusLabel(m.status)} color={getStatusColor(m.status) as any} size="small" />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                    {m.owner.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">{m.owner}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RedLightsTable: React.FC<{ redLights: RedLightStatus[] }> = ({ redLights }) => {
  if (redLights.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
        <Typography color="text.secondary">此專案目前無紅燈項目</Typography>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>工項名稱</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">延誤天數</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">升級狀態</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>紅燈起始日</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>部門</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {redLights.map((r) => (
            <TableRow key={r.id} sx={{ bgcolor: r.status === RedLightState.Escalated30 ? alpha('#E05A47', 0.05) : 'inherit' }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="error" fontSize="small" />
                  {r.milestoneName}
                </Box>
              </TableCell>
              <TableCell align="center"><Chip label={`${r.currentDelayDays} 天`} color="error" size="small" /></TableCell>
              <TableCell align="center">
                <Chip
                  label={
                    r.status === RedLightState.Escalated30 ? '30天-列入週報' :
                    r.status === RedLightState.Escalated14 ? '14天-處級通知' :
                    r.status === RedLightState.Escalated7 ? '7天-主管通知' : '紅燈啟動'
                  }
                  color="error"
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{new Date(r.redLightStartDate).toLocaleDateString('zh-TW')}</TableCell>
              <TableCell>{r.department}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DocumentsTable: React.FC<{ documents: Document[] }> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <DescriptionIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
        <Typography color="text.secondary">此專案目前無相關文件</Typography>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>文件名稱</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>類型</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>描述</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">版本</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>建立者</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>最後更新</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell><Typography variant="body2" fontWeight={600}>{doc.name}</Typography></TableCell>
              <TableCell>
                <Chip
                  label={
                    doc.type === 'meeting_ppt' ? '會議簡報' :
                    doc.type === 'progress_excel' ? '進度表格' :
                    doc.type === 'contract_pdf' ? '合約文件' : '報告'
                  }
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{doc.description}</TableCell>
              <TableCell align="center"><Chip label={`v${doc.currentVersion}`} color="primary" size="small" /></TableCell>
              <TableCell>{doc.createdBy}</TableCell>
              <TableCell>{new Date(doc.updatedAt).toLocaleDateString('zh-TW')}</TableCell>
              <TableCell align="center">
                <Button size="small" variant="outlined">查看</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PendingActionsTable: React.FC<{ pendingActions: PendingAction[] }> = ({ pendingActions }) => {
  const theme = useTheme();
  const openActions = pendingActions.filter((p) => p.status !== 'completed');
  if (openActions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
        <Typography color="text.secondary">此專案目前無待辦事項</Typography>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>待辦事項</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>負責人</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>期限</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">狀態</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {openActions.map((action) => (
            <TableRow key={action.id} sx={{ bgcolor: action.status === 'overdue' ? alpha('#E05A47', 0.03) : 'inherit' }}>
              <TableCell>{action.description}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                    {action.ownerName.charAt(0)}
                  </Avatar>
                  {action.ownerName}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color={action.status === 'overdue' ? 'error.main' : 'text.primary'} fontWeight={action.status === 'overdue' ? 600 : 400}>
                  {new Date(action.dueDate).toLocaleDateString('zh-TW')}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={
                    action.status === 'overdue' ? '已逾期' :
                    action.status === 'in_progress' ? '進行中' : '待處理'
                  }
                  color={action.status === 'overdue' ? 'error' : action.status === 'in_progress' ? 'warning' : 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AuditTrailTab: React.FC = () => {
  const mockAuditLogs = [
    { id: '1', timestamp: new Date('2024-02-20T10:30:00'), user: '王小明', action: '更新預計完成日', oldValue: '2024/02/15', newValue: '2024/02/28', reason: '廠商物料延遲' },
    { id: '2', timestamp: new Date('2024-02-18T14:20:00'), user: '王小明', action: '新增待辦事項', oldValue: '-', newValue: '提出工期展延申請', reason: '-' },
    { id: '3', timestamp: new Date('2024-02-15T09:00:00'), user: '陳工程', action: '更新專案狀態', oldValue: '規劃中', newValue: '進行中', reason: '專案正式啟動' },
  ];

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>時間</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>操作者</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>動作</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>原值</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>新值</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>原因</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockAuditLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <Typography variant="body2">
                  {log.timestamp.toLocaleDateString('zh-TW')} {log.timestamp.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell><Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="error">{log.oldValue}</Typography></TableCell>
              <TableCell><Typography variant="body2" color="success.main" fontWeight={600}>{log.newValue}</Typography></TableCell>
              <TableCell>{log.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectDetail;
