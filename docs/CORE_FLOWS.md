# Core Flows (stabilization pass)

## Data model

### `packs`
- Core pack metadata (`title`, `category`, `visibility`, `status`, `created_at`).
- `creator_name` stores a readable name for guest-created packs.
- Public discovery uses `visibility = 'public'`.

### `pack_items`
- One row per rankable item in a pack.
- `position` stores canonical item order from creation.

### `ranking_submissions`
- One row per submitted ranking event.
- Stores:
  - `pack_id`
  - optional `user_id`
  - `display_name`
  - `ordered_item_ids` (JSON array)
  - `submitted_at`
- This enables both guest submissions and visible individual ranking history.

## Why flows were broken before
1. Create pack did not persist anything; API returned a random UUID only.
2. Create flow had template hints but no required custom item input.
3. Explore and Home used static placeholders, not DB queries.
4. Rankings API did not save submissions, so results had no source data.
5. Results page was a placeholder and could not show individual user rankings.

## Implemented flow behavior

### A) Create pack (custom + preset)
- `CreatePackFlow` now requires item lines (minimum 2).
- Template selection pre-fills item suggestions, but users can edit freely.
- `POST /api/packs` persists both pack and pack items.

### B) Discover packs
- Home and Explore fetch packs from DB (`visibility = public`).
- Explore supports basic category and recency filters.

### C) Rank a pack
- Pack page fetches live pack + items.
- Ranking submit calls `POST /api/rankings` and persists submission rows.
- Guest flow remains supported through `display_name`.

### D) Results + individual rankings
- Results page now shows:
  - your last local ranking,
  - aggregate group ranking (Borda score / average rank / top votes),
  - individual submissions with display name + ordered list.

### E) Visibility / permissions
- Public packs are listed in Home + Explore.
- Link-only packs are excluded from public discovery.
- Direct access by URL still works for link-only packs.

## Remaining known issues
- Admin auth is lightweight (`ADMIN_EMAILS` + `?as=email`), intended for troubleshooting.
- Full invite-based private membership controls are not completed in this pass.
- In this environment, full Next build cannot be run due blocked package install.

## Supabase migration steps
1. Open Supabase SQL editor.
2. Run `supabase/migrations/0002_core_flows.sql`.
3. Verify tables/columns exist:
   - `packs.creator_name`
   - `pack_items.position`
   - `ranking_submissions`
