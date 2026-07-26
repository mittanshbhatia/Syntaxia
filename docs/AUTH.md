## Auth + roles (Supabase)

### Roles
- **Executive:** all chapters, manage curriculum visibility, manage staff. Cannot be removed by chapter directors.
- **Chapter director:** own chapter only; approve/reject members; control what members see on the dashboard; cannot remove executives or other directors.
- **Instructor:** own chapter view; cannot approve/reject/remove members; can view curriculum including hidden items; cannot change visibility.
- **Approved member:** dashboard for chapter materials that executives/directors have made visible.

### Auth URLs
- Site URL: `https://syntaxia.org`
- Redirects: `https://syntaxia.org/**`, `https://www.syntaxia.org/**`, localhost callbacks, Vercel previews

### Google Sign-In
Enable Google under Authentication → Providers. After Google signup, users complete a username on `/auth/complete-profile`.

### Email from team.apsds@gmail.com
Configure custom SMTP under Authentication → Emails with `team.apsds@gmail.com`, and add “Do not reply to this email.” to templates.
