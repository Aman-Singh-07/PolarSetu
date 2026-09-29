-- Phase 2: Seed Mock Data for Aicygram independent backend development
-- Data derived from handbook constraints: realistic, traceable, comprehensive polar dataset.

-- 1. Seed Admin User
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@aicygram.in', '$2a$10$0tPrQCnDWpSCgnfaUzgGT.p2gea2l.QD2lJwTjhKn4puujPlgguWW', 'admin')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
-- 2. Seed Expeditions
INSERT INTO expeditions (id, name, region, year, start_date, end_date, objective, latitude, longitude, source_url) VALUES 
(1, '43rd Indian Scientific Expedition to Antarctica', 'Antarctica', 2023, '2023-11-01', '2024-04-30', 'Continuous monitoring of polar climate, ice shelf dynamics, atmospheric physics, and marine biogeochemistry at Maitri and Bharati stations.', -69.4068, 76.1950, 'https://ncpor.res.in/pages/display/384-antarctic-records'),
(2, '15th Indian Arctic Expedition', 'Arctic', 2024, '2024-06-01', '2025-05-31', 'Inaugural winter-phase operations at Himadri Station (Ny-Ålesund), continuous atmospheric aerosol monitoring, fjord oceanography, and sea ice physics.', 78.9220, 11.9280, 'https://ncpor.res.in/arctics/display/452-reports'),
(3, '42nd Indian Scientific Expedition to Antarctica', 'Antarctica', 2022, '2022-11-15', '2023-04-15', 'Glaciological ice core drilling, boundary layer meteorology, and paleoclimate reconstruction in East Antarctica.', -70.7667, 11.7333, 'https://ncpor.res.in/pages/display/384-antarctic-records'),
(4, '14th Indian Arctic Expedition', 'Arctic', 2023, '2023-06-10', '2024-05-20', 'Kongsfjorden fjord dynamics, biogeochemical carbon cycling, and annual retrieval/servicing of the IndARC moored observatory.', 78.9167, 11.9333, 'https://ncpor.res.in/arctics/display/452-reports'),
(5, 'Indian Himalayan Cryospheric Expedition (Himansh)', 'Himalayas', 2023, '2023-05-01', '2023-10-31', 'High-altitude cryospheric monitoring in Chandra-Bhaga basin (4,080m), automated weather station telemetry, and benchmark glacier mass balance.', 32.4000, 77.6000, 'https://ncpor.res.in/pages/display/385-cryosphere'),
(6, '12th Indian Southern Ocean Expedition (ISOE)', 'Southern Ocean', 2020, '2020-01-10', '2020-03-25', 'Hydrodynamics, primary productivity, and particulate organic carbon flux across Subtropical, Subantarctic, and Polar Frontal zones.', -55.0000, 57.5000, 'https://ncpor.res.in/pages/display/386-southern-ocean'),
(7, '41st Indian Scientific Expedition to Antarctica', 'Antarctica', 2021, '2021-11-05', '2022-04-20', 'Reconnaissance of inland ice traverses, lake sediment coring at Schirmacher Oasis, and microbial extremophile sampling.', -70.7667, 11.7333, 'https://ncpor.res.in/pages/display/384-antarctic-records')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    region = EXCLUDED.region,
    year = EXCLUDED.year,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    objective = EXCLUDED.objective,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    source_url = EXCLUDED.source_url;

SELECT setval('expeditions_id_seq', (SELECT MAX(id) FROM expeditions));

-- 3. Seed Resources
INSERT INTO resources (id, type, title, description, year, region, source_url, storage_path, license, status) VALUES 
('RPT-2024-001', 'REPORT', '15th Indian Arctic Expedition Report (2024–2025)', 
 'Official technical report detailing India''s inaugural wintering operation at the Himadri Station in Ny-Ålesund, Svalbard (78.9°N). Documents continuous atmospheric aerosol monitoring, Kongsfjorden fjord hydrography, winter sea ice physics, logistics, and power cogeneration under extreme polar night conditions.', 
 2024, 'Arctic', 'https://ncpor.res.in/arctics/display/452-reports', '/storage/rpt-2024-001.pdf', 'Creative Commons / NCPOR', 'APPROVED'),

