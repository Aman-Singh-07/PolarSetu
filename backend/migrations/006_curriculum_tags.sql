-- Curriculum concepts lookup table
CREATE TABLE IF NOT EXISTS curriculum_concepts (\n    id SERIAL PRIMARY KEY,
    class INT NOT NULL CHECK (class BETWEEN 8 AND 12),
    subject VARCHAR(100) NOT NULL,
    concept VARCHAR(255) NOT NULL,
    nep_tags TEXT[] DEFAULT '{}',  -- NEP 2020 alignment tags
    description TEXT,
    UNIQUE(class, subject, concept)
);

-- Link resources to curriculum concepts
CREATE TABLE IF NOT EXISTS resource_curriculum_tags (
    resource_id VARCHAR(50) REFERENCES resources(id) ON DELETE CASCADE,
    concept_id INT REFERENCES curriculum_concepts(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, concept_id)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_class ON curriculum_concepts(class);
CREATE INDEX IF NOT EXISTS idx_curriculum_subject ON curriculum_concepts(subject);
CREATE INDEX IF NOT EXISTS idx_resource_curriculum ON resource_curriculum_tags(resource_id);

-- Seed data: Core concepts for Classes 8-12
INSERT INTO curriculum_concepts (class, subject, concept, nep_tags, description) VALUES
-- Class 8
(8, 'Science', 'Conservation of Plants and Animals', '{"Environmental Awareness","Biodiversity"}', 'NCERT Class 8 Ch 7: Deforestation, conservation, biosphere reserves'),
(8, 'Geography', 'Resources and Development', '{"Sustainable Development"}', 'NCERT Class 8: Natural resources, conservation strategies'),
-- Class 9
(9, 'Science', 'Natural Resources', '{"Environmental Awareness","Sustainability"}', 'NCERT Class 9 Ch 14: Air, water, soil pollution; ozone depletion'),
(9, 'Geography', 'Climate', '{"Climate Literacy"}', 'NCERT Class 9 Ch 4: Factors affecting climate, Indian monsoon'),
-- Class 10
(10, 'Science', 'Our Environment', '{"Ecosystem Thinking","Biodiversity"}', 'NCERT Class 10 Ch 15: Ecosystems, food chains, ozone depletion'),
(10, 'Science', 'Management of Natural Resources', '{"Sustainability","Conservation"}', 'NCERT Class 10 Ch 16: Conservation, sustainable development'),
(10, 'Geography', 'Water Resources', '{"Water Literacy","Sustainability"}', 'NCERT Class 10 Ch 3: Dams, rainwater harvesting, water scarcity'),
-- Class 11
(11, 'Geography', 'Water in the Atmosphere', '{"Climate Literacy","Hydrology"}', 'NCERT Class 11 Ch 11: Evaporation, humidity, precipitation'),
(11, 'Geography', 'World Climate and Climate Change', '{"Climate Literacy","Global Awareness"}', 'NCERT Class 11 Ch 12: Climate types, greenhouse effect, global warming'),
(11, 'Biology', 'Ecosystem', '{"Ecosystem Thinking","Biodiversity"}', 'NCERT Class 11 Ch 14: Productivity, decomposition, energy flow'),
(11, 'Environmental Science', 'Biodiversity and Conservation', '{"Biodiversity","Conservation"}', 'NCERT Class 11: Patterns, importance, threats to biodiversity'),
-- Class 12
(12, 'Biology', 'Organisms and Populations', '{"Ecology","Adaptation"}', 'NCERT Class 12 Ch 13: Adaptations, population attributes'),
(12, 'Biology', 'Ecosystem', '{"Ecosystem Thinking"}', 'NCERT Class 12 Ch 14: Energy flow, nutrient cycling'),
(12, 'Biology', 'Biodiversity and Conservation', '{"Biodiversity","Conservation","Sustainability"}', 'NCERT Class 12 Ch 15: Biodiversity patterns, conservation strategies'),
(12, 'Geography', 'Geographical Perspective on Selected Issues', '{"Environmental Awareness","Global Awareness"}', 'NCERT Class 12: Environmental pollution, climate change impacts'),
(12, 'Environmental Science', 'Climate Change and Cryosphere', '{"Climate Literacy","Polar Science"}', 'NEP 2020 interdisciplinary: Polar ice sheets, sea level rise, albedo effect')
ON CONFLICT (class, subject, concept) DO NOTHING;

-- Seed data: Link resources to concepts
INSERT INTO resource_curriculum_tags (resource_id, concept_id) VALUES
('RPT-2024-001', 4),  -- Climate (Class 9 Geography)
('RPT-2024-001', 5),  -- Our Environment (Class 10 Science)
('RPT-2024-001', 8),  -- Water in the Atmosphere (Class 11 Geography)
('RPT-2024-001', 9),  -- World Climate and Climate Change (Class 11 Geography)
('RPT-2024-001', 16), -- Climate Change and Cryosphere (Class 12 Env Science)
('DTS-2023-014', 4),  -- Climate (Class 9 Geography)
('DTS-2023-014', 5),  -- Our Environment (Class 10 Science)
('DTS-2023-014', 9),  -- World Climate and Climate Change (Class 11 Geography)
('DTS-2023-014', 16), -- Climate Change and Cryosphere (Class 12 Env Science)
('PUB-2023-088', 2),  -- Resources and Development (Class 8 Geography)
('PUB-2023-088', 16)  -- Climate Change and Cryosphere (Class 12 Env Science)
ON CONFLICT DO NOTHING;
