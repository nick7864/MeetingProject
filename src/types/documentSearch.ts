// Extend Document for search results
export interface DocumentSearchResult {
  id: string;
  title: string;
  summary: string;
  fileType: 'pptx' | 'docx' | 'xlsx';
  fileSize: number;
  uploadDate: Date;
  tags: string[];
  downloadUrl: string;
  relevanceScore?: number; // For chat recommendations
}

// Chat message for AI mode
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: DocumentSearchResult[]; // AI recommended files
}

// Search filters state
export interface SearchFilters {
  searchTerm: string;
  documentType: string;
  dateRange: { start: Date | null; end: Date | null };
  tags: string[];
  sortBy: 'relevance' | 'date' | 'name' | 'size';
}

// View mode type
export type ViewMode = 'list' | 'chat';
