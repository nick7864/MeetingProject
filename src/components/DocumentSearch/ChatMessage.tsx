import React from 'react';
import { Box, Typography, Avatar, Paper, Grid, Chip, alpha, useTheme } from '@mui/material';
import { SmartToy as AIIcon, Person as UserIcon } from '@mui/icons-material';
import { ChatMessage as IChatMessage, DocumentSearchResult } from '../../types/documentSearch';
import { DocumentCard } from './DocumentCard';

interface ChatMessageProps {
  message: IChatMessage;
  onDownload?: (doc: DocumentSearchResult) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onDownload }) => {
  const theme = useTheme();
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 2,
        mb: 3,
        maxWidth: '100%',
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
          color: 'white',
          width: 40,
          height: 40,
          boxShadow: `0 4px 12px ${alpha(isUser ? theme.palette.primary.main : theme.palette.secondary.main, 0.3)}`,
        }}
      >
        {isUser ? <UserIcon /> : <AIIcon />}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          maxWidth: isUser ? '70%' : '85%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            mb: 0.5,
            flexDirection: isUser ? 'row-reverse' : 'row',
          }}
        >
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            {isUser ? '您' : 'AI 助理'}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {new Date(message.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            borderTopRightRadius: isUser ? 0 : 3,
            borderTopLeftRadius: isUser ? 3 : 0,
            bgcolor: isUser ? theme.palette.primary.main : alpha(theme.palette.background.paper, 0.8),
            color: isUser ? 'white' : 'text.primary',
            border: isUser ? 'none' : '1px solid',
            borderColor: 'divider',
            boxShadow: isUser 
              ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}` 
              : `0 4px 12px ${alpha('#000', 0.05)}`,
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {message.content}
          </Typography>
        </Paper>

        {/* Recommendations */}
        {!isUser && message.recommendations && message.recommendations.length > 0 && (
          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, pl: 0.5 }}>
              推薦文件
            </Typography>
            <Grid container spacing={2}>
              {message.recommendations.map((doc, index) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Box sx={{ position: 'relative' }}>
                    {/* Relevance Score Badge */}
                    {doc.relevanceScore && (
                      <Chip
                        label={`相關度 ${Math.round(doc.relevanceScore * 100)}%`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: 12,
                          zIndex: 1,
                          bgcolor: theme.palette.secondary.main,
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 20,
                          boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.4)}`,
                        }}
                      />
                    )}
                    <DocumentCard document={doc} index={index} onDownload={onDownload} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};
