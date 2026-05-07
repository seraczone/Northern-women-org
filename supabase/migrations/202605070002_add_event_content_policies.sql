do $$
begin
  if to_regclass('public.featured_event') is not null then
    execute 'alter table public.featured_event enable row level security';

    execute 'drop policy if exists "featured_event_public_select" on public.featured_event';
    execute 'create policy "featured_event_public_select"
      on public.featured_event
      for select
      to public
      using (true)';

    execute 'drop policy if exists "featured_event_admin_insert" on public.featured_event';
    execute 'create policy "featured_event_admin_insert"
      on public.featured_event
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "featured_event_admin_update" on public.featured_event';
    execute 'create policy "featured_event_admin_update"
      on public.featured_event
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "featured_event_admin_delete" on public.featured_event';
    execute 'create policy "featured_event_admin_delete"
      on public.featured_event
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';
  end if;

  if to_regclass('public.programs') is not null then
    execute 'alter table public.programs enable row level security';

    execute 'drop policy if exists "programs_public_select" on public.programs';
    execute 'create policy "programs_public_select"
      on public.programs
      for select
      to public
      using (true)';

    execute 'drop policy if exists "programs_admin_insert" on public.programs';
    execute 'create policy "programs_admin_insert"
      on public.programs
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "programs_admin_update" on public.programs';
    execute 'create policy "programs_admin_update"
      on public.programs
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "programs_admin_delete" on public.programs';
    execute 'create policy "programs_admin_delete"
      on public.programs
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';
  end if;

  if to_regclass('public.event_gallery') is not null then
    execute 'alter table public.event_gallery enable row level security';

    execute 'drop policy if exists "event_gallery_public_select" on public.event_gallery';
    execute 'create policy "event_gallery_public_select"
      on public.event_gallery
      for select
      to public
      using (true)';

    execute 'drop policy if exists "event_gallery_admin_insert" on public.event_gallery';
    execute 'create policy "event_gallery_admin_insert"
      on public.event_gallery
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "event_gallery_admin_update" on public.event_gallery';
    execute 'create policy "event_gallery_admin_update"
      on public.event_gallery
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "event_gallery_admin_delete" on public.event_gallery';
    execute 'create policy "event_gallery_admin_delete"
      on public.event_gallery
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';
  end if;

  if to_regclass('public.event_video') is not null then
    execute 'alter table public.event_video enable row level security';

    execute 'drop policy if exists "event_video_public_select" on public.event_video';
    execute 'create policy "event_video_public_select"
      on public.event_video
      for select
      to public
      using (true)';

    execute 'drop policy if exists "event_video_admin_insert" on public.event_video';
    execute 'create policy "event_video_admin_insert"
      on public.event_video
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "event_video_admin_update" on public.event_video';
    execute 'create policy "event_video_admin_update"
      on public.event_video
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )
      with check (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';

    execute 'drop policy if exists "event_video_admin_delete" on public.event_video';
    execute 'create policy "event_video_admin_delete"
      on public.event_video
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.admin_users
          where email = auth.jwt() ->> ''email''
        )
      )';
  end if;
end
$$;
