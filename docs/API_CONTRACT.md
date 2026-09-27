# API CONTRACT (Draft Proposal)

All application logic goes through Go/Gin REST endpoints. The API surface is intentionally small and predictable.

## Core Endpoints

### Health & Auth
- `GET /api/health`: Health check
- `POST /api/auth/login`: Admin login

### Expeditions & Resources (Discovery)
- `GET /api/expeditions`: List expeditions
- `GET /api/expeditions/:id`: Expedition detail
- `POST /api/expeditions`: Create expedition
- `GET /api/resources`: List/filter resources
- `GET /api/resources/:id`: Resource detail
- `POST /api/resources`: Create resource
- `POST /api/resources/:id/upload`: Attach file (interacts with Supabase Storage)

### Search
- `GET /api/search?q=`: Universal search (reports, publications, datasets, etc.)

### AI & Outreach (Source-Grounded)
- `POST /api/ai/ask`: Grounded Q&A over selected `resource_ids`
- `POST /api/ai/summarize`: Summary draft generation
- `POST /api/ai/outreach`: Outreach generation (Student, Public, etc.) based on `resource_ids`

### Governance & Review
- `GET /api/review/queue`: Review queue for generated drafts
- `POST /api/review/:id/approve`: Approve draft
- `POST /api/review/:id/reject`: Reject draft

## Response Standards
- Use proper HTTP status codes.
- Centralize error handling (e.g., `{"error": {"code": "...", "message": "..."}}`).
- Never leak internal errors or secrets.
