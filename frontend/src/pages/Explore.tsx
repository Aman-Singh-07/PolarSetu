import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, ChevronDown, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import type { Resource } from '../types';
import { Skeleton, EmptyState, ErrorState } from '../components/ui';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || '';
  const regionFilter = searchParams.get('region') || '';

  const [searchQuery, setSearchQuery] = useState(q);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Resource[] = [];
        
        const apiTypeFilter = typeFilter ? typeFilter.toUpperCase() : undefined;
        
        if (q) {
          data = await api.searchResources(q, ac.signal);
          if (typeFilter) data = data.filter(r => r.type?.toUpperCase() === apiTypeFilter);
          if (regionFilter) data = data.filter(r => r.region?.toLowerCase() === regionFilter.toLowerCase());
        } else {
          data = await api.getResources({ type: apiTypeFilter, region: regionFilter });
        }
        
        if (isMounted && !ac.signal.aborted) {
          setResources(data);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError('Research could not be loaded.');
      } finally {
        if (isMounted && !ac.signal.aborted) setLoading(false);
      }
    };

    load();
    setSearchQuery(q);
    
    return () => {
      ac.abort();
      isMounted = false;
    };
  }, [q, typeFilter, regionFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchQuery('');
    setSearchParams(newParams);
  };

  const clearAll = () => { 
    setSearchParams({}); 
    setSearchQuery(''); 
  };

  const setFilter = (key: string, val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const hasFilters = Boolean(typeFilter || regionFilter);
  const isSearchActive = Boolean(q);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">

      {/* ─── HEADER ─── */}
      <section className="w-full bg-snow pt-10 md:pt-16 pb-8">
        <div className="container-standard flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">Research Repository</span>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-deep-ocean tracking-tight leading-tight">
            Explore Polar Research
          </h1>
          <p className="text-[16px] text-ink/60 max-w-[520px]">
            Search the available polar-science knowledge repository.
          </p>
        </div>
      </section>

      {/* ─── SEARCH ─── */}
      <section className="w-full pb-2">
        <div className="container-standard">
          <form onSubmit={handleSearch} className="relative w-full">
            <label htmlFor="resource-search" className="sr-only">Search resources</label>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
            <input 
              id="resource-search"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search papers, reports, observations, topics..."
              className="w-full h-[52px] bg-white border border-border-ice rounded-[12px] pl-12 pr-12 text-[16px] text-deep-ocean font-medium placeholder:text-muted/50 outline-none focus:border-glacial-blue/50 focus:ring-2 focus:ring-glacial-blue/10 transition-all"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch} 
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
              <label htmlFor="type-filter" className="sr-only">Filter by type</label>
              <select 
                id="type-filter"
                value={typeFilter} 
                onChange={e => setFilter('type', e.target.value)} 
                className="w-full sm:w-[160px] h-[42px] pl-4 pr-10 bg-white text-[14px] text-ink font-medium rounded-[10px] cursor-pointer appearance-none outline-none border border-border-ice hover:border-glacial-blue/30 focus:border-glacial-blue/50 focus:ring-2 focus:ring-glacial-blue/10 transition-all"
              >
                <option value="">All Types</option>
                <option value="dataset">Dataset</option>
                <option value="publication">Publication</option>
                <option value="report">Report</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>

            <div className="relative w-full sm:w-auto">
              <label htmlFor="region-filter" className="sr-only">Filter by region</label>
              <select 
                id="region-filter"
                value={regionFilter} 
                onChange={e => setFilter('region', e.target.value)} 
                className="w-full sm:w-[160px] h-[42px] pl-4 pr-10 bg-white text-[14px] text-ink font-medium rounded-[10px] cursor-pointer appearance-none outline-none border border-border-ice hover:border-glacial-blue/30 focus:border-glacial-blue/50 focus:ring-2 focus:ring-glacial-blue/10 transition-all"
              >
                <option value="">All Regions</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Arctic">Arctic</option>
                <option value="Himalayas">Himalayas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Active filter pills */}
          {(q || regionFilter || typeFilter) && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {q && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-deep-ocean text-white text-[11px] font-semibold">
                  "{q}" 
                  <button aria-label="Clear search" onClick={clearSearch} className="hover:text-cyan-accent p-0.5 rounded transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-border-ice text-deep-ocean text-[11px] font-semibold">
                  Type: {typeFilter} 
                  <button aria-label="Clear type filter" onClick={() => { 
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('type'); 
                    setSearchParams(newParams); 
                  }} className="hover:text-error p-0.5 rounded transition-colors">
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
          {/* Result count */}
          <div className="border-b border-border-ice pb-3 mb-6">
            <span className="text-[13px] text-muted font-medium">
              {loading ? 'Loading...' : `${resources.length} resource${resources.length !== 1 ? 's' : ''} found`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[240px] w-full rounded-[12px]" />)}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map(r => (
                <Link key={r.id} to={`/research/${r.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 rounded-[12px]">
                  <article className="h-full group bg-white rounded-[12px] p-5 flex flex-col border border-border-ice hover:border-glacial-blue/40 hover:shadow-sm transition-all duration-200">
                    {/* Type */}
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-glacial-blue mb-3">
                      {r.type || 'RESOURCE'}
                    </span>

                    {/* Title */}
                    <h3 className="font-display text-[18px] font-bold text-ink leading-[1.3] line-clamp-2 mb-2 group-hover:text-glacial-blue transition-colors">
                      {r.title}
                    </h3>

                    {/* Description */}
                    {r.description && (
                      <p className="text-[14px] text-ink/50 leading-relaxed line-clamp-2 mb-4">
                        {r.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted font-medium">
                      {r.region && <span>{r.region}</span>}
                      {r.region && r.year && <span>·</span>}
                      {r.year && <span>{r.year}</span>}
                    </div>

                    {/* CTA */}
                    <div className="mt-3 pt-3 border-t border-border-ice/60 flex items-center text-[13px] font-semibold text-glacial-blue group-hover:text-cyan-accent transition-colors">
                      View Resource <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={SearchIcon}
              title={isSearchActive ? "No resources matched your search." : "No research resources are available yet."}
              description={isSearchActive ? "Adjust your search terms or filters to find what you're looking for." : "Resources will appear here when they are added to the repository."}
              actionLabel={hasFilters || isSearchActive ? "Clear Filters" : undefined}
              onAction={clearAll}
            />
          )}
        </div>
      </section>
    </div>
  );
}
