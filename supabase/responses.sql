-- Member answers / submissions for in-site materials

create table if not exists public.material_responses (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  material_id text not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (chapter_id, material_id, user_id)
);

create index if not exists material_responses_user_idx
  on public.material_responses (user_id);

create index if not exists material_responses_chapter_material_idx
  on public.material_responses (chapter_id, material_id);

alter table public.material_responses enable row level security;

drop policy if exists "Users read own material responses" on public.material_responses;
create policy "Users read own material responses"
  on public.material_responses for select
  using (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  );

drop policy if exists "Users upsert own material responses" on public.material_responses;
create policy "Users insert own material responses"
  on public.material_responses for insert
  with check (
    user_id = auth.uid()
    and (
      public.is_executive()
      or public.is_chapter_staff(chapter_id)
      or exists (
        select 1 from public.chapter_memberships m
        where m.chapter_id = material_responses.chapter_id
          and m.user_id = auth.uid()
          and m.status = 'approved'
      )
    )
  );

drop policy if exists "Users update own material responses" on public.material_responses;
create policy "Users update own material responses"
  on public.material_responses for update
  using (user_id = auth.uid() or public.is_executive() or public.is_chapter_staff(chapter_id))
  with check (user_id = auth.uid() or public.is_executive() or public.is_chapter_staff(chapter_id));
