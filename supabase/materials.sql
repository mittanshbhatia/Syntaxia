-- Dashboard / material visibility (idempotent)

create table if not exists public.chapter_material_visibility (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  material_id text not null,
  visible_to_members boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id),
  unique (chapter_id, material_id)
);

create index if not exists chapter_material_visibility_chapter_idx
  on public.chapter_material_visibility (chapter_id);

create table if not exists public.chapter_section_visibility (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  section_key text not null,
  visible_to_members boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id),
  unique (chapter_id, section_key)
);

create index if not exists chapter_section_visibility_chapter_idx
  on public.chapter_section_visibility (chapter_id);

create or replace function public.is_chapter_director(target_chapter uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.chapter_staff s
    where s.user_id = auth.uid()
      and s.chapter_id = target_chapter
      and s.role = 'director'
  );
$$;

alter table public.chapter_material_visibility enable row level security;
alter table public.chapter_section_visibility enable row level security;

drop policy if exists "Members read material visibility" on public.chapter_material_visibility;
create policy "Members read material visibility"
  on public.chapter_material_visibility for select
  using (
    public.is_executive()
    or public.is_chapter_staff(chapter_id)
    or exists (
      select 1 from public.chapter_memberships m
      where m.chapter_id = chapter_material_visibility.chapter_id
        and m.user_id = auth.uid()
        and m.status = 'approved'
    )
  );

drop policy if exists "Directors manage material visibility" on public.chapter_material_visibility;
create policy "Directors manage material visibility"
  on public.chapter_material_visibility for all
  using (
    public.is_executive()
    or public.is_chapter_director(chapter_id)
  )
  with check (
    public.is_executive()
    or public.is_chapter_director(chapter_id)
  );

drop policy if exists "Members read section visibility" on public.chapter_section_visibility;
create policy "Members read section visibility"
  on public.chapter_section_visibility for select
  using (
    public.is_executive()
    or public.is_chapter_staff(chapter_id)
    or exists (
      select 1 from public.chapter_memberships m
      where m.chapter_id = chapter_section_visibility.chapter_id
        and m.user_id = auth.uid()
        and m.status = 'approved'
    )
  );

drop policy if exists "Directors manage section visibility" on public.chapter_section_visibility;
create policy "Directors manage section visibility"
  on public.chapter_section_visibility for all
  using (
    public.is_executive()
    or public.is_chapter_director(chapter_id)
  )
  with check (
    public.is_executive()
    or public.is_chapter_director(chapter_id)
  );
