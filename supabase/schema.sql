-- 1. 建立報名資料表
create table public.registrations (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  parent_name text not null,
  phone text not null,
  email text,
  child_nickname text not null,
  child_age smallint not null,
  class_type text not null,
  contact_time text,
  message text,
  status text not null default 'pending', -- pending, contacted, confirmed
  constraint registrations_pkey primary key (id)
);

-- 2. 建立相簿資料表
create table public.albums (
  id text not null, -- 使用 slug 作為 ID (例如: craft-2024-01)
  created_at timestamp with time zone not null default now(),
  title text not null,
  date date not null,
  description text,
  cover_color text default 'linear-gradient(135deg, #FFD93D, #FFAAA5)',
  category text not null, -- craft, music, science, outdoor, special
  constraint albums_pkey primary key (id)
);

-- 3. 建立照片資料表
create table public.photos (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  album_id text not null references public.albums(id) on delete cascade,
  src text not null,
  width integer not null default 800,
  height integer not null default 600,
  alt text,
  constraint photos_pkey primary key (id)
);

-- 4. 開啟 RLS (Row Level Security)
alter table public.registrations enable row level security;
alter table public.albums enable row level security;
alter table public.photos enable row level security;

-- 5. 設定 RLS 規則

-- 報名表: 任何人都可以新增(報名)，但只有管理員可以讀取
create policy "Anyone can insert registrations"
on public.registrations for insert
to anon
with check (true);

create policy "Admins can view registrations"
on public.registrations for select
to authenticated
using (true);

-- 相簿與照片: 任何人都可以讀取，但只有管理員可以新增/修改/刪除
create policy "Anyone can view albums"
on public.albums for select
to anon
using (true);

create policy "Admins can manage albums"
on public.albums for all
to authenticated
using (true);

create policy "Anyone can view photos"
on public.photos for select
to anon
using (true);

create policy "Admins can manage photos"
on public.photos for all
to authenticated
using (true);

-- 6. 建立 Storage Bucket (用於存放照片)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true);

-- Storage Policy: 任何人都可以讀取，只有管理員可以上傳
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'gallery' );

create policy "Auth Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'gallery' );

create policy "Auth Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'gallery' );
