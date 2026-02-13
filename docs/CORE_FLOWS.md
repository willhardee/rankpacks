# Core flows

## Data model

- `packs`: top-level ranking packs (`title`, `category`, `visibility`, `owner_id`, `status`).
- `pack_items`: one row per rankable option, tied to `pack_id`.
- `rankings`: one submission per `(pack_id, user_id)` storing `ordered_item_ids` (full ordered array).
- `profiles`: display names for users, used in results and submission lists.

## Flow mapping

### A) Create pack
1. User signs in and opens `/packs/new`.
2. Builder captures title/category/visibility and custom item list (one item per line).
3. `POST /api/packs` creates the `packs` row and inserts `pack_items` rows.
4. UI redirects to `/p/:packId?created=1`.

### B) Discover packs
1. `/explore` queries `packs` where `visibility = 'public'` sorted by recency.
2. Optional `category` filter narrows the list.
3. `/` and `/home` show recent public packs.

### C) Rank a pack
1. `/p/:packId` loads persisted items from DB.
2. Signed-in users can save draft or submit through `POST /api/rankings`.
3. Existing ranking (if any) is loaded with `GET /api/rankings?packId=...`.
4. Logged-out users are redirected to login.

### D) View results
1. `/results/:packId` calls `GET /api/results?packId=...`.
2. API returns:
   - `viewerSubmission` (current user ranking if signed in)
   - `aggregate` (Borda ranking + average rank)
   - `submissions` list (display name + ordered list)

### E) Permissions/visibility
- Public packs are visible in explore/home/results.
- Private/link-only packs are excluded from browse lists.
- Ranking writes require auth.

## Issues found during audit

- `api/packs`, `api/rankings`, and pack/results pages were previously mock-only and did not persist data.
- Explore/home used static placeholders and never queried public packs.
- Results page had no ranking visibility (neither aggregate nor individual submissions).
- Profile bootstrap from auth users was missing, causing ownership/ranking FK failures in real environments.
