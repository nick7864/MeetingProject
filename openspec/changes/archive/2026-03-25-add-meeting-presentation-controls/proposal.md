## Why

目前系統以後台填報介面為主，直接在會議中展示會造成閱讀節奏不順、版面密度過高，且缺乏會議前凍結版本、會後補件與出席責任追溯的治理機制。第一階段需要先補齊「會議呈現 + 時間治理 + 出席留痕 + 填報內容約束」這四個核心能力，讓會議輸出可被一致呈現且可追蹤。

## What Changes

- 新增專屬「報告呈現頁面」路由與視圖，與後台填報工作台分離；呈現頁以唯讀方式流暢展示各部門與專案進度。
- 新增會議時間鎖定治理：支援設定會議鎖定時間，自動鎖定後禁止編輯；僅管理端可開啟外掛時間暫時解鎖，時間到自動回鎖。
- 新增電子會議簽到能力：會議前提供簽到入口，保存當次會議的部門與人員出席紀錄，並保留稽核軌跡。
- 新增欄位字數限制規則：對填報欄位套用最大字數約束（如 200 字），超過限制不可提交，避免過期或冗長內容影響會議版面。
- 維持現階段前端 mock state 架構，不引入後端依賴；先以規格化能力與一致資料模型落地。

## Capabilities

### New Capabilities

- `meeting-presentation-view`: 會議專用唯讀呈現模式，支援長頁面平滑瀏覽與內容密度可讀性。
- `meeting-lock-and-overtime-control`: 會議時間自動鎖定與外掛時間暫時解鎖控制，確保會議版次一致。
- `meeting-attendance-ledger`: 電子簽到與會議出席留痕，提供會議紀錄中的部門與人員追溯。
- `report-field-length-governance`: 報表欄位字數上限與輸入驗證規則，避免內容失控造成版面與閱讀負擔。

### Modified Capabilities

- (none)

## Impact

- Affected code:
  - `src/App.tsx`（新增呈現頁路由與導覽入口）
  - `src/components/ReportWorkspace/ReportWorkspace.tsx`（新增鎖定排程設定、外掛時間控制、欄位長度驗證入口）
  - `src/types/reportWorkspace.ts`（擴充會議鎖定、簽到、欄位治理相關型別）
  - `src/mock/reportWorkspaceData.ts`（擴充初始資料與 mock 流程）
  - `src/components/PresentationPage/*`（新建會議呈現頁模組）
- Affected systems: 前端路由、狀態模型、會議治理流程、會議紀錄與審計可追溯性。
- External dependencies: 無（第一階段不新增後端或第三方簽章服務）。
