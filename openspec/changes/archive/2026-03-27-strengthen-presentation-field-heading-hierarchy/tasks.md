## 1. 欄位標題語言與節奏

- [x] 1.1 落地 **Decision: Use a low-contrast left-accent heading style for report fields**，在 `src/styles/meetingSurface.ts` 定義低調左側色條型的欄位標題樣式 token。
- [x] 1.2 完成 **Report field headings use a restrained left-accent visual language**，在 `src/components/PresentationPage/PresentationPage.tsx` 讓一般報表欄位標題一致套用 restrained left-accent 視覺語言。
- [x] 1.3 落地 **Decision: Strengthen heading hierarchy through proportion, not decoration**，同步調整標題字級、字重、對比與標題/內容間距，讓內容仍保持主視覺地位。

## 2. 長文欄位與閱讀平衡

- [x] 2.1 完成 **Report fields use stronger but balanced heading hierarchy in presentation mode**，讓一般報表頁的欄位標題比正文更易掃讀，但不壓過內容可讀性。
- [x] 2.2 落地 **Decision: Keep summary and expanded field flows visually continuous**，調整長文欄位摘要與展開狀態的標題節奏，避免切換時出現突兀視覺落差。
- [x] 2.3 完成 **Text content uses configurable summary lines with expansion**，驗證摘要/展開流程在新標題階層下仍保持一致的欄位辨識度與閱讀連續性。

## 3. 驗證與回歸

- [x] 3.1 在 `src/components/PresentationPage/PresentationPage.test.tsx` 補齊欄位標題層級、內容優先閱讀平衡、摘要/展開一致性與多欄位視覺語言一致性的測試。
- [x] 3.2 執行測試與 Spectra 驗證，確認一般報表頁標題層級改善沒有破壞封面、圖片頁與既有會議呈現流程。