('DTS-2023-014', 'DATASET', 'Sea Ice Concentration and Telemetry around Himadri Station (2023–2024)', 
 'High-resolution passive microwave observations, moored CTD salinity profiles, and in-situ ice thickness telemetry across the Kongsfjorden fjord system (78.9°N–79.1°N), documenting seasonal freezing front velocities and Atlantic water intrusions.', 
 2023, 'Arctic', 'https://npdc.ncpor.res.in/', '/storage/data-ice-2023.csv', 'Open Data', 'APPROVED'),

('PUB-2023-088', 'PUBLICATION', 'Geological and Glacial Evolution of Schirmacher Oasis, East Antarctica', 
 'Peer-reviewed study analyzing the bedrock polymetamorphic granulites, structural deformation history, and post-LGM glacial retreat around Maitri Station, East Antarctica, utilizing zircon U-Pb geochronology and cosmogenic nuclide dating.', 
 2023, 'Antarctica', 'https://ncpor.res.in/libraries', '', 'Restricted Access', 'APPROVED'),

('PUB-2024-012', 'PUBLICATION', 'Antarctic Sea Ice Dynamics and Polynya Formations during the 43rd Indian Expedition (2024)', 
 'Comprehensive multi-satellite and shipboard radiometer investigation into the record-low sea ice extent observed during the 2023–2024 austral winter in the Cosmonaut and Weddell Seas, driven by anomalous katabatic wind stress and warm deep water upwelling.', 
 2024, 'Antarctica', 'https://ncpor.res.in/publications/antarctic-sea-ice-2024', '', 'Open Access', 'APPROVED'),

('PUB-2023-045', 'PUBLICATION', 'Atmospheric Black Carbon Deposition on Kongsfjorden Glaciers and Albedo Reduction', 
 'In-situ aerosol measurements using a multi-wavelength Aethalometer (AE-33) at Himadri Station demonstrating episodic black carbon transport from mid-latitude Eurasian wildfires and industrial plumes, causing a 0.032 surface albedo drop and accelerating summer melt on Vestre Lovénbreen glacier.', 
 2023, 'Arctic', 'https://ncpor.res.in/publications/black-carbon-arctic', '', 'Open Access', 'APPROVED'),

('DTS-2024-007', 'DATASET', '43rd Antarctic Expedition Physical Oceanography and CTD Hydrographic Profiles', 
 'Physical oceanography dataset containing 124 Conductivity-Temperature-Depth (CTD) casts, 18 autonomous Argo float profiles, and continuous underway fluorometry collected between Cape Town, South Africa, and Bharati Station in Prydz Bay (40°S to 69°S).', 
 2024, 'Antarctica', 'https://npdc.ncpor.res.in/datasets/ctd-43-antarctic', '/storage/ctd-43rd-oceanography.nc', 'Open Data', 'APPROVED'),

('PUB-2022-031', 'PUBLICATION', 'Psychrotolerant and Psychrophilic Bacterial Strains Isolated from Lake Priyadarshini, Schirmacher Oasis', 
 'Microbiological investigation characterizing cold-active, enzyme-producing bacterial isolates (Planococcus antarcticus and Pseudomonas strain PRI-4) from perennially ice-capped Lake Priyadarshini near Maitri station, highlighting exopolysaccharide cryoprotectants and biotechnological lipases active at -4°C.', 
 2022, 'Antarctica', 'https://ncpor.res.in/libraries/microbiology-priyadarshini', '', 'Open Access', 'APPROVED'),

('RPT-2023-005', 'REPORT', 'Himalayan Cryosphere Monitoring and Glacier Mass Balance at Himansh Station (2023)', 
 'Annual technical assessment from the Himansh Observatory (4,080m MSL) in the Spiti Valley, reporting mass balance measurements, geodetic surveys, runoff discharge rates, and automated meteorological telemetry for the Sutri Dhaka and Batal glaciers in the Upper Indus Basin.', 
 2023, 'Himalayas', 'https://ncpor.res.in/cryosphere/himansh-report-2023', '/storage/himansh-annual-2023.pdf', 'Creative Commons / NCPOR', 'APPROVED'),

