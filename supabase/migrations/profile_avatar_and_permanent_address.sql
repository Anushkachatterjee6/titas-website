-- Run this once in the Supabase SQL Editor for this project (Dashboard ->
-- SQL Editor -> New query -> paste -> Run). It is not applied automatically
-- by this repo. It only ADDS columns/a bucket/policies — nothing here
-- drops or rewrites existing data, so it's safe to run against the live
-- database.

-- 1. Profile picture + permanent address columns on the existing
--    `profiles` table. All nullable, so existing rows are unaffected.
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists permanent_address_line text,
  add column if not exists permanent_city text,
  add column if not exists permanent_state text,
  add column if not exists permanent_pincode text,
  add column if not exists permanent_country text default 'India';

-- 2. Storage bucket for avatar uploads. Public read (so the stored URL can
--    be used directly in an <img> tag without a signed URL), but writes are
--    locked down below to the owning user only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

-- 3. RLS on storage.objects for the avatars bucket. Convention: every
--    uploaded file's path starts with the uploader's own auth.uid(), e.g.
--    "<user-id>/profile.jpg" — these policies enforce that a user can only
--    insert/update/delete objects under their OWN id prefix. Public read is
--    granted via the bucket's `public = true` flag above, so no SELECT
--    policy is required for that.
create policy if not exists "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy if not exists "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
