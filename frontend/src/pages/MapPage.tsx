import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../services/api';
import type { Station, Expedition } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Compass, ExternalLink } from 'lucide-react';

const stationDot = L.divIcon({
  className: 'transition-transform duration-300',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#F8FBFD;border:3px solid #1D6FA5;"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7],
});

const stationDotSelected = L.divIcon({
  className: 'transition-transform duration-300',
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#38BDF8;border:4px solid #F8FBFD;"></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const expDot = L.divIcon({
  className: 'transition-transform duration-300',
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#EFF7FB;border:3px solid #172033;"></div>`,
  iconSize: [12, 12], iconAnchor: [6, 6],
});

const expDotSelected = L.divIcon({
  className: 'transition-transform duration-300',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#EFF7FB;border:4px solid #071426;"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, zoom, { animate: true, duration: 1.2 }); }, [center, zoom, map]);
  return null;
}

type SelectedEntity = 
  | { type: 'station', data: Station }
  | { type: 'expedition', data: Expedition }
  | null;

export default function MapPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  
  const [showStations, setShowStations] = useState(true);
  const [showExpeditions, setShowExpeditions] = useState(true);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 78]);
  const [mapZoom, setMapZoom] = useState(3);
  
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>(null);

  useEffect(() => {
    Promise.all([api.getStations(), api.getExpeditions()]).then(([st, exp]) => {
      setStations(st); setExpeditions(exp);
    });
  }, []);

  const handleSelect = (entity: SelectedEntity) => {
    setSelectedEntity(entity);
    if (entity) {
      if (entity.type === 'station') {
        setMapCenter([entity.data.latitude, entity.data.longitude]);
      } else if (entity.type === 'expedition' && entity.data.latitude && entity.data.longitude) {
        setMapCenter([entity.data.latitude, entity.data.longitude]);
      }
      setMapZoom(5);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-72px)] bg-[#071426] overflow-hidden">
      
      {/* ─── MAP AREA ─── */}
      <div className="flex-1 relative h-[50vh] lg:h-[calc(100vh-72px)] shrink-0 lg:shrink">
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3 pointer-events-none">
          
          <div className="bg-[#071426]/90 backdrop-blur-md rounded-[12px] px-3 py-2 flex items-center shadow-lg border border-white/10 pointer-events-auto">
            <div className="flex flex-col pr-4 border-r border-white/10 mr-3">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em]">
                Polar Atlas
              </span>
              <span className="text-[13px] font-bold text-white leading-tight">
                India’s Polar Field Presence
              </span>
            </div>
            <button 
              onClick={() => { setMapCenter([20, 78]); setMapZoom(3); setSelectedEntity(null); }} 
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Reset View
            </button>
          </div>
          
          <div className="bg-[#071426]/90 backdrop-blur-md rounded-[12px] p-2 flex flex-col gap-1 shadow-lg border border-white/10 pointer-events-auto w-fit">
             <button onClick={() => setShowStations(!showStations)} className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-[12px] font-semibold">
               <div className={`w-3 h-3 rounded-full border-2 ${showStations ? 'bg-snow border-glacial-blue' : 'bg-transparent border-white/30'}`} />
               <span className={showStations ? 'text-white' : 'text-white/50'}>Stations</span>
             </button>
             <button onClick={() => setShowExpeditions(!showExpeditions)} className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-[12px] font-semibold">
               <div className={`w-3 h-3 rounded-full border-2 ${showExpeditions ? 'bg-ink border-white/30' : 'bg-transparent border-white/30'}`} />
               <span className={showExpeditions ? 'text-white' : 'text-white/50'}>Expeditions</span>
             </button>
          </div>
        </div>

        {/* Prototype Transparency Label */}
        <div className="absolute bottom-6 left-4 z-[1000] bg-[#071426]/90 backdrop-blur-md rounded-[8px] px-3 py-2 shadow-lg border border-white/10 pointer-events-none">
          <span className="text-[10px] text-white/70 font-semibold uppercase tracking-[0.1em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-accent opacity-80" />
            Prototype Demonstration Data
          </span>
        </div>

        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          zoomControl={false} 
          className="w-full h-full z-0" 
          style={{ background: '#0a0a0a' }}
        >
          <ZoomControl position="bottomright" />
          
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution="&copy; OpenStreetMap contributors"
            className="dark-map-tiles"
          />
          <MapController center={mapCenter} zoom={mapZoom} />

          {showStations && stations.map(station => {
            const isSelected = selectedEntity?.type === 'station' && selectedEntity.data.id === station.id;
            return (
              <Marker 
                key={station.id} 
                position={[station.latitude, station.longitude]} 
                icon={isSelected ? stationDotSelected : stationDot}
                eventHandlers={{ click: () => handleSelect({ type: 'station', data: station }) }}
              />
            )
          })}

          {showExpeditions && expeditions.map(exp => {
            if (!exp.latitude || !exp.longitude) return null;
            const isSelected = selectedEntity?.type === 'expedition' && selectedEntity.data.id === exp.id;
            return (
              <Marker 
                key={exp.id} 
                position={[exp.latitude, exp.longitude]} 
                icon={isSelected ? expDotSelected : expDot}
                eventHandlers={{ click: () => handleSelect({ type: 'expedition', data: exp }) }}
              />
            )
          })}
        </MapContainer>
      </div>

      {/* ─── CONTEXT PANEL ─── */}
      <div className="w-full lg:w-[400px] h-[50vh] lg:h-[calc(100vh-72px)] bg-[#071426] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0 overflow-y-auto z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.2)]">
        
        {!selectedEntity ? (
          <div className="flex flex-col justify-center h-full p-8 text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 border border-white/10">
              <Compass className="w-6 h-6 text-cyan-accent/80" />
            </div>
            <h2 className="text-[20px] font-display font-bold text-white">Explore the Polar Atlas</h2>
            <p className="text-[14px] text-white/60 font-light max-w-[280px] mx-auto leading-relaxed">
              Select a field location on the map to view geographic context and available scientific resources.
            </p>
            <div className="mt-8 px-4 py-3 bg-white/5 rounded-lg border border-white/10 w-fit mx-auto">
              <p className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.1em]">Prototype Demonstration Data</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full min-h-full">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/10">
              <div className="flex flex-col gap-1.5 pr-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-accent">
                  {selectedEntity.type === 'station' ? 'Research Station' : 'Field Expedition'}
                </span>
                <h2 className="text-[24px] font-display font-bold text-white leading-tight">
                  {selectedEntity.data.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedEntity(null)}
                className="p-2 -mr-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors shrink-0 outline-none focus:ring-2 focus:ring-cyan-accent"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata */}
            <div className="p-6 flex flex-col gap-6">
              
              <dl className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Region</dt>
                  <dd className="text-[14px] font-medium text-white/90">
                    {selectedEntity.data.region}
                  </dd>
                </div>

                {selectedEntity.data.latitude && selectedEntity.data.longitude && (
                  <div className="flex flex-col gap-1.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Coordinates</dt>
                    <dd className="text-[13px] font-mono font-medium text-ice-blue">
                      {selectedEntity.data.latitude}°, {selectedEntity.data.longitude}°
                    </dd>
                  </div>
                )}

                {selectedEntity.type === 'station' && selectedEntity.data.type && (
                  <div className="flex flex-col gap-1.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Facility Type</dt>
                    <dd className="text-[14px] font-medium text-white/90">
                      {selectedEntity.data.type}
                    </dd>
                  </div>
                )}
                
                {selectedEntity.type === 'expedition' && selectedEntity.data.year && (
                  <div className="flex flex-col gap-1.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Year</dt>
                    <dd className="text-[14px] font-medium text-white/90">
                      {selectedEntity.data.year}
                    </dd>
                  </div>
                )}
              </dl>

              {selectedEntity.type === 'expedition' && selectedEntity.data.objective && (
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Overview</span>
                  <p className="text-[14px] text-white/70 font-light leading-relaxed">
                    {selectedEntity.data.objective}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-6 mt-auto">
                {selectedEntity.type === 'expedition' ? (
                  <Link 
                    to={`/expeditions/${selectedEntity.data.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[#071426] font-bold text-[14px] rounded-[10px] hover:bg-ice-blue transition-colors focus:ring-2 focus:ring-cyan-accent focus:ring-offset-2 focus:ring-offset-[#071426] outline-none"
                  >
                    View Expedition <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link 
                    to="/explore"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[#071426] font-bold text-[14px] rounded-[10px] hover:bg-ice-blue transition-colors focus:ring-2 focus:ring-cyan-accent focus:ring-offset-2 focus:ring-offset-[#071426] outline-none"
                  >
                    Explore Research <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