('DTS-2023-022', 'DATASET', 'IndARC Underwater Moored Observatory Hydrographic Time Series (Kongsfjorden)', 
 'Subsurface moored observatory data deployed at 192m depth in Kongsfjorden fjord, Svalbard. Logs year-round hourly water temperature, conductivity, salinity, dissolved oxygen, and acoustic Doppler current profiler (ADCP) velocity vectors.', 
 2023, 'Arctic', 'https://npdc.ncpor.res.in/indarc-time-series', '/storage/indarc-mooring-2023.csv', 'Open Data', 'APPROVED'),

('PUB-2021-019', 'PUBLICATION', 'Biogeochemical Carbon Export and Phytoplankton Assemblages in the Indian Sector of the Southern Ocean', 
 'Assessment of particulate organic carbon (POC) export efficiency, diatom-to-dinoflagellate ratios, and trace metal bioavailability across the Subtropical Front and Polar Frontal Zone during the 12th Indian Southern Ocean Expedition.', 
 2021, 'Southern Ocean', 'https://ncpor.res.in/libraries/isoe-carbon-export', '', 'Open Access', 'APPROVED'),

('DTS-2024-030', 'DATASET', 'Automated Weather Station (AWS) Meteorological Telemetry from Bharati Station (2023–2024)', 
 'Continuous 10-minute meteorological record from Bharati Station, Larsemann Hills, Antarctica (-69.41°S, 76.20°E), measuring surface air temperature, surface atmospheric pressure, wind direction, gust velocity up to 88 knots, and incoming solar radiation.', 
 2024, 'Antarctica', 'https://npdc.ncpor.res.in/aws-bharati-2024', '/storage/aws-bharati-telemetry.csv', 'Open Data', 'APPROVED'),

('PUB-2024-055', 'PUBLICATION', 'Microbial Community Succession and Active-Layer Dynamics in Ny-Ålesund Permafrost', 
 'High-throughput 16S rRNA gene amplicon sequencing examining seasonal active-layer soil thaw dynamics adjacent to Himadri Base, revealing metabolic shifts in nitrogen-fixing diazotrophs and methanotrophic bacteria under warming Arctic soil conditions.', 
 2024, 'Arctic', 'https://ncpor.res.in/publications/permafrost-microbiome-2024', '', 'Open Access', 'APPROVED'),

('IMG-2024-010', 'PHOTO', 'Himadri Station Under Winter Polar Night', 
 'Archival photograph of India''s Arctic research base Himadri illuminated against the continuous polar night sky in Ny-Ålesund, Svalbard (78.9°N), marking the station''s first historic year-round manned scientific campaign.', 
 2024, 'Arctic', '', '/storage/himadri-winter.jpg', 'CC-BY-NC', 'APPROVED'),

('IMG-2023-002', 'PHOTO', 'Bharati Station Research Complex in Larsemann Hills', 
 'Panoramic photograph showing the state-of-the-art modular aerodynamic architecture of Bharati Station, Antarctica, nestled between Grovnes peninsula rocks with its radome satellite Earth station visible.', 
 2023, 'Antarctica', '', '/storage/bharati-station.jpg', 'CC-BY-NC', 'APPROVED'),

('IMG-2023-003', 'PHOTO', 'Maitri Station and Lake Priyadarshini Limnological Station', 
 'Winter aerial capture of Maitri station modules, fuel farm, and the pristine frozen surface of Lake Priyadarshini in the Schirmacher Oasis of Dronning Maud Land.', 
 2023, 'Antarctica', '', '/storage/maitri-lake.jpg', 'CC-BY-NC', 'APPROVED'),

('IMG-2024-004', 'PHOTO', 'Himansh High-Altitude Observatory in Chandra Basin (4,080m)', 
 'Visual record of the Himansh glaciological research camp and automated weather station masts in the remote, snow-clad Spiti Valley Himalayas.', 
 2024, 'Himalayas', '', '/storage/himansh-base.jpg', 'CC-BY-NC', 'APPROVED'),

('IMG-2024-005', 'PHOTO', 'IndARC Mooring Deployment from R/V Kronprins Haakon', 
 'Marine technician deployment of the multi-instrument IndARC mooring string into Kongsfjorden fjord to monitor Arctic subsurface circulation and climate teleconnections.', 
 2024, 'Arctic', '', '/storage/indarc-deployment.jpg', 'CC-BY-NC', 'APPROVED')

