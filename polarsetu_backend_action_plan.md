# PolarSetu Backend — Action Plan

## Situation Assessment

You have a **complete set of specifications** (data model, API contract, architecture, product spec, demo flow) but **zero implemented backend code**. The existing files are all empty stubs:

| File | Status |
|------|--------|
| [go.mod](file:///home/redd/Projects/PolarSetu/backend/go.mod) | ❌ Empty |
| [cmd/server/main.go](file:///home/redd/Projects/PolarSetu/backend/cmd/server/main.go) | ❌ Empty |
| [internal/services/ai.go](file:///home/redd/Projects/PolarSetu/backend/internal/services/ai.go) | ❌ Empty |
| [internal/services/search.go](file:///home/redd/Projects/PolarSetu/backend/internal/services/search.go) | ❌ Empty |
| [internal/services/storage.go](file:///home/redd/Projects/PolarSetu/backend/internal/services/storage.go) | ❌ Empty |
| [internal/services/provenance.go](file:///home/redd/Projects/PolarSetu/backend/internal/services/provenance.go) | ❌ Empty |

No migrations, no .env, no Dockerfile, no seed data. **Everything must be built from scratch.**

> [!IMPORTANT]
> **Prerequisites before starting**: You need a running PostgreSQL instance (local or Docker), and API keys for Groq and Supabase (can be deferred to Phase 4-5). If you don't have PostgreSQL running locally, the first thing to do is spin one up via Docker.

---

## Proposed Changes — Phase-by-Phase

The plan follows a strict **bottom-up dependency order**: each phase produces a testable, runnable increment.

---

### Phase 1: Project Bootstrapping & Health Check ⏱️ ~1-2 hours

**Goal**: A Go binary that compiles, runs, and responds to `GET /api/health`.

#### Target Folder Structure
```
backend/
├── cmd/server/main.go          # Entry point
├── internal/
│   ├── config/config.go        # Env var loading
│   ├── db/db.go                # pgx connection pool
│   ├── handlers/health.go      # Health handler
│   ├── middleware/              # (empty for now)
│   ├── models/                 # (empty for now)
│   ├── repository/             # (empty for now)
│   ├── routes/routes.go        # Central route registration
│   └── services/               # (existing stubs)
├── migrations/                 # (empty for now)
├── seeds/                      # (empty for now)
├── .env.example                # Template
├── go.mod
└── go.sum
```

#### [MODIFY] `go.mod`
Initialize with the correct module path and dependencies:
```go
module github.com/polarsetu/backend

go 1.23

require (
    github.com/gin-gonic/gin v1.10.0
    github.com/jackc/pgx/v5 v5.7.4
    github.com/joho/godotenv v1.5.1
)
```

#### [MODIFY] `cmd/server/main.go`
```go
package main

import (
    "log"
    "github.com/polarsetu/backend/internal/config"
    "github.com/polarsetu/backend/internal/db"
    "github.com/polarsetu/backend/internal/routes"
)

func main() {
    cfg := config.Load()
    pool, err := db.Connect(cfg.DatabaseURL)
    if err != nil {
        log.Fatalf("DB connection failed: %v", err)
    }
    defer pool.Close()

    r := routes.Setup(pool)
    log.Printf("Server starting on :%s", cfg.Port)
    r.Run(":" + cfg.Port)
}
```

#### [NEW] `internal/config/config.go`
Load `DATABASE_URL`, `PORT`, `JWT_SECRET`, `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY` from `.env`.

#### [NEW] `internal/db/db.go`
Create a `pgxpool.Pool` wrapper with context-aware `Connect(databaseURL)` function.

#### [NEW] `internal/routes/routes.go`
Register `GET /api/health` → `handlers.HealthCheck`.

#### [NEW] `internal/handlers/health.go`
Return `{"status": "ok"}`.

#### [NEW] `.env.example`
```env
DATABASE_URL=postgres://user:pass@localhost:5432/polarsetu?sslmode=disable
PORT=8080
JWT_SECRET=your-secret-here
GROQ_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
```

#### ✅ Verification
```bash
cd backend && go mod tidy && go run ./cmd/server/
# In another terminal:
curl http://localhost:8080/api/health
# Expected: {"status": "ok"}
```

---

### Phase 2: Database Schema & Migrations ⏱️ ~1-2 hours

**Goal**: All 8+ tables created in PostgreSQL with proper constraints, indexes, and a seed script.

#### [NEW] `migrations/001_create_tables.sql`
Full DDL based on [DATA_MODEL.md](file:///home/redd/Projects/PolarSetu/docs/DATA_MODEL.md):

```sql
-- Core tables with proper types, constraints, FKs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE expeditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    year INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    objective TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    source_url TEXT
);

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('REPORT','PUBLICATION','DATASET','PHOTO','VIDEO','ACTIVITY','EXPEDITION','OTHER')),
    title TEXT NOT NULL,
    description TEXT,
    year INTEGER,
    region TEXT,
    source_url TEXT,
    storage_path TEXT,
    license TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','REJECTED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE resource_expedition (
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    expedition_id UUID REFERENCES expeditions(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, expedition_id)
);

CREATE TABLE resource_relations (
    from_resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    to_resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL,
    PRIMARY KEY (from_resource_id, to_resource_id, relation_type)
);

CREATE TABLE resource_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    page_number INTEGER,
    section TEXT,
    content TEXT NOT NULL,
    search_vector tsvector
);

CREATE TABLE ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    source_ids JSONB,
    audience TEXT,
    output_type TEXT,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','APPROVED','REJECTED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_year ON resources(year);
CREATE INDEX idx_resource_chunks_search ON resource_chunks USING GIN(search_vector);
CREATE INDEX idx_resources_title_trgm ON resources USING GIN(title gin_trgm_ops);
CREATE INDEX idx_expeditions_region ON expeditions(region);
```

#### [NEW] `migrations/002_search_trigger.sql`
Auto-populate `search_vector` on insert/update:
```sql
CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resource_chunks_search
BEFORE INSERT OR UPDATE ON resource_chunks
FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

#### [NEW] `seeds/seed.sql`
Insert 1 admin user (hashed password), 3-5 expeditions (Indian Antarctic/Arctic), 10-15 resources, resource_chunks for AI grounding, and resource-expedition links. This is **critical** — you need seeded data to test everything without a frontend.

#### [NEW] `internal/models/models.go`
Go structs for all tables with `json` and `db` tags:
```go
type Expedition struct {
    ID        uuid.UUID  `json:"id"`
    Name      string     `json:"name"`
    Region    string     `json:"region"`
    Year      int        `json:"year"`
    // ... all fields
}
// Similarly for Resource, User, ResourceChunk, AIGeneration, AuditLog
```

#### ✅ Verification
```bash
psql $DATABASE_URL -f migrations/001_create_tables.sql
psql $DATABASE_URL -f migrations/002_search_trigger.sql
psql $DATABASE_URL -f seeds/seed.sql
psql $DATABASE_URL -c "SELECT count(*) FROM expeditions;"
# Expected: 3-5 rows
```

---

### Phase 3: Core CRUD API (Expeditions + Resources + Auth) ⏱️ ~3-4 hours

**Goal**: Full working REST API for the data layer. Testable via cURL/Postman.

Build in strict dependency order: **Model → Repository → Handler → Route**.

#### [NEW] `internal/repository/expedition_repo.go`
```go
// ListAll(ctx) ([]Expedition, error)
// GetByID(ctx, id) (*Expedition, error)
// Create(ctx, exp) (*Expedition, error)
```

#### [NEW] `internal/repository/resource_repo.go`
```go
// ListAll(ctx, filters) ([]Resource, error)
// GetByID(ctx, id) (*Resource, error)
// Create(ctx, res) (*Resource, error)
// GetByExpeditionID(ctx, expID) ([]Resource, error)
```

#### [NEW] `internal/repository/user_repo.go`
```go
// GetByEmail(ctx, email) (*User, error)
```

#### [NEW] `internal/handlers/expedition_handler.go`
- `GET /api/expeditions` → list with optional `?region=` and `?year=` filters
- `GET /api/expeditions/:id` → detail + linked resources
- `POST /api/expeditions` → create (protected)

#### [NEW] `internal/handlers/resource_handler.go`
- `GET /api/resources` → list with `?type=`, `?region=`, `?year=`, `?status=` filters
- `GET /api/resources/:id` → detail + linked expedition(s)
- `POST /api/resources` → create (protected)

#### [NEW] `internal/handlers/auth_handler.go`
- `POST /api/auth/login` → validate email/password → return signed JWT

#### [NEW] `internal/middleware/auth.go`
JWT middleware that:
1. Extracts `Authorization: Bearer <token>` header
2. Validates signature and expiry
3. Injects user claims into Gin context
4. Returns 401 on failure

#### [MODIFY] `internal/routes/routes.go`
Register all new routes. Protected routes use `middleware.AuthRequired()`.

```
Public:
  GET  /api/health
  POST /api/auth/login
  GET  /api/expeditions
  GET  /api/expeditions/:id
  GET  /api/resources
  GET  /api/resources/:id

Protected (JWT):
  POST /api/expeditions
  POST /api/resources
```

#### ✅ Verification
```bash
# List expeditions (seeded data)
curl http://localhost:8080/api/expeditions | jq .

# Get specific expedition
curl http://localhost:8080/api/expeditions/<uuid> | jq .

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@polarsetu.in","password":"admin123"}' | jq .

# Create resource (with JWT)
curl -X POST http://localhost:8080/api/resources \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test Report","type":"REPORT","description":"Test"}' | jq .
```

---

### Phase 4: Full-Text Search ⏱️ ~1-2 hours

**Goal**: `GET /api/search?q=sea+ice&type=REPORT` returns ranked results.

#### [MODIFY] `internal/services/search.go`
Implement `Search(ctx, query, typeFilter, regionFilter) ([]SearchResult, error)`:
- Combine `tsvector` matching on `resource_chunks.content` with `pg_trgm` fuzzy matching on `resources.title`
- Return results with rank score, highlighted snippets, and parent resource metadata

```sql
-- Core query pattern
SELECT r.id, r.title, r.type, r.description,
       ts_headline('english', rc.content, plainto_tsquery('english', $1)) AS snippet,
       ts_rank(rc.search_vector, plainto_tsquery('english', $1)) AS rank
FROM resource_chunks rc
JOIN resources r ON rc.resource_id = r.id
WHERE rc.search_vector @@ plainto_tsquery('english', $1)
ORDER BY rank DESC
LIMIT 20;
```

#### [NEW] `internal/handlers/search_handler.go`
- `GET /api/search?q=&type=&region=&year=` → calls search service, returns results

#### [MODIFY] `internal/routes/routes.go`
Register `GET /api/search`.

#### ✅ Verification
```bash
curl "http://localhost:8080/api/search?q=sea+ice" | jq .
curl "http://localhost:8080/api/search?q=glacier&type=REPORT" | jq .
# Verify results match seeded data
```

---

### Phase 5: AI Layer (Groq Integration) ⏱️ ~2-3 hours

**Goal**: Source-grounded AI Q&A and Outreach Studio generation.

#### [MODIFY] `internal/services/ai.go`
Implement Groq API client:
```go
type AIService struct {
    apiKey     string
    httpClient *http.Client
}

// Ask: fetch resource_chunks by IDs → build grounded prompt → call Groq → return answer + citations
// GenerateOutreach: audience + resource_ids → structured prompt → Groq → JSON output
```

> [!WARNING]
> **Source Grounding Rule**: The prompt MUST instruct the model to cite specific `resource_id` + `page_number`/`section` for every factual claim. If context is insufficient, the model must explicitly say so. This is a hard product requirement per [PRODUCT_SPEC.md](file:///home/redd/Projects/PolarSetu/docs/PRODUCT_SPEC.md).

#### [NEW] `internal/handlers/ai_handler.go`
- `POST /api/ai/ask` → `{ "resource_ids": [...], "question": "..." }` → grounded answer + source cards
- `POST /api/ai/outreach` → `{ "resource_ids": [...], "audience": "student", "output_type": "explanation" }` → draft content
- `POST /api/ai/summarize` → `{ "resource_ids": [...] }` → summary draft

Both endpoints save results to `ai_generations` table with `status: DRAFT`.

#### [NEW] `internal/handlers/review_handler.go`
- `GET /api/review/queue` → list `ai_generations` with `status = DRAFT`
- `POST /api/review/:id/approve` → set status to `APPROVED`, write `audit_log`
- `POST /api/review/:id/reject` → set status to `REJECTED`, write `audit_log`

#### [NEW] `internal/repository/ai_generation_repo.go`
CRUD for `ai_generations` table.

#### [NEW] `internal/repository/audit_repo.go`
Insert-only for `audit_log`.

#### [MODIFY] `internal/routes/routes.go`
```
Protected (JWT):
  POST /api/ai/ask
  POST /api/ai/outreach
  POST /api/ai/summarize
  GET  /api/review/queue
  POST /api/review/:id/approve
  POST /api/review/:id/reject
```

#### ✅ Verification
```bash
# Ask a grounded question
curl -X POST http://localhost:8080/api/ai/ask \
  -H 'Authorization: Bearer <token>' \
  -d '{"resource_ids":["<uuid>"],"question":"What did this expedition study?"}' | jq .

# Generate outreach
curl -X POST http://localhost:8080/api/ai/outreach \
  -H 'Authorization: Bearer <token>' \
  -d '{"resource_ids":["<uuid>"],"audience":"student","output_type":"explanation"}' | jq .

# Check review queue
curl http://localhost:8080/api/review/queue -H 'Authorization: Bearer <token>' | jq .
```

---

### Phase 6: File Upload & Remaining Services ⏱️ ~1-2 hours

#### [MODIFY] `internal/services/storage.go`
Implement Supabase Storage upload:
```go
func (s *StorageService) Upload(ctx, bucket, filename string, file io.Reader) (string, error)
```

#### [MODIFY] `internal/services/provenance.go`
Implement resource relationship queries:
```go
func (s *ProvenanceService) GetRelatedResources(ctx, resourceID) ([]ResourceRelation, error)
func (s *ProvenanceService) CreateRelation(ctx, fromID, toID, relationType) error
```

#### [NEW] `internal/handlers/upload_handler.go`
- `POST /api/resources/:id/upload` → multipart file → validate MIME/size → Supabase → update `storage_path`

#### ✅ Verification
```bash
curl -X POST http://localhost:8080/api/resources/<uuid>/upload \
  -H 'Authorization: Bearer <token>' \
  -F 'file=@test.pdf' | jq .
```

---

### Phase 7: DevOps & Polish ⏱️ ~1 hour

#### [NEW] `Dockerfile`
```dockerfile
FROM golang:1.23-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server ./cmd/server/

FROM alpine:3.20
COPY --from=build /app/server /server
EXPOSE 8080
CMD ["/server"]
```

#### [NEW] `docker-compose.yml` (development)
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: polarsetu
      POSTGRES_USER: polarsetu
      POSTGRES_PASSWORD: polarsetu
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  api:
    build: ./backend
    ports: ["8080:8080"]
    env_file: ./backend/.env
    depends_on: [db]

volumes:
  pgdata:
```

#### CORS Middleware
Add CORS middleware in `routes.go` to allow frontend (`localhost:5173`) to call the API.

---

## Complete File Inventory (What Gets Created)

```mermaid
flowchart LR
    subgraph "Phase 1"
        A1[go.mod] --> A2[cmd/server/main.go]
        A2 --> A3[internal/config/config.go]
        A2 --> A4[internal/db/db.go]
        A2 --> A5[internal/routes/routes.go]
        A2 --> A6[internal/handlers/health.go]
        A7[.env.example]
    end
    subgraph "Phase 2"
        B1[migrations/001_create_tables.sql]
        B2[migrations/002_search_trigger.sql]
        B3[seeds/seed.sql]
        B4[internal/models/models.go]
    end
    subgraph "Phase 3"
        C1[repository/expedition_repo.go]
        C2[repository/resource_repo.go]
        C3[repository/user_repo.go]
        C4[handlers/expedition_handler.go]
        C5[handlers/resource_handler.go]
        C6[handlers/auth_handler.go]
        C7[middleware/auth.go]
    end
    subgraph "Phase 4"
        D1[services/search.go]
        D2[handlers/search_handler.go]
    end
    subgraph "Phase 5"
        E1[services/ai.go]
        E2[handlers/ai_handler.go]
        E3[handlers/review_handler.go]
        E4[repository/ai_generation_repo.go]
        E5[repository/audit_repo.go]
    end
    subgraph "Phase 6"
        F1[services/storage.go]
        F2[services/provenance.go]
        F3[handlers/upload_handler.go]
    end
    subgraph "Phase 7"
        G1[Dockerfile]
        G2[docker-compose.yml]
    end
```

## API Surface Summary

| Method | Endpoint | Phase | Auth |
|--------|----------|-------|------|
| `GET` | `/api/health` | 1 | ❌ |
| `POST` | `/api/auth/login` | 3 | ❌ |
| `GET` | `/api/expeditions` | 3 | ❌ |
| `GET` | `/api/expeditions/:id` | 3 | ❌ |
| `POST` | `/api/expeditions` | 3 | ✅ |
| `GET` | `/api/resources` | 3 | ❌ |
| `GET` | `/api/resources/:id` | 3 | ❌ |
| `POST` | `/api/resources` | 3 | ✅ |
| `GET` | `/api/search?q=` | 4 | ❌ |
| `POST` | `/api/ai/ask` | 5 | ✅ |
| `POST` | `/api/ai/summarize` | 5 | ✅ |
| `POST` | `/api/ai/outreach` | 5 | ✅ |
| `GET` | `/api/review/queue` | 5 | ✅ |
| `POST` | `/api/review/:id/approve` | 5 | ✅ |
| `POST` | `/api/review/:id/reject` | 5 | ✅ |
| `POST` | `/api/resources/:id/upload` | 6 | ✅ |

## Open Questions

> [!IMPORTANT]
> **PostgreSQL Setup**: Do you already have PostgreSQL running locally, or should I set up a `docker-compose.yml` with PostgreSQL first so you have a database to work against?

> [!IMPORTANT]
> **API Keys**: Do you already have Groq and Supabase API keys/project set up? (These are only needed for Phases 5-6, so we can defer this.)

> [!IMPORTANT]
> **Module Path**: The original plan says `github.com/yourorg/polarsetu/backend`. What should the actual Go module path be? I've used `github.com/polarsetu/backend` as a placeholder.

## Verification Plan

### After Each Phase
- `go build ./...` — must compile
- `go vet ./...` — no warnings
- `curl` the new endpoints against seeded data

### End-to-End (After Phase 5)
Walk through the entire [DEMO_FLOW.md](file:///home/redd/Projects/PolarSetu/docs/DEMO_FLOW.md) using only cURL:
1. Search for "sea ice" → get results
2. Get expedition detail + linked resources
3. Ask AI a grounded question → get answer with source cards
4. Generate outreach draft → verify it's saved as DRAFT
5. Approve draft via review queue

### Manual Verification
- Confirm all SQL migrations apply cleanly to a fresh database
- Confirm JWT tokens are correctly validated and rejected when invalid/expired
- Confirm AI responses include source citations and refuse when context is insufficient
