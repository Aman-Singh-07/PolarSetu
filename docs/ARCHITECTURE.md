# ARCHITECTURE

## Constraints & Philosophy
The architecture is intentionally simple and pragmatic to guarantee a working prototype within the 72-hour hackathon window. Reliability and end-to-end integration are prioritized over enterprise complexity.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (adhering strictly to `DESIGN.md`)
- **Routing/Icons**: React Router, Lucide React
- **Geospatial**: Leaflet / React Leaflet (No live telemetry scraping, static/seeded markers only)
- **Backend**: Go + Gin (REST API)
- **Database**: PostgreSQL (Relational schema, no Neo4j, no multiple DBs)
- **Search**: PostgreSQL Full-Text Search (pg_trgm) initially. pgvector is strictly a post-MVP stretch goal.
- **Storage**: Supabase Storage
- **AI**: Groq API (Strictly called from the Go backend, never the frontend)
- **Auth**: Admin authentication only for the MVP via JWT/bcrypt.

## Architectural Flow
```text
User -> React UI -> REST/JSON -> Go/Gin API -> PostgreSQL (Metadata/Audit/Search)
                                            -> Supabase Storage (Files)
                                            -> Groq (Source-grounded AI)
```

## Anti-Patterns (Do NOT Introduce)
- Next.js, Node/Express, Python (Flask/FastAPI)
- Microservices, Kafka, Redis, Elasticsearch, Neo4j, Kubernetes
- Serverless fragmentation
- Multiple AI backends
- Hardcoded secrets in the frontend
