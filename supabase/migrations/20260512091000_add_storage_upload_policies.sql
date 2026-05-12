-- Ensure the public image buckets exist and authenticated users can upload
-- files into their own user-id folder.
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('posts', 'posts', true)
on conflict (id) do update
set public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read avatar objects'
  ) then
    create policy "Public can read avatar objects"
      on storage.objects
      for select
      to public
      using (bucket_id = 'avatars');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read post images'
  ) then
    create policy "Public can read post images"
      on storage.objects
      for select
      to public
      using (bucket_id = 'posts');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload own avatars'
  ) then
    create policy "Users can upload own avatars"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload own post images'
  ) then
    create policy "Users can upload own post images"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'posts'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );
  end if;
end $$;
