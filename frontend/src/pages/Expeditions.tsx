import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, X, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import type { Expedition } from '../types';
import { Skeleton, EmptyState, ErrorState } from '../components/ui';

export default function Expeditions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const regionFilter = searchParams.get('region') || '';

  const [searchQuery, setSearchQuery] = useState(q);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getExpeditions()
      .then(data => setExpeditions(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setSearchQuery(q); }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    searchQuery ? newParams.set('q', searchQuery) : newParams.delete('q');
    setSearchParams(newParams);
  };

  const filtered = useMemo(() => {
    let data = [...expeditions];
    if (q) {
      const lq = q.toLowerCase();
      data = data.filter(e => e.name.toLowerCase().includes(lq) || e.objective.toLowerCase().includes(lq) || e.region.toLowerCase().includes(lq));
    }
    if (regionFilter) data = data.filter(e => e.region === regionFilter);
    return data;
  }, [expeditions, q, regionFilter]);

  const clearAll = () => { setSearchParams({}); setSearchQuery(''); };

  const hasFilters = Boolean(q || regionFilter);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      {/* ─── HEADER ─── */}
      <section className="w-full bg-snow pt-10 md:pt-16 pb-8">
        <div className="container-standard flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">Field Expeditions</span>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-deep-ocean tracking-tight leading-tight">
            India's Polar Expeditions
          </h1>
          <p className="text-[16px] text-ink/60 max-w-[520px]">
            Explore documented polar expeditions and their available research context.
          </p>
        </div>
      </section>

      {/* ─── SEARCH ─── */}
      <section className="w-full pb-2">
        <div className="container-standard">
          <form onSubmit={handleSearch} className="relative w-full">
            <label htmlFor="expedition-search" className="sr-only">Search expeditions</label>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
            <input 
              id="expedition-search"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search expeditions, regions, years..."
              className="w-full h-[52px] bg-white border border-border-ice rounded-[12px] pl-12 pr-12 text-[16px] text-deep-ocean font-medium placeholder:text-muted/50 outline-none focus:border-glacial-blue/50 focus:ring-2 focus:ring-glacial-blue/10 transition-all"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('q');
                  setSearchQuery('');
                  setSearchParams(newParams);
                }} 
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-ink rounded-full hover:bg-frost transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="hidden">Submit</button>
          </form>
        </div>
      </section>

      {/* ─── FILTERS ─── */}
      <section className="w-full pb-6">
        <div className="container-standard">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <div className="relative w-full sm:w-auto">
              <label htmlFor="region-filter" className="sr-only">Filter by region</label>
              <select 
                id="region-filter"
                value={regionFilter} 
                onChange={e => { 
                  const newParams = new URLSearchParams(searchParams);
                  e.target.value ? newParams.set('region', e.target.value) : newParams.delete('region'); 
                  setSearchParams(newParams); 
                }}
                className="w-full sm:w-[160px] h-[42px] pl-4 pr-10 bg-white text-[14px] text-ink font-medium rounded-[10px] cursor-pointer appearance-none outline-none border border-border-ice hover:border-glacial-blue/30 focus:border-glacial-blue/50 focus:ring-2 focus:ring-glacial-blue/10 transition-all"
              >
                <option value="">All Regions</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Arctic">Arctic</option>
                <option value="Himalayas">Himalayas</option>
                <option value="Southern Ocean">Southern Ocean</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {q && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-deep-ocean text-white text-[11px] font-semibold">
                  "{q}" 
                  <button aria-label="Clear search" onClick={() => { 
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('q'); 
                    setSearchQuery(''); 
                    setSearchParams(newParams); 
                  }} className="hover:text-cyan-accent p-0.5 rounded transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {regionFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-border-ice text-deep-ocean text-[11px] font-semibold">
                  Region: {regionFilter} 
                  <button aria-label="Clear region filter" onClick={() => { 
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('region'); 
                    setSearchParams(newParams); 
                  }} className="hover:text-error p-0.5 rounded transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button onClick={clearAll} className="text-[11px] font-semibold text-muted hover:text-deep-ocean hover:underline ml-1 transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── RESULTS ─── */}
      <section className="w-full pb-24 flex-1">
        <div className="container-standard">
          <div className="border-b border-border-ice pb-3 mb-6">
            <span className="text-[13px] text-muted font-medium">
              {loading ? 'Loading...' : `${filtered.length} expedition${filtered.length !== 1 ? 's' : ''} found`}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[12px] border border-border-ice flex flex-col md:flex-row h-[220px]">
                  <Skeleton className="w-full md:w-[300px] h-[200px] md:h-full rounded-none rounded-t-[12px] md:rounded-l-[12px] md:rounded-tr-none shrink-0" />
                  <div className="p-6 flex-1 flex flex-col justify-center gap-3">
                    <Skeleton className="h-4 w-[120px] rounded" />
                    <Skeleton className="h-6 w-[60%] rounded mb-2" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-[80%] rounded" />
                    <Skeleton className="h-4 w-[100px] rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 bg-white rounded-[12px] border border-border-ice flex items-center justify-center">
              <ErrorState message="Unable to load expeditions." onRetry={() => window.location.reload()} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 bg-white rounded-[12px] border border-border-ice flex items-center justify-center">
              <EmptyState
                icon={SearchIcon}
                title={expeditions.length === 0 ? "No expeditions are available yet." : "No expeditions matched your search."}
                description={expeditions.length === 0 ? "Expedition records will appear here when they are added to the repository." : "Adjust your search terms or filters to find what you're looking for."}
                actionLabel={hasFilters ? "Clear Filters" : undefined}
                onAction={clearAll}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filtered.map(exp => {
                // Determine if we have a real image field (fallback to quiet placeholder if none)
                const actualImageUrl = (exp as any).imageUrl; // Access if added to backend

                return (
                  <Link key={exp.id} to={`/expeditions/${exp.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 rounded-[12px]">
                    <article className="group bg-white rounded-[12px] flex flex-col md:flex-row items-stretch border border-border-ice hover:border-glacial-blue/40 hover:shadow-sm transition-all duration-200 overflow-hidden">
                      
                      {/* Image / Fallback Section */}
                      <div className="w-full md:w-[280px] shrink-0 border-r border-border-ice/50 bg-deep-ocean/5 relative overflow-hidden">
                        <img 
                          src={actualImageUrl || "/images/polar/polar_map_placeholder.jpg"} 
                          alt={exp.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                        />
                        {!actualImageUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-deep-ocean/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em] px-3 py-1 bg-deep-ocean/80 rounded-md backdrop-blur-sm">View Map Area</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 flex flex-col justify-center p-6 md:p-8">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-glacial-blue mb-2">
                          <span>Field Expedition</span>
                        </div>
                        
                        <h2 className="font-display text-[22px] font-bold text-ink group-hover:text-glacial-blue transition-colors leading-[1.2] mb-3">
                          {exp.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted font-medium mb-4">
                          {exp.region && <span>{exp.region}</span>}
                          {exp.region && exp.year && <span>·</span>}
                          {exp.year && <span>{exp.year}</span>}
                        </div>
                        
                        <p className="text-[15px] text-ink/70 font-light leading-relaxed mb-6 line-clamp-2 md:line-clamp-3">
                          {exp.objective}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-border-ice/60 flex items-center text-[13px] font-semibold text-glacial-blue group-hover:text-cyan-accent transition-colors">
                          View Expedition <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