ON CONFLICT (id) DO UPDATE SET 
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    year = EXCLUDED.year,
    region = EXCLUDED.region,
    source_url = EXCLUDED.source_url,
    storage_path = EXCLUDED.storage_path,
    license = EXCLUDED.license,
    status = EXCLUDED.status;

-- 4. Seed Grounding Chunks in resource_chunks
DELETE FROM resource_chunks;

INSERT INTO resource_chunks (resource_id, page_number, section, content) VALUES
('RPT-2024-001', 1, 'Executive Summary & Wintering Milestone', 
 'The 15th Indian Arctic Expedition marked a historic operational milestone in Indian polar science: the successful commencement of year-round scientific operations at the Himadri Station in Ny-Ålesund, Svalbard (78.9°N, 11.9°E). Conducted under the mandate of the Ministry of Earth Sciences (MoES) and managed by the National Centre for Polar and Ocean Research (NCPOR), Goa, the wintering team maintained uninterrupted atmospheric, glaciological, and oceanographic monitoring through the harsh polar night from November 2024 to March 2025.'),

('RPT-2024-001', 3, 'Atmospheric Physics & Aerosol Telemetry', 
 'Continuous measurements of atmospheric black carbon (BC) concentrations were performed at Himadri using a dual-spot 7-wavelength Aethalometer (Magee Scientific AE-33). Ground-level black carbon levels showed background winter averages of 12.4 ± 3.1 ng/m³, punctuated by episodic long-range transport events originating from Northern Eurasian industrial and agricultural combustion zones, where values spiked to 48.7 ng/m³. Concurrent multi-axis differential optical absorption spectroscopy (MAX-DOAS) captured tropospheric bromine monoxide (BrO) plumes during spring sunrise, driving ozone depletion events in the marine boundary layer.'),

('RPT-2024-001', 7, 'Kongsfjorden Oceanography & IndARC Integration', 
 'Marine operations integrated real-time acoustic telemetry from the IndARC subsurface moored observatory situated at 192m depth in the Kongsfjorden fjord. The CTD profilers logged an anomalous influx of warm, saline transformed Atlantic Water (TAW, temperature > 1.8°C, salinity > 34.8 PSU) entering the inner fjord trough during January 2025. This persistent subsurface heat advection prevented stable fast-ice formation in the middle fjord, limiting total sea ice cover to less than 28% of historical winter averages.'),

('RPT-2024-001', 12, 'Logistics, Energy & Station Cogeneration', 
 'The Himadri winter station infrastructure operated on a combined micro-cogeneration diesel and lithium iron phosphate (LiFePO4) battery buffer system, achieving a 99.4% uptime across the 120-day polar night. Total fuel consumption was reduced by 18.2% through smart building insulation and waste-heat recovery loops plumbed into laboratory analytical benches.'),

('DTS-2023-014', 1, 'Telemetry Array Specification & Sampling Protocol', 
 'Dataset comprises in-situ telemetry data gathered across 6 measurement stations in Kongsfjorden (78°55''N, 11°56''E) paired with AMSR2 6.25km passive microwave grid points. Variables recorded include sea ice thickness (m), surface snow depth (cm), ice bottom temperature (°C), water column salinity (PSU), and spectral solar transmittance through ice.'),

('DTS-2023-014', 2, 'Winter Freezing Front Dynamics & Salinity Profiles', 
 'Winter freeze onset commenced on December 8, 2023, delayed by 19 days compared to the 2015–2020 decadal climatological mean. Maximum ice growth reached 0.62m in sheltered inlets near Blomstrandhalvøya by late March 2024, whereas open fjord reaches exhibited dynamic grease ice and nilas formations due to recurrent tidal surging and wind-driven shear stress exceeding 0.15 N/m².'),

('PUB-2024-012', 1, 'Austral Winter 2024 Sea Ice Extent Overview', 
 'During the 43rd Indian Scientific Expedition to Antarctica (2023–2024), satellite radiometry (SSMIS and AMSR2) combined with underway shipboard observations from the research vessel revealed historically low sea-ice extent across the Southern Ocean. The circumpolar sea ice extent dropped to 16.98 million km² in mid-September 2024, sitting over 1.4 million km² below the 1991–2020 climatological median, with the most severe negative anomalies concentrated in the Cosmonaut and Weddell Sea sectors.'),

