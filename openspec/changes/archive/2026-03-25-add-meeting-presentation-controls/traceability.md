# Spec-to-Test Traceability

Change: `add-meeting-presentation-controls`

## Capability Coverage Matrix

| Capability | Requirement focus | Positive case(s) | Negative case(s) |
| --- | --- | --- | --- |
| 呈現頁 | 封面欄位完整才可開始、可回封面、頁底最小資訊、全螢幕工具列隱藏/恢復 | `PresentationPage.test.tsx` - `shows cover sign-in entry and return-to-cover flow`; `keeps a fixed footer with minimal context fields only` | `PresentationPage.test.tsx` - `blocks report start when cover metadata is incomplete`; `blocks content when no locked version exists` |
| 後台管理 | 管理員可見後台與四個子 tab、跨 tab 設定一致 | `ReportWorkspace.test.tsx` - `shows backend management tab for admin`; `shows management sub-tabs when backend management is selected`; `keeps state consistent when switching across backend sub-tabs` | `ReportWorkspace.test.tsx` - `hides backend management tab for department user` |
| 鎖定與外掛 | lockAt 觸發鎖定/複製、外掛原因必填、到期回鎖 | `ReportWorkspace.test.tsx` - `auto-locks latest editable version at or after lockAt and clones next editable version`; `relocks immediately when overtime expires` | `ReportWorkspace.test.tsx` - `requires overtime reason and defaults duration to 15 minutes`; `blocks lock when any report field remains over configured limits` |
| 電子簽到 | 會前準時、會中遲到、關閉後僅補簽/更正、不可重開一般簽到 | `PresentationPage.test.tsx` - `supports manual sign-in from cover during active sign-in period`; `marks sign-in as late when timestamp is after meeting start`; `limits closed sign-in dialog modes to correction and backfill only` | `ReportWorkspace.test.tsx` - `allows admin to open and close sign-in, then disallows reopening normal sign-in`; `freezes roster editing once sign-in is closed` |
| 簽到稽核 | 代簽必填、去重、更正作廢重建、逾期補簽、CSV 匯出正確 | `PresentationPage.test.tsx` - `requires proxy actor and reason for proxy sign-in`; `allows backfill after close and marks overdue when beyond 24 hours`; `prevents duplicate primary sign-in and supports void-and-replace correction`; `allows same-name attendees from different departments without duplicate conflict`; `ReportWorkspace.test.tsx` - `exports canonicalized attendance summary as CSV after sign-in closes` | `PresentationPage.test.tsx` - `requires proxy actor and reason for proxy sign-in` (未填資料拒絕); `prevents duplicate primary sign-in and supports void-and-replace correction` (重複主紀錄拒絕) |
| 字數治理 | 每欄位上限、80%警示、超限截斷、空白換行計字、鎖定前合規、舊資料不靜默改寫 | `ReportWorkspace.test.tsx` - `shows default field limits and clamps admin updates between 50 and 1000`; `shows real-time count and warning style when reaching 80 percent`; `truncates over-limit paste with notice while counting spaces and newlines` | `ReportWorkspace.test.tsx` - `blocks lock when any report field remains over configured limits`; `does not silently mutate legacy over-limit content and requires manual reduction` |
| 角色矩陣 | 管理員/部門使用者在會前/會中/會後允許與拒絕 | `ReportWorkspace.test.tsx` - `enforces role matrix across pre-meeting, in-meeting, and post-meeting states` | `ReportWorkspace.test.tsx` - `enforces role matrix across pre-meeting, in-meeting, and post-meeting states` (部門使用者後台動作拒絕、會後唯讀) |

## Verification Evidence

- Type check + build: `npm run build` (includes `tsc && vite build`) passed.
- Full tests: `npm test -- --run` passed with `49 passed`.
- Regression targets added in this round:
  - roster freeze after sign-in close
  - legacy over-limit manual-reduction-only behavior
  - duplicate active attendance canonicalization for summary/CSV
  - presentation footer minimal context
  - closed sign-in mode restrictions
  - backend sub-tab state consistency
  - role matrix pre/in/post meeting
