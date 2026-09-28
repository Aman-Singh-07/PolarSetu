import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../services/api';
import type { Station, Expedition } from '../types';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Thermometer, X, Search, Layers, Globe } from 'lucide-react';

// Custom icons
const stationIcon = L.divIcon({
  className: 'custom-station-icon',
  html: `<div class="w-4 h-4 rounded-full bg-aurora-emerald border-2 border-pure-white shadow-lg ring-4 ring-aurora-emerald/20"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const expeditionIcon = L.divIcon({
  className: 'custom-expedition-icon',
  html: `<div class="w-4 h-4 rounded-full bg-glacial-sky border-2 border-pure-white shadow-lg ring-4 ring-glacial-sky/20"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

type SelectedMarker = { type: 'station', data: Station } | { type: 'expedition', data: Expedition } | null;

export default function MapPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  
  const [regionFilter, setRegionFilter] = useState('all');
  const [showStations, setShowStations] = useState(true);
  const [showExpeditions, setShowExpeditions] = useState(true);
  
  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 78]);
  const [mapZoom, setMapZoom] = useState(3);
  
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getStations(), api.getExpeditions()]).then(([st, exp]) => {
      setStations(st);
      setExpeditions(exp);
    });
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter(s => regionFilter === 'all' || s.region.toLowerCase() === regionFilter.toLowerCase());
  }, [stations, regionFilter]);

  const filteredExpeditions = useMemo(() => {
    return expeditions.filter(e => regionFilter === 'all' || e.region.toLowerCase() === regionFilter.toLowerCase());
  }, [expeditions, regionFilter]);

  const handleSelectMarker = (item: Station | Expedition, type: 'station' | 'expedition') => {
    if (type === 'station') setSelectedMarker({ type: 'station', data: item as Station });
    else setSelectedMarker({ type: 'expedition', data: item as Expedition });
    
    // Zoom slightly towards the selected marker, preserving context
    setMapCenter([item.latitude, item.longitude]);
    setMapZoom(4);
  };

  const handleResetMap = () => {
    setMapCenter([20, 78]);
    setMapZoom(3);
    setSelectedMarker(null);
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      {/* Top Geospatial Command Bar */}
      <div className="w-full px-4 lg:px-8 py-4 bg-polar-navy-surface text-ice-white shadow-md z-10 flex flex-col gap-4 border-b border-slate-border/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-1 rounded-lg bg-polar-midnight-deep text-glacial-sky">
                <Globe className="w-5 h-5" />
              </span>
              <h1 className="font-headline-sm text-headline-sm font-bold text-pure-white tracking-tight">Polar Expedition Map</h1>
              <span className="px-2 py-0.5 rounded bg-aurora-emerald/20 text-aurora-emerald font-label-sm text-[10px] uppercase tracking-wider font-bold shadow-sm">NCPOR GIS v4.2 Demo</span>
            </div>
            <p className="font-body-sm text-body-sm text-surface-dim">
              Explore research stations, expedition locations and scientific activity across India's polar and Himalayan research ecosystem.
            </p>
          </div>

          {/* Telemetry Sync Badge */}
          <div className="flex items-center gap-3 text-surface-dim font-code-sm text-code-sm bg-polar-midnight-deep/60 px-4 py-2 rounded-lg border border-slate-border/10">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-aurora-emerald animate-pulse"></span>
              <span className="text-ice-white font-semibold">Simulated Feed</span>
            </div>
            <span className="hidden sm:inline text-outline-variant">|</span>
            <span className="hidden sm:inline font-mono text-glacial-sky">WGS84 / EPSG:4326</span>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 max-w-[1440px] mx-auto w-full">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-polar-midnight-deep rounded-lg p-1 border border-slate-border/10">
              <select 
                value={regionFilter} 
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-transparent text-ice-white font-label-md text-label-md py-1.5 pl-3 pr-8 focus:outline-none cursor-pointer appearance-none relative"
              >
                <option value="all" className="bg-polar-midnight-deep text-pure-white">All Observation Sectors</option>
                <option value="antarctica" className="bg-polar-midnight-deep text-pure-white">Antarctica</option>
                <option value="arctic" className="bg-polar-midnight-deep text-pure-white">Arctic</option>
                <option value="himalayas" className="bg-polar-midnight-deep text-pure-white">Himalayas</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-label-sm text-[10px] text-outline-variant uppercase tracking-wider font-bold">Layers:</span>
              <button 
                onClick={() => setShowStations(!showStations)}
                className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 transition-all shadow-sm ${showStations ? 'bg-secondary text-pure-white' : 'bg-polar-midnight-deep text-pure-white/80 border border-slate-border/20'}`}
              >
                <span className={`w-2 h-2 rounded-full ${showStations ? 'bg-pure-white' : 'bg-outline-variant'}`}></span>
                Research Stations
              </button>
              <button 
                onClick={() => setShowExpeditions(!showExpeditions)}
                className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 transition-all shadow-sm ${showExpeditions ? 'bg-secondary text-pure-white' : 'bg-polar-midnight-deep text-pure-white/80 border border-slate-border/20'}`}
              >
                <span className={`w-2 h-2 rounded-full ${showExpeditions ? 'bg-pure-white' : 'bg-outline-variant'}`}></span>
                Expeditions
              </button>
            </div>
          </div>
          
          <button onClick={handleResetMap} className="px-4 py-1.5 bg-polar-midnight-deep hover:bg-surface-container-high/20 text-pure-white font-label-sm text-label-sm rounded-lg flex items-center gap-2 transition-colors border border-slate-border/10">
            <Navigation className="w-4 h-4" /> Reset View
          </button>
        </div>
      </div>

      {/* Main Map Experience */}
      <div className="relative w-full h-[600px] lg:h-[75vh] bg-polar-midnight-deep z-0">
        <MapContainer
          center={[20, 78]}
          zoom={3}
          minZoom={2.5}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          zoomControl={true}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#0B132B' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          {/* Base Map Dark Theme */}
          <TileLayer
            attribution='&copy; OpenStreetMap CartoDB'
            url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY || ''}`}
            noWrap={true}
          />

          {showStations && filteredStations.map(station => (
            <Marker 
              key={station.id} 
              position={[station.latitude, station.longitude]}
              icon={stationIcon}
              eventHandlers={{
                click: () => handleSelectMarker(station, 'station'),
              }}
            />
          ))}

          {showExpeditions && filteredExpeditions.map(exp => (
            <Marker 
              key={exp.id} 
              position={[exp.latitude, exp.longitude]}
              icon={expeditionIcon}
              eventHandlers={{
                click: () => handleSelectMarker(exp, 'expedition'),
              }}
            />
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-[400] hidden md:flex flex-col gap-2 bg-polar-navy-surface/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-border/10 text-pure-white">
          <div className="flex items-center gap-2 font-label-sm text-label-sm">
            <span className="w-3 h-3 rounded-full bg-aurora-emerald ring-2 ring-aurora-emerald/30 shadow-sm"></span>
            Research Station
          </div>
          <div className="flex items-center gap-2 font-label-sm text-label-sm">
            <span className="w-3 h-3 rounded-full bg-glacial-sky ring-2 ring-glacial-sky/30 shadow-sm"></span>
            Expedition
          </div>
        </div>

        {/* Selected Marker Drawer */}
        <div className={`absolute top-0 right-0 w-full sm:w-[400px] md:w-[450px] h-full z-[500] bg-polar-navy-surface/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 overflow-y-auto border-l border-slate-border/10 transform ${selectedMarker ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedMarker && (
            <div className="flex flex-col h-full text-ice-white pb-6">
              <div className="p-4 bg-polar-midnight-deep flex items-start justify-between gap-3 sticky top-0 z-10 shadow-md border-b border-slate-border/10">
                <div className="flex flex-col">
                  <div className="flex flex-col gap-1 mb-1">
                    <span className="font-label-sm text-[10px] uppercase text-surface-dim font-bold tracking-wider flex items-center gap-1.5">
                      {selectedMarker.type === 'station' ? <><Thermometer className="w-3.5 h-3.5 text-aurora-emerald" /> STATION TELEMETRY</> : <><Navigation className="w-3.5 h-3.5 text-glacial-sky" /> EXPEDITION RECORD</>}
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md font-bold text-pure-white leading-tight">
                    {selectedMarker.type === 'station' ? selectedMarker.data.name : selectedMarker.data.name}
                  </h2>
                  <p className="font-code-sm text-code-sm text-glacial-sky font-mono mt-1">
                    {selectedMarker.data.latitude.toFixed(4)}° N, {selectedMarker.data.longitude.toFixed(4)}° E • {selectedMarker.data.region}
                  </p>
                </div>
                <button onClick={() => setSelectedMarker(null)} className="p-2 rounded-lg text-outline-variant hover:text-ice-white hover:bg-polar-midnight-deep transition-colors bg-polar-navy-surface/50 border border-slate-border/5 text-pure-white shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-6">
                
                {/* Station specific info */}
                {selectedMarker.type === 'station' && (
                  <>
                    <div className="flex items-center gap-2 bg-polar-midnight-deep p-3 rounded-lg border border-slate-border/10">
                      <span className="px-2 py-1 rounded bg-aurora-emerald/20 text-aurora-emerald font-label-sm text-[10px] uppercase font-bold tracking-wider">{(selectedMarker.data as Station).type}</span>
                    </div>

                    {(selectedMarker.data as Station).observations && (
                      <div className="flex flex-col gap-3">
                        <span className="font-label-sm text-[10px] font-bold text-outline-variant uppercase tracking-wider">Latest Station Observations (Prototype Demonstration Data)</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-polar-midnight-deep p-3 rounded-lg flex flex-col gap-1 border border-slate-border/5">
                            <span className="font-label-sm text-[11px] text-surface-dim">Air Temp</span>
                            <span className="font-headline-sm text-headline-sm font-bold text-pure-white">{(selectedMarker.data as Station).observations?.temperature}</span>
                          </div>
                          <div className="bg-polar-midnight-deep p-3 rounded-lg flex flex-col gap-1 border border-slate-border/5">
                            <span className="font-label-sm text-[11px] text-surface-dim">Wind</span>
                            <span className="font-headline-sm text-headline-sm font-bold text-pure-white">{(selectedMarker.data as Station).observations?.wind}</span>
                          </div>
                          <div className="bg-polar-midnight-deep p-3 rounded-lg flex flex-col gap-1 border border-slate-border/5 col-span-2">
                            <span className="font-label-sm text-[11px] text-surface-dim">Humidity</span>
                            <span className="font-headline-sm text-headline-sm font-bold text-pure-white">{(selectedMarker.data as Station).observations?.humidity}</span>
                          </div>
                        </div>
                        <span className="font-code-sm text-[10px] text-outline-variant text-right">Observed: 28 Sep 2026, 10:00 UTC (Simulated)</span>
                      </div>
                    )}
                  </>
                )}

                {/* Expedition specific info */}
                {selectedMarker.type === 'expedition' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 font-code-sm text-code-sm bg-polar-midnight-deep p-3 rounded-lg border border-slate-border/10">
                      <div className="flex flex-col">
                        <span className="text-surface-dim text-[10px] uppercase font-bold">Start Date</span>
                        <span className="text-pure-white">{(selectedMarker.data as Expedition).startDate}</span>
                      </div>
                      <span className="text-outline-variant">→</span>
                      <div className="flex flex-col">
                        <span className="text-surface-dim text-[10px] uppercase font-bold">End Date</span>
                        <span className="text-pure-white">{(selectedMarker.data as Expedition).endDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="font-label-sm text-[10px] font-bold text-outline-variant uppercase tracking-wider">Mission Objective</span>
                      <p className="font-body-sm text-body-sm text-inverse-on-surface leading-relaxed">
                        {(selectedMarker.data as Expedition).objective}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-border/10">
                  <span className="font-label-sm text-[10px] font-bold text-outline-variant uppercase tracking-wider mb-1">Actions</span>
                  
                  {selectedMarker.type === 'expedition' && (
                    <button 
                      onClick={() => navigate(`/expeditions/${selectedMarker.data.id}`)}
                      className="w-full py-2.5 px-4 bg-secondary hover:bg-secondary-container hover:text-polar-midnight-deep text-pure-white rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <MapPin className="w-4 h-4" /> View Expedition
                    </button>
                  )}

                  <button 
                    onClick={() => navigate(`/explore?region=${selectedMarker.data.region.toLowerCase()}`)}
                    className="w-full py-2.5 px-4 bg-polar-midnight-deep hover:bg-surface-container-high/20 text-ice-white rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-border/10"
                  >
                    <Search className="w-4 h-4" /> Explore Related Research
                  </button>

                  <button 
                    onClick={() => navigate(`/media?region=${selectedMarker.data.region.toLowerCase()}`)}
                    className="w-full py-2.5 px-4 bg-polar-midnight-deep hover:bg-surface-container-high/20 text-ice-white rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-border/10"
                  >
                    <Layers className="w-4 h-4" /> View Region Media
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
