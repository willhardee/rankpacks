# Operator Runbook (copy/paste friendly)

## 1) Create Supabase project
- Create project in Supabase dashboard.
- Save Project URL + anon key + service role key.

## 2) Paste SQL migration
Run file: `supabase/migrations/0001_rankpacks.sql` in SQL editor.

## 3) Auth settings
Add redirect URLs:
- `http://localhost:3000/auth/callback`
- `https://YOURDOMAIN/auth/callback`

## 4) Resend
- Verify sending domain.
- Generate API key.

## 5) Vercel env vars (copy/paste)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
BETA_MODE=true
ADMIN_EMAILS=you@example.com
RESEND_API_KEY=
RESEND_FROM=notifications@yourdomain.com
```

## 6) Deploy
- Push to GitHub.
- Import in Vercel.
- Add env vars.
- Deploy production.

## 7) Create first admin
Sign in with email listed in `ADMIN_EMAILS`.

## 8) First pack dry run
- Create pack from template
- Add items
- Generate invite link
- Submit two rankings
- Reveal and share results

## 9) Account deletion requests
Check admin panel for deletion requests and process manually in Supabase.
