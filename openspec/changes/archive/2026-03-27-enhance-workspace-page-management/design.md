## Context

目前 `ReportWorkspace` 的頁面管理區塊只提供頁面列表切換與新增頁面，沒有刪除頁面、調整頁面順序或刪除保護流程。資料模型本身已經有 `WorkspacePage.order` 欄位，圖片排序也已有共用的 `reorderItems` 邏輯，代表頁面排序不需要引入全新概念；但頁面刪除會影響 `activePageId`、版本內最少保留一頁的限制，以及鎖定版本不可編輯的規則，因此需要先把互動邊界定義清楚。

## Goals / Non-Goals

**Goals:**

- 讓管理員能在可編輯版本中刪除頁面，並在刪除前看到自訂簡潔確認彈窗。
- 讓管理員能在頁面管理區塊中調整頁面順序，且排序結果會同步更新 `order` 與目前頁面列表顯示。
- 定義刪除與排序的保護規則，避免把版本刪成空白或刪除後造成 `activePageId` 失效。
- 讓一般報表頁與純圖片頁在頁面管理中遵守一致的刪除與排序邏輯。

**Non-Goals:**

- 這次不引入 drag-and-drop 套件或拖曳排序，第一階段只做上移與下移。
- 這次不重做整個頁面管理視覺結構，只在既有區塊上補齊必要操作與確認彈窗。
- 這次不改變新增頁面的基本流程與頁面模板內容。

## Decisions

### Decision: Use explicit move up and move down controls for first-phase page reordering

第一階段頁面排序採用明確的上移與下移控制，而不是直接導入拖曳排序。這樣可以重用現有 `order` 與 `reorderItems` 心智模型，降低狀態同步與測試複雜度，也能更快補齊使用者最需要的實際能力。

替代方案是直接導入 drag-and-drop；但目前頁面管理區塊還缺少基本刪除與保護邏輯，先上拖曳會把互動、可測性與鍵盤可及性一起拉高，因此不採用。

### Decision: Require a custom compact confirmation modal for page deletion

所有頁面刪除操作都必須先進入自訂的簡潔確認彈窗，顯示頁面名稱與「刪除後無法復原」警示，再由使用者明確確認。此做法可維持工作台 UI 一致性，也避免使用原生 `alert` 或 `confirm` 造成互動斷裂。

替代方案是使用原生確認視窗；但其樣式不可控、資訊承載不足，與目前產品方向不一致，因此不採用。

### Decision: Preserve a valid active page and at least one page per version after deletion

刪除頁面時必須維持版本至少保留一頁，且若刪除的是當前頁，系統要自動切換到鄰近頁面；同時刪除與排序後需重新整理所有頁面的 `order`。這能避免刪除操作留下無效 `activePageId` 或破碎排序資料。

替代方案是允許刪到零頁或刪除後不主動修正 active page；但這會使工作台進入不完整狀態，後續頁面編輯與展示都容易出錯，因此不採用。

## Risks / Trade-offs

- [Risk] 頁面管理區塊加入更多操作後，單列按鈕密度會提高。 → Mitigation：先用簡潔的列表行動按鈕與單一確認彈窗，不同功能保持固定位置與一致圖示語言。
- [Risk] 刪除當前頁後若切換邏輯不明確，使用者可能失去上下文。 → Mitigation：優先切到鄰近頁，並在測試中覆蓋刪除首頁、中間頁、尾頁三種情境。
- [Trade-off] 不做 drag-and-drop 代表第一波排序體驗不是最流暢。 → Mitigation：先交付可用且穩定的上移/下移，後續若確定高頻使用再升級拖曳互動。
