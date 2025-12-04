-- Add is_pinned column to albums table
alter table public.albums add column is_pinned boolean default false;
