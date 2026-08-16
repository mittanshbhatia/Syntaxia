-- Keep the public read policy separate from executive write policies so each
-- operation evaluates only one permissive policy.
drop policy if exists "Executives manage site content" on public.site_content;

create policy "Executives insert site content"
  on public.site_content for insert
  to authenticated
  with check (public.is_executive());

create policy "Executives update site content"
  on public.site_content for update
  to authenticated
  using (public.is_executive())
  with check (public.is_executive());

create policy "Executives delete site content"
  on public.site_content for delete
  to authenticated
  using (public.is_executive());
