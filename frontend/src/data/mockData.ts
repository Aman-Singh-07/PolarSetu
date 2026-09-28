import type { Station } from '../types';

export const mockStations: Station[] = [
  {
    id: 'STA-BHA',
    name: 'Bharati',
    region: 'Antarctica',
    latitude: -69.4068,
    longitude: 76.1950,
    type: 'Year-round Research Station',
    observations: {
      temperature: '-18.4°C',
      wind: '28 kts',
      humidity: '55%'
    }
  },
  {
    id: 'STA-MAI',
    name: 'Maitri',
    region: 'Antarctica',
    latitude: -70.7667,
    longitude: 11.7333,
    type: 'Year-round Research Station',
    observations: {
      temperature: '-22.1°C',
      wind: '19 kts',
      humidity: '50%'
    }
  },
  {
    id: 'STA-HIM',
    name: 'Himadri',
    region: 'Arctic',
    latitude: 78.922,
    longitude: 11.928,
    type: 'Arctic Research Base',
    observations: {
      temperature: '-12.8°C',
      wind: '14 kts',
      humidity: '80%'
    }
  },
  {
    id: 'STA-HIMANSH',
    name: 'Himansh',
    region: 'Himalayas',
    latitude: 32.40,
    longitude: 77.60,
    type: 'High-Altitude Observatory (4,000m)',
    observations: {
      temperature: '-9.5°C',
      wind: '8 kts',
      humidity: '35%'
    }
  }
];
