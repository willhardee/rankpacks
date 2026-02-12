# RankPacks (Launch-ready v1)

RankPacks is a mobile-first PWA for group rankings: create packs, invite friends, rank items, reveal consensus, and share results.

## Stack
- Next.js App Router + TypeScript
- TailwindCSS + shadcn-style UI primitives
- Supabase Auth + Postgres + Storage + Realtime + RLS
- Resend for email notifications
- Vercel deploy target

## Local setup
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables
Copy `.env.example` into `.env.local` and fill values.

## Supabase setup (copy/paste)
1. Create a Supabase project.
2. Open SQL editor and run migration:
   - `supabase/migrations/0001_rankpacks.sql`
3. Configure Auth redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-VERCEL-DOMAIN/auth/callback`
4. Create storage bucket `avatars` and `pack-media`.

## Resend setup
1. Verify your sending domain.
2. Add `RESEND_API_KEY` and `RESEND_FROM`.
3. Use API routes for invite/open/reveal notifications.

## Deploy (Vercel)
1. Import repo in Vercel.
2. Add env vars from `.env.example`.
3. Deploy.

## Architecture notes
- Business logic is centralized in `src/lib/*` and route handlers under `src/app/api/*`.
- Deep links: `/p/[packId]` and `/i/[inviteToken]` for web and future native app compatibility.
- Ranking algorithm: Borda count + variance controversy + Spearman taste twins.

## Beta gating
Set `BETA_MODE=true` to require allowlist/invite code logic before signup.

## Known assumptions
- This repo includes production-oriented scaffolding and core routes; wire the Supabase queries in each route handler for your project IDs.
- Rate limiting uses an in-memory fallback; replace with Redis/KV in production.


## Supabase OAuth setup (Google/Facebook)
1. In Supabase Dashboard → **Authentication** → **URL Configuration**:
   - Set **Site URL** to your app URL (`https://YOUR-VERCEL-DOMAIN` in prod).
   - Add Redirect URLs exactly:
     - `http://localhost:3000/auth/callback`
     - `https://YOUR-VERCEL-DOMAIN/auth/callback`
2. In Supabase Dashboard → **Authentication** → **Providers**:
   - Enable **Google** provider and add Google OAuth Client ID + Secret.
   - (Optional) Enable **Facebook** provider and add Facebook App ID + Secret.
3. In Google/Facebook developer console, add callback URL exactly:
   - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
4. Ensure `NEXT_PUBLIC_APP_URL` matches your environment URL so OAuth `redirectTo` works.
5. Verify flow:
   - Open `/login`, click Continue with Google, complete provider flow, confirm redirect lands on `/auth/callback` then `/home` (or requested `next` route).
