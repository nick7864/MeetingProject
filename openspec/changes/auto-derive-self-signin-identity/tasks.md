## 1. 身份來源與資料模型整理

- [x] 1.1 落地 **Decision: Derive self sign-in identity from authenticated meeting context**，在 `src/types/reportWorkspace.ts` 與相關狀態來源定義一般簽到使用的 authenticated identity 欄位。
- [x] 1.2 完成 **Manual sign-in mode for first release**，將一般簽到建立 attendance record 的資料來源從手動 `departmentId + memberName` 改為系統提供的 `memberId`、`memberName`、`departmentId`。
- [x] 1.3 完成 **Self sign-in blocks when authenticated identity is incomplete**，在 `src/mock/reportWorkspaceData.ts` 與簽到流程中定義抓不到身份時的阻擋狀態與提示資料。

## 2. 簽到彈窗模式分流

- [x] 2.1 落地 **Decision: Keep management sign-in modes explicitly target-driven**，重構 `src/components/PresentationPage/PresentationPage.tsx` 的模式判斷，分開一般簽到與代簽/更正/補簽所需欄位。
- [x] 2.2 完成 **Cover includes attendee sign-in call-to-action**，讓封面一般簽到入口打開唯讀身份確認流程，而不是手動姓名與部門輸入。
- [x] 2.3 完成 **Cover sign-in dialog distinguishes self and management workflows**，讓一般簽到顯示最小確認內容，管理型流程顯示對象選擇與稽核欄位。
- [x] 2.4 完成 **Management sign-in modes preserve target selection and audit inputs**，保留代簽、更正、補簽的 target 與 reason 驗證，不讓其退化成一般簽到視圖。

## 3. 例外阻擋與互動文案

- [x] 3.1 落地 **Decision: Block self sign-in when identity context is incomplete**，在一般簽到送出前檢查 authenticated identity 是否完整，缺漏時阻擋送出並顯示前置條件不足訊息。
- [x] 3.2 完成 **Open normal sign-in from cover** 情境，更新簽到彈窗文案為唯讀身份確認，例如顯示簽到者姓名與部門而非可編輯欄位。
- [x] 3.3 完成 **Authenticated attendee opens self sign-in dialog** 與 **Operator switches to management workflow in sign-in dialog** 情境，確認不同模式切換時 UI 與按鈕語意一致。

## 4. 驗證與回歸

- [x] 4.1 在 `src/components/PresentationPage/PresentationPage.test.tsx` 補齊 **Register self attendance record from authenticated identity**、**Missing identity context during self sign-in** 的正反向測試。
- [x] 4.2 在 `src/components/PresentationPage/PresentationPage.test.tsx` 補齊 **Proxy sign-in still requires explicit target and audit reason**、**Correction or backfill does not reuse self sign-in identity confirmation flow** 的流程測試。
- [x] 4.3 執行型別檢查、測試與 Spectra 驗證，確認封面簽到入口、attendance ledger、重複簽到判斷與管理型簽到流程沒有回歸破壞。