('PUB-2024-012', 3, 'Katabatic Wind Stress & Polynya Development', 
 'Detailed analysis around the Indian Antarctic stations (Maitri at 70°46''S, 11°44''E and Bharati at 69°24''S, 76°11''E) identified strong localized katabatic wind events descending from the Antarctic plateau with sustained speeds over 52 knots. These intense downslope winds mechanically drove pack ice offshore, opening an extensive coastal latent heat polynya spanning over 14,000 km² in Prydz Bay. The open water exposure triggered intense ocean-to-atmosphere sensible heat fluxes exceeding 320 W/m², cooling surface waters and driving brine rejection.'),

('PUB-2024-012', 5, 'Oceanic Upwelling & Deep Water Warming', 
 'Oceanographic transects by the 43rd Expedition deployed CTD casts across the Antarctic Slope Front (ASF). Data revealed that modified Circumpolar Deep Water (MCDW) with temperatures between +0.8°C and +1.3°C was shoaled by up to 80m closer to the ice shelf bases compared to 2018 measurements, preventing the customary thickening of winter pack ice along the Dronning Maud Land margin.'),

('PUB-2023-045', 1, 'Aerosol Sampling at Himadri & Long-Range Transport', 
 'From March to September 2023, atmospheric black carbon (eBC) was monitored at the Indian Arctic base Himadri, Ny-Ålesund, using continuous Magee AE-33 aethalometers. Backward air mass trajectories computed using the NOAA HYSPLIT model showed distinct transport corridors delivering agricultural fire emissions from Central and Eastern Eurasia during April–May (the "Arctic Haze" phenomenon), elevating BC levels from a clean baseline of 8 ng/m³ to peak values of 35 ng/m³.'),

('PUB-2023-045', 2, 'Albedo Reduction & Glacier Melt Acceleration', 
 'Surface snow sampling across the ablation zone of the nearby Vestre Lovénbreen glacier (78.88°N, 12.05°E) revealed black carbon concentrations in fresh snow ranging between 4.2 and 18.6 ng/g. Radiative transfer modeling (SNICAR) indicated that this particulate deposition reduced clean snow surface albedo by an average of 0.032 (3.2%). This darkening accelerated glacier surface melt onset by approximately 11 days and increased cumulative seasonal ice loss by 14.3 ± 2.8 cm water equivalent (w.e.).'),

('DTS-2024-007', 1, 'Cruise Track & Hydrographic Cast Distribution', 
 'Hydrographic dataset collected during the 43rd Indian Scientific Expedition aboard chartered ice-class research vessel between December 2023 and March 2024. The transect spans from Cape Town, South Africa (33°55''S) to Prydz Bay, East Antarctica (69°24''S), crossing the Subtropical Front (STF, ~41°S), the Subantarctic Front (SAF, ~46°S), and the Antarctic Polar Front (APF, ~51°S).'),

('DTS-2024-007', 2, 'Parameters & Instrumentation Suite', 
 'The dataset contains 124 full-depth CTD casts (Seabird SBE 911plus calibrated for conductivity, temperature, pressure, dissolved oxygen, fluorescence, and transmissivity down to 4,500m depth), 18 autonomous Argo profiling floats deployed in the Antarctic Circumpolar Current (ACC), and 62 continuous surface seawater fluorometry transects logging chlorophyll-a biomass.'),

('PUB-2022-031', 1, 'Isolation & Identification of Extremophiles in Schirmacher Oasis', 
 'Water and benthic microbial mat samples were harvested from Lake Priyadarshini—a perennially ice-covered freshwater lake in the Schirmacher Oasis near Maitri Station (-70.76°S, 11.73°E). Sixteen distinct bacterial strains were cultured at 4°C, including predominant psychrotolerant species Planococcus antarcticus strain PRI-2 and Pseudomonas sp. strain PRI-4. 16S rRNA gene sequencing confirmed high phylogenetic similarity to cold-adapted endemic Antarctic taxa.'),

('PUB-2022-031', 2, 'Cold-Active Enzymes & Cryoprotection Mechanisms', 
 'Enzymatic assays demonstrated that Pseudomonas strain PRI-4 produces cold-active extracellular lipases and proteases retaining over 65% of their peak catalytic activity at temperatures as low as -4°C to +4°C, with rapid heat inactivation above 35°C. The bacteria synthesize high molecular weight exopolysaccharides (EPS) rich in uronic acid that coat the cell wall, preventing intracellular ice crystallization and permitting cellular survival in sub-zero polar freshwater lakes.'),

