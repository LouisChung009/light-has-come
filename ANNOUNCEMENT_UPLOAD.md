# 公告彈窗上傳說明（給維運/AI）

## 後台位置
- 路徑：`/admin/announcement`
- 設定項目：啟用彈窗、海報圖片、報名按鈕開關/文字/URL、Storage Key。

## 海報上傳方式
- 介面元件：PosterUploader（與相簿上傳類似）。
- 操作：點擊或拖拉圖片到「海報圖片」框，即可選檔上傳。
- 儲存位置：Supabase Storage `gallery` bucket。
- 成功後：自動取得 Public URL 並填入表單的 `imageUrl` 欄位，前台彈窗即使用此圖。

## 報名按鈕與連結
- 可勾選「顯示立即報名按鈕」，並填寫按鈕文字與 URL（可用站內路徑或完整網址）。

## 「今日不再顯示」行為
- 前台彈窗每次進首頁會顯示。
- 使用者勾選「今日不再顯示」後，會在 localStorage 以 `Storage Key + 今日日期` 記錄；當天不再顯示，隔天會重新顯示。
- 若要強制所有訪客再次看到彈窗，可在後台更換 Storage Key 後儲存。
