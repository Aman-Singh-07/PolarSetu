import type { Expedition, Resource, MediaItem, Station, OutreachDraft } from '../types';

export const mockExpeditions: Expedition[] = [
  {
    id: 'EXP-43',
    name: '43rd Indian Scientific Expedition to Antarctica',
    region: 'Antarctica',
    year: 2024,
    startDate: '2023-11-01',
    endDate: '2024-04-30',
    objective: 'Climate change observations, glaciology, and upper atmosphere research.',
    latitude: -69.4068,
    longitude: 76.1950,
  },
  {
    id: 'EXP-ARC-15',
    name: '15th Indian Arctic Expedition',
    region: 'Arctic',
    year: 2024,
    startDate: '2024-05-15',
    endDate: '2024-09-15',
    objective: 'Arctic sea ice decline and its impact on Indian monsoon.',
    latitude: 78.922,
    longitude: 11.928,
  }
];

export const mockResources: Resource[] = [
  {
    id: 'RES-001',
    type: 'REPORT',
    title: 'Glacial Dynamics in the Larsemann Hills',
    description: 'A comprehensive study on the movement and melting rates of glaciers near Bharati station.',
    year: 2024,
    region: 'Antarctica',
    status: 'PUBLISHED',
    createdAt: '2024-03-10T10:00:00Z',
    expeditionId: 'EXP-43',
    author: 'Dr. Sharma',
    institution: 'NCPOR',
    researchArea: 'Glaciology',
    keywords: ['glacier', 'melting', 'climate change'],
  },
  {
    id: 'RES-002',
    type: 'DATASET',
    title: 'Arctic Sea Ice Concentration (2024)',
    description: 'Monthly sea ice concentration data from the 15th Arctic Expedition.',
    year: 2024,
    region: 'Arctic',
    status: 'PUBLISHED',
    createdAt: '2024-08-20T10:00:00Z',
    expeditionId: 'EXP-ARC-15',
    author: 'Dr. Patel',
    institution: 'NCPOR',
    researchArea: 'Oceanography',
    keywords: ['sea ice', 'arctic', 'climate'],
  }
];

export const mockMedia: MediaItem[] = [
  {
    id: 'MED-001',
    type: 'PHOTO',
    title: 'Bharati Station at Twilight',
    description: 'Dramatic wide panoramic photograph of Indian Antarctic research station Bharati.',
    year: 2024,
    region: 'Antarctica',
    status: 'PUBLISHED',
    createdAt: '2024-01-15T10:00:00Z',
    expeditionId: 'EXP-43',
    caption: 'Bharati Station during the austral summer.',
  }
];

export const mockStations: Station[] = [
  {
    id: 'STA-BHA',
    name: 'Bharati',
    region: 'ANTARCTICA',
    latitude: -69.4068,
    longitude: 76.1950,
    type: 'Research Station',
    observations: {
      temperature: '-12°C',
      wind: '45 km/h',
      humidity: '65%'
    }
  },
  {
    id: 'STA-MAI',
    name: 'Maitri',
    region: 'ANTARCTICA',
    latitude: -70.7667,
    longitude: 11.7333,
    type: 'Research Station',
    observations: {
      temperature: '-18°C',
      wind: '30 km/h',
      humidity: '50%'
    }
  },
  {
    id: 'STA-HIM',
    name: 'Himadri',
    region: 'ARCTIC',
    latitude: 78.922,
    longitude: 11.928,
    type: 'Research Station',
    observations: {
      temperature: '2°C',
      wind: '15 km/h',
      humidity: '80%'
    }
  }
];

export const mockDrafts: OutreachDraft[] = [
  {
    id: 'DRF-001',
    audience: 'General Public',
    outputType: 'Social Media Post',
    content: 'Did you know? Indian scientists at Bharati station are studying how fast glaciers are melting. 🌍❄️ This helps us understand global climate change! #PolarScience #NCPOR #ClimateAction',
    sourceIds: ['RES-001'],
    status: 'DRAFT',
    createdAt: '2026-09-27T10:00:00Z'
  }
];
