# Local Backend Setup

This document describes how to set up and run the PolarSetu backend locally.

## Requirements
- **Go**: `1.27.1` (or `1.27.0`) is required. On Windows, this can be installed via `winget install GoLang.Go`.
- **Docker & Docker Compose**: Required for running the PostgreSQL database.

## Database Setup
The default PostgreSQL port `5432` may conflict with an existing host PostgreSQL service.
To avoid conflicts, the `docker-compose.yml` file is configured to map the container's `5432` port to the host's `5444` port.
- **Host Port**: `5444`
- **Container Port**: `5432`

Start the database with:
```bash
docker-compose up -d
```
The initialization scripts in `backend/migrations` will automatically create the `PolarSetu` database, configure the `polarsetu` user, run schemas, and insert seed data.
If you need to perform a fresh DB reset, you can remove the docker volume and recreate it:
```bash
docker-compose down -v
docker-compose up -d
```

## Environment Variables
The `.env` file in the `backend/` directory should contain the following variables (names only, no real values):
- `PORT` (e.g., `8080`)
- `DATABASE_URL` (must use `127.0.0.1:5444` to avoid IPv6 `localhost` resolution errors)
- `JWT_SECRET`
- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` (Required for backend upload)

## Backend Startup
A startup script `backend/start.ps1` is provided to quickly launch the Go backend in PowerShell:
```powershell
.\start.ps1
```
Alternatively, build and run manually:
```bash
go mod download
go build -o server.exe ./cmd/server
./server.exe
```

## Health Check & API Base
Verify the server is running by hitting the health check endpoint:
```bash
curl http://localhost:8080/api/health
```
Expected response: `{"status": "ok", "version": "1.0", "timestamp": ...}`
The API Base URL for local frontend connections is `http://localhost:8080/api`.

## Local Development Auth Setup
The `002_seed_data.sql` script creates a default development admin user.
- **Email**: `admin@polarsetu.in`
- **Password**: `password123`

You can authenticate locally via:
```bash
curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@polarsetu.in", "password":"password123"}'
```

### Supabase Storage Setup
- **Bucket Name**: resources
- **Required Env Variables**: SUPABASE_URL, SUPABASE_SERVICE_KEY
- **Setup**: Create a public bucket named 'resources' in the Supabase dashboard or via API.
