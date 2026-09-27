import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Database, FileText, BookOpen, ChevronDown, BadgeCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import type { Resource } from '../types';

const RESOURCE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  DATASET: { label: 'Dataset', color: 'text-secondary' },
  PUBLICATION: { label: 'Publication', color: 'text-azure-accent' },
  REPORT: { label: 'Technical Report', color: 'text-aurora-emerald' },
  PHOTO: { label: 'Photo', color: 'text-secondary' },
  VIDEO: { label: 'Video', color: 'text-secondary' },
};

export default function Explore() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchResources();
  }, [typeFilter]);

  const fetchResources = async () => {
    setLoading(true);
    const data = await api.getResources(typeFilter ? { type: typeFilter } : undefined);
    setResources(data);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (searchQuery) {
      const data = await api.searchResources(searchQuery);
      setResources(data);
    } else {
      await fetchResources();
    }
    setLoading(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'all') {
      setTypeFilter('');
    } else {
      setTypeFilter(tab.toUpperCase());
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DATASET': return <Database className="w-6 h-6" />;
      case 'PUBLICATION': return <BookOpen className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Repository Banner */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1 text-secondary font-medium">MoES / NCPOR</span>
              <span className="text-slate-border-strong">/</span>
              <span className="text-on-surface">Knowledge Core</span>
              <span className="text-slate-border-strong">/</span>
              <span className="text-secondary font-semibold">Repository Catalog</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-draft-amber-bg text-draft-amber-text font-label-sm text-label-sm font-semibold">
                PROTOTYPE DATASET DEMO (SIH26063)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm">
                <BadgeCheck className="w-3.5 h-3.5 text-aurora-emerald" />
                FAIR Level 3 Compliant
              </span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-4xl flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">Scientific Repository & Lineage Core</span>
              <h1 className="font-headline-lg text-headline-lg text-polar-midnight-deep font-bold tracking-tight">
                Polar Knowledge Repository
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                Unified discovery across vetted expedition reports, NPDC oceanographic datasets, peer-reviewed publications, and cryospheric field observations.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-pure-white p-1 rounded-xl shadow-sm self-start lg:self-auto">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-low text-polar-midnight-deep">
                <span className="font-code-sm text-code-sm font-semibold">44 Expeditions</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-low text-polar-midnight-deep">
                <span className="font-code-sm text-code-sm font-semibold">196 Datasets</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-low text-polar-midnight-deep">
                <span className="font-code-sm text-code-sm font-semibold">284 Papers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="w-full bg-pure-white shadow-sm py-4 px-4 lg:px-8 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
            <form onSubmit={handleSearch} className="lg:col-span-8 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input
                className="w-full pl-10 pr-24 py-2.5 bg-surface text-polar-midnight-deep font-body-md text-body-md rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-accent transition-all"
                placeholder="Search across 1,040+ polar records by keyword, author, DOI, expedition..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-polar-midnight-deep text-on-primary font-label-sm text-label-sm rounded hover:bg-polar-navy-surface transition-colors flex items-center gap-1">
                <span>Search</span>
              </button>
            </form>
            <div className="lg:col-span-4 flex items-center gap-2">
              <div className="relative w-1/2">
                <select className="w-full appearance-none bg-surface text-polar-midnight-deep font-label-md text-label-md px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-accent pr-8 cursor-pointer">
                  <option>All Realms (Global)</option>
                  <option>Antarctic (Maitri/Bharati)</option>
                  <option>Arctic (Himadri/Svalbard)</option>
                  <option>Himalayan (Himansh)</option>
                  <option>Southern Ocean</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="relative w-1/2">
                <select className="w-full appearance-none bg-surface text-polar-midnight-deep font-label-md text-label-md px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure-accent pr-8 cursor-pointer">
                  <option>All Research Themes</option>
                  <option>Cryosphere & Glaciology</option>
                  <option>Physical Oceanography</option>
                  <option>Atmospheric Chemistry</option>
                  <option>Polar Biology</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1">
            {['all', 'report', 'dataset', 'publication'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 rounded-md font-label-md text-label-md transition-colors ${
                  activeTab === tab
                    ? 'font-semibold text-pure-white bg-polar-midnight-deep shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {tab === 'all' ? 'All Outputs' : tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant font-body-md">Loading resources...</div>
          ) : resources.length > 0 ? (
            resources.map(resource => {
              const config = RESOURCE_TYPE_CONFIG[resource.type] || { label: resource.type, color: 'text-secondary' };
              return (
                <div key={resource.id} className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center ${config.color} shrink-0`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded bg-surface-container-high ${config.color} font-code-sm text-code-sm font-semibold`}>
                          {config.label} • {resource.id}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-ice-white text-on-surface-variant font-label-sm text-label-sm">{resource.region}</span>
                        <span className="text-outline font-label-sm text-label-sm">{resource.year}</span>
                      </div>
                      <Link to={`/research/${resource.id}`} className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep hover:text-secondary transition-colors">
                        {resource.title}
                      </Link>
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl line-clamp-2">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 lg:flex-col lg:items-end justify-between">
                    {resource.author && (
                      <span className="px-2.5 py-0.5 rounded bg-surface-container text-polar-midnight-deep font-code-sm text-code-sm">{resource.author}</span>
                    )}
                    <Link to={`/research/${resource.id}`} className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-pure-white rounded-xl p-12 text-center shadow-sm">
              <Database className="w-12 h-12 text-outline-variant mx-auto mb-4" />
              <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">No resources found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your search query or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
