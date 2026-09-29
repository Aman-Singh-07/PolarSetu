import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, X, MapPin, SlidersHorizontal, Navigation } from 'lucide-react';
import { api } from '../services/api';
import type { Expedition } from '../types';
import { Skeleton, EmptyState, ErrorState } from '../components/ui';

const EXPEDITION_IMAGES: Record<string, string> = {
  'EXP-43': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA',
  'EXP-ARC-15': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB96sKfj2s1GP-c4K4liF32nJk6pqICs30jsSS1NnNd5dzn4ykdY0PyEOGQGyci-tWIbPkpGZNDPBgTXzxXGGr3elVT4A7ujheEbfdvpBDzu13jOxlU0GSgwsnizLarYDOymKsDbyYWRzYSAMiCXID7VzCUsIEIQ1znRyY9FIyODNc14oNsWRL17GHi2WhyUnLpa-j40NYGS0pB8F7qsL4sbyO-IoSP2c8FRtD1Dsp3c5de68u1EvlYw',
  'EXP-SO-2024': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV_C6b5zrKkQSFIhMOvZZn6R1_m0viH4zJ6telQyT419UgjW68niXGtanxETA0KhUkk7u7ZDCRoo8G_3TX4uRj7IjyjCh1KhhfLBb7VNFm0b5XBUenvylXHIxgPQW5bL-mL8EWZ5H1IoPPjf8WVP4Gg8OLjhDrnAplWyW9F1Fqxewx6cTtETEK9t63P0vpIAzj9pOGuAUmkp_145lHVXmNB39MGwf1_-kTM_ja55If4ejn8Uw_t6rMIw',
  'EXP-42': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoh_p2zMxwZwU_Tz-12xqiAZAyn2SGIt01c1Hw3MNhXKESF8DCd1BaJot_jsT0LzOFYzVlA3Hez-MLsuhb_wY8ShfUEDvzvq91fuHEdW1i83wF-d43RhGObbdOOmaYKL7W3E-V6ai2p_IP8ZdEU48cTzcKUuCi6k2mMvaumxoZ3bjmef4tDLaXiP4XAoMcZXGwZJf-_x802BVm6_SnwoCVeo9KQIdjR-mmGrjZxZYxR6Q82lDbi31x6Q',
  'EXP-HIM-5': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA'
};

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
    searchQuery ? searchParams.set('q', searchQuery) : searchParams.delete('q');
    setSearchParams(searchParams);
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

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      {/* ─── CINEMATIC HEADER ─── */}
      <section className="relative w-full bg-deep-ocean pt-24 pb-32 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-navy via-deep-ocean to-deep-ocean" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        <div className="relative z-10 max-w-[1000px] mx-auto flex flex-col items-center text-center gap-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
            <Navigation className="w-4 h-4 text-cyan-accent" />
            <span className="text-white text-[11px] font-bold tracking-[0.25em] uppercase">Journey Archive</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-[64px] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            Expedition Records
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl leading-relaxed drop-shadow-md">
            Chronicles of India's polar research journeys across Antarctica, the Arctic, and the Himalayas.
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
              <label htmlFor="expedition-search" className="sr-only">Search expeditions</label>
              <SearchIcon className="w-5 h-5 text-muted shrink-0" />
              <input
                id="expedition-search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search expeditions by name or objective..."
                className="w-full bg-transparent border-none outline-none px-4 text-lg font-medium text-deep-ocean placeholder:text-muted/50"
              />
              <button type="submit" className="hidden" aria-hidden="true">Search</button>
            </form>
            
            <div className="hidden md:block w-px bg-border-ice/60 my-4" />
            
            <div className="flex items-center px-4 py-3 bg-frost/50 md:bg-transparent border-t md:border-t-0 border-border-ice/60 gap-3">
              <div className="relative group/select flex-1 md:flex-none">
                <label htmlFor="region-filter" className="sr-only">Filter by region</label>
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-hover/select:text-cyan-accent transition-colors" />
                <select
                  id="region-filter"
                  value={regionFilter}
                  onChange={e => { e.target.value ? searchParams.set('region', e.target.value) : searchParams.delete('region'); setSearchParams(searchParams); }}
                  className="w-full md:w-[180px] pl-10 pr-8 py-3 bg-white hover:bg-ice-blue/30 text-sm text-ink font-semibold rounded-xl cursor-pointer appearance-none outline-none border border-border-ice/50 hover:border-cyan-accent/30 transition-all shadow-sm"
                >
                  <option value="">All Regions</option>
                  <option value="Antarctica">Antarctica</option>
                  <option value="Arctic">Arctic</option>
                  <option value="Himalayas">Himalayas</option>
                  <option value="Southern Ocean">Southern Ocean</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {(q || regionFilter) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 px-2">
              {q && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-deep-ocean text-white text-xs font-bold shadow-md tracking-wide">
                  "{q}" 
                  <button aria-label="Clear search" onClick={() => { searchParams.delete('q'); setSearchQuery(''); setSearchParams(searchParams); }} className="hover:text-cyan-accent bg-white/10 p-0.5 rounded-full transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {regionFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border-ice text-deep-ocean text-xs font-bold shadow-sm tracking-wide">
                  Region: {regionFilter} 
                  <button aria-label="Clear region filter" onClick={() => { searchParams.delete('region'); setSearchParams(searchParams); }} className="hover:text-error hover:bg-error/10 p-0.5 rounded-full transition-colors">
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
              {loading ? 'Retrieving records...' : `${filtered.length} Record${filtered.length !== 1 ? 's' : ''} Found`}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-[220px] rounded-[24px]" />)}
            </div>
          ) : error ? (
            <ErrorState message="Unable to load expeditions." onRetry={() => window.location.reload()} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No expeditions found"
              description="Adjust your search terms or filters to find what you're looking for."
              actionLabel="Clear All Filters"
              onAction={clearAll}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {filtered.map(exp => (
                <article key={exp.id} className="group bg-white rounded-[24px] p-4 md:p-6 flex flex-col md:flex-row gap-8 items-stretch border border-border-ice/60 shadow-[0_4px_20px_rgba(7,20,38,0.02)] hover:shadow-[0_16px_40px_rgba(29,111,165,0.08)] hover:border-cyan-accent/40 hover:-translate-y-1 transition-all duration-300">
                  
                  {/* Image Section */}
                  {EXPEDITION_IMAGES[exp.id] ? (
                    <div className="w-full md:w-[320px] shrink-0 rounded-[16px] overflow-hidden relative shadow-sm">
                      <img 
                        src={EXPEDITION_IMAGES[exp.id]} 
                        alt={exp.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        style={{ minHeight: '220px' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="w-full md:w-[320px] shrink-0 rounded-[16px] overflow-hidden relative shadow-sm bg-frost flex items-center justify-center">
                       <MapPin className="w-12 h-12 text-muted/30" />
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div className="flex-1 flex flex-col justify-center py-2 md:pr-4">
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ice-blue/40 text-ocean-navy">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.region}
                      </div>
                      <span className="text-muted">{exp.year}</span>
                    </div>
                    
                    <Link to={`/expeditions/${exp.id}`} className="font-display text-[26px] font-bold text-deep-ocean group-hover:text-glacial-blue transition-colors leading-[1.2] mb-3">
                      {exp.name}
                    </Link>
                    
                    <p className="text-[15px] text-ink/70 font-light leading-relaxed mb-6 line-clamp-3">
                      {exp.objective}
                    </p>
                    
                    <Link to={`/expeditions/${exp.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-glacial-blue hover:text-cyan-accent transition-all duration-300 self-start group/link">
                      View Expedition Log 
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
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
