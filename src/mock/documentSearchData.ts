import { DocumentSearchResult, ChatMessage } from '../types/documentSearch';

// 8-10 mock searchable documents (mostly PPTX)
export const mockSearchableDocuments: DocumentSearchResult[] = [
  {
    id: 'search-doc-001',
    title: '2024Q1 專案進度報告',
    summary: '包含低碳建築示範專案第一季進度追蹤、里程碑達成狀況與風險評估。詳細說明了結構工程與綠能設施的整合進度。',
    fileType: 'pptx',
    fileSize: 2456789,
    uploadDate: new Date('2024-02-20'),
    tags: ['進度報告', 'Q1', '低碳建築'],
    downloadUrl: '/files/2024Q1-report.pptx',
  },
  {
    id: 'search-doc-002',
    title: '智慧工廠轉型計畫書',
    summary: '智慧化生產線導入規劃，包含自動化倉儲系統與工業物聯網(IIoT)架構設計。預計提升生產效率25%。',
    fileType: 'pptx',
    fileSize: 4123456,
    uploadDate: new Date('2024-01-15'),
    tags: ['智慧工廠', 'IIoT', '自動化'],
    downloadUrl: '/files/smart-factory-plan.pptx',
  },
  {
    id: 'search-doc-003',
    title: 'ESG 永續經營策略規劃',
    summary: '企業環境責任、社會參與及公司治理(ESG)年度計畫。重點在於碳中和路徑圖與供應鏈減碳管理。',
    fileType: 'pptx',
    fileSize: 3200000,
    uploadDate: new Date('2023-12-10'),
    tags: ['ESG', '永續發展', '碳中和'],
    downloadUrl: '/files/esg-strategy.pptx',
  },
  {
    id: 'search-doc-004',
    title: '2024 數位轉型技術白皮書',
    summary: '分析生成式 AI 在企業內部的應用場景，包含知識管理與自動化客戶服務的導入建議。',
    fileType: 'docx',
    fileSize: 850000,
    uploadDate: new Date('2024-02-05'),
    tags: ['數位轉型', 'AI', '白皮書'],
    downloadUrl: '/files/digital-transformation-whitepaper.docx',
  },
  {
    id: 'search-doc-005',
    title: '半導體供應鏈風險分析',
    summary: '針對全球地緣政治對半導體材料供應的影響評估，包含替代方案規劃與安全庫存水位建議。',
    fileType: 'xlsx',
    fileSize: 1200000,
    uploadDate: new Date('2024-01-28'),
    tags: ['供應鏈', '半導體', '風險評估'],
    downloadUrl: '/files/supply-chain-risk.xlsx',
  },
  {
    id: 'search-doc-006',
    title: '高雄港自動化碼頭建置方案',
    summary: '無人化起重機與自駕貨櫃車在碼頭作業的整合測試報告。大幅優化裝卸櫃效率並提升作業安全。',
    fileType: 'pptx',
    fileSize: 5600000,
    uploadDate: new Date('2023-11-20'),
    tags: ['自動化', '碼頭', '智慧交通'],
    downloadUrl: '/files/kaohsiung-port-automation.pptx',
  },
  {
    id: 'search-doc-007',
    title: '再生能源併網穩定性技術報告',
    summary: '探討離岸風電與太陽能併入台電電網時的電壓波動控制技術。引用多項實地測試數據。',
    fileType: 'pptx',
    fileSize: 2800000,
    uploadDate: new Date('2024-02-12'),
    tags: ['再生能源', '併網技術', '能源轉型'],
    downloadUrl: '/files/renewable-energy-grid.pptx',
  },
  {
    id: 'search-doc-008',
    title: '企業資安韌性提升計畫',
    summary: '針對勒索軟體攻擊的防禦架構升級計畫，包含零信任架構導入與異地備援演練。',
    fileType: 'pptx',
    fileSize: 3900000,
    uploadDate: new Date('2024-01-05'),
    tags: ['資安', '零信任', '韌性'],
    downloadUrl: '/files/cybersecurity-plan.pptx',
  },
  {
    id: 'search-doc-009',
    title: '5G AIoT 邊緣運算應用實務',
    summary: '結合 5G 低延遲特性與邊緣運算處理即時影像分析。應用於智慧安防與工安預警。',
    fileType: 'pptx',
    fileSize: 4500000,
    uploadDate: new Date('2023-10-15'),
    tags: ['5G', 'AIoT', '邊緣運算'],
    downloadUrl: '/files/5g-aiot-edge.pptx',
  },
  {
    id: 'search-doc-010',
    title: '智慧建築能耗監測季度報告',
    summary: '各辦公大樓空調與照明系統能耗細分統計，並提出 2024 下半年節能優化建議。',
    fileType: 'xlsx',
    fileSize: 980000,
    uploadDate: new Date('2024-02-25'),
    tags: ['智慧建築', '節能', '數據分析'],
    downloadUrl: '/files/building-energy-report.xlsx',
  },
];

// Mock AI chat responses
export const mockChatResponses: Record<string, ChatMessage> = {
  'api': {
    id: 'chat-001',
    role: 'assistant',
    content: '我為您找到了 3 個相關文件：',
    timestamp: new Date(),
    recommendations: [mockSearchableDocuments[0], mockSearchableDocuments[1], mockSearchableDocuments[3]],
  },
};

// Helper function to simulate AI search
export function searchDocuments(query: string): DocumentSearchResult[] {
  const lowerQuery = query.toLowerCase();
  return mockSearchableDocuments.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.summary.toLowerCase().includes(lowerQuery) ||
    doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Helper function to get mock chat response
export function getChatResponse(query: string): ChatMessage {
  const results = searchDocuments(query);
  return {
    id: `chat-${Date.now()}`,
    role: 'assistant',
    content: results.length > 0 
      ? `我為您找到了 ${results.length} 個相關文件：`
      : '抱歉，沒有找到相關文件。請嘗試其他關鍵字。',
    timestamp: new Date(),
    recommendations: results.slice(0, 3),
  };
}
