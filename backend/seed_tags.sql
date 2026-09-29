INSERT INTO resource_curriculum_tags (resource_id, concept_id) VALUES
-- RPT-2024-001 (Arctic Expedition Report) covers biology, ecosystems, natural resources
('RPT-2024-001', 1),
('RPT-2024-001', 3),
('RPT-2024-001', 6),
('RPT-2024-001', 7),
('RPT-2024-001', 10),
('RPT-2024-001', 11),
('RPT-2024-001', 12),
('RPT-2024-001', 13),
('RPT-2024-001', 14),
('RPT-2024-001', 15),

-- DTS-2023-014 (Sea Ice Dataset) covers water, geography, and specific geography issues
('DTS-2023-014', 7),
('DTS-2023-014', 8),
('DTS-2023-014', 15),

-- PUB-2023-088 (Geological evolution) covers natural resources
('PUB-2023-088', 3),
('PUB-2023-088', 6)
ON CONFLICT DO NOTHING;
