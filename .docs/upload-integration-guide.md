# 文件上傳功能整合指南

## 📋 概述

本文件說明如何將 `DocumentUpload` 元件整合到 `DocumentManagement` 頁面，讓使用者可以點擊上傳按鈕後開啟上傳 Modal。

---

## 🎯 整合目標

| 項目 | 說明 |
|------|------|
| 觸發方式 | 點擊文件卡片上的上傳圖示按鈕 |
| 開啟元件 | DocumentUpload 包裝在 MUI Dialog 中 |
| 傳遞資訊 | 文件名稱、文件 ID |
| 完成動作 | 關閉 Modal、可選擇刷新文件列表 |

---

## 📁 需要修改的檔案

**唯一檔案**: `src/components/DocumentManagement/DocumentManagement.tsx`

---

## 🔧 修改步驟

### 步驟 1: 新增 Import

在檔案頂部的 import 區域，新增 Dialog 相關元件和 DocumentUpload 元件。

**位置**: 第 1-12 行

```tsx
// ===== 原本的 import =====
import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, alpha, useTheme, Chip, Collapse, IconButton } from '@mui/material';
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { Document, DocumentVersion, Project } from '../../types';
import { mockProjects, mockDocuments, getVersionsByDocument } from '../../mock/data';
import { VersionHistory } from '../VersionHistory/VersionHistory';

// ===== 新增以下 import =====
import { Dialog, DialogTitle, DialogContent, IconButton as CloseIconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
```

**💡 說明**:
- `Dialog`, `DialogTitle`, `DialogContent`: MUI 的對話框元件
- `CloseIcon`: 關閉按鈕圖示
- `DocumentUpload`: 我們要整合的上傳元件

---

### 步驟 2: 新增 State 狀態

在 Component 內部，新增控制上傳 Modal 的狀態。

**位置**: 約第 18-19 行之後（在 `expandedDocumentId` state 之後）

```tsx
export const DocumentManagementPage: React.FC<DocumentManagementPageProps> = () => {
  const theme = useTheme();
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>('all');
  const [expandedDocumentId, setExpandedDocumentId] = React.useState<string | null>(null);

  // ===== 新增以下狀態 =====
  // 上傳 Modal 控制狀態
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [uploadTargetDoc, setUploadTargetDoc] = React.useState<Document | null>(null);
  // ===== 新增結束 =====

  // 取得所有專案
  const projects = mockProjects;
  // ... 其餘程式碼
```

**💡 說明**:
| 狀態 | 型別 | 用途 |
|------|------|------|
| `uploadDialogOpen` | `boolean` | 控制 Modal 開啟/關閉 |
| `uploadTargetDoc` | `Document \| null` | 儲存要上傳的目標文件資訊 |

---

### 步驟 3: 新增處理函式

在 `toggleDocument` 函式附近，新增開啟和關閉 Modal 的處理函式。

**位置**: 約第 49-51 行之後（在 `toggleDocument` 函式之後）

```tsx
  const toggleDocument = (documentId: string) => {
    setExpandedDocumentId(expandedDocumentId === documentId ? null : documentId);
  };

  // ===== 新增以下函式 =====
  // 開啟上傳 Modal
  const handleOpenUploadDialog = (doc: Document) => {
    setUploadTargetDoc(doc);
    setUploadDialogOpen(true);
  };

  // 關閉上傳 Modal
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setUploadTargetDoc(null);
  };

  // 上傳完成後的回調
  const handleUploadComplete = () => {
    handleCloseUploadDialog();
    // 可選: 這裡可以加入刷新文件列表的邏輯
    console.log('上傳完成，可在此刷新列表');
  };
  // ===== 新增結束 =====

  const handleDownload = (version: DocumentVersion) => {
    console.log('下載版本:', version);
  };
```

**💡 說明**:
| 函式 | 用途 |
|------|------|
| `handleOpenUploadDialog` | 設定目標文件並開啟 Modal |
| `handleCloseUploadDialog` | 關閉 Modal 並清除目標文件 |
| `handleUploadComplete` | 上傳完成後的回調，關閉 Modal 並可執行其他邏輯 |

---

### 步驟 4: 修改上傳按鈕的 onClick

找到上傳按鈕的 `onClick` 事件，將 `console.log` 改為呼叫開啟 Modal 的函式。

**位置**: 約第 235-247 行

```tsx
// ===== 原本的程式碼 =====
<IconButton
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    console.log('上傳新版本:', doc.id);  // ← 這行要改
  }}
  sx={{
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
  }}
>
  <UploadIcon fontSize="small" color="primary" />
</IconButton>

// ===== 修改後的程式碼 =====
<IconButton
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    handleOpenUploadDialog(doc);  // ← 改成呼叫這個函式
  }}
  sx={{
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
  }}
>
  <UploadIcon fontSize="small" color="primary" />
</IconButton>
```

**💡 說明**:
- `e.stopPropagation()` 保留，防止點擊事件冒泡到父層（避免展開/收起文件卡片）
- 傳入 `doc` 物件，讓 Modal 知道要上傳到哪個文件

