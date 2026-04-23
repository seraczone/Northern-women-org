create temp table duplicate_registration_emails (
  source_table text not null,
  id uuid not null,
  email text,
  normalized_email text,
  created_at timestamptz,
  keep_rank bigint not null,
  duplicate_count bigint not null
) on commit drop;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'join_us_registrations',
    'summit_2026_registrations',
    'volunteer_applications'
  ]
  loop
    if to_regclass(format('public.%s', table_name)) is not null then
      execute format(
        $sql$
          insert into duplicate_registration_emails (
            source_table,
            id,
            email,
            normalized_email,
            created_at,
            keep_rank,
            duplicate_count
          )
          select
            %L as source_table,
            id,
            email,
            lower(btrim(email)) as normalized_email,
            created_at,
            row_number() over (
              partition by lower(btrim(email))
              order by created_at desc nulls last, id desc
            ) as keep_rank,
            count(*) over (
              partition by lower(btrim(email))
            ) as duplicate_count
          from public.%I
          where email is not null
            and btrim(email) <> ''
        $sql$,
        table_name,
        table_name
      );
    end if;
  end loop;
end;
$$;

select
  source_table,
  normalized_email,
  duplicate_count,
  id,
  email,
  created_at,
  case
    when keep_rank = 1 then 'keep'
    else 'delete'
  end as cleanup_action
from duplicate_registration_emails
where duplicate_count > 1
order by source_table, normalized_email, keep_rank, created_at desc nulls last, id desc;
