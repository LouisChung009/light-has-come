-- 建立網站內容管理表
create table public.site_content (
  id text not null primary key, -- 使用有意義的 key，例如: 'home_hero_title'
  category text not null, -- 分類: home, courses, about 等
  label text not null, -- 顯示名稱，例如: '首頁主標題'
  content text not null, -- 實際內容
  content_type text not null default 'text', -- text, html, markdown
  updated_at timestamp with time zone default now(),
  constraint site_content_pkey primary key (id)
);

-- 開啟 RLS
alter table public.site_content enable row level security;

-- RLS 政策: 任何人都可以讀取，只有管理員可以修改
create policy "Anyone can view site content"
on public.site_content for select
to anon, authenticated
using (true);

create policy "Admins can update site content"
on public.site_content for update
to authenticated
using (true);

-- 插入初始內容
insert into public.site_content (id, category, label, content, content_type) values
-- 首頁內容
('home_hero_title', 'home', '首頁主標題', '讓孩子在愛中成長', 'text'),
('home_hero_subtitle', 'home', '首頁副標題', '大里思恩堂兒童主日學歡迎您', 'text'),
('home_hero_description', 'home', '首頁描述', '我們相信每個孩子都是上帝的寶貝，在「光·來了」，孩子們將透過聖經故事、品格教育、創意活動，認識耶穌的愛，建立美好的品格與價值觀。', 'text'),

-- 課程介紹
('courses_intro', 'courses', '課程介紹文字', '我們根據孩子的年齡與發展階段，設計了三個不同的班級，每個班級都有專屬的課程內容與活動設計。', 'text'),

-- 關於我們
('about_vision', 'about', '願景說明', '我們的願景是成為孩子生命中的光，陪伴他們在信仰中成長，在愛中茁壯。', 'text'),
('about_mission', 'about', '使命說明', '透過聖經教導、品格培育、創意活動，幫助孩子認識神、愛神、服事神。', 'text');
