-- Syntaxia auth, chapters, roles, memberships (idempotent migration)

create extension if not exists "pgcrypto";

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  region text,
  status text not null default 'open' check (status in ('open', 'coming')),
  blurb text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists global_role text;

update public.profiles
set global_role = 'member'
where global_role is null;

alter table public.profiles
  alter column global_role set default 'member';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_global_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_global_role_check
      check (global_role in ('executive', 'member'));
  end if;
end $$;

alter table public.profiles
  alter column global_role set not null;

create table if not exists public.chapter_staff (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('director', 'instructor')),
  created_at timestamptz not null default now(),
  unique (chapter_id, user_id)
);

create table if not exists public.chapter_memberships (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  track text check (track is null or track in ('l1', 'l2', 'l3')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id),
  unique (chapter_id, user_id)
);

create index if not exists chapter_memberships_chapter_status_idx
  on public.chapter_memberships (chapter_id, status);

create index if not exists chapter_staff_user_idx
  on public.chapter_staff (user_id);

create or replace function public.is_executive()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.global_role = 'executive'
  );
$$;

create or replace function public.is_chapter_staff(target_chapter uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.chapter_staff s
    where s.user_id = auth.uid() and s.chapter_id = target_chapter
  );
$$;

create or replace function public.handles_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, global_role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'member'
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handles_new_user();

insert into public.chapters (slug, name, short_name, region, status, blurb)
values
  (
    'bisv',
    'BASIS Independent Silicon Valley',
    'BISV',
    'Bay Area, CA',
    'open',
    'Founding chapter. Weekly after-school sessions across L1–L3.'
  ),
  (
    'lynbrook',
    'Lynbrook High School',
    'Lynbrook',
    'San Jose, CA',
    'open',
    'APSDS chapter at Lynbrook High School.'
  ),
  (
    'harker',
    'The Harker School',
    'Harker',
    'San Jose, CA',
    'open',
    'APSDS chapter at The Harker School.'
  )
on conflict (slug) do update
set
  name = excluded.name,
  short_name = excluded.short_name,
  region = excluded.region,
  status = excluded.status,
  blurb = excluded.blurb;

alter table public.chapters enable row level security;
alter table public.profiles enable row level security;
alter table public.chapter_staff enable row level security;
alter table public.chapter_memberships enable row level security;

drop policy if exists "Chapters are publicly readable" on public.chapters;
create policy "Chapters are publicly readable"
  on public.chapters for select
  using (true);

drop policy if exists "Executives manage chapters" on public.chapters;
create policy "Executives manage chapters"
  on public.chapters for all
  using (public.is_executive())
  with check (public.is_executive());

drop policy if exists "Profiles are viewable by owner" on public.profiles;
drop policy if exists "Profiles are upsertable by owner" on public.profiles;
drop policy if exists "Profiles are updatable by owner" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Staff read chapter member profiles" on public.profiles;
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_executive());

create policy "Staff read chapter member profiles"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.chapter_memberships m
      join public.chapter_staff s on s.chapter_id = m.chapter_id
      where m.user_id = profiles.id
        and s.user_id = auth.uid()
    )
  );

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_executive())
  with check (auth.uid() = id or public.is_executive());

drop policy if exists "Staff readable" on public.chapter_staff;
create policy "Staff readable"
  on public.chapter_staff for select
  using (
    public.is_executive()
    or user_id = auth.uid()
    or public.is_chapter_staff(chapter_id)
  );

drop policy if exists "Executives manage staff" on public.chapter_staff;
create policy "Executives manage staff"
  on public.chapter_staff for all
  using (public.is_executive())
  with check (public.is_executive());

drop policy if exists "Members read own memberships" on public.chapter_memberships;
create policy "Members read own memberships"
  on public.chapter_memberships for select
  using (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  );

drop policy if exists "Members request membership" on public.chapter_memberships;
create policy "Members request membership"
  on public.chapter_memberships for insert
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "Staff and executives review memberships" on public.chapter_memberships;
create policy "Staff and executives review memberships"
  on public.chapter_memberships for update
  using (
    public.is_executive()
    or public.is_chapter_staff(chapter_id)
  )
  with check (
    public.is_executive()
    or public.is_chapter_staff(chapter_id)
  );

-- Curriculum: executives write; chapter staff/members with access read.
-- Chapter directors cannot edit curriculum and cannot remove executives (app-enforced).
create table if not exists public.curriculum_items (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  title text not null,
  body text not null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists curriculum_items_chapter_idx
  on public.curriculum_items (chapter_id);

alter table public.curriculum_items enable row level security;

drop policy if exists "Curriculum readable by chapter access" on public.curriculum_items;
create policy "Curriculum readable by chapter access"
  on public.curriculum_items for select
  using (
    public.is_executive()
    or public.is_chapter_staff(chapter_id)
    or exists (
      select 1 from public.chapter_memberships m
      where m.chapter_id = curriculum_items.chapter_id
        and m.user_id = auth.uid()
        and m.status = 'approved'
    )
  );

drop policy if exists "Executives manage curriculum" on public.curriculum_items;
create policy "Executives manage curriculum"
  on public.curriculum_items for all
  using (public.is_executive())
  with check (public.is_executive());
