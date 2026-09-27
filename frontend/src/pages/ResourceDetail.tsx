import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Resource } from '../types';
import { ArrowLeft, Brain, Map as MapIcon, Calendar, CheckCircle2 } from 'lucide-react';

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchResource(id);
  }, [id]);

  const fetchResource = async (resId: string) => {
    setLoading(true);
    const data = await api.getResource(resId);
    if (data) setResource(data);
    setLoading(false);
  };

  if (loading) return <div className="py-12 text-center text-slate-500">Loading resource details...</div>;
  if (!resource) return <div className="py-12 text-center text-slate-500">Resource not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/explore" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Repository
      </Link>

      <div className="bg-white border border-border rounded-xl p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xs font-semibold text-primary bg-slate-100 px-2 py-1 rounded">{resource.type}</span>
                {resource.status === 'PUBLISHED' && (
                  <span className="flex items-center text-xs font-semibold text-verified-text bg-verified-bg border border-verified-border px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                  </span>
                )}
                <span className="text-sm text-slate-400">{resource.id}</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-primary mb-4">{resource.title}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{resource.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
              <Link to={`/ai?resourceId=${resource.id}`} className="bg-secondary hover:bg-accent text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center">
                <Brain className="w-4 h-4 mr-2" /> Ask AI About This
              </Link>
              <Link to={`/outreach?sourceId=${resource.id}`} className="bg-white border border-border hover:bg-slate-50 text-primary px-5 py-2.5 rounded-md font-medium text-sm transition-colors">
                Generate Outreach
              </Link>
            </div>
          </div>

          <div className="w-full md:w-72 shrink-0">
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
              <h3 className="font-semibold text-primary border-b border-slate-200 pb-2">Metadata</h3>
              
              <div>
                <dt className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Author / Institution</dt>
                <dd className="text-sm text-slate-900">{resource.author} • {resource.institution}</dd>
              </div>
              
              <div>
                <dt className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Year</dt>
                <dd className="text-sm text-slate-900 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {resource.year}</dd>
              </div>

              {resource.expeditionId && (
                <div>
                  <dt className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Related Expedition</dt>
                  <dd className="text-sm">
                    <Link to={`/expeditions/${resource.expeditionId}`} className="text-secondary hover:underline flex items-center">
                      <MapIcon className="w-3.5 h-3.5 mr-1.5" /> {resource.expeditionId}
                    </Link>
                  </dd>
                </div>
              )}

              {resource.keywords && resource.keywords.length > 0 && (
                <div>
                  <dt className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Keywords</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {resource.keywords.map(kw => (
                      <span key={kw} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">{kw}</span>
                    ))}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
