## Why

目前工作台的頁面管理只有切換與新增頁面，缺少刪除頁面與調整順序能力，讓誤建頁面、頁面重排與會議前整理版面都變得笨重。現在需要補齊頁面管理的基本操作，並為刪除行為提供一致且可控的自訂確認體驗。

## What Changes

- 新增工作台頁面刪除能力，刪除前必須顯示自訂簡潔確認彈窗，不得使用原生 `alert` 或 `confirm`。
- 新增工作台頁面的順序調整能力，第一階段支援頁面上移與下移，並同步更新頁面 `order`。
- 定義頁面管理的安全規則：不可刪到版本內完全沒有頁面、刪除當前頁時需切換到鄰近頁、鎖定版本不可刪除或排序。
- 補齊頁面管理測試與規格，確保一般報表頁與純圖片頁都遵守相同行為。

## Capabilities

### New Capabilities

- `workspace-page-management`: 管理工作台頁面的新增、刪除、排序與刪除確認互動。

### Modified Capabilities

(none)

## Impact

- Affected specs: `workspace-page-management`
- Affected code:
  - `src/components/ReportWorkspace/ReportWorkspace.tsx`
  - `src/components/ReportWorkspace/ReportWorkspace.test.tsx`
  - `src/mock/reportWorkspaceData.ts`
  - `src/types/reportWorkspace.ts`
- Affected systems: 工作台頁面列表、active page 切換、版本內頁面順序、刪除確認互動
