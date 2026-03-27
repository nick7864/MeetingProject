## 1. 頁面排序能力

- [x] 1.1 落地 **Decision: Use explicit move up and move down controls for first-phase page reordering**，在 `src/components/ReportWorkspace/ReportWorkspace.tsx` 為頁面管理列加入上移與下移控制。
- [x] 1.2 完成 **Workspace pages can be reordered within editable versions**，重用 `src/mock/reportWorkspaceData.ts` 的排序邏輯或擴充對頁面排序的支援，讓一般報表頁與純圖片頁都可調整順序。
- [x] 1.3 完成 **Locked versions disable page management actions**，在不可編輯版本停用頁面排序控制並同步反映在頁面管理 UI。

## 2. 刪除頁面與確認彈窗

- [x] 2.1 落地 **Decision: Require a custom compact confirmation modal for page deletion**，在 `src/components/ReportWorkspace/ReportWorkspace.tsx` 新增自訂簡潔確認彈窗，禁止使用原生 `alert` 或 `confirm`。
- [x] 2.2 完成 **Workspace pages can be deleted with custom confirmation**，讓刪除操作先顯示頁面名稱與「刪除後無法復原」提示，再由使用者明確確認。
- [x] 2.3 完成 **Workspace page deletion preserves a valid version state**，確保不可刪到最後一頁、刪除當前頁時切到鄰近頁，且刪除後重整剩餘頁面的 `order`。
- [x] 2.4 落地 **Decision: Preserve a valid active page and at least one page per version after deletion**，統一整理 `activePageId` 與頁面順序修正邏輯，避免刪除後留下無效狀態。

## 3. 型別與驗證回歸

- [x] 3.1 在 `src/types/reportWorkspace.ts` 與相關 helper 補齊頁面管理操作需要的型別與資料約束，讓排序與刪除流程有一致的資料輸入輸出。
- [x] 3.2 在 `src/components/ReportWorkspace/ReportWorkspace.test.tsx` 補齊 **Confirm page deletion from custom modal**、**Cancel page deletion from custom modal**、**Delete the active page from a multi-page version**、**Attempt to delete the last remaining page** 的測試。
- [x] 3.3 在 `src/components/ReportWorkspace/ReportWorkspace.test.tsx` 補齊 **Move a middle page upward**、**Move a middle page downward**、**View page management in a locked version** 的測試。
- [x] 3.4 執行型別檢查、測試與 Spectra 驗證，確認頁面新增、頁面切換、頁面排序與刪除確認流程沒有回歸破壞。
