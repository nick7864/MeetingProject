import React from 'react';
import { ToggleButton, ToggleButtonGroup, alpha, useTheme } from '@mui/material';
import { ViewList as ListIcon, Chat as ChatIcon } from '@mui/icons-material';

interface ModeToggleProps {
  mode: 'list' | 'chat';
  onChange: (mode: 'list' | 'chat') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange }) => {
  const theme = useTheme();

  const handleAlignment = (_event: React.MouseEvent<HTMLElement>, 

    newMode: 'list' | 'chat' | null,
  ) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleAlignment}
      aria-label="view mode toggle"
      size="small"
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        borderRadius: 2,
        '& .MuiToggleButtonGroup-grouped': {
          margin: 0.5,
          border: 0,
          borderRadius: 1.5,
          '&.Mui-disabled': {
            border: 0,
          },
          '&:not(:first-of-type)': {
            borderRadius: 1.5,
          },
          '&:first-of-type': {
            borderRadius: 1.5,
          },
        },
      }}
    >
      <ToggleButton
        value="list"
        aria-label="list view"
        sx={{
          px: 2,
          py: 0.5,
          color: mode === 'list' ? theme.palette.primary.main : 'text.secondary',
          bgcolor: mode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
          '&:hover': {
            bgcolor: mode === 'list' ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.action.hover, 0.1),
          },
          '&.Mui-selected': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 600,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
            }
          }
        }}
      >
        <ListIcon sx={{ mr: 1, fontSize: 20 }} />
        列表模式
      </ToggleButton>
      <ToggleButton
        value="chat"
        aria-label="chat view"
        sx={{
          px: 2,
          py: 0.5,
          color: mode === 'chat' ? theme.palette.primary.main : 'text.secondary',
          bgcolor: mode === 'chat' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
          '&:hover': {
            bgcolor: mode === 'chat' ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.action.hover, 0.1),
          },
          '&.Mui-selected': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 600,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
            }
          }
        }}
      >
        <ChatIcon sx={{ mr: 1, fontSize: 20 }} />
        AI 助理
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
