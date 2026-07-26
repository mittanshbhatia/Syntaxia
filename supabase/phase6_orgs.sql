-- Organizations for self-serve pilots (idempotent)

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type text not null
    check (org_type in ('school', 'club', 'tutoring', 'nonprofit', 'other')),
  estimated_students int,
  track text check (track is null or track in ('l1', 'l2', 'l3')),
  plan_id text not null default 'founding',
  contact_email text not null,
  contact_name text,
  notes text,
  created_by uuid references public.profiles (id),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'rejected', 'churned')),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role text not null default 'instructor',
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.organization_invites enable row level security;

drop policy if exists "organizations_access" on public.organizations;
create policy "organizations_access" on public.organizations
  for all using (
    created_by = auth.uid()
    or public.is_executive()
  )
  with check (
    created_by = auth.uid()
    or public.is_executive()
  );

drop policy if exists "organization_invites_access" on public.organization_invites;
create policy "organization_invites_access" on public.organization_invites
  for all using (
    public.is_executive()
    or exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.created_by = auth.uid()
    )
  )
  with check (
    public.is_executive()
    or exists (
      select 1 from public.organizations o
      where o.id = organization_id and o.created_by = auth.uid()
    )
  );
