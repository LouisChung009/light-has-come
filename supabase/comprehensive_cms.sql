-- 刪除舊的 site_content 表（如果存在）
drop table if exists public.site_content cascade;
drop table if exists public.banner_slides cascade;

-- 1. 建立網站內容管理表
create table public.site_content (
  id text not null primary key,
  category text not null,
  section text, -- 區塊名稱，例如: hero, values, courses
  label text not null,
  content text not null,
  content_type text not null default 'text',
  display_order integer default 0,
  updated_at timestamp with time zone default now()
);

-- 2. 建立 Banner 輪播表
create table public.banner_slides (
  id uuid not null default gen_random_uuid() primary key,
  title text,
  subtitle text,
  media_url text not null, -- 照片或影片的 URL
  media_type text not null, -- 'image' or 'video'
  link_url text, -- 可選的連結
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 開啟 RLS
alter table public.site_content enable row level security;
alter table public.banner_slides enable row level security;

-- RLS 政策: 任何人都可以讀取，只有管理員可以修改
create policy "Anyone can view site content"
on public.site_content for select
to anon, authenticated
using (true);

create policy "Admins can manage site content"
on public.site_content for all
to authenticated
using (true);

create policy "Anyone can view banner slides"
on public.banner_slides for select
to anon, authenticated
using (is_active = true);

create policy "Admins can manage banner slides"
on public.banner_slides for all
to authenticated
using (true);

-- 插入完整的網站內容
insert into public.site_content (id, category, section, label, content, content_type, display_order) values
-- 首頁 Hero 區塊
('home_hero_title', 'home', 'hero', '首頁主標題', '讓孩子在愛中成長', 'text', 1),
('home_hero_subtitle', 'home', 'hero', '首頁副標題', '大里思恩堂兒童主日學歡迎您', 'text', 2),
('home_hero_description', 'home', 'hero', '首頁描述', '我們相信每個孩子都是上帝的寶貝，在「光·來了」，孩子們將透過聖經故事、品格教育、創意活動，認識耶穌的愛，建立美好的品格與價值觀。', 'text', 3),
('home_hero_cta', 'home', 'hero', 'CTA 按鈕文字', '立即預約體驗', 'text', 4),

-- 首頁價值主張
('home_values_title', 'home', 'values', '價值主張標題', '為什麼選擇「光·來了」？', 'text', 1),
('home_value_1_title', 'home', 'values', '價值1標題', '聖經為本', 'text', 2),
('home_value_1_desc', 'home', 'values', '價值1說明', '以聖經真理為基礎，幫助孩子建立正確的價值觀', 'text', 3),
('home_value_2_title', 'home', 'values', '價值2標題', '品格培育', 'text', 4),
('home_value_2_desc', 'home', 'values', '價值2說明', '透過故事與活動，培養孩子的好品格', 'text', 5),
('home_value_3_title', 'home', 'values', '價值3標題', '快樂學習', 'text', 6),
('home_value_3_desc', 'home', 'values', '價值3說明', '在遊戲中學習，讓信仰教育充滿樂趣', 'text', 7),

-- 首頁課程預覽
('home_courses_title', 'home', 'courses', '課程預覽標題', '我們的課程', 'text', 1),
('home_courses_subtitle', 'home', 'courses', '課程預覽副標題', '根據年齡分班，給孩子最適合的成長環境', 'text', 2),

-- 課程介紹頁
('courses_intro_title', 'courses', 'intro', '課程介紹標題', '課程介紹', 'text', 1),
('courses_intro_desc', 'courses', 'intro', '課程介紹說明', '我們根據孩子的年齡與發展階段，設計了三個不同的班級，每個班級都有專屬的課程內容與活動設計。', 'text', 2),

-- 幼幼班
('courses_toddler_name', 'courses', 'toddler', '幼幼班名稱', '幼幼班', 'text', 1),
('courses_toddler_age', 'courses', 'toddler', '幼幼班年齡', '2-6歲', 'text', 2),
('courses_toddler_desc', 'courses', 'toddler', '幼幼班說明', '透過遊戲、唱歌、手作等活動，讓孩子在快樂中認識耶穌的愛。', 'text', 3),

-- 撒母耳班
('courses_samuel_name', 'courses', 'samuel', '撒母耳班名稱', '撒母耳班', 'text', 1),
('courses_samuel_age', 'courses', 'samuel', '撒母耳班年齡', '7-9歲', 'text', 2),
('courses_samuel_desc', 'courses', 'samuel', '撒母耳班說明', '深入淺出的聖經故事教學，培養孩子的信仰根基與品格。', 'text', 3),

-- 約書亞班
('courses_joshua_name', 'courses', 'joshua', '約書亞班名稱', '約書亞班', 'text', 1),
('courses_joshua_age', 'courses', 'joshua', '約書亞班年齡', '10-12歲', 'text', 2),
('courses_joshua_desc', 'courses', 'joshua', '約書亞班說明', '引導孩子思考信仰與生活的連結，建立個人與神的關係。', 'text', 3),

-- 關於我們
('about_title', 'about', 'intro', '關於我們標題', '關於我們', 'text', 1),
('about_intro', 'about', 'intro', '關於我們簡介', '「光·來了」是大里思恩堂的兒童主日學，我們致力於為孩子提供一個充滿愛與歡樂的學習環境。', 'text', 2),
('about_vision_title', 'about', 'vision', '願景標題', '我們的願景', 'text', 1),
('about_vision', 'about', 'vision', '願景說明', '成為孩子生命中的光，陪伴他們在信仰中成長，在愛中茁壯。', 'text', 2),
('about_mission_title', 'about', 'mission', '使命標題', '我們的使命', 'text', 1),
('about_mission', 'about', 'mission', '使命說明', '透過聖經教導、品格培育、創意活動，幫助孩子認識神、愛神、服事神。', 'text', 2),

-- 聯絡資訊
('contact_address', 'contact', 'info', '地址', '412台灣大里區東榮路312號', 'text', 1),
('contact_phone', 'contact', 'info', '電話', '04 2482 3735', 'text', 2),
('contact_time', 'contact', 'info', '聚會時間', '每週日 10:00-11:30', 'text', 3);
