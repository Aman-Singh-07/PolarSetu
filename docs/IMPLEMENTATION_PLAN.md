# IMPLEMENTATION PLAN

## A. Current Repository State
- Clean slate.
- Contains only `.git` folder and `stitch_polarsetu_polar_knowledge_outreach_platform` which holds image exports and the `DESIGN.md` specification.
- No existing codebase, no scaffolding.

## B. 72-Hour Priority Framework & Feature Classification
- **P0 (Must Work for Demo)**: Application shell, Home, Repository search, Expedition details, Resource details, Map (Leaflet with seeded data), Ask Polar AI (source-grounded), Outreach Studio, Human Review queue, Core Go APIs, PostgreSQL schema, coherent seeded demo data.
- **P1 (Strongly Valuable)**: JWT Auth for Admin.
- **P2 (Optional/Stretch)**: pgvector for semantic search, Live station data connectors, Analytics dashboard.
- **P3 (Do Not Build)**: Neo4j, Microservices, Real-time social posting, 3D digital twin.

## C. 72-Hour Execution Plan

### Phase 1: Foundation (Hours 0-6)
1. Initialize Go backend (`/backend`), set up Gin, PostgreSQL connection, health endpoint.
2. Initialize React frontend (`/frontend`) with Vite, TypeScript, Tailwind, React Router.
3. Configure environment variables (Supabase, Groq).

### Phase 2: Core Backend + Database (Hours 6-18)
1. Write PostgreSQL migrations for core tables (Expeditions, Resources, Relations).
2. Seed a small, coherent dataset (3-5 expeditions, 10-15 reports/publications/datasets) mapping to official NCPOR data.
3. Implement core CRUD Go handlers for Resources and Expeditions.
4. Implement PostgreSQL Full-Text Search.

### Phase 3: Core Frontend (Hours 18-30)
1. Scaffold layout, Navbar, conforming to `DESIGN.md`.
2. Build Home, Repository list, Search/Filters.
3. Build Resource Detail and Expedition Detail pages.
4. Integrate basic Leaflet Map with static markers.

### Phase 4: AI Integration (Hours 30-42)
1. Implement Go handler for Groq API integration.
2. Build `Ask Polar AI` with mandatory source citations.
3. Build `Polar Outreach Studio` (Generate Student/Public drafts).
4. Ensure structured JSON output from Groq.

### Phase 5: Review & Provenance (Hours 42-54)
1. Implement Admin Review Queue (`DRAFT` -> `APPROVED`).
2. Build audit logging.
3. Hook up UI state to show explicit error handling and "Insufficient Evidence" AI handling.

### Phase 6: Polish & Freeze (Hours 54-72)
1. Visual consistency pass (strict adherence to `DESIGN.md`).
2. Finalize seed data quality.
3. Rehearse demo flow end-to-end.
4. Deploy (if required) or ensure local resilience. Freeze code.
