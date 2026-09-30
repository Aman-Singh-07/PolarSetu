import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, ExternalLink, Play } from 'lucide-react';
import { Skeleton, EmptyState, ErrorState } from '../components/ui';

type CuratedVideo = {
  id: string;
  title: string;
  sourceName: string;
  watchUrl: string;
  thumbnailUrl?: string;
  category: string;
  description?: string;
  actionLabel?: string;
  isNavigationCard?: boolean;
};

const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: "ext-1",
    title: "Antarctica Research Stations [360 Video]",
    sourceName: "National Science Foundation",
    watchUrl: "https://www.youtube.com/watch?v=TVHe9ovnWJI",
    thumbnailUrl: "https://img.youtube.com/vi/TVHe9ovnWJI/hqdefault.jpg",
    category: "ANTARCTICA",
    description: "The first 360 video filmed at all three USAP research stations."
  },
  {
    id: "ext-2",
    title: "Under the Ice of Antarctica",
    sourceName: "National Science Foundation",
    watchUrl: "https://www.youtube.com/watch?v=wDcUUTwy6pA",
    thumbnailUrl: "https://img.youtube.com/vi/wDcUUTwy6pA/hqdefault.jpg",
    category: "ANTARCTICA",
    description: "A short documentary exploring life under Antarctic ice through scientists and scuba divers."
  },
  {
    id: "ext-3",
    title: "At the Bottom of the World",
    sourceName: "National Science Foundation",
    watchUrl: "https://www.youtube.com/watch?v=aFv4Ozt_ra4",
    thumbnailUrl: "https://img.youtube.com/vi/aFv4Ozt_ra4/hqdefault.jpg",
    category: "ANTARCTICA",
    description: "A tour of the NSF Amundsen-Scott South Pole Station and its research projects."
  },
  {
    id: "ext-4",
    title: "On ice with Mara",
    sourceName: "National Science Foundation",
    watchUrl: "https://www.youtube.com/watch?v=-29TDKiki-U",
    thumbnailUrl: "https://img.youtube.com/vi/-29TDKiki-U/hqdefault.jpg",
    category: "ARCTIC",
    description: "Mara Menehan is a science technician working on the Greenland Ice Sheet at Summit Station."
  },
  {
    id: "ext-ncpor",
    title: "NCPOR Video Gallery",
    sourceName: "National Centre for Polar and Ocean Research",
    watchUrl: "https://ncpor.res.in/videogallery",
    category: "OFFICIAL SOURCE",
    actionLabel: "Explore Video Gallery",
    isNavigationCard: true
  }
];

