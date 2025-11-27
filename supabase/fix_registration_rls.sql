-- 修復報名表的 RLS 政策
-- 先刪除可能存在的舊政策
drop policy if exists "Anyone can insert registrations" on public.registrations;
drop policy if exists "Admins can view registrations" on public.registrations;
drop policy if exists "Admins can update registrations" on public.registrations;

-- 重新建立政策
-- 1. 允許任何人（包含匿名用戶）新增報名資料
create policy "Anyone can insert registrations"
on public.registrations for insert
to anon, authenticated
with check (true);

-- 2. 只有已登入的管理員可以查看報名資料
create policy "Admins can view registrations"
on public.registrations for select
to authenticated
using (true);

-- 3. 只有已登入的管理員可以更新報名資料
create policy "Admins can update registrations"
on public.registrations for update
to authenticated
using (true);

-- 4. 只有已登入的管理員可以刪除報名資料
create policy "Admins can delete registrations"
on public.registrations for delete
to authenticated
using (true);
