-- Phase 2: Seed Mock Data for PolarSetu independent backend development
-- Data derived from handbook constraints: realistic, traceable, small seed dataset.

-- 1. Seed Admin User
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@polarsetu.in', '$2a$10$0tPrQCnDWpSCgnfaUzgGT.p2gea2l.QD2lJwTjhKn4puujPlgguWW', 'admin');
-- Note: 'password_hash' is a bcrypt hash for 'password123'

-- 2. Seed Expeditions
INSERT INTO expeditions (id, name, region, year, start_date, end_date, objective, latitude, longitude, source_url) VALUES 
(1, '43rd Indian Scientific Expedition to Antarctica', 'Antarctica', 2023, '2023-11-01', '2024-04-30', 'Continuous monitoring of polar climate, geology, and biology.', -70.7667, 11.7333, 'https://ncpor.res.in/pages/display/384-antarctic-records'),
(2, '15th Indian Arctic Expedition', 'Arctic', 2024, '2024-06-01', '2025-05-31', 'Winter phase Arctic monitoring and sea ice research.', 78.9167, 11.9333, 'https://www.ncpor.res.in/arctics/display/452-reports');

-- Reset simple sequence
SELECT setval('expeditions_id_seq', (SELECT MAX(id) FROM expeditions));

-- 3. Seed Resources
INSERT INTO resources (id, type, title, description, year, region, source_url, storage_path, license, status) VALUES 
('RPT-2024-001', 'REPORT', '15th Indian Arctic Expedition Report (2024–2025)', 'Official technical report covering the first winter-phase operations in the Arctic.', 2024, 'Arctic', 'https://www.ncpor.res.in/arctics/display/452-reports', '/storage/rpt-2024-001.pdf', 'Creative Commons / NCPOR', 'APPROVED'),
('DTS-2023-014', 'DATASET', 'Sea Ice Concentration around Himadri Station (2023)', 'Monthly sea ice variations captured from live telemetry data and physical observations.', 2023, 'Arctic', 'https://npdc.ncpor.res.in/', '/storage/data-ice-2023.csv', 'Open Data', 'APPROVED'),
('PUB-2023-088', 'PUBLICATION', 'Geological evolution of the Schirmacher Oasis', 'Comprehensive study on the bedrock formations around the Maitri station in Antarctica.', 2023, 'Antarctica', 'https://ncpor.res.in/libraries', '', 'Restricted Access', 'APPROVED'),
('IMG-2024-010', 'PHOTO', 'Himadri Station in winter', 'First views of the Himadri station during prolonged winter darkness.', 2024, 'Arctic', '', '/storage/himadri-winter.jpg', 'CC-BY-NC', 'APPROVED');

-- 4. Seed Resource-Expedition Relationships
INSERT INTO resource_expedition (resource_id, expedition_id) VALUES 
('RPT-2024-001', 2), -- the Arctic report maps to the Arctic expedition
('DTS-2023-014', 2), -- the dataset maps to the Arctic expedition
('PUB-2023-088', 1); -- the publication maps to the Antarctic expedition

-- 5. Seed Activities
INSERT INTO activities (title, date, description, source_url, media_url) VALUES 
('Successful launch of winter Arctic Phase', '2024-06-15', 'NCPOR officially announced the commencement of physical operations for the winter phase of the Himadri station.', 'https://ncpor.res.in/pages/display/373-outreachprogram', ''),
('National Science Day Outreach Event', '2024-02-28', 'NCPOR scientists engaged with over 5,000 students across the country in an interactive webinar.', 'https://ncpor.res.in/pages/display/373-outreachprogram', '');