---

### 步驟 5: 新增 Dialog 元件

在 Component 的 return 區域最後，`</Box>` 結束標籤之前，新增 Dialog 元件。

**位置**: 約第 293 行（在 Empty State Paper 區塊之後，最後的 `</Box>` 之前）

```tsx
      {/* Empty State */}
      {documents.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <FileIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            此專案尚無文件
          </Typography>
          <Typography variant="body2" color="text.disabled">
            請先上傳文件或選擇其他專案
          </Typography>
        </Paper>
      )}

      {/* ===== 新增上傳 Dialog ===== */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleCloseUploadDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h6" fontWeight={700}>
            上傳新版本
          </Typography>
          <CloseIconButton 
            size="small" 
            onClick={handleCloseUploadDialog}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </CloseIconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {uploadTargetDoc && (
            <DocumentUpload
              documentName={uploadTargetDoc.name}
              documentId={uploadTargetDoc.id}
              onUploadComplete={handleUploadComplete}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* ===== 新增結束 ===== */}
    </Box>
  );
};
```

**💡 說明**:

| Dialog 屬性 | 說明 |
|-------------|------|
| `open={uploadDialogOpen}` | 綁定開啟狀態 |
| `onClose={handleCloseUploadDialog}` | 點擊外部或按 ESC 關閉 |
| `maxWidth="md"` | Dialog 最大寬度 |
| `fullWidth` | Dialog 佔滿可用寬度 |

| DocumentUpload Props | 說明 |
|---------------------|------|
| `documentName` | 顯示在 Modal 標題 |
| `documentId` | 用於衝突檢測邏輯 |
| `onUploadComplete` | 上傳完成後的回調函式 |

---

## 📋 完整修改對照表

| 步驟 | 位置 | 修改類型 | 說明 |
|------|------|----------|------|
| 1 | 第 1-12 行 | 新增 import | Dialog、CloseIcon、DocumentUpload |
| 2 | 第 18-19 行後 | 新增 state | uploadDialogOpen, uploadTargetDoc |
| 3 | 第 49-51 行後 | 新增函式 | handleOpenUploadDialog, handleCloseUploadDialog, handleUploadComplete |
| 4 | 第 239 行 | 修改 onClick | console.log → handleOpenUploadDialog(doc) |
| 5 | 第 293 行後 | 新增元件 | Dialog 包裹 DocumentUpload |

---

## 🎨 UI 流程說明

```
使用者操作流程:
┌─────────────────────────────────────────────────────────────┐
│  1. 使用者在文件卡片上看到上傳圖示 (☁️)                        │
│                          ↓                                   │
│  2. 點擊上傳按鈕                                              │
│                          ↓                                   │
│  3. 開啟 Dialog Modal                                        │
│     - 顯示文件名稱                                            │
│     - 顯示 DocumentUpload 元件                               │
│                          ↓                                   │
│  4. 使用者拖放或選擇檔案                                      │
│                          ↓                                   │
│  5. 系統解析檔案並顯示差異預覽                                │
│                          ↓                                   │
│  6. 使用者填寫變更說明並點擊上傳                              │
│                          ↓                                   │
│  7. 上傳完成 → 觸發 onUploadComplete                         │
│                          ↓                                   │
│  8. 關閉 Modal                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ 注意事項

1. **DocumentUpload 元件本身是 Card**
   - 它不是 Dialog，所以需要由父層包裝在 Dialog 中
   - 這樣的設計讓 DocumentUpload 可以在不同情境重複使用

2. **stopPropagation 的重要性**
   - 保留 `e.stopPropagation()` 是必要的
   - 否則點擊上傳按鈕會同時觸發文件卡片的展開/收起

3. **上傳完成後的處理**
   - 目前 `handleUploadComplete` 只關閉 Modal
   - 未來可以加入刷新文件列表、顯示成功提示等邏輯

4. **衝突檢測**
   - DocumentUpload 內部已有衝突檢測邏輯
   - 如果檢測到版本衝突，會自動顯示 ConflictDialog

---

## ✅ 驗證步驟

修改完成後，請執行以下驗證:

1. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

2. **開啟瀏覽器**
   - 瀏覽至文件管理頁面

3. **測試功能**
   - [ ] 點擊上傳按鈕能開啟 Modal
   - [ ] Modal 標題顯示正確的文件名稱
   - [ ] 可以拖放或選擇檔案
   - [ ] 上傳完成後 Modal 自動關閉
   - [ ] 點擊 X 按鈕可以關閉 Modal
   - [ ] 點擊 Modal 外部可以關閉 Modal

---

## 📚 相關檔案

| 檔案 | 說明 |
|------|------|
| `src/components/DocumentManagement/DocumentManagement.tsx` | 本文件要修改的目標 |
| `src/components/DocumentUpload/DocumentUpload.tsx` | 上傳功能元件 |
| `src/components/ConflictDialog/ConflictDialog.tsx` | 衝突處理對話框 |
| `src/types/index.ts` | Document, DocumentVersion 等型別定義 |
