create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'item_type') then
    create type item_type as enum ('prompt', 'link', 'note', 'snippet');
  end if;
end
$$;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type item_type not null,
  title text not null check (char_length(trim(title)) > 0),
  body text not null check (char_length(trim(body)) > 0),
  url text,
  tags text[] not null default '{}',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_user_pinned_created_idx
  on public.items (user_id, pinned desc, created_at desc);

create index if not exists items_tags_idx
  on public.items using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_items_updated_at on public.items;

create trigger set_items_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

alter table public.items enable row level security;

drop policy if exists "Users can read their own items" on public.items;
create policy "Users can read their own items"
on public.items
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own items" on public.items;
create policy "Users can create their own items"
on public.items
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own items" on public.items;
create policy "Users can update their own items"
on public.items
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own items" on public.items;
create policy "Users can delete their own items"
on public.items
for delete
to authenticated
using (auth.uid() = user_id);
