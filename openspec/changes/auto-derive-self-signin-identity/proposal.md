## Why

目前會議呈現頁的自助簽到彈窗仍要求使用者手動填寫部門與姓名，這與真實落地系統會從登入身分直接取得人員資訊的前提不一致，也讓自助簽到流程多了不必要的輸入摩擦與誤填風險。現在需要把「一般簽到」調整為以系統身份自動帶入，讓簽到流程更接近實際使用情境。

## What Changes

- 將一般簽到從手動輸入 `部門`、`姓名` 改為使用系統登入身分自動帶入，彈窗改為顯示唯讀身份確認資訊。
- 保留代簽、更正、補簽等管理型流程所需的對象選擇、原因與稽核欄位，不與一般簽到混為同一欄位集合。
- 明確定義當系統無法取得登入者唯一身分、姓名或部門時的阻擋行為，避免退回自由輸入造成資料不一致。
- 更新簽到資料模型與驗證規格，確保 `memberId`、`departmentId`、`memberName` 仍完整寫入出席紀錄，只是來源改由登入上下文提供。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `meeting-attendance-ledger`: 一般簽到的身份來源與欄位需求改為由系統自動帶入，並補強抓不到身份時的阻擋規則。
- `meeting-presentation-view`: 封面簽到入口打開的彈窗互動與文案需配合一般簽到自動帶入身份的新流程。

## Impact

- Affected specs: `meeting-attendance-ledger`, `meeting-presentation-view`
- Affected code:
  - `src/components/PresentationPage/PresentationPage.tsx`
  - `src/types/reportWorkspace.ts`
  - `src/mock/reportWorkspaceData.ts`
  - `src/components/PresentationPage/PresentationPage.test.tsx`
  - `src/App.test.tsx`
- Affected systems: 會議簽到流程、簽到身份比對、封面簽到彈窗互動、出席稽核資料完整性
