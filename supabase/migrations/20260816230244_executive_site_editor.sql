-- Executive-managed website copy. Public visitors can read published values;
-- only executives may change them.

create table if not exists public.site_content (
  key text primary key,
  value text not null check (char_length(value) between 1 and 800),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null,
  constraint site_content_key_check check (
    key in (
      'home.hero.tagline',
      'home.hero.headline',
      'home.problem.title',
      'home.product.title',
      'home.product.subtitle',
      'home.how.title',
      'home.different.title',
      'home.traction.title',
      'home.story.title',
      'home.story.body',
      'home.cta.title',
      'home.cta.body'
    )
  )
);

alter table public.site_content enable row level security;

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

drop policy if exists "Published site content is publicly readable" on public.site_content;
create policy "Published site content is publicly readable"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Executives manage site content" on public.site_content;
create policy "Executives manage site content"
  on public.site_content for all
  to authenticated
  using (public.is_executive())
  with check (public.is_executive());

-- Members may edit their own display information, but global_role is managed
-- only by the existing service-role-protected executive endpoints.
revoke update on public.profiles from authenticated;
grant update (email, display_name, updated_at) on public.profiles to authenticated;
