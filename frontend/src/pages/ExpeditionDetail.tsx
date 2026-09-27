import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Expedition, Resource } from '../types';
import { Calendar, Navigation, ArrowLeft, Brain } from 'lucide-react';

export default function ExpeditionDetail() {
  const { id } = useParams();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetails(id);
  }, [id]);

  const fetchDetails = async (expId: string) => {
    setLoading(true);
    const exp = await api.getExpedition(expId);
    const res = await api.getResources();
    const expRes = res.filter(r => r.expeditionId === expId);
    
    if (exp) setExpedition(exp);
    setResources(expRes);
    setLoading(false);
  };

  if (loading) return <div className="py-12 text-center text-slate-500">Loading expedition details...</div>;
  if (!expedition) return <div className="py-12 text-center text-slate-500">Expedition not found.</div>;

  return (
    <div className="space-y-8">
      <Link to="/expeditions" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Expeditions
      </Link>

      <div className="bg-polar-navy-surface text-white p-8 rounded-xl bg-[#1C2541]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-sm text-slate-300 font-medium mb-3">
              <span>{expedition.id}</span>
              <span>•</span>
              <span>{expedition.region}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{expedition.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {expedition.startDate} to {expedition.endDate}</span>
              <span className="flex items-center"><Navigation className="w-4 h-4 mr-1.5" /> {expedition.latitude}, {expedition.longitude}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to={`/ai?expeditionId=${expedition.id}`} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors border border-white/20 flex items-center justify-center">
              <Brain className="w-4 h-4 mr-2" /> Ask AI
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white p-6 rounded-lg border border-border">
            <h2 className="text-xl font-display font-bold mb-4">Mission Overview</h2>
            <p className="text-slate-700 leading-relaxed">{expedition.objective}</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold mb-4 flex items-center justify-between">
              <span>Related Resources</span>
              <span className="text-sm font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{resources.length}</span>
            </h2>
            <div className="grid gap-4">
              {resources.map(res => (
                <Link key={res.id} to={`/research/${res.id}`} className="block bg-white p-4 rounded-lg border border-border hover:border-secondary hover:shadow-sm transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{res.type}</span>
                        <span className="text-xs text-slate-400">{res.id}</span>
                      </div>
                      <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors">{res.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
              {resources.length === 0 && <p className="text-sm text-slate-500">No resources linked yet.</p>}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-4">Mission Metadata</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500 font-medium">Year</dt>
                <dd className="text-slate-900">{expedition.year}</dd>
              </div>
              <div>
                <dt className="text-slate-500 font-medium">Coordinates</dt>
                <dd className="text-slate-900">{expedition.latitude}, {expedition.longitude}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
