import React, { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Grid, Fade, Snackbar, Alert, alpha, useTheme } from '@mui/material';
import { SearchFilters } from './SearchFilters';
import { DocumentCard } from './DocumentCard';
import { ChatWindow } from './ChatWindow';
import { DocumentSearchResult, ChatMessage as ChatMessageType, ViewMode } from '../../types/documentSearch';
import { mockSearchableDocuments, getChatResponse } from '../../mock/documentSearchData';

export const DocumentSearchPage: React.FC = () => {
  const theme = useTheme();

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Search and filter state (shared between modes)
  const [searchTerm, setSearchTerm] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // UI state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let results = [...mockSearchableDocuments];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(
        (doc) =>
          doc.title.toLowerCase().includes(lowerSearch) ||
          doc.summary.toLowerCase().includes(lowerSearch) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
      );
    }

    // Type filter
    if (documentType !== 'all') {
      results = results.filter((doc) => doc.fileType === documentType);
    }

    // Sort
    switch (sortBy) {
      case 'date':
        results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'name':
        results.sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'));
        break;
      case 'size':
        results.sort((a, b) => b.fileSize - a.fileSize);
        break;
      case 'relevance':
      default:
        if (searchTerm) {
          results.sort((a, b) => {
            const aScore = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 1;
            const bScore = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 1;
            return bScore - aScore;
          });
        }
        break;
    }

    return results;
  }, [searchTerm, documentType, sortBy]);

  // Handle download
  const handleDownload = useCallback((doc: DocumentSearchResult) => {
    setSnackbar({
      open: true,
      message: `正在下載「${doc.title}」...`,
    });
  }, []);

  // Handle chat message send
  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage: ChatMessageType = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMessage]);

      setIsChatLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

      const aiResponse = getChatResponse(message);

      if (aiResponse.recommendations) {
        aiResponse.recommendations = aiResponse.recommendations.map((doc, index) => ({
          ...doc,
          relevanceScore: Math.max(0.95 - index * 0.1, 0.65),
        }));
      }

      setChatMessages((prev) => [...prev, aiResponse]);
      setIsChatLoading(false);
    },
    []
  );

  const handleModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar({ open: false, message: '' });
  }, []);

  return (
    <Box className="animate-fade-in-up">
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          文件搜尋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          跨專案搜尋關鍵文件與歷史版本，支援自然語言 AI 搜尋
        </Typography>
      </Box>

      {/* Search Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        documentType={documentType}
        onTypeChange={setDocumentType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onModeChange={handleModeChange}
      />

      {/* Main Content Area */}
      <Box sx={{ position: 'relative' }}>
        {/* List Mode */}
        <Fade in={viewMode === 'list'} unmountOnExit>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
              <Typography variant="caption" fontWeight={600} color="primary">
                {filteredDocuments.length} 個文件
              </Typography>
              {searchTerm && (
                <Typography variant="caption" color="text.secondary">
                  (搜尋「{searchTerm}」)
                </Typography>
              )}
            </Box>

            {filteredDocuments.length === 0 ? (
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
                  沒有符合條件的文件
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  請嘗試調整搜尋條件或篩選器
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredDocuments.map((doc, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={doc.id}>
                    <DocumentCard document={doc} index={index} onDownload={handleDownload} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>

        {/* Chat Mode */}
        <Fade in={viewMode === 'chat'} unmountOnExit>
          <Box>
            <ChatWindow
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onDownload={handleDownload}
              isLoading={isChatLoading}
            />
          </Box>
        </Fade>
      </Box>

      {/* Download Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
