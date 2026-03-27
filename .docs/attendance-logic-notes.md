# Attendance Logic Notes

## Purpose

這份文件整理目前原型中「後台簽到治理」與「前台簽到執行」兩個頁面的函式責任，方便後續討論要怎麼調整流程、拆模組或改資料模型。

目前專案仍是前端原型，簽到資料不是走 API 或資料庫，而是存在元件 state / localStorage。

## Related Files

- `src/components/ReportWorkspace/ReportWorkspace.tsx`
- `src/components/PresentationPage/PresentationPage.tsx`
- `src/types/reportWorkspace.ts`

## Shared Attendance Model

`src/types/reportWorkspace.ts` 目前把簽到拆成三層：

- `AttendanceState`: 全域簽到狀態，包含 `activeSessionId`、`signInOpenedAt`、`signInClosedAt`
- `AttendanceSession`: 單一場次資料，包含 `expectedRoster`、`records`、`startedAt`、`closedAt`、`rosterFrozenAt`
- `AttendanceRecord`: 單筆簽到紀錄，包含 `status`、`mode`、`actorName`、`reason`、`voidedAt` 等稽核欄位

簽到模式有四種：

- `self`: 一般簽到
- `proxy`: 代簽
- `correction`: 更正
- `backfill`: 補簽

## ReportWorkspace.tsx

這頁偏「後台治理」，主要負責名單、開關、摘要與匯出。

### Attendance-related functions

- `buildAttendanceSummary`
  - 將未作廢紀錄做 canonicalization
  - 以 memberId 為主鍵保留有效主紀錄
  - 產出 `onTime`、`late`、`absent` 三組結果

- `parseAttendanceRosterDraft`
  - 解析名單貼上區內容
  - 驗證格式、部門存在、姓名不可空白
  - 檢查批次內重複，以及 append 模式是否與既有名單重複

- `handleAttendanceRosterPreview`
  - 先產生匯入預覽結果
  - 顯示 replace / append 對現有名單的影響
  - 有錯誤時阻止確認匯入

- `handleAttendanceRosterSave`
  - 只接受已完成預覽且無錯誤的結果
  - 依 replace / append 模式寫回目前 active session 的 `expectedRoster`
  - 只有 admin 且名單尚未凍結、簽到尚未關閉時可執行

- `handleOpenSignIn`
  - 開啟一般簽到
  - 寫入 `attendance.signInOpenedAt`
  - 若 session 尚未有 `startedAt`，一併補上
  - 已關閉後不可重新開啟

- `handleCloseSignIn`
  - 關閉一般簽到
  - 寫入 `attendance.signInClosedAt`
  - 同步設定 session 的 `closedAt` 與 `rosterFrozenAt`
  - 關閉後前台只剩補簽 / 更正流程

- `handleExportAttendanceCsv`
  - 僅在簽到關閉後可用
  - 以摘要結果輸出 CSV
  - 準時、遲到會輸出實際 record；缺席則由 expected roster 推導

### Related governance functions

- `handleLockAndClone`
  - 手動鎖定版本後建立下一版
  - 也會把當前 session 的 `rosterFrozenAt` 補上
  - 代表目前「版本鎖定」與「名單凍結」是綁在一起的

## PresentationPage.tsx

這頁偏「簽到執行」，讓與會者或操作人員從封面進入簽到流程。

### Attendance-related functions

- `openSignInDialog`
  - 依目前簽到是否已關閉，決定預設模式是 `self` 或 `backfill`
  - 初始化代簽者、原因、更正目標等暫存欄位

- `resolveMemberId`
  - 先用 `departmentId + memberName` 去應到名單找既有 member
  - 找不到時建立 `ad-hoc` member id
  - 這個 id 會影響重複簽到判斷

- `handleConfirmSignIn`
  - 前台簽到主流程
  - 驗證姓名、場次、簽到是否開放、代簽 / 補簽 / 更正原因是否完整
  - 以會議開始時間判斷 `on_time` 或 `late`
  - 阻擋同 memberId 的重複主紀錄
  - 更正時先把舊紀錄標 `voidedAt` / `voidReason`，再新增 replacement record
  - 補簽時若距離關閉超過 24 小時，標記 `isOverdueBackfill`

- `getDisplayStatusLabel`
  - 決定封面區塊顯示的是一般狀態、補簽或逾期補簽文案

## Current Flow Summary

1. 後台貼上應到名單
2. 系統先做預覽與驗證
3. 管理員確認 replace 或 append 後正式匯入
4. 管理員按下開始簽到
5. 前台封面開放一般簽到 / 代簽
6. 前台寫入 `records`
7. 管理員按下結束簽到
8. 前台切換成只允許補簽 / 更正
9. 後台查看摘要並匯出 CSV

## Discussion Hotspots

以下是目前最值得討論的幾個點：

- `signInOpenedAt` / `signInClosedAt` 放在 `AttendanceState` 全域層，而不是每個 `AttendanceSession` 自己管理
- `handleLockAndClone` 會順便凍結 roster，代表版本治理與簽到治理是耦合的
- `handleConfirmSignIn` 用「現在建立紀錄的時間」判斷準時 / 遲到，補簽與更正沒有獨立的實際到場時間欄位
- `resolveMemberId` 找不到名單時會建立 ad-hoc id，彈性高，但也會影響去重與後續稽核一致性
- roster 匯入已改成 preview-first；如果之後還要再優化，可以再升級成表格編輯 + 批次匯入混合模式
- 封面上的「已簽到 N 人」目前直接看 `records.length`，不等於 canonical active attendees

## Suggested Next Discussion Order

如果接下來要討論調整，我會建議照這個順序：

1. 先決定簽到狀態要不要改成 session-level
2. 再決定 roster freeze 要跟版本鎖定脫鉤還是維持綁定
3. 最後處理補簽 / 更正要不要加入「實際到場時間」與更嚴格的 operator metadata
