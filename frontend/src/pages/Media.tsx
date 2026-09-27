import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { api } from '../services/api';
import type { MediaItem } from '../types';

export default function Media() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMedia().then(data => {
      setMediaItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Field Media & Cryospheric Imagery</span>
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Polar Media Explorer</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Verified visual dispatches from NCPOR research teams operating on polar ice floes, glaciological summits, and Antarctic research vessels.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-pure-white p-1 rounded-xl shadow-sm self-start">
              <span className="px-3 py-1.5 rounded-lg bg-surface-container-low text-polar-midnight-deep font-code-sm text-code-sm font-semibold">
                {mediaItems.length} Assets
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant font-body-md">Loading media...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Hero card */}
              {mediaItems[0] && (
                <div className="md:col-span-7 flex flex-col rounded-xl overflow-hidden bg-pure-white shadow-sm group">
                  <div className="relative h-80 w-full overflow-hidden">
                    <img alt={mediaItems[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={mediaItems[0].thumbnailUrl || ''} />
                    <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/90 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-polar-midnight-deep/80 text-pure-white font-label-sm text-label-sm uppercase tracking-wider backdrop-blur-sm">
                      Station Profile
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-pure-white">
                      <span className="font-code-sm text-code-sm text-glacial-sky">{mediaItems[0].region}</span>
                      <h3 className="font-headline-md text-headline-md font-bold leading-tight">{mediaItems[0].title}</h3>
                      <p className="font-body-sm text-body-sm text-inverse-primary line-clamp-2">{mediaItems[0].description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Smaller cards */}
              {mediaItems.slice(1).map(item => (
                <div key={item.id} className="md:col-span-5 flex flex-col rounded-xl overflow-hidden bg-pure-white shadow-sm group">
                  <div className="relative h-44 w-full overflow-hidden">
                    <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.thumbnailUrl || ''} />
                    <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/80 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-polar-midnight-deep/80 text-pure-white font-label-sm text-label-sm uppercase backdrop-blur-sm">
                      {item.region}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5 text-pure-white">
                      <span className="font-code-sm text-code-sm text-glacial-sky">{item.type}</span>
                      <h4 className="font-title-md text-title-md font-bold leading-snug">{item.title}</h4>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-pure-white text-on-surface-variant font-label-sm text-label-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {item.caption || item.region}
                    </span>
                    <span className="text-secondary font-semibold cursor-pointer hover:underline">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
