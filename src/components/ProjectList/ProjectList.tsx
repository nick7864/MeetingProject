import React from 'react';
import { Box, Typography, Grid, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Chip, Paper, alpha, useTheme } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ProjectCard } from './ProjectCard';
import { Project, ProjectStatus } from '../../types';
import { mockRedLights } from '../../mock/data';

interface ProjectListProps {
  projects: Project[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getRedLightCount = (projectId: string) => {
    return mockRedLights.filter((r) => r.projectId === projectId).length;
  };

  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const delayCount = projects.filter(p => {
    const delay = Math.ceil((new Date(p.currentEndDate).getTime() - new Date(p.baselineEndDate).getTime()) / (1000 * 60 * 60 * 24));
    return delay > 0;
  }).length;

  return (
    <Box>
      {/* Search & Filter Bar */}
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="搜尋專案名稱、編號、負責人或部門..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>狀態篩選</InputLabel>
              <Select
                value={statusFilter}
                label="狀態篩選"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">全部狀態</MenuItem>
                <MenuItem value={ProjectStatus.InProgress}>進行中</MenuItem>
                <MenuItem value={ProjectStatus.Delayed}>延誤</MenuItem>
                <MenuItem value={ProjectStatus.Completed}>已完成</MenuItem>
                <MenuItem value={ProjectStatus.Planning}>規劃中</MenuItem>
                <MenuItem value={ProjectStatus.OnHold}>暫停</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { md: 'flex-end' } }}>
              <Chip
                label={`全部 ${projects.length}`}
                color={statusFilter === 'all' ? 'primary' : 'default'}
                onClick={() => setStatusFilter('all')}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={`延誤 ${statusCounts[ProjectStatus.Delayed] || 0}`}
                color="error"
                variant={statusFilter === ProjectStatus.Delayed ? 'filled' : 'outlined'}
                onClick={() => setStatusFilter(ProjectStatus.Delayed)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={`紅燈 ${mockRedLights.length}`}
                color="warning"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
            }}
          />
          <Typography variant="caption" fontWeight={600} color="primary">
            {filteredProjects.length} 個專案
          </Typography>
        </Box>
        {delayCount > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: alpha('#E05A47', 0.08),
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#E05A47',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <Typography variant="caption" fontWeight={600} color="error">
              {delayCount} 個工期落後
            </Typography>
          </Box>
        )}
      </Box>

      {/* Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            px: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            沒有符合條件的專案
          </Typography>
          <Typography variant="body2" color="text.disabled">
            請嘗試調整搜尋條件或篩選器
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project, index) => (
            <Grid item xs={12} sm={6} lg={4} key={project.id}>
              <ProjectCard
                project={project}
                redLightCount={getRedLightCount(project.id)}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
