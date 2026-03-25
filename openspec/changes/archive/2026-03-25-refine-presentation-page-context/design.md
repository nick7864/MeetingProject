## Context

`meeting-presentation-view` 已經被重構為 slide-based 會議播放模式，但目前實作與主 spec 仍保留較多「頁面上下文文字」：主畫面標示頁面名稱，footer 也顯示部門與頁面名稱。這與使用者對簡報模式的期待有落差，因為簡報進行中更重要的是知道目前進度，而不是持續看到內部頁面命名。現行主 spec 甚至明確禁止 footer 顯示頁碼，與新需求直接衝突。

## Goals / Non-Goals

**Goals:**

- 讓會議呈現頁的頁面上下文更接近簡報播放語境。
- 用 `current/total` 格式提供明確的進度資訊，例如 `2/13`。
- 移除 footer 對頁面型別與頁面名稱的依賴，避免畫面資訊過重。
- 讓頁碼在按鈕切頁、鍵盤切頁與抽屜跳頁時都能保持一致更新。

**Non-Goals:**

- 不改變 slide deck 的排序規則、頁面內容版型或圖片頁單圖限制。
- 不導入進度條、百分比或剩餘時間估算。
- 不改變 toolbar 中既有的版本/狀態控制邏輯。

## Decisions

### Decision: Replace footer context text with slide index over total

footer 改為只顯示目前 slide index 與總 slide 數，例如 `2/13`。這比顯示部門名稱與頁面名稱更符合簡報語境，也更容易讓報告者與聽眾理解目前進度。

替代方案是同時顯示頁碼與頁面名稱，或保留現有 footer 文字不動；前者仍會讓底部資訊過重，後者則無法達成簡報化收斂，因此都不採用。

### Decision: Keep slide title in main content area but not in persistent page context chrome

slide 主內容區仍可保有必要的標題層級，例如部門名與頁面名，因為這是內容本身的一部分；但 persistent page context chrome（尤其 footer）不再重複顯示這些資訊。這能讓資訊層級更清楚：內容標題屬於內容本體，頁碼屬於播放狀態。

替代方案是連主內容標題都完全移除；但這會讓單張 slide 失去辨識錨點，因此不採用。

### Decision: Derive page count from the slide deck model

頁碼直接由既有 `slides` 陣列與 `activeSlideIndex` 推導，避免引入另一套獨立頁碼資料模型。這樣所有導覽方式都會自然共用同一份頁碼來源，也能降低不同導覽入口顯示不一致的風險。

替代方案是額外保存獨立頁碼狀態；但這會造成同步負擔，因此不採用。

## Risks / Trade-offs

- [Risk] 移除 footer 的部門與頁面名稱後，若使用者只看底部可能失去內容語意。 → Mitigation：保留主內容區的部門與頁面標題。
- [Risk] 使用者可能期待 footer 保留版本資訊。 → Mitigation：版本與狀態仍留在上方 toolbar，不在 footer 重複顯示。
- [Trade-off] `2/13` 只提供進度，不提供語意。 → Mitigation：讓語意回到 slide 主內容標題，讓 footer 專注在播放進度。
