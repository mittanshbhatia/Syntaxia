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

### Auth URLs (Supabase)

Dashboard → Authentication → URL configuration:

- Site URL: `https://syntaxia.org`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://127.0.0.1:3000/auth/callback`
  - `https://syntaxia.org/auth/callback`
  - `https://www.syntaxia.org/auth/callback`
  - `https://syntaxia.org/**`
  - `https://www.syntaxia.org/**`
  - `https://syntaxia-gold.vercel.app/auth/callback`
  - `https://*.vercel.app/auth/callback`

Optional: Authentication → Providers → Email → turn off “Confirm email” for faster local/prod onboarding.
