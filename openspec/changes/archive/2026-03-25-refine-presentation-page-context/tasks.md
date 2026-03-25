## 1. Footer 頁碼上下文

- [x] 1.1 在 `src/components/PresentationPage/PresentationPage.tsx` 實作 Decision: Replace footer context text with slide index over total，讓 requirement `Footer remains fixed with minimal context fields` 以 `current/total` 格式顯示目前頁碼。
- [x] 1.2 更新 `src/components/PresentationPage/PresentationPage.tsx` 的 footer 輸出，讓 requirement `Footer excludes page count and clock` 不再顯示頁面名稱、頁面型別、版本文字或鎖定狀態。

## 2. 頁碼來源一致性

- [x] 2.1 實作 Decision: Derive page count from the slide deck model，使用既有 `slides` 與 `activeSlideIndex` 推導 footer 頁碼，避免另建獨立頁碼狀態。
- [x] 2.2 驗證按鈕切頁、左右方向鍵切頁與抽屜跳頁後，footer 的 `current/total` 會同步更新。

## 3. 驗證

- [x] 3.1 更新 `src/components/PresentationPage/PresentationPage.test.tsx`，覆蓋 `Footer remains fixed with minimal context fields` 與 `Footer excludes page count and clock` 的新行為。
- [x] 3.2 執行測試與建置驗證，確認頁碼顯示調整不影響既有 slide 導覽與會議呈現流程。
