import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Upload, Filter, AlertTriangle, FileText } from 'lucide-react';
import { api } from '../services/api';
import type { Resource } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function AdminResources() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || '';
  const regionFilter = searchParams.get('region') || '';

  const [searchQuery, setSearchQuery] = useState(q);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();

    const fetchResources = async () => {
      setLoading(true);
      setError(false);
      try {
        let data: Resource[] = [];
        const apiTypeFilter = typeFilter ? typeFilter.toUpperCase() : undefined;
        
        if (q) {
          data = await api.searchResources(q, ac.signal);
        } else {
          // Fallback to fetch all, since backend might ignore query params
          data = await api.getResources();
        }
        
        if (apiTypeFilter) {
          data = data.filter(r => r.type?.toUpperCase() === apiTypeFilter);
        }
        if (regionFilter) {
          data = data.filter(r => r.region?.toLowerCase() === regionFilter.toLowerCase());
        }
        
        if (mounted) {
          setResources(data);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && mounted) {
          setError(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResources();
    setSearchQuery(q);

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [q, typeFilter, regionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const formatStatus = (s: string) => {
    if (!s) return null;
    const map: Record<string, { label: string; color: string }> = {
      'DRAFT': { label: 'Draft', color: 'text-white/60 bg-white/10 border-white/20' },
      'IN_REVIEW': { label: 'In Review', color: 'text-amber-warn bg-amber-warn/10 border-amber-warn/20' },
      'APPROVED': { label: 'Approved', color: 'text-emerald bg-emerald/10 border-emerald/20' },
      'PUBLISHED': { label: 'Published', color: 'text-cyan-accent bg-cyan-accent/10 border-cyan-accent/20' },
      'REJECTED': { label: 'Rejected', color: 'text-error bg-error/10 border-error/20' }
    };
    const conf = map[s] || { label: s, color: 'text-white/60 bg-white/5 border-white/10' };
    return (
      <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-[0.05em] border ${conf.color}`}>
        {conf.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-full pb-12">
      {/* ─── HEADER ─── */}
      <section className="w-full px-4 lg:px-8 pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">RESEARCH REPOSITORY</span>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
              Resources
            </h1>
            <p className="text-[14px] text-white/60 font-medium max-w-2xl">
              Review and manage resources in the polar science repository.
            </p>
          </div>
          <Button onClick={() => navigate('/admin/upload')} className="gap-2 shrink-0 h-[44px]">
            <Upload className="w-4 h-4" /> Upload Resource
          </Button>
        </div>
      </section>

      {/* ─── FILTERS & SEARCH ─── */}
      <section className="w-full px-4 lg:px-8 py-6">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resources by title or description..."
                className="pl-12 !bg-deep-blue !border-white/10 !text-white placeholder:!text-white/40 focus:!border-cyan-accent/50 focus:!bg-deep-ocean h-[44px]"
                aria-label="Search resources"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative shrink-0 w-36">
                <select
                  value={typeFilter}
                  onChange={e => handleFilterChange('type', e.target.value)}
                  className="w-full h-[44px] pl-4 pr-10 bg-deep-blue border border-white/10 rounded-[10px] text-[13px] text-white font-medium focus:outline-none focus:border-cyan-accent/50 appearance-none shadow-sm cursor-pointer truncate"
                  aria-label="Filter by type"
                >
                  <option value="">All Types</option>
                  <option value="report">Report</option>
                  <option value="publication">Publication</option>
                  <option value="dataset">Dataset</option>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="activity">Activity</option>
                  <option value="expedition">Expedition</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>

              <div className="relative shrink-0 w-36">
                <select
                  value={regionFilter}
                  onChange={e => handleFilterChange('region', e.target.value)}
                  className="w-full h-[44px] pl-4 pr-10 bg-deep-blue border border-white/10 rounded-[10px] text-[13px] text-white font-medium focus:outline-none focus:border-cyan-accent/50 appearance-none shadow-sm cursor-pointer truncate"
                  aria-label="Filter by region"
                >
                  <option value="">All Regions</option>
                  <option value="antarctica">Antarctica</option>
                  <option value="arctic">Arctic</option>
                  <option value="himalayas">Himalayas</option>
                  <option value="southern ocean">Southern Ocean</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>
          </form>

          {/* Results Count */}
          <div className="flex items-center gap-2 mt-2">
             {!loading && !error && (
               <span className="text-[13px] font-bold text-white/50 uppercase tracking-[0.05em]">
                 {resources.length === 0 ? 'No resources found' : `${resources.length} resources found`}
               </span>
             )}
          </div>

        </div>
      </section>

      {/* ─── DATA TABLE / LIST ─── */}
      <section className="w-full px-4 lg:px-8 flex-1">
        <div className="max-w-[1200px] mx-auto">
          
          {loading ? (
            <div className="bg-deep-blue border border-white/10 rounded-[12px] shadow-sm overflow-hidden flex flex-col">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="col-span-12 md:col-span-5 h-4 bg-white/10 rounded w-24 animate-pulse" />
              </div>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-white/5">
                  <div className="col-span-12 md:col-span-5 flex flex-col gap-2">
                     <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                     <div className="h-3 bg-white/5 rounded w-1/4 animate-pulse md:hidden" />
                  </div>
                  <div className="hidden md:block col-span-2 h-4 bg-white/5 rounded w-16 animate-pulse" />
                  <div className="hidden md:block col-span-2 h-4 bg-white/5 rounded w-20 animate-pulse" />
                  <div className="hidden md:block col-span-2 h-4 bg-white/5 rounded w-12 animate-pulse" />
                  <div className="hidden md:block col-span-1 h-8 bg-white/5 rounded w-16 animate-pulse" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-deep-blue border border-white/10 rounded-[12px] shadow-sm text-center">
              <div className="w-12 h-12 rounded-[12px] bg-error/10 flex items-center justify-center mb-4 border border-error/20">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              <h2 className="text-[16px] font-bold text-white mb-2">We couldn't load the resources.</h2>
              <p className="text-[14px] text-white/50 mb-6 font-medium">Please try again.</p>
              <Button onClick={() => window.location.reload()} variant="secondary" className="!border-white/20 !text-white hover:!bg-white/5">
                Retry
              </Button>
            </div>
          ) : resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-deep-blue border border-white/10 rounded-[12px] shadow-sm text-center">
              <div className="w-12 h-12 rounded-[12px] bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <FileText className="w-6 h-6 text-white/30" />
              </div>
              <h2 className="text-[16px] font-bold text-white mb-2">No resources found</h2>
              <p className="text-[14px] text-white/50 mb-6 font-medium max-w-sm">
                {(q || typeFilter || regionFilter) 
                  ? 'No resources match the current search or filters.' 
                  : 'There are currently no resources in the repository.'}
              </p>
              {!(q || typeFilter || regionFilter) && (
                <Button onClick={() => navigate('/admin/upload')} className="gap-2">
                  <Upload className="w-4 h-4" /> Upload Resource
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-deep-blue border border-white/10 rounded-[12px] shadow-sm overflow-hidden flex flex-col">
              {/* Desktop Header Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-ocean-navy text-[11px] font-bold text-white/40 uppercase tracking-[0.1em]">
                <div className="col-span-5">Resource</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Region</div>
                <div className="col-span-2">Year & Status</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {/* Rows */}
              <div className="flex flex-col divide-y divide-white/5">
                {resources.map(r => (
                  <div key={r.id} className="grid grid-cols-1 md:grid-cols-12 gap-y-3 gap-x-4 px-6 py-5 hover:bg-white/5 transition-colors items-center group">
                    {/* Mobile & Desktop: Title */}
                    <div className="col-span-1 md:col-span-5 flex flex-col gap-1 min-w-0">
                      <Link to={`/research/${r.id}`} className="text-[14px] font-bold text-white hover:text-cyan-accent transition-colors line-clamp-2">
                        {r.title}
                      </Link>
                      {/* Mobile Only: Metadata Line */}
                      <div className="flex md:hidden flex-wrap items-center gap-2 text-[12px] text-white/50 font-medium mt-1">
                        {r.type && <span className="capitalize">{r.type.toLowerCase()}</span>}
                        {r.type && r.region && <span>•</span>}
                        {r.region && <span>{r.region}</span>}
                        {r.year && <span>•</span>}
                        {r.year && <span>{r.year}</span>}
                      </div>
                      {/* Mobile Only: Status */}
                      <div className="md:hidden mt-2">
                        {formatStatus(r.status)}
                      </div>
                    </div>

                    {/* Desktop: Type */}
                    <div className="hidden md:block col-span-2 text-[13px] text-white/70 font-medium capitalize truncate">
                      {r.type ? r.type.toLowerCase() : '-'}
                    </div>

                    {/* Desktop: Region */}
                    <div className="hidden md:block col-span-2 text-[13px] text-white/70 font-medium truncate">
                      {r.region || '-'}
                    </div>

                    {/* Desktop: Year & Status */}
                    <div className="hidden md:flex flex-col items-start gap-1.5 col-span-2 text-[13px] text-white/70 font-medium">
                      <span>{r.year || '-'}</span>
                      {formatStatus(r.status)}
                    </div>

                    {/* Action */}
                    <div className="col-span-1 md:col-span-1 flex justify-start md:justify-end mt-2 md:mt-0">
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/research/${r.id}`)}
                        className="!border-white/20 !text-white hover:!bg-white/10 !h-8 !px-4 !text-[12px] shrink-0"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
