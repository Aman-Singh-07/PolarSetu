import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, Calendar, Navigation, ChevronRight, Activity } from 'lucide-react';
import { api } from '../services/api';
import type { Expedition } from '../types';

export default function Expeditions() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpeditions();
  }, []);

  const fetchExpeditions = async () => {
    const data = await api.getExpeditions();
    setExpeditions(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Expedition Explorer</h1>
          <p className="text-slate-500">Browse Indian scientific missions to polar regions.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading expeditions...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {expeditions.map(exp => (
            <div key={exp.id} className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">{exp.name}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="flex items-center"><Map className="w-4 h-4 mr-1 text-slate-400" /> {exp.region}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400" /> {exp.year}</span>
                    <span className="flex items-center"><Navigation className="w-4 h-4 mr-1 text-slate-400" /> {exp.latitude}, {exp.longitude}</span>
                  </div>
                </div>
                <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-semibold">
                  {exp.id}
                </div>
              </div>
              <p className="text-slate-600 mb-6">{exp.objective}</p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-slate-500" title="Resources"><Activity className="w-4 h-4" /></div>
                </div>
                <Link to={`/expeditions/${exp.id}`} className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center">
                  View Dossier
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
