import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import { Skeleton, EmptyState, ErrorState } from '../components/ui';

export default function Media() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getMedia()
      .then(data => setMedia(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="w-full pb-32 flex-1">
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
              <ErrorState message="Unable to load media." onRetry={() => window.location.reload()} />
            </div>
          ) : media.length === 0 ? (
            <div className="py-24 bg-white rounded-[12px] border border-border-ice flex items-center justify-center">
              <EmptyState
                icon={ImageIcon}
                title="No media stories have been published yet."
                description="Media content will appear here when records become available."
                actionLabel="Explore Research"
                onAction={() => navigate('/explore')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {media.map(item => (
                <article key={item.id} className="group flex flex-col bg-white rounded-[12px] border border-border-ice overflow-hidden hover:border-glacial-blue/40 hover:shadow-sm transition-all duration-200">
                  <div className="w-full aspect-[4/3] bg-frost border-b border-border-ice relative">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.caption || item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted/30">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    {item.type && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-deep-ocean text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md border border-white/50 shadow-sm">
                        {item.type}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-display text-[18px] font-bold text-ink group-hover:text-glacial-blue transition-colors leading-[1.3] mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    {item.caption && (
                      <p className="text-[14px] text-ink/70 font-light line-clamp-3 mb-5 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                    
                    <div className="mt-auto pt-3 border-t border-border-ice/50 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted font-medium">
                      {item.location && <span>{item.location}</span>}
                      {item.location && item.createdAt && <span>·</span>}
                      {item.createdAt && <span>{new Date(item.createdAt).getFullYear()}</span>}
                    </div>
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
