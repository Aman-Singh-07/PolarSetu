# Deployment Guide

This document describes the deployment architecture and status of the AICYGRAM platform.

## Architecture Status

* **Frontend**: Vercel (Deployed & Verified)
* **Backend**: Render / Docker (Configured but live public URL not yet verified in this repository)
* **Database**: Supabase PostgreSQL (Configured & Verified)
* **Storage**: Supabase Cloud Storage (Configured & Verified)
* **AI Provider**: Groq API (Configured & Verified)

## Environment Configuration

### Frontend (Vercel)
The React client requires the backend API URL injected during the build process.
* `VITE_API_BASE_URL`: The production URL of the Go backend (e.g., `https://aicygram-api.render.com`).

**Routing Note:** The repository includes a `vercel.json` file providing SPA fallback rewrites so that direct navigation to paths like `/media` correctly loads `index.html`.

### Backend (Render / Docker)
The Go REST API is containerized (see `backend/Dockerfile`) and requires the following environment variables provided by the hosting environment:

* `PORT`: Usually automatically supplied by hosts like Render (e.g., `8080`).
* `DATABASE_URL`: Full PostgreSQL connection string pointing to Supabase.
* `JWT_SECRET`: A strong cryptographic key for signing authentication tokens.
* `GROQ_API_KEY`: API key for the AI LLM inference.
* `SUPABASE_URL`: The base URL of the Supabase project.
* `SUPABASE_SERVICE_KEY`: The privileged service role key for backend-mediated storage actions.
* `CORS_ORIGIN`: Ensure CORS is configured to allow requests from the specific Vercel frontend domain.

## Database Migrations
Migrations are located in `backend/migrations`. When deploying to a fresh Supabase database, ensure these SQL scripts are applied sequentially to establish the schema, indices, and required tables before starting the backend service.

## Security Considerations
* Ensure the frontend `.env.local` contains **no** privileged secrets, only public configuration like the API Base URL.
* Protect the Supabase Service Key; it bypasses RLS (Row Level Security) and should only ever exist within the Go backend environment variables.
