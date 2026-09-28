import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Database, FileText, BookOpen, BadgeCheck, ArrowRight, Camera, Sparkles, Filter, X } from 'lucide-react';
import { api } from '../services/api';
import type { Resource } from '../types';

const RESOURCE_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string, icon: any }> = {
  DATASET: { label: 'Dataset', color: 'text-aurora-emerald', bg: 'bg-aurora-emerald/10', icon: Database },
  PUBLICATION: { label: 'Peer-Reviewed Paper', color: 'text-azure-accent', bg: 'bg-azure-accent/10', icon: BookOpen },
  REPORT: { label: 'Technical Report', color: 'text-secondary', bg: 'bg-surface-container', icon: FileText },
  PHOTO: { label: 'Field Photo', color: 'text-secondary', bg: 'bg-surface-container', icon: Camera },
  VIDEO: { label: 'Field Video', color: 'text-secondary', bg: 'bg-surface-container', icon: Camera },
};

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || '';
  const regionFilter = searchParams.get('region') || '';
  const themeFilter = searchParams.get('theme') || '';
  
  const [searchQuery, setSearchQuery] = useState(q);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      let data = [];
      if (q) {
        data = await api.searchResources(q);
      } else {
        data = await api.getResources();
      }
      
      if (typeFilter) {
        data = data.filter(r => r.type.toLowerCase() === typeFilter.toLowerCase());
      }
      if (regionFilter) {
        data = data.filter(r => r.region.toLowerCase() === regionFilter.toLowerCase());
      }
      if (themeFilter) {
        data = data.filter(r => r.researchArea && r.researchArea.toLowerCase() === themeFilter.toLowerCase());
      }
      
      setResources(data);
      setLoading(false);
    };

    fetchResources();
    setSearchQuery(q); // Sync input if URL changes
  }, [q, typeFilter, regionFilter, themeFilter]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };
  
  const handleClearFilter = (key: string) => {
    searchParams.delete(key);
    if (key === 'q') setSearchQuery('');
    setSearchParams(searchParams);
  };

  const handleClearAll = () => {
    setSearchParams({});
    setSearchQuery('');
  };
  
  const updateFilter = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const hasFilters = Boolean(q || typeFilter || regionFilter || themeFilter);

  const getTypeIcon = (type: string) => {
    const config = RESOURCE_TYPE_CONFIG[type];
    if (config) {
      const Icon = config.icon;
      return <Icon className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-[calc(100vh-80px)] pt-20">
      {/* Top Repository Banner */}
      <section className="w-full bg-ice-white py-12 px-4 lg:px-8 border-b border-slate-border">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1 text-secondary font-medium">
                MoES / NCPOR
              </span>
              <span className="text-slate-border-strong">/</span>
              <span className="text-on-surface">Knowledge Core</span>
              <span className="text-slate-border-strong">/</span>
              <span className="text-secondary font-semibold">Repository Catalog</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm">
                <BadgeCheck className="w-3.5 h-3.5 text-aurora-emerald" />
                FAIR Level 3 Compliant
              </span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-4xl flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">Scientific Repository & Lineage Core</span>
              <h1 className="font-headline-lg text-headline-lg text-polar-midnight-deep font-bold tracking-tight">
                Polar Knowledge Repository
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                Explore reports, publications, datasets, expeditions and media from India's polar research ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Query Controller & Categories */}
      <section className="w-full bg-pure-white shadow-sm py-6 px-4 lg:px-8 sticky top-20 z-40">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-6">
          {/* Search Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <form onSubmit={handleSearch} className="lg:col-span-12 relative flex">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input
                className="w-full pl-12 pr-28 py-3 bg-surface text-polar-midnight-deep font-body-md text-body-md rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-accent transition-all border border-transparent focus:border-azure-accent"
                id="repoSearchInput"
                placeholder="Search expeditions, reports, publications, datasets and media..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search Repository"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-polar-midnight-deep text-on-primary font-label-sm text-label-sm rounded hover:bg-polar-navy-surface transition-colors flex items-center gap-1 font-bold"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => updateFilter('type', '')} 
                className={`px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all ${
                  !typeFilter ? 'bg-polar-midnight-deep text-pure-white shadow-sm' : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                }`}
              >
                All Resources
              </button>
              <button 
                onClick={() => updateFilter('type', 'report')} 
                className={`px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all ${
                  typeFilter === 'report' ? 'bg-polar-midnight-deep text-pure-white shadow-sm' : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                }`}
              >
                Reports
              </button>
              <button 
                onClick={() => updateFilter('type', 'publication')} 
                className={`px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all ${
                  typeFilter === 'publication' ? 'bg-polar-midnight-deep text-pure-white shadow-sm' : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                }`}
              >
                Publications
              </button>
              <button 
                onClick={() => updateFilter('type', 'dataset')} 
                className={`px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all ${
                  typeFilter === 'dataset' ? 'bg-polar-midnight-deep text-pure-white shadow-sm' : 'bg-surface-container-low text-secondary hover:bg-surface-container'
                }`}
              >
                Datasets
              </button>
            </div>
            <button 
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface text-secondary font-label-sm text-label-sm rounded-lg"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>
      </section>

      {/* Main Exploration Workspace */}
      <section className="w-full px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filters */}
          <aside className={`lg:col-span-3 flex flex-col gap-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:flex'}`}>
            <div className="bg-pure-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md font-bold text-polar-midnight-deep flex items-center gap-2">
                  <Filter className="w-5 h-5 text-secondary" />
                  Filters
                </span>
                {hasFilters && (
                  <button onClick={handleClearAll} className="font-label-sm text-label-sm text-secondary hover:underline cursor-pointer">
                    Reset All
                  </button>
                )}
              </div>

              {/* Geographic Region */}
              <div className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Region</span>
                <div className="flex flex-col gap-2">
                  {['Antarctica', 'Arctic', 'Himalayas', 'Southern Ocean'].map(region => (
                    <label key={region} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={regionFilter === region}
                        onChange={() => updateFilter('region', regionFilter === region ? '' : region)}
                        className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface group-hover:text-secondary">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Research Theme */}
              <div className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Research Theme</span>
                <div className="flex flex-col gap-2">
                  {['Glaciology', 'Oceanography', 'Atmospheric Chemistry', 'Polar Biology', 'Geophysics', 'Cryosphere'].map(theme => (
                    <label key={theme} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={themeFilter === theme}
                        onChange={() => updateFilter('theme', themeFilter === theme ? '' : theme)}
                        className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface group-hover:text-secondary">{theme}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Access Mode */}
              <div className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Access Permissions</span>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer" />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-secondary">Open Access (Verified)</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Main Dossier Grid */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Active Tags Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-pure-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-label-md text-label-md font-bold text-polar-midnight-deep">
                  {loading ? 'Searching...' : `${resources.length} resources found`}
                  {q && ` for "${q}"`}
                </span>
              </div>
              
              {hasFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Active:</span>
                  {q && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-secondary font-label-sm text-label-sm">
                      Query: {q}
                      <button onClick={() => handleClearFilter('q')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                    </span>
                  )}
                  {typeFilter && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-secondary font-label-sm text-label-sm">
                      Type: {typeFilter}
                      <button onClick={() => handleClearFilter('type')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                    </span>
                  )}
                  {regionFilter && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-secondary font-label-sm text-label-sm">
                      Region: {regionFilter}
                      <button onClick={() => handleClearFilter('region')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                    </span>
                  )}
                  {themeFilter && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-secondary font-label-sm text-label-sm">
                      Theme: {themeFilter}
                      <button onClick={() => handleClearFilter('theme')} className="hover:text-error ml-1"><X className="w-3.5 h-3.5" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-full py-12 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
                </div>
              ) : resources.length > 0 ? (
                resources.map(resource => {
                  const config = RESOURCE_TYPE_CONFIG[resource.type] || { label: resource.type, color: 'text-secondary', bg: 'bg-surface-container', icon: FileText };
                  return (
                    <article key={resource.id} className="bg-pure-white rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow group border border-transparent hover:border-surface-variant">
                      <div className="flex flex-col gap-3">
                        {/* Header Metadata Row */}
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded ${config.bg} ${config.color} font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1.5`}>
                            {getTypeIcon(resource.type)}
                            {config.label}
                          </span>
                          <span className="font-code-sm text-code-sm text-on-surface-variant">
                            {resource.year}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <Link to={`/research/${resource.id}`} className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors line-clamp-2">
                          {resource.title}
                        </Link>
                        
                        {/* Region & Expedition */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface font-label-sm text-label-sm text-polar-midnight-deep">
                            {resource.region}
                          </span>
                          {resource.expeditionId && (
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              {resource.expeditionId}
                            </span>
                          )}
                        </div>
                        
                        {/* Abstract */}
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                          {resource.description}
                        </p>
                        
                        {/* Author */}
                        <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mt-1">
                          {resource.author && <span className="font-semibold text-polar-midnight-deep">{resource.author}</span>}
                          {resource.author && resource.institution && <span>•</span>}
                          {resource.institution && <span>{resource.institution}</span>}
                        </div>
                      </div>
                      
                      {/* Action Footer */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-variant">
                        <Link to={`/research/${resource.id}`} className="px-4 py-2 rounded-lg bg-polar-midnight-deep text-on-primary font-label-sm text-label-sm hover:bg-polar-navy-surface transition-colors flex items-center gap-2">
                          View Resource <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to={`/ai?resourceId=${resource.id}`} className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary transition-colors" title="Ask AI about this resource">
                          <Sparkles className="w-5 h-5 text-azure-accent" />
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="col-span-full bg-pure-white rounded-xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-surface-variant">
                  <Database className="w-16 h-16 text-slate-border-strong mb-4" />
                  <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">No resources found.</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">
                    Try a different keyword or clear one of the active filters to expand your search.
                  </p>
                  <button onClick={handleClearAll} className="px-6 py-2.5 bg-surface-container-low text-secondary font-label-md font-semibold rounded-lg hover:bg-surface-container transition-colors">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </main>

        </div>
      </section>
    </div>
  );
}
