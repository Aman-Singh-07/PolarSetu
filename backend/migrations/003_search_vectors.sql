-- Phase 4: Configure Search Vector Engine

-- 1. Create the specialized GIN Index on the search_vector column. 
-- This allows PostgreSQL to perform incredibly fast weighted lexeme lookups without scanning every row.
CREATE INDEX IF NOT EXISTS resources_search_idx ON resources USING GIN (search_vector);

-- 2. Backfill existing seeded resources.
-- This concatenates the Title, Type, and Description into a massive weighted text tokenized vector payload.
-- (A creates highest rank priority for title, followed by B for type, then C for body text)
UPDATE resources
SET search_vector = 
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') || 
    setweight(to_tsvector('english', COALESCE(type, '')), 'B') || 
    setweight(to_tsvector('english', COALESCE(description, '')), 'C');

-- 3. Create a Postgres Trigger function.
-- This ensures that anytime the Backend inserts or updates a resource, the search_vector is automatically regenerated.
CREATE OR REPLACE FUNCTION resources_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') || 
        setweight(to_tsvector('english', COALESCE(NEW.type, '')), 'B') || 
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 4. Attach the Postgres Trigger to the 'resources' table.
DROP TRIGGER IF EXISTS tsvector_update_trigger ON resources;
CREATE TRIGGER tsvector_update_trigger
    BEFORE INSERT OR UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION resources_search_vector_update();
