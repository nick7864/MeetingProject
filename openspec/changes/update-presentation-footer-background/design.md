## Context

`PresentationPage` 的 `mode === 'end'` 分支目前會渲染 `presentation-end-surface`，並在該 surface 內顯示結束頁 title、subtitle 與 optional supporting text。若只替換背景圖、維持一般卡片尺寸，結束頁會比封面 hero 扁很多，導致開場與收尾的視覺比例不一致。這次需求不是重做內容，而是讓結束頁在沿用 `End.jpg` 的同時，改成接近封面 `maxWidth: 1080px + aspectRatio: 16/9` 的 hero 呈現。

## Goals / Non-Goals

**Goals:**

- 讓 terminal end slide 使用 `src/assets/images/End.jpg`。
- 讓結束頁主視覺比例接近封面 hero，而不是沿用扁平卡片比例。
- 維持結束頁 title、subtitle 與 supporting text 的可讀性。

**Non-Goals:**

- 不重做封面內容結構或一般報告 slide。
- 不把 `End.jpg` 套用到共用 footer 或其他播放狀態。
- 不新增結束頁額外 metadata 或控制元件。

## Decisions

### Decision: Apply End.jpg to the end-slide presentation surface only

背景圖只套用在 `mode === 'end'` 分支中的 `presentation-end-surface`，不影響封面或一般報告模式。這讓改動邊界維持在 terminal end slide。

### Decision: Match the end-slide hero proportion to the cover presentation surface

結束頁主視覺改採與封面同類型的 hero 比例：`maxWidth: 1080px`、置中、`aspectRatio: 16/9`。這讓封面與封底形成一致的簡報首尾比例，而不是一個滿版 hero、一個扁平卡片。

替代方案是保留原本較矮的卡片並只增加 padding；但這仍無法解決整體比例失衡，因此不採用。

### Decision: Preserve end-slide copy readability over the decorative background

`End.jpg` 應被視為結束頁的裝飾背景層，title、subtitle 與 supporting text 維持在前景，透過遮罩、text shadow 與適度留白確保可讀性。

## Risks / Trade-offs

- [Risk] 改成 16:9 hero 後，結束頁在小螢幕上高度會提高。 → Mitigation：維持外層 responsive padding，讓內層 hero 自適應縮放。
- [Risk] 背景圖與文字若對比不足，結束頁資訊會變難讀。 → Mitigation：保留 overlay 與文字陰影。
- [Trade-off] 結束頁會比原先卡片更有存在感。 → Mitigation：把強視覺只限制在 terminal end slide，不擴散到其他模式。
