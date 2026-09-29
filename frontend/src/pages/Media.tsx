import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Sparkles, Camera, Play, Aperture } from 'lucide-react';
import { Skeleton, EmptyState, ErrorState } from '../components/ui';

export default function Media() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.getMedia()
      .then(data => setMedia(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? media : media.filter(m => m.type === filter || m.caption?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      {/* ─── CINEMATIC HEADER ─── */}
      <section className="relative w-full bg-deep-ocean pt-24 pb-32 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-navy via-deep-ocean to-deep-ocean" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col items-center text-center gap-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
            <Aperture className="w-4 h-4 text-cyan-accent" />
            <span className="text-white text-[11px] font-bold tracking-[0.25em] uppercase">Media Archive</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-[64px] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            Visual Records
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl leading-relaxed drop-shadow-md">
            Photographic and video documentation from Indian polar research field operations.
          </p>
        </div>
      </section>

      {/* ─── FLOATING FILTERS ─── */}
      <section className="w-full px-4 lg:px-8 -mt-10 relative z-30 mb-16">
        <div className="max-w-[1100px] mx-auto flex justify-center">
          <div className="inline-flex bg-white/95 backdrop-blur-xl rounded-[20px] p-1.5 shadow-[0_16px_40px_rgba(7,20,38,0.12)] border border-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-accent/10 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative flex items-center z-10">
              {[
                { id: 'All', label: 'All Formats', icon: Aperture },
                { id: 'PHOTO', label: 'Photography', icon: Camera },
                { id: 'VIDEO', label: 'Video', icon: Play }
              ].map(f => (
                <button 
                  key={f.id} 
                  onClick={() => setFilter(f.id)} 
                  className={`flex items-center gap-2 px-6 py-3 rounded-[14px] text-sm font-bold transition-all duration-300 ${
                    filter === f.id 
                      ? 'bg-deep-ocean text-white shadow-md scale-100' 
                      : 'text-muted hover:text-deep-ocean hover:bg-frost scale-95 hover:scale-100'
                  }`}
                >
                  <f.icon className={`w-4 h-4 ${filter === f.id ? 'text-cyan-accent' : ''}`} />
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="w-full px-4 lg:px-8 pb-32 flex-1">
        <div className="max-w-[1100px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full aspect-[4/3] rounded-[20px]" />
                  <Skeleton className="w-2/3 h-6 rounded-md" />
                  <Skeleton className="w-1/3 h-4 rounded-md" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState message="Unable to load the media archive." onRetry={() => window.location.reload()} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Media Archive Empty"
              description="No catalogued media resources are currently available in the public archive."
              actionLabel="Explore Research"
              onAction={() => window.location.href = '/explore'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map(item => (
                <article key={item.id} className="group flex flex-col gap-5">
                  <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-deep-ocean/5 shadow-[0_8px_30px_rgba(7,20,38,0.06)] group-hover:shadow-[0_20px_50px_rgba(29,111,165,0.12)] relative transition-all duration-500 group-hover:-translate-y-2 border border-border-ice/50 group-hover:border-cyan-accent/30">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.caption || item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/30">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 left-4 bg-deep-ocean/80 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                      {item.type}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 px-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted font-bold uppercase tracking-[0.15em]">
                      {item.location && <span className="text-glacial-blue">{item.location}</span>}
                    </div>
                    
                    <h3 className="font-display text-[22px] font-bold text-deep-ocean group-hover:text-glacial-blue transition-colors leading-[1.2]">
                      {item.title}
                    </h3>
                    
                    {item.caption && (
                      <p className="text-[15px] text-ink/70 font-light line-clamp-2 mt-1 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                    
                    <Link to={`/outreach?sourceId=${item.id}`} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted hover:text-cyan-accent transition-all duration-300 mt-4 self-start group/link">
                      <Sparkles className="w-3.5 h-3.5 group-hover/link:rotate-12 transition-transform" /> 
                      Create Outreach
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
