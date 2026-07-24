## Auth + roles (Supabase)

All users, chapters, memberships, and staff roles live in Supabase.

### Easy role control

1. Create your account at `/auth/sign-up`
2. Open `/admin` → **Become first executive** (one-time)
3. In **People & roles**:
   - search any signed-up login
   - **Make executive** for org-wide access
   - assign **Chapter director** or **Instructor** to BISV / Lynbrook / Harker
4. Students request chapter access from `/members`
5. Directors/instructors approve them in `/admin`

### Auth URLs to add in Supabase

Dashboard → Authentication → URL configuration:

- Site URL: `https://syntaxia-gold.vercel.app`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://syntaxia-gold.vercel.app/auth/callback`
  - `https://*.vercel.app/auth/callback`

Optional: Authentication → Providers → Email → turn off “Confirm email” for faster local/prod onboarding.
