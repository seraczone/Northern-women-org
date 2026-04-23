create or replace function public.normalize_registration_emails(
  target_table regclass,
  target_index_name text
)
returns void
language plpgsql
as $$
begin
  execute format(
    $sql$
      with ranked as (
        select
          id,
          row_number() over (
            partition by lower(btrim(email))
            order by created_at desc nulls last, id desc
          ) as row_num
        from %s
        where email is not null
          and btrim(email) <> ''
      )
      delete from %s current_rows
      using ranked
      where current_rows.id = ranked.id
        and ranked.row_num > 1
    $sql$,
    target_table,
    target_table
  );

  execute format(
    'update %s
      set email = lower(btrim(email))
      where email is not null
        and email <> lower(btrim(email))',
    target_table
  );

  execute format(
    'create unique index if not exists %I
      on %s ((lower(btrim(email))))
      where email is not null
        and btrim(email) <> ''''',
    target_index_name,
    target_table
  );
end;
$$;

select public.normalize_registration_emails(
  'public.join_us_registrations',
  'join_us_registrations_email_normalized_key'
);

select public.normalize_registration_emails(
  'public.summit_2026_registrations',
  'summit_2026_registrations_email_normalized_key'
);

do $$
begin
  if to_regclass('public.volunteer_applications') is not null then
    perform public.normalize_registration_emails(
      'public.volunteer_applications',
      'volunteer_applications_email_normalized_key'
    );
  end if;
end;
$$;

drop function if exists public.normalize_registration_emails(regclass, text);
