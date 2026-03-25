## 1. 路由與呈現頁骨架

- [x] 1.1 實作 **Decision: Separate presentation route from editing workspace**，在 `src/App.tsx` 新增會議呈現路由與導覽入口。
- [x] 1.2 建立 `PresentationPage` 並落地 **Dedicated meeting presentation route**，確保頁面為唯讀且不暴露編輯控件。
- [x] 1.3 完成 **Admin-only backend management tab visibility**，僅管理員可見後台管理 tab。
- [x] 1.4 完成 **Backend management tab uses capability sub-tabs**，以呈現/鎖定與外掛/簽到/字數治理四個子 tab 組織設定。
- [x] 1.5 完成 **Presentation binds to latest locked version**，預設載入最新鎖定版並處理無鎖定版阻擋狀態。
- [x] 1.6 完成 **Continuous department-first scroll presentation**，以部門為主軸、部門內維持 page 原始順序。
- [x] 1.7 完成 **Department tab navigation uses in-page smooth scroll**，部門 tabs 僅做頁內跳轉不切頁。
- [x] 1.8 完成 **Presentation toolbar supports meeting controls**，提供專案/版本/鎖定狀態、部門 tabs、全螢幕、字級切換。
- [x] 1.9 完成 **Cover page metadata is managed from admin workspace**，封面欄位由後台會議資料管理並限制欄位集合。
- [x] 1.10 完成 **Cover blocks entry when required metadata is missing**，缺必要欄位時阻擋進入正文。
- [x] 1.11 完成 **Cover starts report body by manual action**，封面必須手動按開始報告。
- [x] 1.12 完成 **Cover includes attendee sign-in call-to-action**，封面提供會議成員可見的簽到入口。
- [x] 1.13 完成 **Presenter can return to cover from report body**，正文工具列可回封面。
- [x] 1.14 完成 **Fullscreen mode auto-hides toolbar**，滑到上方才顯示工具列。
- [x] 1.15 完成 **Font-size toggle supports normal and large modes**，僅提供一般/大字兩段。
- [x] 1.16 完成 **Text content uses configurable summary lines with expansion**，摘要行數改讀全域設定且支援展開全文。
- [x] 1.17 完成 **Department image preview and lightbox behavior**，每段先顯示 4 張並支援看全部進 lightbox。
- [x] 1.18 完成 **Lightbox shows image notes by default**，預設顯示圖片備註。
- [x] 1.19 完成 **Presentation respects selected version snapshot**，維持會議中快照穩定性。
- [x] 1.20 完成 **Presentation layout targets desktop and projector first**，優先桌機與投影會議可讀性。
- [x] 1.21 完成 **Footer remains fixed with minimal context fields**，頁底固定顯示部門/章節/版本/鎖定狀態。
- [x] 1.22 完成 **Footer excludes page count and clock**，頁底不顯示頁碼與時間。
- [x] 1.23 完成 **Cover uses minimalist presentation style**，封面不含 logo、出席統計與自由備註。
- [x] 1.24 完成 **Unified UI and interaction style across meeting surfaces**，統一 workspace、後台子 tab、呈現頁的字體階層、間距節奏、狀態色與互動回饋。

## 2. 鎖定與外掛時間治理

- [x] 2.1 實作 **Decision: Use a lock state model with scheduled lock and overtime window**，擴充 `WorkspaceVersion` 型別與狀態欄位。
- [x] 2.2 完成 **Project-level one-time lock datetime with timezone**，支援每專案一次性 `lockAt` 日期時間與時區語意。
- [x] 2.3 完成 **Scheduled auto-lock triggers on or after lockAt**，在 `now >= lockAt` 觸發鎖定流程。
- [x] 2.4 完成 **Auto-lock targets latest editable version only**，僅鎖最新可編輯版本並忽略已鎖歷史版本。
- [x] 2.5 完成 **Auto-lock uses lock-and-clone behavior**，自動鎖定後建立下一個可編輯版本。
- [x] 2.6 完成 **Overtime unlock with explicit expiration**，提供管理端外掛時間並在到期自動回鎖。
- [x] 2.7 完成 **Overtime unlock reason is mandatory**，未填原因不可開啟外掛。
- [x] 2.8 完成 **Overtime duration uses governed presets**，提供 5/10/15/30 分鐘且預設 15 分鐘。
- [x] 2.9 完成 **Overtime preserves existing role permissions**，外掛期間維持既有角色權限邊界。
- [x] 2.10 完成 **Overtime expiration relocks immediately**，到期立即回鎖且不提供緩衝。
- [x] 2.11 完成 **Lock and overtime actions are auditable**，紀錄操作者、時間、原因與到期資訊。

## 3. 電子簽到與可追溯紀錄