('PUB-2022-031', 3, 'Biotechnological & Educational Implications', 
 'These psychrotolerant bacterial enzymes offer profound industrial utility, including cold-wash detergent formulation, green bioremediation of hydrocarbon spills in cold climates, and food processing without thermal degradation. For students and educators, they serve as a benchmark textbook example of how life thrives in extreme polar conditions through evolutionary adaptations that lower the activation energy of essential metabolic enzymes.'),

('RPT-2023-005', 1, 'Himansh High-Altitude Station & Geographic Context', 
 'The Himansh Observatory is India''s dedicated high-altitude research station located at 4,080 meters above sea level in the Chandra-Bhaga basin, Spiti Valley, Himachal Pradesh (32°24''N, 77°36''E). Established by NCPOR in 2016, it serves as the ground truth base for Himalayan cryosphere glaciological studies, providing continuous energy and satellite communications for monitoring glaciers in the Hindu Kush-Himalaya (Third Pole) system.'),

('RPT-2023-005', 2, 'Glacier Mass Balance & Runoff at Sutri Dhaka and Batal', 
 'During the 2022–2023 hydrological balance year, the Sutri Dhaka benchmark glacier exhibited an annual net specific mass balance of -0.72 ± 0.14 m w.e. (meters water equivalent). Automatic weather stations (AWS) deployed on the glacier tongue recorded a summer mean temperature of +4.2°C, with a total seasonal ice loss of 1.84m at the terminus (4,400m). Automated ultrasonic stage sensors installed at the proglacial stream measured discharge peaks in late July of 18.6 m³/s.'),

('DTS-2023-022', 1, 'IndARC Observatory Architecture & Mooring Design', 
 'The Indian Arctic Moored Observatory (IndARC) has been continuously deployed since 2014 in the inner basin of Kongsfjorden (78°59''N, 11°49''E, bottom depth ~192m). The subsurface mooring line comprises an acoustic release, seabed anchor, and an array of Sea-Bird SBE 37 MicroCAT CTD sensors, Seabird dissolved oxygen loggers, RBR pressure recorders, and a 300 kHz upward-looking Acoustic Doppler Current Profiler (ADCP).'),

('DTS-2023-022', 2, 'Atlantic Water Intrusion & Hydrographic Time Series', 
 'Data spanning 2023–2024 records significant multi-week pulses of Atlantic Water (AW) crossing the shelf break into the fjord during autumn. Subsurface temperatures at 100m depth oscillated between -0.4°C in late winter and +4.8°C in early September. The time series establishes that Arctic fjord warming is primarily driven by autumn and winter subsurface Atlantic inflow rather than local solar radiation.'),

('DTS-2024-030', 1, 'Meteorological Station Setup at Larsemann Hills', 
 'Automated Weather Station (AWS) positioned on bedrock ridge at Bharati Station (-69°24''25"S, 76°11''41"E, altitude 35m MSL). Equipment includes Vaisala PTB210 barometric pressure sensors, PT100 temperature probes, Young 05103 propeller anemometers, and Kipp & Zonen pyranometers logging every 10 minutes with Iridium satellite burst transmission to NCPOR, Goa.'),

('DTS-2024-030', 2, 'Blizzard Dynamics & 2024 Temperature Extremes', 
 'During the 2023–2024 calendar year, Bharati recorded a minimum winter temperature of -38.6°C on July 14, 2024, and a maximum summer temperature of +5.4°C on January 3, 2024. A major polar cyclone on August 21–23, 2024 generated sustained gale-force winds of 64 knots with peak gusts reaching 88.4 knots (163.7 km/h), accompanied by rapid barometric drops of 28 hPa over 12 hours.');

