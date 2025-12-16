# 相簿照片搬移到外部空間（給維運/AI）

Supabase Free Plan Storage 只有 1GB；相簿照片量大時建議把「相簿照片」搬到更大的 S3 相容免費空間，Supabase 只保留資料庫與少量後台小圖。

本專案已支援：
- **外部 S3 相容 Bucket（例如 Cloudflare R2、Backblaze B2、Wasabi、AWS S3 等）**
- 後台/批次上傳若偵測到外部設定，會**優先上傳到外部空間**；否則回退用 Supabase Storage。
- 提供搬移腳本 `scripts/migrate-to-external.ts`（會更新 `photos.src` / `albums.cover_photo_url`）。

---

## 1) 建議的免費空間選項

### A. Cloudflare R2（推薦）
- 優點：S3 相容、**10GB 免費儲存**、無 egress 費、速度穩定，可綁自訂網域做 CDN。
- 注意：通常需要綁信用卡/付款方式才能開 R2。

### B. Backblaze B2
- 優點：S3 相容、**10GB 免費儲存**，穩定性佳。
- 注意：免費下載/請求量有上限，超過可能收費。

兩者皆可用以下同一套設定與腳本。

---

## 2) 需要設定的環境變數

在 `.env.local`（本機）與 Vercel 專案環境變數都要設定：

```
EXTERNAL_S3_ENDPOINT=你的 S3/R2/B2 endpoint
EXTERNAL_S3_REGION=auto 或你的 region
EXTERNAL_S3_BUCKET=bucket 名稱
EXTERNAL_S3_ACCESS_KEY_ID=access key
EXTERNAL_S3_SECRET_ACCESS_KEY=secret

# 外部 Bucket 對外公開的 base URL（務必可直接瀏覽圖片）
# 例如： https://static.example.com 或 R2 Public Bucket URL
EXTERNAL_PUBLIC_BASE_URL=https://你的公開網域

# （可選）如果想把所有物件放在子資料夾
EXTERNAL_S3_PREFIX=gallery
```

### Endpoint 範例
- **R2**：`https://<accountid>.r2.cloudflarestorage.com`
- **B2**：`https://s3.<region>.backblazeb2.com`

---

## 3) 搬移舊相簿照片

1. 先確認外部空間可正常上傳（環境變數都填好）。
2. **試跑**（只搬 10 張）：  
   `npx tsx scripts/migrate-to-external.ts --dry-run --limit=10`
3. **正式搬移（不刪 Supabase）**：  
   `npx tsx scripts/migrate-to-external.ts`
   - 會把 Supabase `gallery` bucket 的照片上傳到外部空間  
   - 更新 `photos.src` 為新 URL  
   - 更新 `albums.cover_photo_url` 為新 URL  
   - 會在專案根目錄產生 `migrate-log.jsonl`（記錄舊 key）
4. 到前台 `/gallery` 隨機抽查相簿是否正常顯示。
5. 確認沒問題後，**清掉 Supabase 舊檔**：  
   `npx tsx scripts/migrate-to-external.ts --delete-from-log=migrate-log.jsonl`

> 若搬移中斷，可直接重跑第 3 步；已搬過的 `photos.src` 會被跳過。

### 3.1) 搬移完成後續工作（重要）

當終端出現類似：
```
🎉 Migration finished.
- Photos migrated: xxxx
- Photos skipped: xxx
- Errors: xx
- Album covers updated: xx
- Log written: migrate-log.jsonl
⚠️ Supabase files were NOT deleted.
```
表示「已搬到外部空間，但 Supabase 舊檔還沒刪」。接下來請照順序收尾：

1. **前台驗證**
   - 打開 `/gallery`、`/gallery/[id]` 隨機看幾本相簿與照片是否正常載入。
   - 右鍵開新分頁看圖片網址應該是 `EXTERNAL_PUBLIC_BASE_URL` 的網域，不是 `supabase.co/storage/...`。
2. **補搬失敗照片（可選但建議）**
   - 再跑一次：`npx tsx scripts/migrate-to-external.ts`
   - 只會嘗試還留在 Supabase 的少數照片。
3. **清理 Supabase 舊檔**
   - `npx tsx scripts/migrate-to-external.ts --delete-from-log=migrate-log.jsonl`
   - 會依照 log 刪除已搬走的 Supabase 物件，釋放容量。
4. **換電腦繼續操作**
   - 請把 `migrate-log.jsonl` 一起帶到新電腦專案根目錄（檔名不要改）。
   - 沒有這個 log 就無法安全自動刪除 Supabase 舊檔。

---

## 4) 之後每週的新照片上傳

只要外部環境變數存在：
- 後台「單張上傳 / ZIP 批次匯入」會自動走外部 Bucket。
- 本機批次：`npx tsx scripts/batch-upload.ts` 也會走外部 Bucket。
- 腳本仍會先做人臉偵測，**跳過正臉特寫**（避免肖像權）。

若未設定外部變數，則會回到 Supabase Storage。
