import React from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton, Tooltip, alpha, useTheme } from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';
import { getStatusColor, getStatusLabel, formatCurrency } from '../../mock/data';

interface ProjectCardProps {
  project: Project;
  redLightCount?: number;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, redLightCount = 0, index = 0 }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const getDelayStatus = () => {
    const baselineEnd = new Date(project.baselineEndDate);
    const currentEnd = new Date(project.currentEndDate);
    const diffDays = Math.ceil((currentEnd.getTime() - baselineEnd.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const delayDays = getDelayStatus();
  const progress = project.progress;

  const getProgressColor = () => {
    if (progress >= 80) return theme.palette.success.main;
    if (progress >= 50) return theme.palette.primary.main;
    if (progress >= 30) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Card
      className={`animate-fade-in-up stagger-${(index % 6) + 1}`}
      onClick={() => navigate(`/projects/${project.id}`)}
      sx={{
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        background: redLightCount > 0 
          ? `linear-gradient(135deg, ${alpha('#E05A47', 0.02)} 0%, #FFFFFF 50%)`
          : '#FFFFFF',
        border: redLightCount > 0 ? '1px solid' : '1px solid',
        borderColor: redLightCount > 0 ? alpha('#E05A47', 0.3) : 'divider',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 0,
        animationFillMode: 'forwards',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: redLightCount > 0
            ? `0 12px 32px ${alpha('#E05A47', 0.15)}, 0 4px 12px ${alpha('#000', 0.05)}`
            : `0 12px 32px ${alpha(theme.palette.primary.main, 0.12)}, 0 4px 12px ${alpha('#000', 0.05)}`,
          borderColor: redLightCount > 0 ? '#E05A47' : theme.palette.primary.main,
          '& .card-action': {
            opacity: 1,
            transform: 'translateX(0)',
          },
          '& .progress-bar': {
            '&::after': {
              opacity: 1,
            },
          },
        },
      }}
    >
      {/* Top accent line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: redLightCount > 0
            ? 'linear-gradient(90deg, #E05A47 0%, #F3C555 100%)'
            : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        }}
      />

      {/* Red light badge */}
      {redLightCount > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: alpha('#E05A47', 0.1),
            color: '#E05A47',
            fontWeight: 600,
            fontSize: '0.75rem',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <WarningIcon sx={{ fontSize: 14 }} />
          {redLightCount} 紅燈
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 2.5, pr: redLightCount > 0 ? 7 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {project.code}
            </Typography>
            <Chip
              label={getStatusLabel(project.status)}
              color={getStatusColor(project.status) as any}
              size="small"
              sx={{ height: 22, fontSize: '0.7rem' }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.name}
          </Typography>
        </Box>

        {/* Progress section */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              專案進度
            </Typography>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ color: getProgressColor() }}
            >
              {progress}%
            </Typography>
          </Box>
          <Box
            className="progress-bar"
            sx={{
              position: 'relative',
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(getProgressColor(), 0.15),
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg, transparent 0%, ${alpha('#fff', 0.4)} 50%, transparent 100%)`,
                backgroundSize: '200% 100%',
                opacity: 0,
                transition: 'opacity 0.3s',
              },
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${getProgressColor()} 0%, ${alpha(getProgressColor(), 0.8)} 100%)`,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </Box>
        </Box>

        {/* Timeline status */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: delayDays > 0 ? alpha('#E05A47', 0.05) : alpha(theme.palette.primary.main, 0.04),
            border: '1px solid',
            borderColor: delayDays > 0 ? alpha('#E05A47', 0.1) : alpha(theme.palette.primary.main, 0.08),
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              工期狀態
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              基準: {new Date(project.baselineEndDate).toLocaleDateString('zh-TW')}
            </Typography>
            <TrendingUpIcon sx={{ fontSize: 14, color: delayDays > 0 ? '#E05A47' : 'text.secondary' }} />
            <Typography
              variant="caption"
              fontWeight={600}
              color={delayDays > 0 ? '#E05A47' : 'text.primary'}
            >
              預計: {new Date(project.currentEndDate).toLocaleDateString('zh-TW')}
            </Typography>
          </Box>
          {delayDays > 0 && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: alpha('#E05A47', 0.1),
              }}
            >
              <WarningIcon sx={{ fontSize: 12, color: '#E05A47' }} />
              <Typography variant="caption" fontWeight={600} color="#E05A47">
                延後 {delayDays} 天
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {project.owner}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {project.department}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
              專案預算
            </Typography>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formatCurrency(project.budget)}
            </Typography>
          </Box>
        </Box>

        {/* Action button */}
        <Box
          className="card-action"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            opacity: 0,
            transform: 'translateX(8px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Tooltip title="查看詳情" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/${project.id}`);
              }}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'scale(1.1)',
                },
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};
