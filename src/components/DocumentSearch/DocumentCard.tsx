import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Tooltip, alpha, useTheme } from '@mui/material';
import { Download as DownloadIcon, InsertDriveFile as FileIcon, CalendarToday as DateIcon, DataUsage as SizeIcon } from '@mui/icons-material';
import { DocumentSearchResult } from '../../types/documentSearch';
import { formatBytes } from '../../mock/data';

interface DocumentCardProps {
  document: DocumentSearchResult;
  index?: number;
  onDownload?: (doc: DocumentSearchResult) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, index = 0, onDownload }) => {
  const theme = useTheme();

  const getFileColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pptx': return '#D24726'; // PowerPoint orange/red
      case 'xlsx': return '#217346'; // Excel green
      case 'docx': return '#2B579A'; // Word blue
      default: return theme.palette.primary.main;
    }
  };

  const fileColor = getFileColor(document.fileType);

  return (
    <Card
      className={`animate-fade-in-up stagger-${(index % 6) + 1}`}
      sx={{
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 0,
        animationFillMode: 'forwards',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.12)}, 0 4px 12px ${alpha('#000', 0.05)}`,
          borderColor: theme.palette.primary.main,
          '& .card-action': {
            opacity: 1,
            transform: 'translateX(0)',
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
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        }}
      />

      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: alpha(fileColor, 0.1),
                color: fileColor,
              }}
            >
              <FileIcon fontSize="small" />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: fileColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {document.fileType}
            </Typography>
          </Box>
          
          {/* Action button */}
          <Box
            className="card-action"
            sx={{
              opacity: 0,
              transform: 'translateX(8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Tooltip title="下載文件" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload?.(document);
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
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Title & Summary */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'text.primary',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {document.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
            lineHeight: 1.6,
          }}
        >
          {document.summary}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2.5 }}>
          {document.tags.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                border: 'none',
              }}
            />
          ))}
        </Box>

        {/* Footer info (Date & Size) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <DateIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {new Date(document.uploadDate).toLocaleDateString('zh-TW')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <SizeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {formatBytes(document.fileSize)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
