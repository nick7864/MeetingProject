## Why

目前會議呈現的結束頁已經需要使用 `src/assets/images/End.jpg` 作為收尾視覺，但若仍沿用一般卡片比例，封底看起來會比封面扁，無法形成一致的簡報開場 / 收尾節奏。這次變更除了套用背景圖，也需要讓結束頁主視覺比例與封面 hero 更接近。

## What Changes

- 將會議呈現的結束頁主視覺改為使用 `src/assets/images/End.jpg`。
- 明確規範 `End.jpg` 僅套用在 terminal end slide，不延伸到一般報告模式或共用 footer chrome。
- 將結束頁主視覺比例調整為參考封面 hero 的 16:9 呈現，避免封底畫面過扁。
- 保持結束頁既有 title、subtitle、supporting text 的可讀性，不因加入背景圖與比例調整而失去收尾資訊辨識。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `presentation-end-slide`: 調整 terminal end slide 的視覺規則，要求結束頁使用指定背景圖片並比照封面 hero 比例呈現。

## Impact

- Affected specs: `presentation-end-slide`
- Affected code: `src/components/PresentationPage/PresentationPage.tsx`, `src/components/PresentationPage/PresentationPage.test.tsx`, `src/assets/images/End.jpg`
