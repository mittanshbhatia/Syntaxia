## Auth + roles (Supabase)

All users, chapters, memberships, staff roles, and curriculum live in Supabase.

### Easy role control

1. Create your account at `/auth/sign-up` (email or Google)
2. Open `/admin` → **Become first executive** (one-time)
3. In **People & roles**:
   - search any signed-up login
   - **Make executive** for org-wide access (executives cannot be removed by chapter leaders)
   - assign **Chapter director** or **Instructor** to BISV / Lynbrook / Harker
4. Students request chapter access from `/members`
5. Directors/instructors approve them in `/admin`
6. Validated members see **Dashboard** (directory + curriculum; executives can edit curriculum)

### Permissions

- **Executives:** full profile access across chapters; exclusive curriculum edit
- **Chapter directors / instructors:** their chapter only; curriculum read-only (revoked when removed)
- **Approved members:** chapter hub + dashboard directory for their chapter

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

### Google Sign-In

Authentication → Providers → Google: enable and add Google OAuth client ID/secret.
Add authorized redirect URI from the Supabase provider panel.

### Auth email sender

To send confirmations from `team.apsds@gmail.com` with a “Do not reply” footer:

1. Authentication → Emails → SMTP Settings
2. Use Gmail SMTP for `team.apsds@gmail.com`
3. Set sender name to APSDS / Syntaxia
4. Edit confirmation template footer: “Do not reply to this email.”
