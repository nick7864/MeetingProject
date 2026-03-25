## Why

目前會議呈現頁以封面加長頁捲動的方式呈現內容，較接近報表瀏覽而非正式簡報播放。這讓會議時的節奏控制、投影閱讀聚焦與圖片頁表現都不夠像 PPT，也讓一般報表頁與純圖片頁在會議情境下缺乏一致的播放模型。

## What Changes

- 將會議呈現從長頁捲動改為 slide-based 播放模式，讓每張 slide 對應單一部門的單一頁面內容。
- 定義一般報表頁在 slide 中的完整版卡片分區式版型，保留六個欄位但改以簡報閱讀節奏排列。
- 定義純圖片頁在 slide 中的單圖版型，限制每頁每部門最多一張圖片，並直接顯示圖片備註。
- 保留既有快照穩定邏輯：外掛時間補充內容不會在會議播放中自動改變當前已載入內容，需經明確重新載入才反映更新。
- 補強播放操作模型，支援上一張/下一張與隱藏式抽屜跳張，讓會議呈現更接近 PPT 使用方式。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `meeting-presentation-view`: 將會議呈現改為投影片式播放，重新定義一般報表頁與純圖片頁的呈現規則與圖片頁單圖限制。

## Impact

- Affected specs: `meeting-presentation-view`
- Affected code: `src/components/PresentationPage/PresentationPage.tsx`, `src/components/ReportWorkspace/ReportWorkspace.tsx`, `src/components/PresentationPage/PresentationPage.test.tsx`, `src/components/ReportWorkspace/ReportWorkspace.test.tsx`, `src/types/reportWorkspace.ts`, `src/mock/reportWorkspaceData.ts`
