import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Search as SearchIcon, Filter, X, ChevronRight, BookOpen, Database, Camera } from 'lucide-react';
import { api } from '../services/api';
import type { Expedition, Resource, MediaItem } from '../types';

const EXPEDITION_IMAGES: Record<string, string> = {
  'EXP-43': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA',
  'EXP-ARC-15': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB96sKfj2s1GP-c4K4liF32nJk6pqICs30jsSS1NnNd5dzn4ykdY0PyEOGQGyci-tWIbPkpGZNDPBgTXzxXGGr3elVT4A7ujheEbfdvpBDzu13jOxlU0GSgwsnizLarYDOymKsDbyYWRzYSAMiCXID7VzCUsIEIQ1znRyY9FIyODNc14oNsWRL17GHi2WhyUnLpa-j40NYGS0pB8F7qsL4sbyO-IoSP2c8FRtD1Dsp3c5de68u1EvlYw',
  'EXP-SO-2024': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV_C6b5zrKkQSFIhMOvZZn6R1_m0viH4zJ6telQyT419UgjW68niXGtanxETA0KhUkk7u7ZDCRoo8G_3TX4uRj7IjyjCh1KhhfLBb7VNFm0b5XBUenvylXHIxgPQW5bL-mL8EWZ5H1IoPPjf8WVP4Gg8OLjhDrnAplWyW9F1Fqxewx6cTtETEK9t63P0vpIAzj9pOGuAUmkp_145lHVXmNB39MGwf1_-kTM_ja55If4ejn8Uw_t6rMIw',
  'EXP-42': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoh_p2zMxwZwU_Tz-12xqiAZAyn2SGIt01c1Hw3MNhXKESF8DCd1BaJot_jsT0LzOFYzVlA3Hez-MLsuhb_wY8ShfUEDvzvq91fuHEdW1i83wF-d43RhGObbdOOmaYKL7W3E-V6ai2p_IP8ZdEU48cTzcKUuCi6k2mMvaumxoZ3bjmef4tDLaXiP4XAoMcZXGwZJf-_x802BVm6_SnwoCVeo9KQIdjR-mmGrjZxZYxR6Q82lDbi31x6Q',
  'EXP-HIM-5': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA' // fallback
};

