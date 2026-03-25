## 1. 投影片播放模型

- [x] 1.1 在 `src/components/PresentationPage/PresentationPage.tsx` 實作 Decision: Replace continuous scrolling with a department-first slide deck，將連續頁面渲染改為依部門優先建立 slide 清單，以滿足 requirement `Continuous department-first scroll presentation`。
- [x] 1.2 在 `src/components/PresentationPage/PresentationPage.tsx` 與 `src/types/reportWorkspace.ts` 新增會議播放狀態與衍生 selector，讓單一 active slide 能對應單一部門頁面，並符合 `Presentation respects selected version snapshot`。

## 2. 投影片導覽控制

- [x] 2.1 在 `src/components/PresentationPage/PresentationPage.tsx` 實作 Decision: Use a hidden drawer plus previous/next controls for slide navigation，以前後切換、左右方向鍵與隱藏抽屜取代頁內平滑捲動，對應 requirement `Department tab navigation uses in-page smooth scroll`。
- [x] 2.2 更新 `src/components/PresentationPage/PresentationPage.tsx` 的會議工具列，讓開始報告後提供上一張、下一張、抽屜入口、全螢幕與字級切換，並滿足 `Presentation toolbar supports meeting controls`。
- [x] 2.3 實作 Decision: Keep fullscreen presentation minimal and reveal controls on mouse movement，在 `src/components/PresentationPage/PresentationPage.tsx` 與 `src/App.tsx` 讓 `Fullscreen mode auto-hides toolbar` 於全螢幕時預設隱藏、滑鼠移動再浮出，並同步隱藏 app header 與左側選單。

## 3. 一般報表投影片版型

- [x] 3.1 在 `src/components/PresentationPage/PresentationPage.tsx` 實作 Decision: Present report slides with a card-section full-content layout，讓一般報表頁以卡片分區式完整呈現六個欄位，並符合 requirement `Report slides use card-section full-content layout`。
- [x] 3.2 調整 `src/styles/meetingSurface.ts` 的會議呈現樣式，讓一般報表投影片採 B 方案的淡分隔線卡片分區，維持投影優先、區塊清楚、且不依賴狀態色塊。

## 4. 純圖片投影片版型

- [x] 4.1 在 `src/components/ReportWorkspace/ReportWorkspace.tsx`、`src/types/reportWorkspace.ts` 與 `src/mock/reportWorkspaceData.ts` 實作 Decision: Restrict pure image pages to one image per page，讓圖片頁編輯流程強制每個部門每頁只能有一張圖片。
- [x] 4.2 更新 `src/components/PresentationPage/PresentationPage.tsx`，讓純圖片投影片以單張主圖加內嵌備註呈現，並移除 `meeting-presentation-view` 中的圖庫式預覽假設。

## 5. 快照穩定與驗證

- [x] 5.1 實作 Decision: Keep presentation snapshot stable during overtime edits，確保外掛時間開啟後，`Presentation respects selected version snapshot` 仍維持到明確重新載入或重新進入會議頁才更新。
- [x] 5.2 更新 `src/components/PresentationPage/PresentationPage.test.tsx`、`src/App.test.tsx` 與 `src/components/ReportWorkspace/ReportWorkspace.test.tsx`，覆蓋 slide deck 流程、左右方向鍵切頁、`Presentation toolbar supports meeting controls`、`Fullscreen mode auto-hides toolbar`、app chrome 隱藏、單圖頁限制與外掛時間快照穩定性。
