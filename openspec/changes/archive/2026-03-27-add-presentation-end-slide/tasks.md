## 1. Presentation metadata 與終點流程

- [x] 1.1 落地 **Decision: Manage end-slide copy alongside cover metadata**，在 `src/types/reportWorkspace.ts` 與 `src/mock/reportWorkspaceData.ts` 定義結束頁 metadata，支援 title、subtitle 與 optional supporting text。
- [x] 1.2 完成 **End slide copy is managed through presentation settings**，在 `src/components/ReportWorkspace/ReportWorkspace.tsx` 提供結束頁文字設定，並讓其管理方式與封面設定保持同一家族邏輯。
- [x] 1.3 完成 **End slide is not part of version page data**，確認結束頁不進入 `versions.pages`、不出現在工作台頁面管理、也不影響版本頁面資料結構。

## 2. 會議呈現導航與結束頁

- [x] 2.1 落地 **Decision: Model the ending screen as presentation-only terminal slide state**，在 `src/components/PresentationPage/PresentationPage.tsx` 新增 presentation-only terminal slide state，而不是新增真實頁面。
- [x] 2.2 完成 **Presentation includes a terminal end slide after the last content slide**，讓最後一張內容頁後可進入結束頁。
- [x] 2.3 完成 **Meeting presentation navigation reaches a managed ending state**，讓 `下一張` 按鈕與右方向鍵在最後一頁後導向結束頁。
- [x] 2.4 完成 **Dedicated meeting presentation route**，讓 presentation route 在不改動版本頁面的前提下支援 cover、content、ending 等 presentation-only flow states。
- [x] 2.5 落地 **Decision: Keep navigation rules symmetrical around the terminal slide**，讓結束頁支援回前一張內容頁、回封面或重新開始等對稱導航操作。

## 3. 驗證與回歸

- [x] 3.1 在 `src/components/PresentationPage/PresentationPage.test.tsx` 補齊最後一頁進入結束頁、鍵盤導航進入結束頁、結束頁回前一頁/回封面/重新開始與結束頁文案顯示的測試。
- [x] 3.2 執行測試與 Spectra 驗證，確認結束頁流程沒有破壞既有封面、內容頁切換與投影片導覽行為。