export default function Expeditions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const regionFilter = searchParams.get('region') || '';
  const yearFilter = searchParams.get('year') || '';
  const themeFilter = searchParams.get('theme') || '';

  const [searchQuery, setSearchQuery] = useState(q);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [expData, resData, mediaData] = await Promise.all([
        api.getExpeditions(),
        api.getResources(),
        api.getMedia()
      ]);
      setExpeditions(expData || []);
      setResources(resData || []);
      setMedia(mediaData || []);
    } catch (err) {
      console.error('Failed to load expeditions:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update local search input if URL changes externally
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

  const updateFilter = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  // Extract available filter options directly from data
  const availableYears = useMemo(() => Array.from(new Set(expeditions.map(e => e.year))).sort((a, b) => b - a), [expeditions]);
  const availableRegions = useMemo(() => Array.from(new Set(expeditions.map(e => e.region))).sort(), [expeditions]);
  const availableThemes = ['Glaciology', 'Oceanography', 'Atmospheric', 'Cryosphere', 'Geophysical', 'Carbon'];

  // Apply filters
  const filteredExpeditions = useMemo(() => {
    return expeditions.filter(exp => {
      // Search text (matches name, region, objective)
      if (q) {
        const query = q.toLowerCase();
        const matchesQuery = 
          exp.name.toLowerCase().includes(query) || 
          exp.region.toLowerCase().includes(query) || 
          exp.objective.toLowerCase().includes(query) ||
          exp.year.toString().includes(query);
        if (!matchesQuery) return false;
      }
      
      // Region
      if (regionFilter && exp.region.toLowerCase() !== regionFilter.toLowerCase()) return false;
      
      // Year
      if (yearFilter && exp.year.toString() !== yearFilter) return false;
      
      // Theme (simple substring match on objective for demo)
      if (themeFilter && !exp.objective.toLowerCase().includes(themeFilter.toLowerCase())) return false;
      
      return true;
    }).sort((a, b) => b.year - a.year); // Sort newest first
  }, [expeditions, q, regionFilter, yearFilter, themeFilter]);

  // Group by year for the timeline view
  const timelineGroups = useMemo(() => {
    const groups: Record<number, Expedition[]> = {};
    filteredExpeditions.forEach(exp => {
      if (!groups[exp.year]) groups[exp.year] = [];
      groups[exp.year].push(exp);
    });
    return Object.entries(groups)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Newest first
      .map(([year, exps]) => ({ year: Number(year), expeditions: exps }));
  }, [filteredExpeditions]);

  const hasFilters = Boolean(q || regionFilter || yearFilter || themeFilter);

  // Helper to count linked resources
  const getResourceStats = (expId: string) => {
    const expResources = resources.filter(r => r.expeditionId === expId);
    const expMedia = media.filter(m => m.expeditionId === expId);
    return {
      datasets: expResources.filter(r => r.type === 'DATASET').length,
      pubs: expResources.filter(r => r.type === 'PUBLICATION' || r.type === 'REPORT').length,
      media: expMedia.length,
      total: expResources.length + expMedia.length
    };
  };

  const getStatus = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date('2026-09-28').getTime(); // Using mock current date
    return end < now ? 'Completed' : 'Ongoing';
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      {/* Header */}
      <section className="w-full bg-polar-midnight-deep text-ice-white py-12 px-4 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-azure-accent/10 via-polar-midnight-deep to-polar-midnight-deep"></div>
        
        <div className="max-w-[1360px] mx-auto flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight">Polar Expeditions</h1>
            <p className="font-body-lg text-body-lg text-surface-dim">
              Explore India's scientific journeys across the Arctic, Antarctic and associated polar research environments.
            </p>
          </div>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative max-w-3xl mt-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              className="w-full pl-12 pr-28 py-3.5 bg-pure-white text-polar-midnight-deep font-body-md text-body-md rounded-xl focus:outline-none focus:ring-2 focus:ring-azure-accent transition-all shadow-lg"
              placeholder="Search expeditions by name, year, region or research theme..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Expeditions"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-polar-midnight-deep text-on-primary font-label-md text-label-md rounded-lg hover:bg-polar-navy-surface transition-colors font-bold"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full px-4 lg:px-8 py-8 lg:py-12 flex-1">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Sidebar Filters */}
          <aside className={`lg:col-span-3 flex flex-col gap-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:flex'}`}>
            <div className="bg-pure-white rounded-xl shadow-sm p-6 flex flex-col gap-8 border border-slate-border">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md font-bold text-polar-midnight-deep flex items-center gap-2">
                  <Filter className="w-5 h-5 text-secondary" />
                  Filters
                </span>
                {hasFilters && (
                  <button onClick={clearAllFilters} className="font-label-sm text-label-sm text-secondary hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              {/* Geographic Region */}
              <div className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Region</span>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => updateFilter('region', '')}
                    className={`text-left px-3 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${!regionFilter ? 'bg-surface-container text-polar-midnight-deep font-semibold' : 'text-on-surface hover:bg-surface-container-low'}`}
                  >
                    All Regions
                  </button>
                  {availableRegions.map(region => (
                    <button 
                      key={region}
                      onClick={() => updateFilter('region', region)}
                      className={`text-left px-3 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${regionFilter === region ? 'bg-surface-container text-polar-midnight-deep font-semibold' : 'text-on-surface hover:bg-surface-container-low'}`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Year</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => updateFilter('year', '')}
                    className={`px-3 py-1.5 rounded-lg font-code-sm text-code-sm transition-colors ${!yearFilter ? 'bg-polar-midnight-deep text-pure-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                  >
                    All
                  </button>
                  {availableYears.map(year => (
                    <button 
                      key={year}
                      onClick={() => updateFilter('year', year.toString())}
                      className={`px-3 py-1.5 rounded-lg font-code-sm text-code-sm transition-colors ${yearFilter === year.toString() ? 'bg-polar-midnight-deep text-pure-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Research Theme */}
              <div className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Research Theme</span>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => updateFilter('theme', '')}
                    className={`text-left px-3 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${!themeFilter ? 'bg-surface-container text-polar-midnight-deep font-semibold' : 'text-on-surface hover:bg-surface-container-low'}`}
                  >
                    All Themes
                  </button>
                  {availableThemes.map(theme => (
                    <button 
                      key={theme}
                      onClick={() => updateFilter('theme', theme)}
                      className={`text-left px-3 py-2 rounded-lg font-body-sm text-body-sm transition-colors ${themeFilter === theme ? 'bg-surface-container text-polar-midnight-deep font-semibold' : 'text-on-surface hover:bg-surface-container-low'}`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Timeline & Grid */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Active Tags Bar & Mobile Filter Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-title-md text-title-md font-bold text-polar-midnight-deep">
                {loading ? 'Loading...' : `${filteredExpeditions.length} ${filteredExpeditions.length === 1 ? 'Expedition' : 'Expeditions'}`}
              </h2>
              
              <div className="flex items-center gap-2">
                <button 
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-pure-white border border-slate-border text-secondary font-label-sm text-label-sm rounded-lg shadow-sm"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                  <Filter className="w-4 h-4" /> {isMobileFilterOpen ? 'Close Filters' : 'Filters'}
                </button>
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Active:</span>
                {q && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pure-white border border-slate-border text-secondary font-label-sm text-label-sm shadow-sm">
                    Query: {q}
                    <button onClick={() => updateFilter('q', '')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {regionFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pure-white border border-slate-border text-secondary font-label-sm text-label-sm shadow-sm">
                    Region: {regionFilter}
                    <button onClick={() => updateFilter('region', '')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {yearFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pure-white border border-slate-border text-secondary font-label-sm text-label-sm shadow-sm">
                    Year: {yearFilter}
                    <button onClick={() => updateFilter('year', '')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {themeFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pure-white border border-slate-border text-secondary font-label-sm text-label-sm shadow-sm">
                    Theme: {themeFilter}
                    <button onClick={() => updateFilter('theme', '')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin"></div>
              </div>
            ) : error ? (
               <div className="bg-pure-white rounded-xl p-16 flex flex-col items-center justify-center text-center border border-slate-border shadow-sm">
                  <X className="w-16 h-16 text-error mb-4" />
                  <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">Unable to load expeditions.</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">There was a problem connecting to the server. Please try again later.</p>
                  <button onClick={() => loadData()} className="px-6 py-2.5 bg-polar-midnight-deep text-pure-white font-label-md font-semibold rounded-lg hover:bg-polar-navy-surface transition-colors">
                    Retry
                  </button>
               </div>
            ) : filteredExpeditions.length === 0 ? (
              <div className="bg-pure-white rounded-xl p-16 flex flex-col items-center justify-center text-center border border-slate-border shadow-sm">
                <MapPin className="w-16 h-16 text-slate-border-strong mb-4" />
                <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">No expeditions match the selected filters.</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">
                  Try adjusting your search terms or clearing the selected filters to view all expeditions.
                </p>
                <button onClick={clearAllFilters} className="px-6 py-2.5 bg-polar-midnight-deep text-pure-white font-label-md font-semibold rounded-lg hover:bg-polar-navy-surface transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-12">
                {timelineGroups.map(group => (
                  <div key={group.year} className="flex flex-col gap-6 relative">
                    {/* Timeline Year Marker */}
                    <div className="flex items-center gap-4 sticky top-24 z-20 bg-surface/90 backdrop-blur py-2">
                      <div className="w-16 font-headline-md text-headline-md font-bold text-polar-midnight-deep">
                        {group.year}
                      </div>
                      <div className="h-px bg-slate-border-strong flex-1"></div>
                    </div>
                    
                    {/* Year's Expeditions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 lg:pl-4">
                      {group.expeditions.map(exp => {
                        const stats = getResourceStats(exp.id);
                        const status = getStatus(exp.endDate);
                        
                        return (
                          <article key={exp.id} className="flex flex-col rounded-xl bg-pure-white border border-slate-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group h-full">
                            {/* Image Header */}
                            <div className="relative h-48 w-full overflow-hidden bg-polar-midnight-deep">
                              <img
                                alt={exp.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                src={EXPEDITION_IMAGES[exp.id] || EXPEDITION_IMAGES['EXP-HIM-5']}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/80 via-transparent to-transparent pointer-events-none"></div>
                              
                              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                <span className="px-2.5 py-1 rounded bg-pure-white/95 text-polar-midnight-deep font-label-sm text-[10px] uppercase tracking-wider font-bold shadow-sm">
                                  {exp.region}
                                </span>
                                {status === 'Completed' && (
                                  <span className="px-2.5 py-1 rounded bg-aurora-emerald/90 text-pure-white font-label-sm text-[10px] uppercase tracking-wider font-bold shadow-sm">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1 gap-4">
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(exp.startDate).toLocaleDateString(undefined, {month: 'short'})} — {new Date(exp.endDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'})}</span>
                                  </div>
                                  <span className="text-outline-variant font-mono">{exp.id}</span>
                                </div>
                                
                                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep line-clamp-2 group-hover:text-secondary transition-colors">
                                  <Link to={`/expeditions/${exp.id}`}>
                                    {exp.name}
                                  </Link>
                                </h3>
                                
                                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mt-1">
                                  {exp.objective}
                                </p>
                              </div>
                              
                              {/* Meta Stats Row */}
                              {stats.total > 0 && (
                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-border">
                                  {stats.datasets > 0 && (
                                    <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm" title={`${stats.datasets} Datasets`}>
                                      <Database className="w-4 h-4 text-aurora-emerald" />
                                      <span>{stats.datasets}</span>
                                    </div>
                                  )}
                                  {stats.pubs > 0 && (
                                    <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm" title={`${stats.pubs} Publications & Reports`}>
                                      <BookOpen className="w-4 h-4 text-azure-accent" />
                                      <span>{stats.pubs}</span>
                                    </div>
                                  )}
                                  {stats.media > 0 && (
                                    <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm" title={`${stats.media} Media Items`}>
                                      <Camera className="w-4 h-4 text-secondary" />
                                      <span>{stats.media}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* CTA Actions */}
                              <div className="flex flex-wrap items-center gap-2 pt-2 mt-auto">
                                <Link 
                                  to={`/expeditions/${exp.id}`} 
                                  className="flex-1 px-4 py-2 rounded-lg bg-polar-midnight-deep text-pure-white font-label-sm text-label-sm hover:bg-polar-navy-surface transition-colors flex items-center justify-center gap-2 font-semibold"
                                >
                                  Explore Expedition <ChevronRight className="w-4 h-4" />
                                </Link>
                                
                                {stats.total > 0 && (
                                  <Link 
                                    to={`/explore?q=${exp.id}`} 
                                    className="px-4 py-2 rounded-lg bg-surface-container-low text-secondary font-label-sm text-label-sm hover:bg-surface-container transition-colors font-semibold border border-transparent hover:border-slate-border"
                                    title="View linked research"
                                  >
                                    View Research
                                  </Link>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </section>
    </div>
  );
}
