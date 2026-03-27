## Context

目前會議呈現頁只會根據鎖定版本的頁面組出播放序列，最後一張內容頁之後沒有終點狀態，導致簡報流程只是停住而非自然收尾。同時，封面資訊已經有一套 presentation metadata，可由管理端設定會議日期與版本資訊；因此若要新增結束頁，最合理的邊界不是在版本頁面資料中塞一張真正的頁面，而是在 presentation 層增加一個只屬於播放流程的終點頁，並沿用 metadata 管理思路提供文案設定。

## Goals / Non-Goals

**Goals:**

- 讓會議呈現在最後一張內容頁後進入明確的結束頁，而不是單純停在最後一頁。
- 讓結束頁文字可管理，並與封面設定使用同一家族的 presentation metadata 思路。
- 保持結束頁與版本頁面資料分離，不讓工作台頁面管理、版本鎖定資料與頁數被污染。
- 讓工具列按鈕、鍵盤導航與回封面/重新開始流程在結束頁維持一致體驗。

**Non-Goals:**

- 這次不在 `versions.pages` 中新增真正的結束頁，也不讓頁面管理可編輯這張頁。
- 這次不重做整個會議路由或封面視覺，只補齊結束狀態與其文字管理。
- 這次不把結束頁當成一般報表頁或純圖片頁的第三種頁型。

## Decisions

### Decision: Model the ending screen as presentation-only terminal slide state

結束頁只存在於 `PresentationPage` 的播放流程中，作為最後一張內容頁之後的 terminal slide state，而不是寫入版本頁面資料。這樣可保持版本資料乾淨，也不會讓工作台頁面管理多出一張不屬於內容製作的虛假頁面。

替代方案是在版本中新增一張真實頁面；但那會污染版本頁數與頁面管理心智模型，因此不採用。

### Decision: Manage end-slide copy alongside cover metadata

結束頁文案與封面同樣屬於 presentation metadata，採用可管理的主標題、副標題與可選補充文字，而不是把內容寫死在呈現元件中。這樣能讓不同會議維持一致設定方式，也讓封面與結束頁形成完整的會議開場/收場對應。

替代方案是將結束文案硬編碼在 `PresentationPage`；但這會限制不同會議的結尾表達，且與封面管理方式不一致，因此不採用。

### Decision: Keep navigation rules symmetrical around the terminal slide

當播放到最後一張內容頁後，`下一張` 與右方向鍵都應進入結束頁；而在結束頁上，使用者應能回前一張內容頁、回封面或重新開始。這樣能維持播放流程的可預測性，也避免結束頁變成單向死路。

替代方案是到最後一頁後直接回封面；但這會讓簡報像重新開始而不是結束，因此不採用。

## Risks / Trade-offs

- [Risk] 結束頁若被算進正式頁碼，會讓使用者誤認版本多了一頁。 → Mitigation：明確定義其為 terminal slide state，不列入版本頁面管理與正式頁碼心智模型。
- [Risk] metadata 新增欄位後，封面/結束頁設定區若設計不好可能變得混亂。 → Mitigation：沿用封面設定分組，將結束頁設定視為同一 presentation 區塊下的平行子區塊。
- [Trade-off] 新增終點頁會增加一個播放節點。 → Mitigation：保持文案精簡、操作清楚，讓它像自然收尾而非額外負擔。