- [x] 3.1 實作 **Decision: Keep attendance as append-only meeting ledger**，新增會議簽到 ledger 資料結構。
- [x] 3.2 完成 **Session-based attendance model**，建立每場會議的應到名單與實到紀錄雙軌模型。
- [x] 3.3 完成 **Admin-only expected roster management before lock**，限制應到名單僅管理員可編輯。
- [x] 3.4 完成 **Expected roster freezes at lock time**，會議鎖定後凍結應到名單。
- [x] 3.5 完成 **Electronic sign-in before meeting**，支援場次簽到流程。
- [x] 3.6 完成 **Presentation cover provides attendee sign-in entry point**，讓會議成員可在封面直接發起簽到。
- [x] 3.7 完成 **Cover sign-in entry reflects sign-in state**，結束前顯示一般簽到、結束後僅提供補簽/更正入口。
- [x] 3.8 完成 **Manual sign-in mode for first release**，以姓名/部門/確認流程落地 V1。
- [x] 3.9 完成 **Admin controls sign-in open and close**，僅管理員可按開始/結束簽到。
- [x] 3.10 完成 **Normal sign-in remains open until admin closes it**，未手動結束前維持一般簽到開啟。
- [x] 3.11 完成 **Closed sign-in cannot be reopened**，結束後不可重開一般簽到。
- [x] 3.12 完成 **No automatic fallback close**，管理員未按結束時系統不自動關閉。
- [x] 3.13 完成 **Late status is determined by meeting start**，開始後到結束前簽到標記遲到。
- [x] 3.14 完成 **Pre-start sign-in is classified as on-time**，會前簽到視為準時。
- [x] 3.15 完成 **Attendance record contains accountable identity fields**，確保部門、人員、時間與操作者欄位齊備。
- [x] 3.16 完成 **Proxy sign-in requires proxy actor and reason**，代簽需填代簽者與原因。
- [x] 3.17 完成 **No duplicate primary attendance per person per session**，同人同場限制唯一主紀錄。
- [x] 3.18 完成 **Corrections require void-and-replace with reason**，更正走作廢重建且原因必填。
- [x] 3.19 完成 **Attendance ledger is append-only with correction trace**，以作廢/補簽取代硬刪除。
- [x] 3.20 完成 **Backfill sign-in is allowed with audit metadata**，結束簽到後補簽需保留原因與操作者。
- [x] 3.21 完成 **Backfill beyond 24 hours is marked overdue**，超過 24 小時標記為逾期補簽。
- [x] 3.22 完成 **Attendance result locks at sign-in close**，按下結束簽到即定稿出席結果。
- [x] 3.23 完成 **Attendance report groups on-time, late, and absent**，三區塊呈現出席狀態。
- [x] 3.24 完成 **Export attendance result as CSV**，提供會議簽到匯出。

## 4. 欄位字數治理與提交驗證

- [x] 4.1 實作 **Decision: Enforce field limits at input boundary and preserve full rendering intent**，建立集中式欄位長度 policy。
- [x] 4.2 完成 **Configurable maximum character limits per report field**，輸入超限即阻擋。
- [x] 4.3 完成 **Admin-managed limits with bounded range**，限制後台調整上限介於 50～1000。
- [x] 4.4 完成 **Default field limit profile is provided**，定義並載入預設欄位上限設定。
- [x] 4.5 完成 **Real-time character count feedback**，在填報欄位顯示即時計數。
- [x] 4.6 完成 **Near-limit warning begins at 80 percent**，達到 80% 時顯示警示樣式。
- [x] 4.7 完成 **Over-limit paste is truncated with notice**，貼上超長內容自動截斷並提示。
- [x] 4.8 完成 **Character counting includes spaces and newlines**，空白與換行納入字數統計。
- [x] 4.9 完成 **Publish and lock require compliant field lengths**，鎖定/發布前檢查並回報違規欄位。
- [x] 4.10 完成 **Legacy over-limit content is never silently mutated**，舊資料不靜默改寫，於編輯/鎖定流程要求修正。

## 5. 驗證與回歸檢查

- [x] 5.1 建立 spec-to-test traceability 清單，確保四大 capability（呈現頁/鎖定外掛/簽到/字數治理）每條 requirement 至少覆蓋 1 個正向與 1 個反向案例。
- [x] 5.2 補齊呈現頁驗證：封面欄位完整與缺漏阻擋、開始報告/回封面、頁底固定欄位、全螢幕工具列自動隱藏與恢復。
- [x] 5.3 補齊後台管理驗證：管理員可見後台管理 tab 與四個子 tab、部門使用者不可見、跨子 tab 設定狀態一致。
- [x] 5.4 補齊鎖定與外掛驗證：`lockAt` 觸發、僅鎖最新可編輯版、auto lock-and-clone、外掛原因必填、到期立即回鎖。
- [x] 5.5 補齊簽到時序驗證：會前簽到為準時、開始後簽到為遲到、結束後僅補簽/更正、不可重開一般簽到。
- [x] 5.6 補齊簽到稽核驗證：代簽必填代簽者與原因、同人同場不可重複主紀錄、作廢重建更正鏈、逾期補簽標記、CSV 匯出正確性。
- [x] 5.7 補齊字數治理驗證：每欄位上限、80% 警示、超長貼上截斷提示、空白換行計字、鎖定前全欄位合規檢查、舊資料超限修正流程。
- [x] 5.8 補齊角色矩陣驗證：管理員與部門使用者在會前/會中/會後各關鍵動作的允許與拒絕結果。
- [x] 5.9 執行型別檢查、測試與建置，並附對照證據回填至 traceability 清單，確認既有工作台流程未被回歸破壞。
