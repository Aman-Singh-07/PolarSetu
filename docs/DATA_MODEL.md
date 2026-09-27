# DATA MODEL (PostgreSQL)

Normalized, relational schema optimized for PostgreSQL without requiring a graph database.

## Core Tables

### `users`
- `id` (UUID, PK)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (String)
- `created_at` (Timestamp)

### `expeditions`
- `id` (UUID, PK)
- `name` (String)
- `region` (String)
- `year` (Integer)
- `start_date` (Date)
- `end_date` (Date)
- `objective` (Text)
- `latitude` (Float)
- `longitude` (Float)
- `source_url` (String)

### `resources` (Shared Catalog)
- `id` (UUID, PK)
- `type` (Enum: REPORT, PUBLICATION, DATASET, PHOTO, VIDEO, ACTIVITY, EXPEDITION, OTHER)
- `title` (String)
- `description` (Text)
- `year` (Integer)
- `region` (String)
- `source_url` (String)
- `storage_path` (String)
- `license` (String)
- `status` (Enum: DRAFT, IN_REVIEW, APPROVED, PUBLISHED, REJECTED)
- `created_at` (Timestamp)

### `resource_expedition` (Join Table)
- `resource_id` (UUID, FK)
- `expedition_id` (UUID, FK)

### `resource_relations` (Provenance/Lineage)
- `from_resource_id` (UUID, FK)
- `to_resource_id` (UUID, FK)
- `relation_type` (String)

### `resource_chunks` (For AI Grounding)
- `id` (UUID, PK)
- `resource_id` (UUID, FK)
- `page_number` (Integer)
- `section` (String)
- `content` (Text)
- `search_vector` (tsvector)

### `ai_generations` (Outreach Studio / Audit)
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `source_ids` (JSONB / Array of UUIDs)
- `audience` (String)
- `output_type` (String)
- `content` (Text)
- `status` (Enum: DRAFT, APPROVED, REJECTED)
- `created_at` (Timestamp)

### `audit_log`
- `id` (UUID, PK)
- `actor_id` (UUID, FK)
- `action` (String)
- `entity_type` (String)
- `entity_id` (UUID)
- `created_at` (Timestamp)
