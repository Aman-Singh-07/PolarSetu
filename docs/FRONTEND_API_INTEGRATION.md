# POLARSETU FRONTEND API INTEGRATION
**Phase 2A - Resource, Search, & Resource Detail**

## Configuration
- **API Base URL**: Configured via `VITE_API_BASE_URL` in `frontend/.env.local`. Defaults to `http://localhost:8080` or `http://localhost:8080/api`.
- Example `.env.example` provided.
- **NO SECRETS** are stored in the frontend or passed to the frontend.

## Endpoints Integrated
1. **GET `/api/resources`**
   - Invoked on the Explore page when no search query is present.
   - Filter parameters are appended if specified (e.g., `?type=REPORT`).
2. **GET `/api/search?q=...`**
   - Invoked on the Explore page when a search query is typed.
   - Utilizes an `AbortController` to cancel stale requests and avoid race conditions.
   - Returns `{ query: string, results: Resource[] }` which is parsed accordingly.
3. **GET `/api/resources/:id`**
   - Invoked on the Resource Detail (`/research/:id`) page.
   - Handled robustly: standard responses render the resource, while a `404 Not Found` correctly routes to a bespoke "Resource not found" Empty state.
4. **GET `/api/resources/:id/relations`**
   - Successfully integrated to display related resources in the metadata sidebar on the Resource Detail page.

## Handled States
- **Loading State**: Uses spinning loading indicators (skeletons/spinners) while fetching. Mock data is no longer pre-flashed.
- **Success State**: Native mapping directly from backend models.
- **Empty State**: Explicit UI presented when `results` array is empty or search yields no matches.
- **Error State (Network/Timeout)**: Presents an explicit "Unable to load repository resources" message and provides a "Retry" button. No silent fallback to mock data occurs.

## Known Backend Limitations (To address later)
1. Backend `Resource` model does not return `expeditionId` natively on the LIST endpoint, but `Explore` screen gracefully handles omitted fields.
2. Search `?theme=` parameter is unsupported by the backend; filtering by theme is done client-side safely.
3. Supabase upload remains non-functional due to a missing bucket (`NoSuchBucket`), so frontend upload capability remains mocked.
4. AI integrations (`/api/ai/ask` and `/api/ai/outreach`) are not officially connected to frontend forms yet per Phase 2A guidelines.

## Mock Data Removal
- `mockResources` is completely disconnected from the central `api.ts` Resource retrieval methods.
- The `mockData.ts` file remains in place to support prototype capabilities (e.g., Maps/Stations, admin draft queues) until those verticals are integrated.

### Admin Upload
- **Create Resource**: POST /api/resources
- **Multipart Upload**: POST /api/resources/:id/upload
- **Supabase Storage**: Streamed via Go Backend to 'resources' bucket.
- **PostgreSQL**: storage_path saved in the DB resource record.

### Expeditions
- **Expeditions List**: GET /api/expeditions (Client-side filtering for region, year, and search query)
- **Expedition Detail**: GET /api/expeditions/:id (Returns expedition metadata plus related resources array)
- **Empty/Error States**: Fully integrated, gracefully handling 404s and network failures without crashing.
