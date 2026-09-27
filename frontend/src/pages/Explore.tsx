import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, Book, FileText, Database, Image as ImageIcon, Video, Activity, Map as MapIcon, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { Resource } from '../types';

export default function Explore() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

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
      fetchResources();
    }
    setLoading(false);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'REPORT': return <FileText className="w-4 h-4" />;
      case 'PUBLICATION': return <Book className="w-4 h-4" />;
      case 'DATASET': return <Database className="w-4 h-4" />;
      case 'PHOTO': return <ImageIcon className="w-4 h-4" />;
      case 'VIDEO': return <Video className="w-4 h-4" />;
      case 'ACTIVITY': return <Activity className="w-4 h-4" />;
      case 'EXPEDITION': return <MapIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Knowledge Repository</h1>
          <p className="text-slate-500">Explore reports, datasets, publications and media.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-6 shrink-0">
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-primary">Filters</h2>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Content Type</h3>
              <div className="space-y-2">
                {['ALL', 'REPORT', 'PUBLICATION', 'DATASET', 'PHOTO', 'VIDEO'].map(type => (
                  <label key={type} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      value={type === 'ALL' ? '' : type}
                      checked={typeFilter === (type === 'ALL' ? '' : type)}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="text-secondary focus:ring-secondary"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading resources...</div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map(resource => (
                <div key={resource.id} className="bg-white border border-border rounded-lg p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {getIcon(resource.type)}
                      <span>{resource.type}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{resource.year}</span>
                  </div>
                  <h3 className="font-semibold text-primary mb-2 line-clamp-2 flex-1">{resource.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{resource.description}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{resource.region}</span>
                    <Link to={`/research/${resource.id}`} className="text-secondary hover:text-accent font-medium text-sm flex items-center">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-border rounded-lg p-12 text-center">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">No resources found</h3>
              <p className="text-slate-500">Try adjusting your search query or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
