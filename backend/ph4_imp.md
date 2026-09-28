# Phase 4: Full-Text Search Integration & Media Endpoints

This narrowed-down action plan covers implementing the orphaned `Media` and `Activities` endpoints from Phase 3, and building out the native PostgreSQL text search logic for the `resources` table.

## Step 1: Wrap up Orphaned Endpoints
*Goal: Provide simple `GET` fetches for the media and activities catalogs.*

1.  **Media Repository & Handler:**
    *   Create `GetMedia(ctx)` in the repository to `SELECT * FROM media`.
    *   Build `GET /api/media` in `handlers/media_handler.go`.
2.  **Activity Repository & Handler:**
    *   Create `GetActivities(ctx)` in the repository to `SELECT * FROM activities`.
    *   Build `GET /api/activities` in `handlers/activity_handler.go`.
3.  **Wire the Routes:** Register these in `routes/routes.go`.

## Step 2: Configure the Search Vector Engine
*Goal: Hydrate the newly added `search_vector` column so the database can execute fast, weighted text lookups.*

1.  **Index Creation:** Add an index to PostgreSQL: `CREATE INDEX resources_search_idx ON resources USING GIN (search_vector)`.
2.  **Backfill Vector Script:** Write a small SQL script to auto-generate `search_vector` payloads for the mocked resources by concatenating `title`, `type`, and `description`.
3.  **Add Trigger (Stretch):** Implement a simple DB trigger function `tsvector_update_trigger` so any new resources created automatically update their own search vector logic.

## Step 3: Implement Search Repository Logic
*Goal: Build the underlying database query.*

1.  **Repository Setup:** Open `backend/internal/services/search.go` (or `repository/search_repo.go`).
2.  **Query Building:**
    *   Accept `query string`, `resourceType string`, `year int`.
    *   Write the query leveraging PostgreSQL's native `@@ to_tsquery()` function against the `search_vector`.
    *   Apply `ORDER BY ts_rank(search_vector, to_tsquery(...))` to rank results gracefully.

## Step 4: The Search Handler and Integration
*Goal: Expose the endpoint and configure edge cases.*

1.  **Handler setup:** Map `GET /api/search?q=...` to accept URL queries.
2.  **Fail-Safes:** If `q` is empty, logically degrade to just forwarding the request to the `ListAll` standard Resource fetching query.
3.  **Testing Constraint:** Connect the API to Postman/Curl. Search for `"sea ice"` and verify `DTS-2023-014` and `RPT-2024-001` emerge at the top of the array based on their descriptions!
