## Why

目前會議呈現頁的一般報表欄位標題層級太弱，字級與對比不足，投影閱讀時不容易快速掃到欄位結構。現在需要強化欄位標題辨識度，但又不能讓標題搶走內容主視覺，讓整體仍維持正式、穩定、和諧的會議閱讀感。

## What Changes

- 強化一般報表頁欄位標題的視覺層級，讓標題從弱 caption 提升為清楚的 section header。
- 第一版採用低調的左側色條型標題語言，但控制色條粗細、字級與對比，避免喧賓奪主。
- 一起調整標題與內容間距、欄位區塊節奏與字重，讓內容仍保持主視覺地位。
- 維持既有摘要/展開閱讀流程，不讓新標題設計破壞長文欄位的閱讀連續性。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `meeting-presentation-view`: 一般報表頁的欄位標題層級、區塊節奏與閱讀平衡需求將被調整。

## Impact

- Affected specs: `meeting-presentation-view`
- Affected code:
  - `src/components/PresentationPage/PresentationPage.tsx`
  - `src/styles/meetingSurface.ts`
  - `src/components/PresentationPage/PresentationPage.test.tsx`
- Affected systems: 會議呈現頁一般報表的資訊階層、投影閱讀體驗、摘要/展開欄位視覺節奏
