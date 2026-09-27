import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Settings2, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import type { Resource, OutreachDraft } from '../types';

export default function Outreach() {
  const [searchParams] = useSearchParams();
  const initialSourceId = searchParams.get('sourceId') || '';

  const [resources, setResources] = useState<Resource[]>([]);
  const [sourceId, setSourceId] = useState(initialSourceId);
  const [audience, setAudience] = useState('Student / Educator');
  const [format, setFormat] = useState('Educational Explanation');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);

  useEffect(() => {
    api.getResources().then(setResources);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId) return;
    
    setLoading(true);
    const newDraft = await api.generateOutreach({ sourceId, audience, format });
    setDraft(newDraft);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2 flex items-center">
          <MessageSquare className="w-8 h-8 mr-3 text-secondary" />
          Polar Outreach Studio
        </h1>
        <p className="text-slate-500">Transform verified research into targeted communication drafts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-semibold flex items-center text-primary mb-6">
              <Settings2 className="w-5 h-5 mr-2" /> Generation Parameters
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Scientific Source</label>
                <select 
                  value={sourceId} 
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full bg-slate-50 border border-input rounded-md p-2.5 text-sm focus:ring-secondary focus:border-secondary"
                  required
                >
                  <option value="">Select a verified resource...</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
                <select 
                  value={audience} 
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-input rounded-md p-2.5 text-sm focus:ring-secondary focus:border-secondary"
                >
                  <option>Researcher</option>
                  <option>Student / Educator</option>
                  <option>General Public</option>
                  <option>Media</option>
                  <option>Policy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Output Format</label>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-slate-50 border border-input rounded-md p-2.5 text-sm focus:ring-secondary focus:border-secondary"
                >
                  <option>Scientific Summary</option>
                  <option>Website Article</option>
                  <option>Social Media Post</option>
                  <option>Educational Explanation</option>
                  <option>Press Note</option>
                  <option>Short Video Script</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading || !sourceId}
                className="w-full bg-secondary hover:bg-accent text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {loading ? 'Generating...' : 'Generate Draft'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {draft ? (
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
              <div className="bg-draft-bg border-b border-draft-border px-6 py-3 flex items-center justify-between">
                <span className="font-bold text-draft-text text-sm tracking-wide uppercase flex items-center">
                  <span className="w-2 h-2 rounded-full bg-draft-border mr-2 animate-pulse" />
                  DRAFT — human review required
                </span>
                <span className="text-xs text-draft-text font-medium">{draft.id}</span>
              </div>
              
              <div className="p-6 md:p-8 flex-1">
                <textarea 
                  className="w-full h-full min-h-[300px] resize-none focus:outline-none text-slate-700 leading-relaxed bg-transparent"
                  defaultValue={draft.content}
                />
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Source: {draft.sourceIds.join(', ')}
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                    Save Edits
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-700 rounded hover:bg-emerald-500 transition-colors flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Submit to Review
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No active draft</h3>
              <p className="text-slate-500 max-w-sm">Select a scientific source and audience parameters to generate a targeted outreach draft.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
