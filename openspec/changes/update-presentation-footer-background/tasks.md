## 1. 結束頁背景與比例

- [ ] 1.1 在 `src/components/PresentationPage/PresentationPage.tsx` 落地 `Decision: Apply End.jpg to the end-slide presentation surface only`，讓 `Presentation includes a terminal end slide after the last content slide` 的 ending screen 使用 `src/assets/images/End.jpg`。
- [ ] 1.2 在 `src/components/PresentationPage/PresentationPage.tsx` 落地 `Decision: Match the end-slide hero proportion to the cover presentation surface`，完成 `End slide copy is managed through presentation settings` 所要求的 cover-like 16:9 hero 比例。
- [ ] 1.3 在 `src/components/PresentationPage/PresentationPage.tsx` 落地 `Decision: Preserve end-slide copy readability over the decorative background`，確保標題、副標與 supporting text 在 `End.jpg` 上仍清楚可讀。

## 2. 驗證與回歸

- [ ] 2.1 更新 `src/components/PresentationPage/PresentationPage.test.tsx`，覆蓋 `Presentation includes a terminal end slide after the last content slide` 與 `End slide copy is managed through presentation settings` 在結束頁套用 `End.jpg` 且使用 16:9 hero 比例的行為。
- [ ] 2.2 執行測試與 Spectra 驗證，確認結束頁加入 `src/assets/images/End.jpg` 並調整為 cover-like hero proportion 後，不影響既有 slide 導覽與結束頁顯示流程。
