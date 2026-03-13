import React from 'react';
import { Paper, Grid, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, alpha, useTheme } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ModeToggle } from './ModeToggle';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  documentType: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'list' | 'chat';
  onModeChange: (mode: 'list' | 'chat') => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  documentType,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onModeChange,
}) => {
  const theme = useTheme();

  return (
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
        {/* Search */}
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            placeholder="搜尋文件名稱、內容或標籤..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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

        {/* File Type Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>檔案類型</InputLabel>
            <Select
              value={documentType}
              label="檔案類型"
              onChange={(e) => onTypeChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="pptx">PPTX</MenuItem>
              <MenuItem value="docx">DOCX</MenuItem>
              <MenuItem value="xlsx">XLSX</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort Select */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>排序方式</InputLabel>
            <Select
              value={sortBy}
              label="排序方式"
              onChange={(e) => onSortChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="relevance">相關性</MenuItem>
              <MenuItem value="date">日期</MenuItem>
              <MenuItem value="name">名稱</MenuItem>
              <MenuItem value="size">大小</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* View Mode Toggle */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <ModeToggle mode={viewMode} onChange={onModeChange} />
        </Grid>
      </Grid>
    </Paper>
  );
};
