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
    <div className="space-y-6 h-[calc(100vh-8rem)] min-h-[600px] flex flex-col">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Polar Expedition Map</h1>
        <p className="text-slate-500">Visualizing India's polar research infrastructure.</p>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-border shadow-sm relative z-0">
        <MapContainer 
          center={[-69.4, 76.2]} 
          zoom={3} 
          scrollWheelZoom={true} 
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {stations.map(station => (
            <Marker key={station.id} position={[station.latitude, station.longitude]}>
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-bold text-primary mb-1">{station.name}</h3>
                  <div className="text-xs font-semibold text-secondary mb-2 bg-blue-50 inline-block px-1.5 py-0.5 rounded">{station.region}</div>
                  <p className="text-xs text-slate-500 mb-3">{station.type}</p>
                  
                  {station.observations && (
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 text-xs space-y-1 mb-2">
                      <div className="font-semibold text-[10px] uppercase text-slate-400 mb-1">Latest Station Observations</div>
                      <div className="flex justify-between"><span>Temp:</span> <span className="font-medium text-slate-700">{station.observations.temperature}</span></div>
                      <div className="flex justify-between"><span>Wind:</span> <span className="font-medium text-slate-700">{station.observations.wind}</span></div>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 text-right italic">Prototype Demonstration Data</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
