import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { RedLightStatus, RedLightState } from '../../types';
import { useNavigate } from 'react-router-dom';

interface RedLightDashboardProps {
  redLights: RedLightStatus[];
}

export const RedLightDashboard: React.FC<RedLightDashboardProps> = ({ redLights }) => {
  const navigate = useNavigate();

  const getEscalationColor = (status: RedLightState) => {
    switch (status) {
      case RedLightState.Active:
        return 'warning';
      case RedLightState.Escalated7:
        return 'error';
      case RedLightState.Escalated14:
        return 'error';
      case RedLightState.Escalated30:
        return 'error';
      case RedLightState.Resolved:
        return 'success';
      default:
        return 'default';
    }
  };

  const getEscalationLabel = (status: RedLightState) => {
    switch (status) {
      case RedLightState.Active:
        return '紅燈啟動';
      case RedLightState.Escalated7:
        return '7天升級';
      case RedLightState.Escalated14:
        return '14天升級';
      case RedLightState.Escalated30:
        return '30天升級';
      case RedLightState.Resolved:
        return '已解決';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: RedLightState) => {
    switch (status) {
      case RedLightState.Active:
      case RedLightState.Escalated7:
      case RedLightState.Escalated14:
      case RedLightState.Escalated30:
        return <WarningIcon sx={{ fontSize: 20, color: 'error.main' }} />;
      default:
        return null;
    }
  };

  // 統計
  const stats = {
    total: redLights.length,
    active: redLights.filter((r) => r.status === RedLightState.Active).length,
    escalated7: redLights.filter((r) => r.status === RedLightState.Escalated7).length,
    escalated14: redLights.filter((r) => r.status === RedLightState.Escalated14).length,
    escalated30: redLights.filter((r) => r.status === RedLightState.Escalated30).length,
  };

  return (
    <Box>
      {/* 統計卡片 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <WarningIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2">紅燈總數</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <ErrorIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.active}
              </Typography>
              <Typography variant="body2">啟動中</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <NotificationsIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.escalated7 + stats.escalated14}
              </Typography>
              <Typography variant="body2">已升級通知</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: 'grey.200', color: 'grey.800' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <ScheduleIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.escalated30}
              </Typography>
              <Typography variant="body2">列入週報</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 紅燈列表 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>專案名稱</TableCell>
              <TableCell>工項名稱</TableCell>
              <TableCell align="center">延誤天數</TableCell>
              <TableCell align="center">狀態</TableCell>
              <TableCell>負責人</TableCell>
              <TableCell>部門</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {redLights.map((redLight) => (
              <TableRow
                key={redLight.id}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  bgcolor: redLight.status === RedLightState.Escalated30 ? 'error.lighter' : 'inherit',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(redLight.status)}
                    <Typography variant="body2" fontWeight="medium">
                      {redLight.projectName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{redLight.milestoneName}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={`${redLight.currentDelayDays} 天`}
                    color={redLight.currentDelayDays > 14 ? 'error' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getEscalationLabel(redLight.status)}
                    color={getEscalationColor(redLight.status) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.main' }}>
                      {redLight.owner.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{redLight.owner}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{redLight.department}</TableCell>
                <TableCell align="center">
                  <Tooltip title="查看詳情">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/projects/${redLight.projectId}`)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// 需要 import Grid
import { Grid } from '@mui/material';
