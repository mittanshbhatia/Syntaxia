-- Diagnostics, cohorts, attendance, submissions (idempotent)

-- Shared helpers already exist: is_executive(), is_chapter_staff(), is_chapter_director()

create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_questions (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics (id) on delete cascade,
  question_key text not null,
  concept text not null,
  prompt text not null,
  choices jsonb not null default '[]'::jsonb,
  correct_index int not null,
  sort_order int not null default 0,
  unique (diagnostic_id, question_key)
);

create table if not exists public.diagnostic_attempts (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (diagnostic_id, chapter_id, user_id, started_at)
);

create index if not exists diagnostic_attempts_user_idx
  on public.diagnostic_attempts (user_id, chapter_id);

create table if not exists public.diagnostic_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.diagnostic_attempts (id) on delete cascade,
  question_key text not null,
  selected_index int,
  is_correct boolean,
  unique (attempt_id, question_key)
);

create table if not exists public.placement_results (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.diagnostic_attempts (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  recommended_track text not null check (recommended_track in ('l1', 'l2', 'l3')),
  confidence numeric(5,2) not null default 0,
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  starting_lesson text,
  instructor_override_track text check (
    instructor_override_track is null or instructor_override_track in ('l1', 'l2', 'l3')
  ),
  override_by uuid references public.profiles (id),
  override_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  name text not null,
  track text not null check (track in ('l1', 'l2', 'l3')),
  instructor_id uuid references public.profiles (id),
  meeting_schedule text,
  start_date date,
  end_date date,
  current_lesson text,
  status text not null default 'active'
    check (status in ('active', 'archived', 'upcoming')),
  created_at timestamptz not null default now()
);

create index if not exists cohorts_chapter_idx on public.cohorts (chapter_id);

create table if not exists public.cohort_members (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create table if not exists public.attendance_meetings (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  meeting_date date not null,
  label text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (cohort_id, meeting_date)
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.attendance_meetings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('present', 'late', 'absent', 'excused')),
  note text,
  unique (meeting_id, user_id)
);

create table if not exists public.code_submissions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  material_id text not null,
  prompt_id text not null default 'main',
  user_id uuid not null references public.profiles (id) on delete cascade,
  source_code text not null,
  stdout text,
  stderr text,
  tests_passed int,
  tests_total int,
  misconception_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists code_submissions_user_material_idx
  on public.code_submissions (user_id, chapter_id, material_id, created_at desc);

alter table public.diagnostics enable row level security;
alter table public.diagnostic_questions enable row level security;
alter table public.diagnostic_attempts enable row level security;
alter table public.diagnostic_responses enable row level security;
alter table public.placement_results enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_members enable row level security;
alter table public.attendance_meetings enable row level security;
alter table public.attendance_records enable row level security;
alter table public.code_submissions enable row level security;

-- Diagnostics catalog readable by authenticated users
drop policy if exists "diagnostics_read" on public.diagnostics;
create policy "diagnostics_read" on public.diagnostics
  for select to authenticated using (active = true or public.is_executive());

drop policy if exists "diagnostic_questions_read" on public.diagnostic_questions;
create policy "diagnostic_questions_read" on public.diagnostic_questions
  for select to authenticated using (true);

drop policy if exists "diagnostic_attempts_own" on public.diagnostic_attempts;
create policy "diagnostic_attempts_own" on public.diagnostic_attempts
  for all to authenticated
  using (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  )
  with check (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  );

drop policy if exists "diagnostic_responses_via_attempt" on public.diagnostic_responses;
create policy "diagnostic_responses_via_attempt" on public.diagnostic_responses
  for all to authenticated
  using (
    exists (
      select 1 from public.diagnostic_attempts a
      where a.id = attempt_id
        and (
          a.user_id = auth.uid()
          or public.is_executive()
          or public.is_chapter_staff(a.chapter_id)
        )
    )
  )
  with check (
    exists (
      select 1 from public.diagnostic_attempts a
      where a.id = attempt_id
        and (
          a.user_id = auth.uid()
          or public.is_executive()
          or public.is_chapter_staff(a.chapter_id)
        )
    )
  );

drop policy if exists "placement_results_access" on public.placement_results;
create policy "placement_results_access" on public.placement_results
  for all to authenticated
  using (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  )
  with check (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  );

drop policy if exists "cohorts_access" on public.cohorts;
create policy "cohorts_access" on public.cohorts
  for select to authenticated
  using (
    public.is_executive()
    or public.is_chapter_staff(chapter_id)
    or exists (
      select 1 from public.cohort_members m
      where m.cohort_id = id and m.user_id = auth.uid()
    )
  );

drop policy if exists "cohorts_staff_write" on public.cohorts;
create policy "cohorts_staff_write" on public.cohorts
  for all to authenticated
  using (public.is_executive() or public.is_chapter_staff(chapter_id))
  with check (public.is_executive() or public.is_chapter_staff(chapter_id));

drop policy if exists "cohort_members_access" on public.cohort_members;
create policy "cohort_members_access" on public.cohort_members
  for all to authenticated
  using (
    user_id = auth.uid()
    or public.is_executive()
    or exists (
      select 1 from public.cohorts c
      where c.id = cohort_id
        and (public.is_chapter_staff(c.chapter_id) or public.is_executive())
    )
  )
  with check (
    public.is_executive()
    or exists (
      select 1 from public.cohorts c
      where c.id = cohort_id and public.is_chapter_staff(c.chapter_id)
    )
  );

drop policy if exists "attendance_meetings_access" on public.attendance_meetings;
create policy "attendance_meetings_access" on public.attendance_meetings
  for all to authenticated
  using (
    exists (
      select 1 from public.cohorts c
      where c.id = cohort_id
        and (
          public.is_executive()
          or public.is_chapter_staff(c.chapter_id)
          or exists (
            select 1 from public.cohort_members m
            where m.cohort_id = c.id and m.user_id = auth.uid()
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.cohorts c
      where c.id = cohort_id
        and (public.is_executive() or public.is_chapter_staff(c.chapter_id))
    )
  );

drop policy if exists "attendance_records_access" on public.attendance_records;
create policy "attendance_records_access" on public.attendance_records
  for all to authenticated
  using (
    user_id = auth.uid()
    or public.is_executive()
    or exists (
      select 1 from public.attendance_meetings mt
      join public.cohorts c on c.id = mt.cohort_id
      where mt.id = meeting_id and public.is_chapter_staff(c.chapter_id)
    )
  )
  with check (
    public.is_executive()
    or exists (
      select 1 from public.attendance_meetings mt
      join public.cohorts c on c.id = mt.cohort_id
      where mt.id = meeting_id and public.is_chapter_staff(c.chapter_id)
    )
  );

drop policy if exists "code_submissions_access" on public.code_submissions;
create policy "code_submissions_access" on public.code_submissions
  for all to authenticated
  using (
    user_id = auth.uid()
    or public.is_executive()
    or public.is_chapter_staff(chapter_id)
  )
  with check (user_id = auth.uid());

-- Seed default Python diagnostic if missing
insert into public.diagnostics (slug, title, description, active)
select
  'python-foundations',
  'Python foundations diagnostic',
  '15–20 question placement covering variables, types, conditionals, loops, functions, lists, debugging, and algorithmic thinking.',
  true
where not exists (select 1 from public.diagnostics where slug = 'python-foundations');
