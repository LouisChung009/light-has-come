# 資料庫遷移進度說明

> 最後更新：2025-12-16 17:09

## 📋 遷移目標

將資料庫從 **Supabase** 遷移到 **Neon**，圖片儲存從 Supabase Storage 遷移到 **Cloudflare R2**。

---

## ✅ 已完成

### 1. Neon 資料庫設定
- [x] 建立 Neon 資料庫 (`neondb`)
- [x] 建立所有資料表：`albums`, `photos`, `album_categories`, `registrations`, `site_content`, `banner_slides`
- [x] 匯入資料：
  - `albums`: 31 筆
  - `photos`: 10 筆（Supabase 有更多，尚未完全匯入）
  - `album_categories`: 5 筆
  - `site_content`: 全部匯入
  - `banner_slides`: 2 筆

### 2. 程式碼遷移
- [x] 建立 `utils/db.ts` - Neon 資料庫連線和類型定義
- [x] 更新前台頁面使用 Neon：
  - `app/page.tsx` (首頁)
  - `app/about/page.tsx` (關於我們)
  - `app/courses/page.tsx` (課程介紹)
  - `app/gallery/page.tsx` (相簿列表)
  - `app/gallery/[id]/page.tsx` (相簿詳細)
  - `app/components/Footer.tsx` (頁尾)
  - `app/components/HeroBanner.tsx` (首頁輪播)
- [x] 更新 API 路由：
  - `app/api/banner/route.ts` - 新增 GET 方法，POST 改用 R2
  - `app/api/debug-db/route.ts` - 測試用 API

### 3. Cloudflare R2 設定
- [x] Banner 圖片已遷移到 R2
- [x] 相簿照片 URL 已指向 R2

---

## ❌ 待完成

### 1. Vercel 環境變數問題（最重要！）
**問題**：Vercel 上的 `DATABASE_URL` 環境變數似乎沒有正確運作，導致網站無法讀取資料庫。

**解決方案**：使用 Vercel 的 Neon 整合
1. 打開 https://vercel.com/dashboard
2. 選擇 **light-has-come** 專案
3. 進入 **Settings** → **Environment Variables**
4. 刪除現有的 `DATABASE_URL`
5. 點擊 **Storage** 標籤 → **Connect Store** → 選擇 **Neon**
6. 連接現有的 Neon 資料庫
7. 重新部署

### 2. 照片資料匯入
Supabase 的 `photos` 表有數百筆資料，目前只匯入了 10 筆到 Neon。

**匯入方法**：
在 Supabase SQL Editor 執行：
```sql
SELECT * FROM photos;
```
然後複製 JSON 結果，轉換為 INSERT 語句匯入 Neon。

### 3. 後台管理頁面遷移
以下後台頁面仍在使用 Supabase，需要更新為 Neon：
- `app/admin/content/` - 內容編輯
- `app/admin/banner/` - 橫幅管理
- `app/admin/announcement/` - 公告管理
- `app/admin/dashboard/` - 儀表板
- `app/register/RegisterForm.tsx` - 報名表單

### 4. 清理工作
- [ ] 移除 debug 訊息（`app/gallery/page.tsx` 的藍色 DEBUG 區塊）
- [ ] 移除 `app/api/debug-db/route.ts`
- [ ] 確認所有功能正常後，可考慮移除 Supabase 相關程式碼

---

## 🔑 重要資訊

### Neon 資料庫連線字串
```
postgresql://neondb_owner:您的密碼@ep-noisy-meadow-a1xsli8h-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### Cloudflare R2 公開 URL
```
https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/
```

### 相關檔案
- `utils/db.ts` - Neon 資料庫連線
- `utils/storage/external.ts` - R2 儲存操作
- `scripts/migrate-banners-to-r2.ts` - Banner 遷移腳本

---

## 📝 測試網址

- 首頁：https://light-has-come.vercel.app/
- 相簿：https://light-has-come.vercel.app/gallery
- 資料庫測試 API：https://light-has-come.vercel.app/api/debug-db