-- 5. Seed Resource-Expedition Mappings
DELETE FROM resource_expedition;
INSERT INTO resource_expedition (resource_id, expedition_id) VALUES 
('RPT-2024-001', 2),
('DTS-2023-014', 2),
('DTS-2023-014', 4),
('PUB-2023-088', 3),
('PUB-2023-088', 7),
('PUB-2024-012', 1),
('PUB-2023-045', 4),
('PUB-2023-045', 2),
('DTS-2024-007', 1),
('PUB-2022-031', 7),
('PUB-2022-031', 3),
('RPT-2023-005', 5),
('DTS-2023-022', 4),
('DTS-2023-022', 2),
('PUB-2021-019', 6),
('DTS-2024-030', 1),
('PUB-2024-055', 2),
('IMG-2024-010', 2),
('IMG-2023-002', 1),
('IMG-2023-003', 3),
('IMG-2024-004', 5),
('IMG-2024-005', 4);

-- 6. Seed Resource Relations Graph
DELETE FROM resource_relations;
INSERT INTO resource_relations (from_resource_id, to_resource_id, relation_type) VALUES 
('PUB-2024-012', 'DTS-2024-007', 'DERIVED_FROM'),
('PUB-2024-012', 'DTS-2024-030', 'TELEMETRY_OF'),
('PUB-2023-045', 'DTS-2023-014', 'COMPANION_DATASET'),
('PUB-2023-045', 'RPT-2024-001', 'CITATION'),
('DTS-2023-022', 'RPT-2024-001', 'TELEMETRY_OF'),
('PUB-2024-055', 'RPT-2024-001', 'CITATION'),
('PUB-2022-031', 'PUB-2023-088', 'COMPANION_DATASET');

-- 7. Seed Media Records
DELETE FROM media;
INSERT INTO media (id, resource_id, media_type, url, caption, attribution) VALUES 
(1, 'IMG-2024-010', 'PHOTO', 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1200', 'Himadri Station illuminated under the 24-hour winter polar night at Ny-Ålesund, Svalbard.', 'NCPOR / MoES Polar Visual Archive'),
(2, 'IMG-2023-002', 'PHOTO', 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1200', 'Bharati Research Station complex nestled in the Larsemann Hills of East Antarctica.', 'NCPOR / Indian Antarctic Programme'),
(3, 'IMG-2023-003', 'PHOTO', 'https://images.unsplash.com/photo-1548777123-e216912df7d8?q=80&w=1200', 'Maitri station main habitat module alongside the ice-covered Lake Priyadarshini in Schirmacher Oasis.', 'NCPOR / Dr. A. Sharma'),
(4, 'IMG-2024-004', 'PHOTO', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200', 'Himansh High-Altitude Observatory at 4,080m in the Chandra-Bhaga basin, Spiti Himalayas.', 'Himalayan Cryosphere Division, NCPOR'),
(5, 'IMG-2024-005', 'PHOTO', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200', 'Deployment of the IndARC multi-sensor moored oceanographic observatory into Kongsfjorden.', 'Arctic Oceanography Group, NCPOR');

SELECT setval('media_id_seq', (SELECT MAX(id) FROM media));

-- 8. Seed Activities & Timeline
DELETE FROM activities;
INSERT INTO activities (title, date, description, source_url, media_url) VALUES 
('Launch of India''s Maiden Winter Arctic Scientific Campaign', '2024-06-15', 'NCPOR and MoES officially deployed India''s first four-person wintering scientific contingent to the Himadri Station in Ny-Ålesund.', 'https://ncpor.res.in/pages/display/373-outreachprogram', ''),
('Deployment of 43rd Antarctic Scientific Expedition Contingent', '2023-11-20', 'Over 40 scientists departed Cape Town for Maitri and Bharati stations aboard the chartered polar expedition vessel.', 'https://ncpor.res.in/pages/display/384-antarctic-records', ''),
('National Science Day Polar Outreach Webinar', '2024-02-28', 'Interactive live satellite uplink session between Indian school students and researchers stationed at Bharati Station, Antarctica.', 'https://ncpor.res.in/pages/display/373-outreachprogram', ''),
('IndARC Deep-Water Acoustic Mooring Servicing Completed', '2023-09-10', 'Annual acoustic recovery, sensor data extraction, and redeployment of the 192m-deep IndARC observatory in Kongsfjorden.', 'https://npdc.ncpor.res.in/', ''),
('Annual Mass Balance Measurement at Sutri Dhaka Glacier Completed', '2023-10-05', 'The glaciology field team from Himansh Base concluded stakes measurement, snow pit density profiling, and AWS calibration in Spiti.', 'https://ncpor.res.in/pages/display/385-cryosphere', '');

SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
