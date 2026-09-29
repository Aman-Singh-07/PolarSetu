import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, X, SlidersHorizontal, BookOpen, Database, FileText, FlaskConical } from 'lucide-react';
import { api } from '../services/api';
import type { Resource } from '../types';
import { Skeleton, EmptyState, ErrorState, Badge } from '../components/ui';

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
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = q ? await api.searchResources(q, ac.signal) : await api.getResources();
        if (typeFilter) data = data.filter(r => r.type.toLowerCase() === typeFilter.toLowerCase());
        if (regionFilter) data = data.filter(r => r.region.toLowerCase() === regionFilter.toLowerCase());
        if (!ac.signal.aborted) setResources(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError('Unable to load resources.');
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    };
    load();
    setSearchQuery(q);
    return () => ac.abort();
  }, [q, typeFilter, regionFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchQuery ? searchParams.set('q', searchQuery) : searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const clearFilter = (key: string) => {
    searchParams.delete(key);
    if (key === 'q') setSearchQuery('');
    setSearchParams(searchParams);
  };

  const clearAll = () => { setSearchParams({}); setSearchQuery(''); };

  const setFilter = (key: string, val: string) => {
    val ? searchParams.set(key, val) : searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const hasFilters = Boolean(q || typeFilter || regionFilter);

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dataset': return <Database className="w-3.5 h-3.5" />;
      case 'report': return <FlaskConical className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      {/* ─── CINEMATIC HEADER ─── */}
      <section className="relative w-full bg-deep-ocean pt-24 pb-32 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-navy via-deep-ocean to-deep-ocean" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        <div className="relative z-10 max-w-[1000px] mx-auto flex flex-col items-center text-center gap-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
            <BookOpen className="w-4 h-4 text-cyan-accent" />
            <span className="text-white text-[11px] font-bold tracking-[0.25em] uppercase">Scientific Repository</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-[64px] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            Research Archive
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl leading-relaxed drop-shadow-md">
            Access our comprehensive, open-access catalog of Indian polar research, verified datasets, and detailed expedition reports.
          </p>
        </div>
      </section>

      {/* ─── FLOATING SEARCH & FILTERS ─── */}
      <section className="w-full px-4 lg:px-8 -mt-10 relative z-30 mb-16">
        <div className="max-w-[1000px] mx-auto relative group">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-cyan-accent/20 blur-[30px] rounded-[24px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
          
          {/* Main Search Container */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_16px_40px_rgba(7,20,38,0.12)] border border-white flex flex-col md:flex-row overflow-hidden transition-all duration-300 group-focus-within:border-cyan-accent/40 group-focus-within:shadow-[0_20px_50px_rgba(56,189,248,0.15)]">
            
            <form onSubmit={handleSearch} className="flex-1 flex items-center px-6 py-5 md:py-0">
              <label htmlFor="search-archive" className="sr-only">Search Archive</label>
              <SearchIcon className="w-5 h-5 text-muted shrink-0" />
              <input
                id="search-archive"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search across all scientific resources..."
                className="w-full bg-transparent border-none outline-none px-4 text-lg font-medium text-deep-ocean placeholder:text-muted/50"
              />
              <button type="submit" className="hidden" aria-hidden="true">Search</button>
            </form>
            
            <div className="hidden md:block w-px bg-border-ice/60 my-4" />
            
            <div className="flex items-center px-4 py-3 bg-frost/50 md:bg-transparent border-t md:border-t-0 border-border-ice/60 gap-3">
              <div className="relative group/select flex-1 md:flex-none">
                <label htmlFor="type-filter" className="sr-only">Filter by type</label>
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-hover/select:text-cyan-accent transition-colors" />
                <select 
                  id="type-filter"
                  value={typeFilter} 
                  onChange={e => setFilter('type', e.target.value)} 
                  className="w-full md:w-[150px] pl-10 pr-8 py-3 bg-white hover:bg-ice-blue/30 text-sm text-ink font-semibold rounded-xl cursor-pointer appearance-none outline-none border border-border-ice/50 hover:border-cyan-accent/30 transition-all shadow-sm"
                >
                  <option value="">All Types</option>
                  <option value="dataset">Dataset</option>
                  <option value="publication">Publication</option>
                  <option value="report">Report</option>
                </select>
              </div>
              <div className="relative group/select flex-1 md:flex-none">
                <label htmlFor="region-filter" className="sr-only">Filter by region</label>
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-hover/select:text-cyan-accent transition-colors" />
                <select 
                  id="region-filter"
                  value={regionFilter} 
                  onChange={e => setFilter('region', e.target.value)} 
                  className="w-full md:w-[150px] pl-10 pr-8 py-3 bg-white hover:bg-ice-blue/30 text-sm text-ink font-semibold rounded-xl cursor-pointer appearance-none outline-none border border-border-ice/50 hover:border-cyan-accent/30 transition-all shadow-sm"
                >
                  <option value="">All Regions</option>
                  <option value="Antarctica">Antarctica</option>
                  <option value="Arctic">Arctic</option>
                  <option value="Himalayas">Himalayas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 px-2">
              {q && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-deep-ocean text-white text-xs font-bold shadow-md tracking-wide">
                  "{q}" 
                  <button aria-label="Clear search" onClick={() => clearFilter('q')} className="hover:text-cyan-accent bg-white/10 p-0.5 rounded-full transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border-ice text-deep-ocean text-xs font-bold shadow-sm tracking-wide">
                  Type: {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                  <button aria-label="Clear type filter" onClick={() => clearFilter('type')} className="hover:text-error hover:bg-error/10 p-0.5 rounded-full transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {regionFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border-ice text-deep-ocean text-xs font-bold shadow-sm tracking-wide">
                  Region: {regionFilter}
                  <button aria-label="Clear region filter" onClick={() => clearFilter('region')} className="hover:text-error hover:bg-error/10 p-0.5 rounded-full transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button onClick={clearAll} className="text-[11px] font-bold text-muted hover:text-deep-ocean hover:underline uppercase tracking-widest ml-2 transition-colors">
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── RESULTS ─── */}
      <section className="w-full px-4 lg:px-8 pb-32 flex-1">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between border-b-2 border-border-ice/40 pb-4 mb-8">
            <span className="text-xs text-muted font-bold uppercase tracking-[0.2em]">
              {loading ? 'Retrieving records...' : `${resources.length} Record${resources.length !== 1 ? 's' : ''} Found`}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-[180px] rounded-[20px]" />)}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : resources.length > 0 ? (
            <div className="flex flex-col gap-5">
              {resources.map(r => (
                <article key={r.id} className="group bg-white rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row gap-6 border border-border-ice/60 shadow-[0_4px_20px_rgba(7,20,38,0.02)] hover:shadow-[0_16px_40px_rgba(29,111,165,0.08)] hover:border-cyan-accent/40 hover:-translate-y-1 transition-all duration-300">
                  
                  {/* Metadata Sidebar */}
                  <div className="md:w-48 shrink-0 flex flex-col gap-3 border-l-[3px] border-border-ice group-hover:border-cyan-accent pl-5 transition-colors">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-frost text-ocean-navy self-start">
                      {getIconForType(r.type)}
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{r.type}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Published</span>
                      <span className="text-sm text-ink font-semibold">{r.year || 'Unknown Date'}</span>
                    </div>
                  </div>
                  
                  {/* Content Main */}
                  <div className="flex-1 flex flex-col gap-3 justify-center">
                    <Link to={`/research/${r.id}`} className="font-display text-2xl font-bold text-deep-ocean group-hover:text-glacial-blue transition-colors leading-[1.3]">
                      {r.title}
                    </Link>
                    <p className="text-[15px] text-ink/70 font-light line-clamp-2 max-w-3xl leading-relaxed">
                      {r.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      {r.region && (
                        <Badge variant="outline" className="text-xs bg-white">{r.region}</Badge>
                      )}
                      <Link to={`/research/${r.id}`} className="text-xs font-bold text-glacial-blue hover:text-cyan-accent transition-colors flex items-center gap-1 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 duration-300">
                        View Full Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={SearchIcon}
              title="No matching records found"
              description="Adjust your search terms or filters to find what you're looking for."
              actionLabel="Clear All Filters"
              onAction={clearAll}
            />
          )}
        </div>
      </section>
    </div>
  );
}
