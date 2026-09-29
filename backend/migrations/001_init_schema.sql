-- Phase 2: Core Database Schema for Aicygram

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expeditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    year INT,
    start_date DATE,
    end_date DATE,
    objective TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
    id VARCHAR(50) PRIMARY KEY, -- e.g., RPT-2025-001
    type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    year INT,
    region VARCHAR(100),
    source_url TEXT,
    storage_path TEXT,
    license VARCHAR(100),
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resource_expedition (
    resource_id VARCHAR(50) REFERENCES resources(id) ON DELETE CASCADE,
    expedition_id INT REFERENCES expeditions(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, expedition_id)
);

CREATE TABLE resource_relations (
    from_resource_id VARCHAR(50) REFERENCES resources(id) ON DELETE CASCADE,
    to_resource_id VARCHAR(50) REFERENCES resources(id) ON DELETE CASCADE,
    relation_type VARCHAR(100),
    PRIMARY KEY (from_resource_id, to_resource_id)
);

CREATE TABLE resource_chunks (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(50) REFERENCES resources(id) ON DELETE CASCADE,
    page_number INT,
    section TEXT,
    content TEXT NOT NULL
    -- Note: search_vector TSVECTOR will be added during Phase 4 implementation
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE,
    description TEXT,
    source_url TEXT,
    media_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(50) REFERENCES resources(id) ON DELETE CASCADE,
    media_type VARCHAR(50),
    url TEXT NOT NULL,
    caption TEXT,
    attribution TEXT
);

CREATE TABLE ai_generations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    source_ids TEXT[], -- Array of resource IDs used as context
    audience VARCHAR(100),
    output_type VARCHAR(100), 
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    actor_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
