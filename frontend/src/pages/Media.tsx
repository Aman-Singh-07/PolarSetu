import { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Download, Camera, Video, Image } from 'lucide-react';
import { api } from '../services/api';
import type { MediaItem } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'All Media' },
  { id: 'field', label: 'Field Research' },
  { id: 'station', label: 'Station Profiles' },
  { id: 'expedition', label: 'Expedition Logs' },
  { id: 'cryo', label: 'Cryospheric Data' },
];

export default function Media() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getMedia().then(data => {
      setMediaItems(data);
      setLoading(false);
    });
  }, []);

  const filteredMedia = mediaItems.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.region.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Command Bar */}
      <div className="w-full bg-polar-midnight-deep text-pure-white px-4 lg:px-8 py-2 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high/20 text-glacial-sky font-code-sm text-code-sm">MoES / NCPOR Archive</span>
            <span className="text-white/40 text-xs hidden sm:inline">•</span>
            <span className="font-label-sm text-label-sm text-surface-container-highest tracking-wide uppercase hidden sm:inline">Cryospheric Visual Archive & Media Dissemination Layer</span>
          </div>
          <div className="flex items-center gap-4 font-code-sm text-code-sm text-glacial-sky">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-aurora-emerald animate-pulse"></span>Data Feed Synchronized</span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-inverse-primary hidden sm:inline">FAIR Open-Access Repository</span>
          </div>
        </div>
      </div>

      {/* Header & Search Console */}
      <section className="w-full bg-surface-container-low px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-3xl">
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-draft-amber-bg text-draft-amber-text font-label-sm text-label-sm font-semibold uppercase">Polar Media Catalog</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">{mediaItems.length} Media Assets</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep tracking-tight">Polar Media Explorer</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Curated high-resolution scientific photography, expedition video logs, station observations, and field instrumentation footage from the Arctic, Antarctic, and Himalayas.
              </p>
            </div>
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-pure-white p-2 rounded-xl shadow-sm self-start">
              <div className="flex flex-col px-3 py-1 bg-surface-container-low rounded">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Antarctica</span>
                <span className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">{mediaItems.filter(m => m.region === 'Antarctica').length}</span>
              </div>
              <div className="flex flex-col px-3 py-1 bg-surface-container-low rounded">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Arctic</span>
                <span className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">{mediaItems.filter(m => m.region === 'Arctic').length}</span>
              </div>
              <div className="flex flex-col px-3 py-1 bg-surface-container-low rounded">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">S. Ocean</span>
                <span className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">{mediaItems.filter(m => m.region === 'Southern Ocean').length}</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-pure-white p-2 rounded-xl shadow-sm">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 w-5 h-5 text-outline" />
              <input
                className="w-full bg-ice-white rounded-lg pl-10 pr-4 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-pure-white focus:ring-2 focus:ring-azure-accent shadow-inner transition-all"
                placeholder="Search media by expedition, keyword, station, or realm..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-md text-label-md transition-colors">
                <Filter className="w-4 h-4 text-secondary" />
                <span>Metadata Filter</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-polar-midnight-deep text-pure-white hover:bg-polar-navy-surface rounded-lg font-label-md text-label-md transition-colors shadow-sm">
                <Download className="w-4 h-4 text-glacial-sky" />
                <span className="hidden md:inline">Batch Export</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap shadow-sm ${
                  activeCategory === cat.id
                    ? 'bg-polar-midnight-deep text-pure-white'
                    : 'bg-pure-white text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant font-body-md">Loading media...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="bg-pure-white rounded-xl p-12 text-center shadow-sm">
              <Image className="w-12 h-12 text-outline-variant mx-auto mb-4" />
              <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">No media found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Hero card — first item */}
              {filteredMedia[0] && (
                <div className="md:col-span-7 flex flex-col rounded-xl overflow-hidden bg-pure-white shadow-sm group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative h-80 w-full overflow-hidden">
                    <img alt={filteredMedia[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={filteredMedia[0].thumbnailUrl || ''} />
                    <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/90 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <span className="px-2.5 py-1 rounded bg-polar-midnight-deep/80 text-pure-white font-label-sm text-label-sm uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5">
                        <Camera className="w-3 h-3" /> Station Profile
                      </span>
                      <span className="px-2 py-0.5 rounded bg-pure-white/90 text-secondary font-code-sm text-code-sm font-semibold">{filteredMedia[0].id}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-pure-white">
                      <span className="font-code-sm text-code-sm text-glacial-sky">{filteredMedia[0].region} • {filteredMedia[0].year}</span>
                      <h3 className="font-headline-md text-headline-md font-bold leading-tight">{filteredMedia[0].title}</h3>
                      <p className="font-body-sm text-body-sm text-inverse-primary line-clamp-2">{filteredMedia[0].description}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-pure-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{filteredMedia[0].caption || filteredMedia[0].region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-code-sm text-[10px] font-semibold uppercase">Verified</span>
                      <span className="text-secondary font-label-sm text-label-sm font-semibold cursor-pointer hover:underline">View Full Resolution →</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Smaller cards */}
              {filteredMedia.slice(1).map(item => (
                <div key={item.id} className="md:col-span-5 flex flex-col rounded-xl overflow-hidden bg-pure-white shadow-sm group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative h-52 w-full overflow-hidden">
                    <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.thumbnailUrl || ''} />
                    <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/80 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-polar-midnight-deep/80 text-pure-white font-label-sm text-label-sm uppercase backdrop-blur-sm flex items-center gap-1">
                        {item.type === 'VIDEO' ? <Video className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                        {item.region}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-pure-white/90 text-secondary font-code-sm text-code-sm font-semibold">{item.id}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5 text-pure-white">
                      <span className="font-code-sm text-code-sm text-glacial-sky">{item.year} • {item.type}</span>
                      <h4 className="font-title-md text-title-md font-bold leading-snug">{item.title}</h4>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-pure-white text-on-surface-variant font-label-sm text-label-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {item.caption || item.region}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-low text-outline font-code-sm text-[10px]">{item.expeditionId}</span>
                      <span className="text-secondary font-semibold cursor-pointer hover:underline">Details →</span>
                    </div>
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
