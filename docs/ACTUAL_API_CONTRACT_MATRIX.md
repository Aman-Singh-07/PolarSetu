# POLARSETU API Contract Matrix

This document maps the actual implemented Go backend endpoints to the frontend requirements.

| Frontend Feature | HTTP Method | Backend Endpoint | Request | Response | Status | Verified Locally |
|------------------|-------------|------------------|---------|----------|--------|------------------|
| Health Check | GET | `/api/health` | - | `{"status": "ok", ...}` | Implemented | YES |
| Auth Login | POST | `/api/auth/login` | `{email, password}` | `{token, user}` | Implemented | YES |
| Expeditions List | GET | `/api/expeditions` | - | `[]Expedition` | Implemented | YES (Frontend Integrated) |
| Expedition Detail | GET | `/api/expeditions/:id` | - | `ExpeditionDetail (w/ Resources)` | Implemented | YES (Frontend Integrated) |
| Expedition Create | POST | `/api/expeditions` | `CreateExpeditionRequest` | `Expedition` | Implemented (Protected) | YES |
| Resources List | GET | `/api/resources` | - | `[]Resource` | Implemented | YES |
| Resource Detail | GET | `/api/resources/:id` | - | `ResourceDetail` | Implemented | YES |
| Resource Create | POST | `/api/resources` | `CreateResourceRequest` | `Resource` | Implemented (Protected) | YES |
| Resource Upload | POST | `/api/resources/:id/upload` | `multipart/form-data (field: file)` | `{status, message, url}` | Implemented (Protected) | YES |
| Resource Relations | GET | `/api/resources/:id/relations` | - | `[]ResourceRelation` | Implemented | YES |
| Resource Rel Create | POST | `/api/resources/:id/relations` | `ResourceRelation` | `ResourceRelation` | Implemented (Protected) | YES |
| Media List | GET | `/api/media` | - | `[]Media` | Implemented | YES |
| Activities List | GET | `/api/activities` | - | `[]Activity` | Implemented | YES |
| Search | GET | `/api/search?q=` | - | `{"query": string, "results": []Resource}` | Implemented | YES |
| AI Ask | POST | `/api/ai/ask` | `{question, resource_id}` | `{answer, sources}` | Implemented | YES |
| AI Outreach | POST | `/api/ai/outreach` | `{source_ids, audience, format}` | `AIGeneration` | Implemented (Protected) | YES |
| Review Queue | GET | `/api/review/queue` | - | `[]AIGeneration` | Implemented (Protected) | YES |
| Review Approve | POST | `/api/review/:id/approve` | - | `AIGeneration` | Implemented (Protected) | YES |
| Review Reject | POST | `/api/review/:id/reject` | - | `AIGeneration` | Implemented (Protected) | YES |

## Notes & Discrepancies
- Update (PUT/PATCH) endpoints are **NOT IMPLEMENTED** for resources and expeditions.
- Delete (DELETE) endpoints are **NOT IMPLEMENTED**.
- There is no station/map endpoint available in the backend. Map data must remain prototype.
- Supabase upload is handled via backend POST `/api/resources/:id/upload`.
