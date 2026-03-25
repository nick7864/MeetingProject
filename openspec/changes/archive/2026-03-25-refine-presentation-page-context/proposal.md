## Why

目前會議呈現頁在主畫面與底部 footer 仍顯示頁面名稱與頁面型別語意，與已經收斂成 PPT 式播放的使用情境不完全一致。使用者希望改成更簡潔的頁碼導向呈現，只保留目前第幾頁與總頁數，例如 `2/13`，避免畫面持續暴露頁面型別或內部命名。

## What Changes

- 將會議呈現頁的底部上下文從部門/頁面名稱導向，改為以當前頁碼/總頁數導向。
- 移除 footer 對頁面名稱、頁面型別語意的依賴，只顯示 `current/total` 格式。
- 更新主 spec 中原本排除頁碼顯示的規則，改為允許並要求顯示 slide index over total。
- 補上對應實作與測試任務，確保頁碼會隨 slide 導覽、鍵盤切頁與抽屜跳頁正確更新。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `meeting-presentation-view`: 調整頁面上下文顯示規則，改以 `current/total` 頁碼取代頁面名稱/型別資訊。

## Impact

- Affected specs: `meeting-presentation-view`
- Affected code: `src/components/PresentationPage/PresentationPage.tsx`, `src/components/PresentationPage/PresentationPage.test.tsx`
