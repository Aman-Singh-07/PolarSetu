import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader2, ArrowRight, Copy, AlertTriangle, FileText, Share2, Check } from 'lucide-react';
import { api } from '../services/api';
import type { Resource, OutreachDraft } from '../types';

const AUDIENCES = ['Researcher', 'Student / Educator', 'General Public', 'Media', 'Policy'];
const FORMATS = ['Scientific Summary', 'Website Article', 'Social Media Post', 'Educational Explanation', 'Press Note', 'Short Video Script'];

export default function Outreach() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSourceId = searchParams.get('sourceId') || (location.state as any)?.sourceId || '';

  const [sourceId, setSourceId] = useState(initialSourceId);
  const [resource, setResource] = useState<Resource | null>(null);
  const [audience, setAudience] = useState('');
  const [format, setFormat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sourceId) { api.getResource(sourceId).then(res => { if (res) setResource(res); }); }
    else { setResource(null); }
  }, [sourceId]);

  const handleGenerate = async () => {
    if (!sourceId || !audience || !format) return;
    setLoading(true); setDraft(null); setError(null); setCopied(false);
    try {
      setDraft(await api.generateOutreach({ sourceId, audience, format }));
    } catch { setError('Failed to generate outreach draft. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ready = !!sourceId && !!audience && !!format;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] bg-snow">
      {/* ─── HEADER ─── */}
      <section className="w-full pt-16 pb-8 px-4 lg:px-8 border-b border-border-ice/50 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-2 text-cyan-accent mb-2">
            <Share2 className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-semibold text-muted">Translation Engine</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-deep-ocean tracking-tight">
            Outreach Studio
          </h1>
          <p className="text-base text-ink/70 font-light max-w-2xl mt-2 leading-relaxed">
            Generate evidence-based communication drafts for specific audiences, directly grounded in verified polar research.
          </p>
        </div>
      </section>

      {/* ─── STUDIO ─── */}
      <section className="w-full px-4 lg:px-8 py-12 flex-1">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ─── CONFIG PANEL ─── */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            
            {/* Source */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Source Material</h2>
              {!sourceId ? (
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-sm text-ink/60 font-light">No source record selected for translation.</p>
                  <Link to="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-deep-ocean text-white text-sm font-semibold rounded-lg shadow-soft hover:bg-ocean-navy transition-colors self-start">
                    Browse Repository <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  {resource ? (
                    <div className="flex flex-col gap-1.5 p-4 bg-white border border-border-ice rounded-xl shadow-soft">
                      <div className="flex items-center gap-2 text-[10px] text-muted font-semibold uppercase tracking-wider mb-1">
                        <span>{resource.type}</span>
                        {resource.year && <><span>·</span><span>{resource.year}</span></>}
                      </div>
                      <p className="text-sm font-bold text-deep-ocean leading-snug">{resource.title}</p>
                    </div>
                  ) : (
                    <div className="h-20 bg-frost rounded-xl animate-pulse" />
                  )}
                  <button onClick={() => { setSourceId(''); setDraft(null); navigate('/outreach'); }} className="text-xs font-semibold text-muted hover:text-error transition-colors self-start">
                    Remove Source
                  </button>
                </div>
              )}
            </div>

            {/* Audience */}
            <div className={`flex flex-col gap-4 ${!sourceId ? 'opacity-40 pointer-events-none' : ''}`}>
              <h2 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Target Audience</h2>
              <div className="flex flex-col gap-1.5 mt-2">
                {AUDIENCES.map(a => (
                  <button 
                    key={a} 
                    onClick={() => setAudience(a)} 
                    className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${audience === a ? 'bg-deep-ocean text-white shadow-soft' : 'bg-transparent text-ink hover:bg-white hover:shadow-soft'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className={`flex flex-col gap-4 ${!audience ? 'opacity-40 pointer-events-none' : ''}`}>
              <h2 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Output Format</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {FORMATS.map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFormat(f)} 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${format === f ? 'bg-cyan-accent border-cyan-accent text-deep-ocean shadow-soft' : 'bg-white border-border-ice text-ink hover:border-cyan-accent/50 hover:shadow-soft'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            <button 
              onClick={handleGenerate} 
              disabled={!ready || loading} 
              className="w-full mt-4 py-4 bg-deep-ocean hover:bg-ocean-navy disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-elevated flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Draft…</> : 'Generate Draft'}
            </button>
          </div>

          {/* ─── DRAFT EDITOR ─── */}
          <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-[500px]">
            {!draft && !loading ? (
              <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-border-ice bg-white/50">
                <FileText className="w-12 h-12 text-border-ice mb-4" />
                <h2 className="font-display text-xl font-bold text-deep-ocean mb-2">Editor Ready</h2>
                <p className="text-sm text-ink/60 font-light max-w-sm">Select a source, audience, and format from the configuration panel to generate an evidence-based communication draft.</p>
              </div>
            ) : draft ? (
              <div className="w-full flex flex-col bg-white rounded-2xl border border-border-ice shadow-elevated animate-fade-up overflow-hidden">
                <div className="p-5 border-b border-border-ice bg-frost/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted" />
                    <h2 className="font-display text-lg font-bold text-deep-ocean">Generated Draft</h2>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2.5 py-1 rounded-full bg-white border border-border-ice font-bold text-muted uppercase tracking-widest">{draft.audience}</span>
                    <span className="px-2.5 py-1 rounded-full bg-deep-ocean text-cyan-accent font-bold uppercase tracking-widest">{draft.outputType}</span>
                  </div>
                </div>
                
                <div className="flex-1 p-0">
                  <label htmlFor="draft-content" className="sr-only">Draft content</label>
                  <textarea
                    id="draft-content"
                    value={draft.content}
                    onChange={e => setDraft({ ...draft, content: e.target.value })}
                    className="w-full h-[500px] resize-y focus:outline-none p-6 text-sm text-ink leading-loose font-light bg-transparent"
                    spellCheck="false"
                  />
                </div>
                
                <div className="p-4 border-t border-border-ice bg-frost/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-accent" />
                    <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Queued for Administrator Review</span>
                  </div>
                  <button 
                    onClick={handleCopy} 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-deep-ocean text-white text-xs font-bold hover:bg-ocean-navy transition-colors shadow-soft"
                  >
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Text</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-border-ice shadow-soft">
                <div className="w-8 h-8 rounded-full border-2 border-border-ice border-t-cyan-accent animate-spin mb-4" />
                <p className="text-xs uppercase tracking-widest font-bold text-muted animate-pulse">Synthesizing Source Material...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
