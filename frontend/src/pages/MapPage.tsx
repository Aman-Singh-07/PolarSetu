import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../services/api';
import type { Station, Expedition } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Layers } from 'lucide-react';

const stationDot = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#38BDF8;border:2px solid #071426;box-shadow:0 0 15px rgba(56,189,248,0.8)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});

const expDot = L.divIcon({
  className: '',
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#10B981;border:2px solid #071426;box-shadow:0 0 12px rgba(16,185,129,0.7)"></div>`,
  iconSize: [12, 12], iconAnchor: [6, 6],
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom, { animate: true, duration: 1.5 }); }, [center, zoom, map]);
  return null;
}

export default function MapPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [regionFilter, setRegionFilter] = useState('all');
  const [showStations, setShowStations] = useState(true);
  const [showExpeditions, setShowExpeditions] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 78]);
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    Promise.all([api.getStations(), api.getExpeditions()]).then(([st, exp]) => {
      setStations(st); setExpeditions(exp);
    });
  }, []);

  const filteredStations = useMemo(() => {
    if (regionFilter === 'all') return stations;
    return stations.filter(s => s.region.toLowerCase() === regionFilter);
  }, [stations, regionFilter]);

  const filteredExpeditions = useMemo(() => {
    if (regionFilter === 'all') return expeditions;
    return expeditions.filter(e => e.region.toLowerCase() === regionFilter);
  }, [expeditions, regionFilter]);

  const jumpTo = (region: string) => {
    const coords: Record<string, [number, number]> = {
      'antarctica': [-72, 30], 'arctic': [78, 15], 'himalayas': [32, 78], 'all': [20, 78]
    };
    setMapCenter(coords[region] || [20, 78]);
    setMapZoom(region === 'all' ? 3 : 5);
    setRegionFilter(region);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-72px)] relative bg-[#0a0a0a]">
      {/* ─── HUD OVERLAYS ─── */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col items-start gap-4 pointer-events-none">
        
        {/* Region Selector */}
        <div className="bg-[#071426]/80 backdrop-blur-xl rounded-[20px] p-2 flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto">
          <div className="px-4 flex items-center gap-2 border-r border-white/10 mr-1">
             <MapPin className="w-4 h-4 text-cyan-accent" />
             <span className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em]">View</span>
          </div>
          <div className="flex items-center gap-1">
            {['all', 'antarctica', 'arctic', 'himalayas'].map(r => (
              <button key={r} onClick={() => jumpTo(r)} className={`px-4 py-2 rounded-[14px] text-[13px] font-bold transition-all duration-300 ${regionFilter === r ? 'bg-cyan-accent text-deep-ocean shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                {r === 'all' ? 'Global' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="bg-[#071426]/80 backdrop-blur-xl rounded-[20px] p-4 flex items-center gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto">
          <div className="flex items-center gap-2 border-r border-white/10 pr-5">
             <Layers className="w-4 h-4 text-muted" />
             <span className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em]">Layers</span>
          </div>
          
          <button onClick={() => setShowStations(!showStations)} className="flex items-center gap-3 group outline-none">
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${showStations ? 'bg-cyan-accent' : 'bg-white/20'}`}>
               <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${showStations ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className={`text-[13px] font-bold transition-colors ${showStations ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>Stations</span>
          </button>
          
          <button onClick={() => setShowExpeditions(!showExpeditions)} className="flex items-center gap-3 group outline-none">
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${showExpeditions ? 'bg-[#10B981]' : 'bg-white/20'}`}>
               <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${showExpeditions ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className={`text-[13px] font-bold transition-colors ${showExpeditions ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>Expeditions</span>
          </button>
        </div>
      </div>

      {/* ─── METADATA BADGE ─── */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-[#071426]/80 backdrop-blur-xl rounded-[16px] px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10">
        <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.15em] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-accent animate-pulse" />
          Live Interactive Atlas Feed
        </span>
      </div>

      {/* ─── MAP ─── */}
      <MapContainer center={mapCenter} zoom={mapZoom} zoomControl={false} className="w-full h-full" style={{ background: '#0a0a0a' }}>
        <ZoomControl position="bottomright" />
        
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution="&copy; OpenStreetMap contributors"
          className="dark-map-tiles"
        />
        <MapController center={mapCenter} zoom={mapZoom} />

        {showStations && filteredStations.map(station => (
          <Marker key={station.id} position={[station.latitude, station.longitude]} icon={stationDot}>
            <Popup className="premium-popup">
              <div className="p-4 min-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-accent" />
                  <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">Research Station</p>
                </div>
                <h4 className="font-display font-bold text-deep-ocean text-[17px] mb-1 leading-tight">{station.name}</h4>
                <p className="text-xs text-ink/70 mb-4 font-medium">{station.region} · {station.type}</p>
                <Link to="/expeditions" className="inline-flex items-center gap-1.5 text-xs font-bold text-glacial-blue hover:text-cyan-accent transition-colors">
                  Explore Research <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {showExpeditions && filteredExpeditions.map(exp => (
          exp.latitude && exp.longitude ? (
            <Marker key={exp.id} position={[exp.latitude, exp.longitude]} icon={expDot}>
              <Popup className="premium-popup">
                <div className="p-4 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">Expedition Log</p>
                  </div>
                  <h4 className="font-display font-bold text-deep-ocean text-[17px] mb-1 leading-tight">{exp.name}</h4>
                  <p className="text-xs text-ink/70 mb-4 font-medium">{exp.region} · {exp.year}</p>
                  <Link to={`/expeditions/${exp.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] hover:text-deep-ocean transition-colors">
                    View Expedition <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}
