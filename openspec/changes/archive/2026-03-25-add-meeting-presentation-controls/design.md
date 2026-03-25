## Context

目前系統僅有 `ReportWorkspacePage`，同時承擔後台填報與展示需求，造成會議情境下閱讀節奏、視覺密度與操作安全性都不理想。現有版本治理僅支援手動「鎖定並複製下一版」，尚未具備依會議時間自動鎖定、外掛時間暫時解鎖與出席留痕能力。專案為前端 mock state 架構，第一階段須在不引入後端的前提下，先建立完整且可驗證的產品行為骨架。

## Goals / Non-Goals

**Goals:**

- 將「後台編修」與「會議呈現」在路由與互動上明確分離，避免會議場景誤操作。
- 建立可預期的會議時間治理流程：到點自動鎖定、管理端可開外掛、到時回鎖。
- 建立可追溯的電子簽到紀錄模型，讓會議參與責任可回查。
- 對報表欄位建立統一字數限制政策，降低冗長內容破壞排版可讀性。

**Non-Goals:**

- 不在第一階段導入後端 API、身份驗證服務或法律等級電子簽章。
- 不處理多使用者即時協作衝突（如跨裝置同時編輯競態）。
- 不重構整體 UI 設計系統，只新增必要頁面與治理面板。

## Decisions

### Decision: Separate presentation route from editing workspace

以新路由承載會議呈現頁，採唯讀模式，與既有工作台共用同一份資料來源。此作法能在最小改動下清楚切出兩種使用情境，避免將後台控件直接暴露於會議畫面。

替代方案是沿用同頁切換「簡報模式」tab；但此作法容易殘留管理操作元件，且 URL 不利於會議時直接進入指定畫面，因此不採用。

### Decision: Use a lock state model with scheduled lock and overtime window

在版本資料上擴充 `scheduledLockAt`、`lockedAt`、`lockType`、`overtimeUnlockUntil` 等欄位，並維持 `isLocked` 作為核心編輯守門。編輯權限判斷改為「已鎖定但仍在外掛時間內」可暫時編修，時間到自動回鎖。

替代方案是僅加一個 `isOvertimeUnlocked` 布林值；但缺乏時間邊界與稽核資訊，無法滿足治理需求，因此不採用。

### Decision: Keep attendance as append-only meeting ledger

簽到資料採附加式紀錄（append-only），若需更正以作廢/補簽方式處理，不做硬刪除。此設計在前端原型階段即可最大化可追溯性，符合「避免事後推託不知情」目標。

替代方案是只保留當前名單快照；但會遺失歷程，無法稽核誰何時簽到，因此不採用。

### Decision: Enforce field limits at input boundary and preserve full rendering intent

欄位字數上限由統一 policy 管理，輸入時即阻擋超限內容，並提供計數提示。呈現頁可做視覺折疊，但不得靜默修改已儲存內容。此決策可同時保障資料品質與會議可讀性。

替代方案是送出前才驗證；但使用者體驗較差且容易反覆退件，因此不採用。

## Risks / Trade-offs

- [Risk] 前端本地時間可能與真實會議時間有偏差，造成鎖定時點誤差。 → Mitigation：在介面明示目前判定時間與鎖定倒數，後續後端化時改用伺服器時間。
- [Risk] 外掛時間被頻繁開啟可能弱化鎖定治理。 → Mitigation：要求填寫開啟原因、期限，並記錄在稽核事件中。
- [Risk] 簽到紀錄目前仍屬前端自證，法律效力有限。 → Mitigation：在第一階段標註為「系統簽到紀錄（原型）」並預留後端簽章欄位。
- [Trade-off] 拆分新路由會增加一個頁面維護成本。 → Mitigation：共用資料模型與選擇器，減少邏輯重複。
