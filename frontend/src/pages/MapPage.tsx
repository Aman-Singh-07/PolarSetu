import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../services/api';
import type { Station } from '../types';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapPage() {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    api.getStations().then(setStations);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Geographic Telemetry & Field Stations</span>
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Interactive Polar Expedition Map</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Live geodetic positioning of India's year-round research stations and field moorings across the planet's extreme latitudes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="w-full px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
            <MapContainer
              center={[10, 50]}
              zoom={2}
              scrollWheelZoom={true}
              className="w-full h-full"
              style={{ background: '#0B132B' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              {stations.map(station => (
                <Marker key={station.id} position={[station.latitude, station.longitude]}>
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{station.name}</h3>
                        <span className="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Active</span>
                      </div>
                      <div className="text-xs font-medium text-blue-600 mb-1">{station.region}</div>
                      <div className="text-xs text-gray-500 mb-3">{station.type}</div>
                      
                      {station.observations && (
                        <div className="bg-gray-50 p-2.5 rounded border border-gray-100 text-xs space-y-1.5">
                          <div className="font-bold text-[10px] uppercase text-gray-400 tracking-wider">Station Observations</div>
                          <div className="flex justify-between"><span>Temp:</span> <span className="font-semibold">{station.observations.temperature}</span></div>
                          <div className="flex justify-between"><span>Wind:</span> <span className="font-semibold">{station.observations.wind}</span></div>
                          <div className="flex justify-between"><span>Humidity:</span> <span className="font-semibold">{station.observations.humidity}</span></div>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-400 text-right italic mt-2">Prototype Demo Data</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Station HUD Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-[1000] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pointer-events-auto">
              {stations.map(station => (
                <div key={station.id} className="p-3 rounded-xl bg-polar-midnight-deep/90 backdrop-blur-md hover:bg-polar-navy-surface transition-all flex flex-col gap-1.5 text-pure-white">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold">{station.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-aurora-emerald/20 text-aurora-emerald font-label-sm text-label-sm uppercase font-semibold">Active</span>
                  </div>
                  <div className="flex flex-col font-code-sm text-code-sm text-glacial-sky">
                    <span>{station.latitude.toFixed(2)}°, {station.longitude.toFixed(2)}°</span>
                    <span className="text-outline-variant font-body-sm text-body-sm">{station.region}</span>
                  </div>
                  {station.observations && (
                    <div className="pt-1 flex items-center justify-between font-label-sm text-label-sm text-inverse-on-surface">
                      <span>Temp: {station.observations.temperature}</span>
                      <span>Wind: {station.observations.wind}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
