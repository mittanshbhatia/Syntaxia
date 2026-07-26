-- Concept mastery + hint events (idempotent)

create table if not exists public.concept_mastery (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  concept text not null,
  mastery numeric(5,2) not null default 0
    check (mastery >= 0 and mastery <= 100),
  evidence jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (chapter_id, user_id, concept)
);

create index if not exists concept_mastery_chapter_user_idx
  on public.concept_mastery (chapter_id, user_id);

create table if not exists public.hint_events (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  material_id text not null,
  prompt_id text not null,
  hint_index int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.concept_mastery enable row level security;
alter table public.hint_events enable row level security;

drop policy if exists "concept_mastery_access" on public.concept_mastery;
create policy "concept_mastery_access" on public.concept_mastery
  for all using (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  )
  with check (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  );

drop policy if exists "hint_events_access" on public.hint_events;
create policy "hint_events_access" on public.hint_events
  for all using (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  )
  with check (user_id = auth.uid());
