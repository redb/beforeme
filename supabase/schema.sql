create table if not exists public.anecdote_cache (
  cache_key text primary key,
  scope text not null check (scope in ('global', 'local')),
  year integer not null check (year between 1 and 2100),
  lang text not null check (lang in ('fr', 'en')),
  country text,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists anecdote_cache_year_idx on public.anecdote_cache (year);
create index if not exists anecdote_cache_scope_idx on public.anecdote_cache (scope);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists anecdote_cache_set_updated_at on public.anecdote_cache;
create trigger anecdote_cache_set_updated_at
before update on public.anecdote_cache
for each row
execute procedure public.set_updated_at();
