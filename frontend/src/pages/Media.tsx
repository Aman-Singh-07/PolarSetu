import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Search as SearchIcon, Camera, Video, Image as ImageIcon, Crosshair, Share2, Info, X } from 'lucide-react';
import { api } from '../services/api';
import type { MediaItem, Expedition } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'All Media' },
  { id: 'field', label: 'Field Research' },
  { id: 'stations', label: 'Research Stations' },
  { id: 'instruments', label: 'Instruments' },
];

export default function Media() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  
  const q = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  
  const [searchQuery, setSearchQuery] = useState(q);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [mediaData, expData] = await Promise.all([
        api.getMedia(),
        api.getExpeditions()
      ]);
      setMediaItems(mediaData);
      setExpeditions(expData);
      
      if (mediaData.length > 0 && !selectedMediaId) {
        setSelectedMediaId(mediaData[0].id);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const setCategory = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredMedia = useMemo(() => {
    return mediaItems.filter(item => {
      // Basic text search
      if (q) {
        const query = q.toLowerCase();
        const matches = 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) || 
          item.region.toLowerCase().includes(query);
        if (!matches) return false;
      }
      
      // Category filter (derived from title/description for demo purposes)
      if (categoryFilter !== 'all') {
        const text = (item.title + ' ' + item.description).toLowerCase();
        if (categoryFilter === 'stations' && !text.includes('station')) return false;
        if (categoryFilter === 'instruments' && !text.includes('ctd') && !text.includes('lidar') && !text.includes('sensor')) return false;
        if (categoryFilter === 'field' && text.includes('station')) return false; // Rough heuristic
      }
      return true;
    });
  }, [mediaItems, q, categoryFilter]);

  const selectedItem = useMemo(() => {
    return filteredMedia.find(m => m.id === selectedMediaId) || filteredMedia[0] || null;
  }, [filteredMedia, selectedMediaId]);

  const relatedExpedition = useMemo(() => {
    if (!selectedItem || !selectedItem.expeditionId) return null;
    return expeditions.find(e => e.id === selectedItem.expeditionId) || null;
  }, [selectedItem, expeditions]);

  const antarcticaCount = mediaItems.filter(m => m.region === 'Antarctica').length;
  const arcticCount = mediaItems.filter(m => m.region === 'Arctic').length;
  const himalayaCount = mediaItems.filter(m => m.region === 'Himalayas').length;

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen pt-20">
      {/* Top Command & Provenance Bar */}
      <div className="w-full bg-polar-midnight-deep text-pure-white px-4 lg:px-8 py-2.5 border-b border-white/10">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high/20 text-glacial-sky font-code-sm text-[11px] font-semibold">MoES / NCPOR Archive</span>
            <span className="text-white/40 text-xs hidden sm:inline">•</span>
            <span className="font-label-sm text-label-sm text-surface-container-highest tracking-wide uppercase hidden sm:inline">Cryospheric Visual Archive & Media Dissemination Layer</span>
          </div>
          <div className="flex items-center gap-3 font-code-sm text-code-sm text-glacial-sky">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-aurora-emerald animate-pulse"></span>Feed Synchronized</span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-inverse-primary hidden sm:inline">FAIR Open-Access</span>
          </div>
        </div>
      </div>

      {/* Header & Search Console */}
      <section className="w-full bg-surface-container-low px-4 lg:px-8 py-8 lg:py-12 border-b border-slate-border/50">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-draft-amber-bg text-draft-amber-text font-label-sm text-[10px] font-bold uppercase tracking-wider shadow-sm">Prototype Demonstration Data</span>
                <span className="px-2.5 py-1 rounded bg-surface-container text-secondary font-label-sm text-[10px] font-bold uppercase tracking-wider shadow-sm">{mediaItems.length} Catalogued Assets</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep tracking-tight">Polar Media Explorer</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                Explore field photographs, research stations, instruments and expedition moments from India's polar research ecosystem.
              </p>
            </div>
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-pure-white p-2 rounded-xl shadow-sm self-start shrink-0">
              <div className="flex flex-col px-4 py-2 bg-surface-container-low rounded-lg">
                <span className="font-label-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Antarctica</span>
                <span className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep leading-none">{antarcticaCount}</span>
              </div>
              <div className="flex flex-col px-4 py-2 bg-surface-container-low rounded-lg">
                <span className="font-label-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Arctic</span>
                <span className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep leading-none">{arcticCount}</span>
              </div>
              <div className="flex flex-col px-4 py-2 bg-surface-container-low rounded-lg">
                <span className="font-label-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Himalaya</span>
                <span className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep leading-none">{himalayaCount}</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-pure-white p-2 rounded-xl shadow-sm">
              <div className="relative flex-1 flex items-center">
                <SearchIcon className="absolute left-4 w-5 h-5 text-outline-variant" />
                <input
                  className="w-full bg-ice-white rounded-lg pl-12 pr-4 py-3 text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-azure-accent transition-all"
                  placeholder="Search media by expedition, keyword, instrument, station..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => {setSearchQuery(''); setSearchParams({});}} className="absolute right-4 text-on-surface-variant hover:text-error">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="submit" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-polar-midnight-deep text-pure-white hover:bg-polar-navy-surface rounded-lg font-label-md text-label-md font-semibold transition-colors">
                  Search
                </button>
              </div>
            </form>

            {/* Category Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map(cat => {
                const isActive = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full font-label-md text-label-md font-semibold transition-all whitespace-nowrap shadow-sm border ${
                      isActive
                        ? 'bg-polar-midnight-deep text-pure-white border-polar-midnight-deep'
                        : 'bg-pure-white text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border-slate-border'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-[1360px] mx-auto flex flex-col xl:flex-row items-start gap-8">
          
          {/* Left Side: Gallery Grid */}
          <div className="w-full xl:w-2/3 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                <span className="font-bold text-polar-midnight-deep uppercase tracking-wider">
                  Showing {filteredMedia.length} of {mediaItems.length} Artifacts
                </span>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin"></div>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="bg-pure-white rounded-xl p-16 text-center border border-slate-border shadow-sm">
                <ImageIcon className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">No media found</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Adjust your search or clear filters to see more.</p>
                <button onClick={() => {setSearchQuery(''); setSearchParams({});}} className="px-6 py-2 bg-polar-midnight-deep text-pure-white font-label-md font-semibold rounded-lg hover:bg-polar-navy-surface">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMedia.map((item) => {
                  const isSelected = selectedMediaId === item.id;
                  return (
                    <article 
                      key={item.id} 
                      onClick={() => setSelectedMediaId(item.id)}
                      className={`group flex flex-col bg-pure-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${isSelected ? 'border-secondary' : 'border-transparent'}`}
                    >
                      <div className="relative w-full aspect-[16/10] bg-polar-navy-surface overflow-hidden">
                        <img 
                          alt={item.title} 
                          className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`} 
                          src={item.thumbnailUrl || ''} 
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-polar-midnight-deep/90 backdrop-blur-sm text-pure-white font-label-sm text-[10px] font-bold tracking-wider uppercase">
                            {item.expeditionId || 'Archival'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-azure-accent/90 backdrop-blur-sm text-pure-white font-label-sm text-[10px] font-bold uppercase">
                            {item.type}
                          </span>
                        </div>
                        {item.type === 'VIDEO' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-polar-midnight-deep/70 backdrop-blur-sm flex items-center justify-center text-pure-white shadow-lg">
                              <Video className="w-6 h-6 ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-secondary" /> {item.region}</span>
                          <span>{item.year}</span>
                        </div>
                        <h3 className={`font-title-md text-title-md font-bold line-clamp-1 transition-colors ${isSelected ? 'text-secondary' : 'text-polar-midnight-deep group-hover:text-secondary'}`}>
                          {item.title}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Sticky Inspector Panel */}
          <aside className="w-full xl:w-1/3 flex flex-col gap-6 sticky top-24">
            {selectedItem ? (
              <div className="bg-pure-white rounded-xl shadow-md border border-slate-border flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-border bg-surface-container-lowest">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-aurora-emerald"></span>
                    <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-polar-midnight-deep">Archival Specimen</span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-2 py-0.5 rounded font-semibold">
                    {selectedItem.id}
                  </span>
                </div>

                {/* Preview Image */}
                <div className="relative w-full aspect-video bg-polar-midnight-deep overflow-hidden">
                  <img 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover" 
                    src={selectedItem.thumbnailUrl || ''} 
                  />
                  {selectedItem.type === 'VIDEO' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-polar-midnight-deep/70 backdrop-blur-sm flex items-center justify-center text-pure-white shadow-lg cursor-pointer hover:bg-polar-midnight-deep transition-colors">
                        <Video className="w-8 h-8 ml-1" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/90 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-none">
                    <div className="flex items-center justify-between text-pure-white text-xs">
                      <span className="font-code-sm flex items-center gap-1.5 opacity-90"><Camera className="w-3.5 h-3.5 text-glacial-sky" /> High-Resolution Capture</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep leading-snug">
                      {selectedItem.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Metadata Table */}
                  <div className="bg-ice-white rounded-lg p-4 flex flex-col gap-2.5 font-code-sm text-code-sm text-on-surface border border-slate-border/60">
                    <div className="flex justify-between py-1 border-b border-slate-border/60">
                      <span className="text-on-surface-variant">Location:</span>
                      <span className="font-semibold text-polar-midnight-deep text-right">{selectedItem.caption || selectedItem.region}</span>
                    </div>
                    {relatedExpedition && (
                      <div className="flex justify-between py-1 border-b border-slate-border/60">
                        <span className="text-on-surface-variant">Expedition Lead:</span>
                        <span className="font-semibold text-polar-midnight-deep text-right">{relatedExpedition.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-border/60">
                      <span className="text-on-surface-variant">Date Captured:</span>
                      <span className="font-semibold text-polar-midnight-deep text-right">{selectedItem.year}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-on-surface-variant">Format:</span>
                      <span className="font-semibold text-polar-midnight-deep text-right">{selectedItem.type === 'VIDEO' ? '4K MP4' : 'TIFF RAW'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      onClick={() => navigate(`/outreach`, { state: { sourceId: selectedItem.id } })}
                      className="w-full py-3 px-4 bg-polar-midnight-deep hover:bg-polar-navy-surface text-pure-white rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Share2 className="w-4 h-4 text-glacial-sky" />
                      <span>Export to Outreach Studio</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {relatedExpedition && (
                        <button 
                          onClick={() => navigate(`/expeditions/${relatedExpedition.id}`)}
                          className="w-full py-2.5 px-3 bg-surface-container-high hover:bg-surface-container text-secondary rounded-lg font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>View Expedition</span>
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/explore?q=${selectedItem.id}`)}
                        className={`w-full py-2.5 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${!relatedExpedition ? 'col-span-2' : ''}`}
                      >
                        <SearchIcon className="w-4 h-4" />
                        <span>Find Resources</span>
                      </button>
                    </div>
                  </div>

                  {/* Provenance Footer */}
                  <div className="mt-2 p-3 rounded-lg bg-surface-container-lowest border border-slate-border flex items-start gap-3">
                    <Info className="w-5 h-5 text-aurora-emerald shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-label-sm font-bold text-polar-midnight-deep uppercase">NCPOR Provenance</span>
                      <p className="font-body-sm text-[11px] leading-tight text-on-surface-variant">
                        Prototype Media Record. Usage rights apply to MoES educational derivatives only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px] border border-slate-border/50">
                <Crosshair className="w-12 h-12 text-outline-variant mb-4" />
                <h4 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">Select a Media Artifact</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Click on any media card in the gallery to inspect high-resolution imagery, view related expedition metadata, and access outreach actions.
                </p>
              </div>
            )}
          </aside>
          
        </div>
      </section>
    </div>
  );
}
