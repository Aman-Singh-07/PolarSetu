import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Map as MapIcon, Sparkles, Globe2, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../services/api';
import type { Resource, Expedition } from '../types';
import { Skeleton, Button } from '../components/ui';

const stationDot = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#38BDF8;border:2px solid #071426;box-shadow:0 0 20px rgba(56,189,248,0.9)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getResources(), api.getExpeditions()])
      .then(([res, exp]) => { setResources(res); setExpeditions(exp); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = expeditions[0] ?? null;
  const recent = resources.slice(0, 4);

  return (
    <div className="flex flex-col w-full bg-snow">
      {/* ─── MAJESTIC HERO ─── */}
      <section className="relative w-full h-[95vh] min-h-[800px] flex flex-col items-center justify-center overflow-hidden bg-deep-ocean">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA"
            alt="Indian Polar Research Landscape"
            className="w-full h-full object-cover object-[center_20%] opacity-70 animate-[soft-pulse_20s_ease-in-out_infinite] scale-105"
          />
          <div className="absolute inset-0 bg-deep-ocean/30 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 lg:px-8 flex flex-col items-center text-center gap-10 animate-fade-up">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Globe2 className="w-4 h-4 text-cyan-accent" />
            <span className="text-white text-[11px] font-bold tracking-[0.25em] uppercase">Government of India Polar Initiative</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-[84px] text-white font-bold leading-[1.05] tracking-tight drop-shadow-2xl">
            Explore the science of a <br className="hidden md:block" />
            <span className="text-cyan-accent drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]">changing polar world.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-3xl font-light drop-shadow-lg">
            Discover, verify, and communicate open research, datasets, and expedition records from India's operational zones across the Antarctic, Arctic, and Himalayas.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-white font-bold">Scroll to Discover</span>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      </section>

      {/* ─── FLOATING QUICK LINKS ─── */}
      <section className="relative z-20 w-full bg-snow">
        <div className="w-full max-w-[1300px] mx-auto px-4 lg:px-8 -mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { to: '/explore', title: 'Research Archive', desc: 'Browse highly curated technical papers and official datasets.', icon: Search },
              { to: '/expeditions', title: 'Expedition Records', desc: 'Access comprehensive journey logs and metadata.', icon: MapIcon },
              { to: '/ai', title: 'Ask Polar AI', desc: 'Get source-grounded assistance for scientific inquiries.', icon: Sparkles },
            ].map((item) => (
              <div key={item.to} onClick={() => navigate(item.to)} className="bg-white/80 backdrop-blur-[24px] rounded-[20px] p-8 flex flex-col gap-5 cursor-pointer group hover:-translate-y-2 transition-all duration-400 shadow-[0_8px_32px_rgba(7,20,38,0.06)] border border-white hover:border-cyan-accent/30 hover:shadow-[0_16px_48px_rgba(56,189,248,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-accent/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-cyan-accent/10 transition-colors" />
                <div className="w-14 h-14 rounded-2xl bg-ice-blue flex items-center justify-center border border-glacial-blue/10 relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-6 h-6 text-glacial-blue" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-bold text-deep-ocean group-hover:text-glacial-blue transition-colors">{item.title}</h3>
                  <p className="text-[15px] text-muted mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED EXPEDITION (CINEMATIC FULL WIDTH) ─── */}
      {featured && (
        <section className="w-full bg-snow py-32">
          <div className="max-w-[1300px] mx-auto px-4 lg:px-8">
            <div className="w-full rounded-[24px] overflow-hidden bg-deep-ocean relative flex flex-col lg:flex-row shadow-[0_24px_64px_rgba(7,20,38,0.15)] group cursor-pointer" onClick={() => navigate(`/expeditions/${featured.id}`)}>
              <div className="w-full lg:w-5/12 p-12 lg:p-20 flex flex-col justify-center gap-8 relative z-10 bg-white">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-full bg-ice-blue/50 text-glacial-blue text-[11px] font-bold uppercase tracking-[0.15em] border border-glacial-blue/10">Featured Edition</span>
                  <span className="text-[13px] font-bold text-muted tracking-wider">{featured.year}</span>
                </div>
                
                <h2 className="font-display text-4xl lg:text-[52px] font-extrabold text-deep-ocean leading-[1.1] tracking-tight">
                  {featured.name}
                </h2>
                
                <p className="text-lg text-ink/70 leading-relaxed font-light">
                  {featured.objective}
                </p>
                
                <div className="pt-4">
                  <Button variant="secondary" className="gap-3 group-hover:bg-ice-blue group-hover:border-glacial-blue/30 transition-colors h-[52px] px-8 rounded-xl shadow-sm text-base">
                    View Expedition Log <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-7/12 min-h-[500px] relative overflow-hidden bg-deep-ocean">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA"
                  alt={featured.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out opacity-95"
                />
                {/* Fade gradient from white side */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent hidden lg:block" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── LATEST RESEARCH ARCHIVE ─── */}
      <section className="w-full bg-[#F3F8FB] py-32 border-y border-border-ice/40 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-accent/5 rounded-full blur-[100px] -mt-40 -mr-40 pointer-events-none" />
        
        <div className="max-w-[1300px] mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between border-b border-border-ice/60 pb-8 mb-12">
            <div className="flex flex-col gap-3">
              <span className="text-cyan-accent font-bold tracking-[0.2em] uppercase text-xs">Official Records</span>
              <h2 className="font-display text-4xl font-extrabold text-deep-ocean">Latest Discoveries</h2>
            </div>
            <Button variant="secondary" className="gap-2 !bg-white hover:!bg-ice-blue" onClick={() => navigate('/explore')}>
              Access Full Archive <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
            </div>
          ) : recent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recent.map((r) => (
                <Link key={r.id} to={`/research/${r.id}`} className="group p-8 rounded-[20px] bg-white border border-border-ice/60 shadow-[0_4px_24px_rgba(7,20,38,0.03)] hover:shadow-[0_12px_40px_rgba(29,111,165,0.08)] hover:-translate-y-1 hover:border-glacial-blue/30 transition-all duration-300 flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-[11px] text-muted mb-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-ice-blue/40 text-ocean-navy font-bold uppercase tracking-widest">
                      <FileText className="w-3 h-3 text-glacial-blue" />
                      {r.type}
                    </div>
                    <span className="font-semibold tracking-wider">{r.year || '2024'}</span>
                  </div>
                  <h3 className="font-display font-bold text-[22px] text-deep-ocean group-hover:text-glacial-blue transition-colors leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-base text-ink/60 line-clamp-2 font-light leading-relaxed">{r.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-border-ice border-dashed">
              <Search className="w-8 h-8 text-muted mb-4 opacity-50" />
              <p className="text-lg text-muted font-light">No records available in the archive.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── LIVE POLAR ATLAS ─── */}
      <section className="w-full bg-deep-ocean text-white relative py-32 overflow-hidden">
        {/* Deep space glow */}
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#040B16] to-transparent z-10 pointer-events-none" />
        
        <div className="max-w-[1300px] mx-auto px-4 lg:px-8 flex flex-col gap-12 relative z-20">
          <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
            <span className="text-cyan-accent font-bold tracking-[0.2em] uppercase text-xs flex items-center gap-2">
              <MapIcon className="w-4 h-4" /> Interactive Observatory
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">Global Presence</h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              Explore India's research stations and operational zones across the Antarctic, Arctic, and Himalayas via our high-resolution interactive polar atlas.
            </p>
          </div>
          
          <div className="w-full h-[600px] rounded-[24px] overflow-hidden bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.5)] border border-white/10 relative group">
            {/* Control Panel Overlay */}
            <div className="absolute top-6 left-6 z-[1000] bg-[#071426]/90 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-2 max-w-[280px]">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-accent mb-1">Status: Active</div>
              <div className="text-base font-bold text-white leading-tight">Maitri & Bharati Stations</div>
              <div className="text-[13px] text-white/50 leading-relaxed">Live telemetry and prototype demonstration data streaming.</div>
            </div>

            {/* Launch Atlas CTA */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
              <Button variant="primary" className="h-[52px] px-8 shadow-[0_0_30px_rgba(56,189,248,0.4)] gap-3 !bg-cyan-accent !text-deep-ocean hover:!bg-white border-0 text-base font-bold" onClick={() => navigate('/map')}>
                Launch Full Interactive Atlas <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            
            <MapContainer center={[20, 78]} zoom={2} zoomControl={true} scrollWheelZoom={false} dragging={true} className="w-full h-full" style={{ background: '#0a0a0a' }}>
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="dark-map-tiles"
              />
              <Marker position={[-69.4, 76.18]} icon={stationDot} />
              <Marker position={[78.91, 11.93]} icon={stationDot} />
              <Marker position={[-70.76, 11.73]} icon={stationDot} />
              <Marker position={[32.4, 77.6]} icon={stationDot} />
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