export default function Media() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    setError(false);
    api.getMedia()
      .then(data => setMedia(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchString = String(filter).toLowerCase();
  
  const filteredPhotos = media.filter(m => 
    (filter === 'All' || filter === 'Photo') &&
    ((m.type || 'PHOTO').toUpperCase() === 'PHOTO') &&
    (filter === 'All' || filter === 'Photo' || 
      String(m.caption).toLowerCase().includes(searchString) ||
      String(m.title).toLowerCase().includes(searchString))
  );

  const displayVideos = (filter === 'All' || filter === 'Video') 
    ? CURATED_VIDEOS 
    : [];

  const isEmpty = filteredPhotos.length === 0 && displayVideos.length === 0;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      {/* ─── HEADER ─── */}
      <section className="w-full bg-snow pt-10 md:pt-16 pb-8">
        <div className="container-standard flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">Polar Media</span>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-deep-ocean tracking-tight leading-tight">
            Stories from the field
          </h1>
          <p className="text-[16px] text-ink/60 max-w-[520px]">
            Explore available media and stories connected to polar science.
          </p>

          <div className="flex bg-frost p-1 rounded-[10px] w-fit border border-border-ice mt-6">
            {['All', 'Photo', 'Video'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-all duration-300 ${
                  filter === f
                    ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-deep-ocean'
                    : 'text-ink/60 hover:text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="w-full pb-32 flex-1 pt-6">
        <div className="container-standard">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col gap-4 bg-white rounded-[12px] border border-border-ice overflow-hidden">
                  <Skeleton className="w-full aspect-[4/3] rounded-none" />
                  <div className="p-5 flex flex-col gap-3">
                    <Skeleton className="w-[80%] h-6 rounded-md" />
                    <Skeleton className="w-[100%] h-4 rounded-md mt-2" />
                    <Skeleton className="w-[60%] h-4 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 bg-white rounded-[12px] border border-border-ice flex items-center justify-center">
              <ErrorState message="Unable to load the media archive." onRetry={loadData} />
            </div>
          ) : isEmpty ? (
            <div className="py-24 bg-white rounded-[12px] border border-border-ice flex items-center justify-center">
              <EmptyState
                icon={ImageIcon}
                title="Media Archive Empty"
                description="No catalogued media resources are currently available in the public archive."
                actionLabel="Explore Research"
                onAction={() => navigate('/explore')}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              
              {/* PHOTOS SECTION */}
              {filteredPhotos.length > 0 && (
                <div className="flex flex-col gap-6">
                  {filter === 'All' && (
                    <div className="flex flex-col gap-2 border-b border-border-ice/60 pb-3">
                      <h2 className="text-[20px] font-bold text-deep-ocean tracking-tight">Repository Media</h2>
                      <p className="text-[14px] text-ink/60">Official photographs from the AICYGRAM repository.</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredPhotos.map(item => (
                      <article key={item.id} className="group flex flex-col gap-5 bg-white rounded-[12px] border border-border-ice/50 hover:border-cyan-accent/30 overflow-hidden shadow-[0_8px_30px_rgba(7,20,38,0.06)] hover:shadow-[0_20px_50px_rgba(29,111,165,0.12)] transition-all duration-300">
                        <div className="w-full aspect-[4/3] relative overflow-hidden bg-deep-ocean/5">
                          {item.thumbnailUrl || (item as any).url ? (
                            <img 
                              src={item.thumbnailUrl || (item as any).url} 
                              alt={item.caption || item.title || "Archival Specimen"} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted/30">
                              <ImageIcon className="w-10 h-10" />
                            </div>
                          )}
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute top-4 left-4 bg-deep-ocean/80 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-lg" style={{zIndex: 1}}>
                            {item.type || 'PHOTO'}
                          </div>
                        </div>
                        
                        <div className="flex flex-col flex-1 p-5 gap-2">
                          <div className="flex items-center gap-2 text-[11px] text-muted font-bold uppercase tracking-[0.15em]">
                            {(item.location || item.region) && <span className="text-glacial-blue">{item.location || item.region}</span>}
                          </div>
                          
                          <h3 className="font-display text-[20px] font-bold text-deep-ocean group-hover:text-glacial-blue transition-colors leading-[1.2]">
                            {item.title || item.caption || "Archival Specimen"}
                          </h3>
                          
                          {(item.description || item.caption) && (
                            <p className="text-[14px] text-ink/70 font-light line-clamp-3 mt-1 leading-relaxed">
                              {item.description || item.caption}
                            </p>
                          )}
                          
                          <div className="mt-auto pt-4 border-t border-border-ice/50 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted font-medium">
                            {item.location && <span>{item.location}</span>}
                            {item.location && item.createdAt && <span>·</span>}
                            {item.createdAt && <span>{new Date(item.createdAt).getFullYear()}</span>}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* CURATED VIDEOS SECTION */}
              {displayVideos.length > 0 && (
                <div className="flex flex-col gap-6">
                  {filter === 'All' && (
                    <div className="flex flex-col gap-2 border-b border-border-ice/60 pb-3">
                      <h2 className="text-[20px] font-bold text-deep-ocean tracking-tight">Curated Polar Science Videos</h2>
                      <p className="text-[14px] text-ink/60">Selected educational and field videos from polar-science institutions and research organizations.</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {displayVideos.map(video => (
                      <a 
                        key={video.id} 
                        href={video.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-5 bg-white rounded-[12px] border border-border-ice/50 hover:border-cyan-accent/30 overflow-hidden shadow-[0_8px_30px_rgba(7,20,38,0.06)] hover:shadow-[0_20px_50px_rgba(29,111,165,0.12)] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent"
                      >
                        <div className="w-full aspect-video relative overflow-hidden bg-deep-ocean/5">
                          {video.thumbnailUrl ? (
                            <img 
                              src={video.thumbnailUrl} 
                              alt={`Thumbnail for "${video.title}"`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted/30">
                              <Play className="w-10 h-10" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean/90 via-deep-ocean/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                          {/* Center Play button */}
                          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-14 h-14 rounded-full bg-cyan-accent/90 backdrop-blur flex items-center justify-center text-deep-ocean shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-6 h-6 ml-1" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col flex-1 p-5 gap-2">
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] mb-1">
                            <span className="text-glacial-blue">{video.isNavigationCard ? "SOURCE NAVIGATION" : "EXTERNAL VIDEO"}</span>
                            {video.category && (
                              <span className="text-muted">{video.category}</span>
                            )}
                          </div>
                          
                          <h3 className="font-display text-[18px] font-bold text-deep-ocean group-hover:text-glacial-blue transition-colors leading-[1.3] line-clamp-2">
                            {video.title}
                          </h3>
                          
                          <div className="text-[13px] font-semibold text-ink/80">
                            Source: {video.sourceName}
                          </div>
                          
                          {video.description && (
                            <p className="text-[14px] text-ink/70 font-light line-clamp-2 mt-1 leading-relaxed">
                              {video.description}
                            </p>
                          )}
                          
                          <div className="mt-auto pt-4 border-t border-border-ice/50 flex items-center justify-end">
                            <span className="flex items-center gap-1.5 text-[13px] text-cyan-accent font-semibold group-hover:text-glacial-blue transition-colors">
                              {video.actionLabel || "Watch Video"} <ExternalLink className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
