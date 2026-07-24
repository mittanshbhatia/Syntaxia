# Syntaxia

**Syntaxia** is the organization behind structured CS club chapters.  
**APSDS** (Algorithmic Problem Solving and Data Structures) is the flagship club we promote.

## Local

```bash
npm install
cp .env.example .env.local   # fill Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Role setup guide: [docs/AUTH.md](docs/AUTH.md)

### Routes

- `/` — Syntaxia home
- `/apsds` — APSDS club overview + media
- `/members` — pick chapter + request access (sign-in required)
- `/members/[slug]` — chapter hub (approved members / staff / executives only)
- `/admin` — executives (everything) + chapter directors/instructors (their chapter only)
- `/auth/sign-in` · `/auth/sign-up`
- `/join` · `/start`

### Auth roles

1. Sign up / sign in
2. Open `/admin` once and click **Become first executive**
3. Assign chapter directors/instructors by email
4. Students request chapter access from `/members`
5. Staff approve them in `/admin` before chapter content unlocks

Open chapters: **BISV**, **Lynbrook**, **Harker**

## Deploy note

Do not push to GitHub / Vercel until explicitly asked.
