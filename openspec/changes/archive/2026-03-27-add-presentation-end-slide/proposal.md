## Why

目前會議呈現在最後一頁後只會停住，沒有明確的投影片結束狀態，讓播放流程像是被截斷而不是自然收尾。現在需要補上一個 presentation-only 的結束頁，並讓結束頁文字像封面一樣可管理，讓會議播放流程更完整，同時不污染版本頁面資料。

## What Changes

- 新增會議呈現專用的結束頁流程，讓播放序列在最後一張內容頁後進入結束頁，而不是直接停在最後一頁。
- 明確規定結束頁屬於 presentation metadata，不屬於版本頁面資料，也不出現在工作台頁面管理中。
- 新增結束頁的文字管理設定，沿用封面式的 presentation 設定思路，支援主標題、副標題與可選補充文字。
- 讓工具列與鍵盤導航在最後一頁與結束頁之間維持一致行為，並提供清楚的回封面或重新開始流程。

## Capabilities

### New Capabilities

- `presentation-end-slide`: 管理會議呈現專用結束頁的顯示、播放流程與文字設定。

### Modified Capabilities

- `meeting-presentation-view`: 會議呈現的播放導航與 presentation metadata 需求將延伸到結束頁流程。

## Impact

- Affected specs: `presentation-end-slide`, `meeting-presentation-view`
- Affected code:
  - `src/types/reportWorkspace.ts`
  - `src/mock/reportWorkspaceData.ts`
  - `src/components/PresentationPage/PresentationPage.tsx`
  - `src/components/PresentationPage/PresentationPage.test.tsx`
  - `src/components/ReportWorkspace/ReportWorkspace.tsx`
- Affected systems: 會議呈現投影片導航、presentation 設定資料、封面/結束頁 metadata 管理
