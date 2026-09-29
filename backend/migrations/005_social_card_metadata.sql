-- Add structured metadata column to ai_generations
-- Stores template config, selected media ID, and rendered card URL
ALTER TABLE ai_generations ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add columns to media for richer discovery
ALTER TABLE media ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';
ALTER TABLE media ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE media ADD COLUMN IF NOT EXISTS year INT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE media ADD COLUMN IF NOT EXISTS expedition_id VARCHAR(50);

-- Index for efficient media filtering by expedition
CREATE INDEX IF NOT EXISTS idx_media_expedition_id ON media(expedition_id);
