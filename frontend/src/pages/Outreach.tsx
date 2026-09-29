import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader2, ArrowRight, Copy, Check, FileText } from 'lucide-react';
import { api } from '../services/api';
import type { Resource, OutreachDraft } from '../types';
import { ErrorState, Button } from '../components/ui';
import SocialCardStudio from '../components/social-card/SocialCardStudio';

export default function Outreach() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSourceId = searchParams.get('sourceId') || (location.state as any)?.sourceId || '';

  const activeTab = searchParams.get('tab') === 'card' ? 'card' : 'text';

  const handleTabChange = (tab: 'text' | 'card') => {
    setSearchParams(prev => {
      prev.set('tab', tab);
      return prev;
    });
  };

  const [sourceId, setSourceId] = useState(initialSourceId);
  const [resource, setResource] = useState<Resource | null>(null);
  
  const [audience, setAudience] = useState('');
  const [format, setFormat] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sourceId) { 
      api.getResource(sourceId).then(res => { 
        if (res) setResource(res); 
        else setError("Invalid source ID provided.");
      }).catch(() => setError("Failed to load source context."));
    } else { 
      setResource(null); 
    }
  }, [sourceId]);

  const handleGenerate = async () => {
    if (!sourceId || !audience || !format) return;
    setLoading(true); setDraft(null); setError(null); setCopied(false);
    try {
      const generated = await api.generateOutreach({ sourceId, audience, format });
      setDraft(generated);
    } catch { 
      setError('Failed to generate outreach draft. Please try again.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ready = !!sourceId && !!audience.trim() && !!format.trim();

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      {/* ─── HEADER ─── */}
      <section className="w-full pt-10 pb-0 px-4 lg:px-8 border-b border-border-ice">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted">Science Outreach</span>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-ink tracking-tight">
            Turn research into public understanding.
          </h1>
          <p className="text-[16px] text-ink/70 font-medium max-w-2xl mt-1 mb-6">
            Transform available scientific material into a clear outreach draft or a visual social media card.
          </p>

          <div className="flex items-center gap-6 border-b border-transparent">
            <button
              onClick={() => handleTabChange('text')}
              className={`pb-3 text-[14px] font-bold transition-all border-b-2 ${
                activeTab === 'text'
                  ? 'border-cyan-accent text-deep-ocean'
                  : 'border-transparent text-muted hover:text-deep-ocean'
              }`}
            >
              Text Draft
            </button>
            <button
              onClick={() => handleTabChange('card')}
              className={`pb-3 text-[14px] font-bold transition-all border-b-2 ${
                activeTab === 'card'
                  ? 'border-cyan-accent text-deep-ocean'
                  : 'border-transparent text-muted hover:text-deep-ocean'
              }`}
            >
              Social Card
            </button>
          </div>
        </div>
      </section>

      {/* ─── WORKSPACE ─── */}
      <section className="w-full px-4 lg:px-8 py-8 flex-1">
        <div className="max-w-[1280px] mx-auto">
          {activeTab === 'card' ? (
            <SocialCardStudio />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* ─── LEFT: CONTEXT & CONTROLS ─── */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                
                {/* Source */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.15em] border-b border-border-ice pb-2">Source Context</h2>
                  
                  {!sourceId ? (
                    <div className="flex flex-col gap-4 mt-2">
                      <p className="text-[14px] text-ink/70">Select a research resource to create an outreach draft.</p>
                      <Link to="/explore" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border-ice text-ink text-[14px] font-bold rounded-lg hover:border-glacial-blue transition-colors self-start shadow-sm">
                        Browse Repository <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : resource ? (
                    <div className="flex flex-col gap-3 mt-2">
                      <div className="flex flex-col gap-2 p-4 bg-white border border-border-ice rounded-lg shadow-sm">
                        <h3 className="text-[15px] font-bold text-ink leading-snug">{resource.title}</h3>
                        <div className="flex items-center gap-2 text-[12px] text-muted font-medium">
                          {resource.type && <span className="uppercase tracking-[0.05em]">{resource.type}</span>}
                          {resource.type && resource.year && <span>·</span>}
                          {resource.year && <span>{resource.year}</span>}
                          {resource.region && <span>·</span>}
                          {resource.region && <span>{resource.region}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[12px] font-bold mt-1">
                        <Link to={`/research/${resource.id}`} className="text-glacial-blue hover:text-deep-ocean transition-colors">
                          View Resource
                        </Link>
                        <button onClick={() => { setSourceId(''); setDraft(null); navigate('/outreach'); }} className="text-muted hover:text-error transition-colors">
                          Remove Context
                        </button>
                      </div>
                    </div>
                  ) : error ? (
                     <div className="mt-2"><ErrorState message={error} /></div>
                  ) : (
                    <div className="h-[80px] bg-frost rounded-lg animate-pulse mt-2" />
                  )}
                </div>

                {/* Controls */}
                <div className={`flex flex-col gap-6 ${!resource ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="audience-input" className="text-[11px] font-bold text-muted uppercase tracking-[0.15em]">Audience</label>
                    <input 
                      id="audience-input"
                      type="text"
                      placeholder="e.g. High school students, General public"
                      value={audience}
                      onChange={e => setAudience(e.target.value)}
                      className="w-full h-[48px] px-4 bg-white border border-border-ice rounded-lg text-[14px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-glacial-blue/50 focus:border-glacial-blue transition-all shadow-sm"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="format-input" className="text-[11px] font-bold text-muted uppercase tracking-[0.15em]">Format</label>
                    <input 
                      id="format-input"
                      type="text"
                      placeholder="e.g. Short article, Press release"
                      value={format}
                      onChange={e => setFormat(e.target.value)}
                      className="w-full h-[48px] px-4 bg-white border border-border-ice rounded-lg text-[14px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-glacial-blue/50 focus:border-glacial-blue transition-all shadow-sm"
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    disabled={!ready || loading} 
                    className="w-full h-[48px] flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Draft'}
                  </Button>
                </div>
                
                {error && !loading && (
                  <div className="bg-white border border-border-ice p-4 rounded-lg mt-2">
                    <ErrorState message={error} onRetry={handleGenerate} />
                  </div>
                )}
                
              </div>

              {/* ─── RIGHT: DRAFT EDITOR ─── */}
              <div className="lg:col-span-8 flex flex-col gap-4 min-h-[500px]">
                <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.15em] border-b border-border-ice pb-2">Generated Draft</h2>
                
                {!draft && !loading ? (
                  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-frost/50 border border-border-ice rounded-lg text-center mt-2">
                    <FileText className="w-8 h-8 text-muted/50 mb-4" />
                    <p className="text-[14px] text-ink/70 font-medium max-w-sm leading-relaxed">
                      Your outreach draft will appear here after generation.
                    </p>
                  </div>
                ) : draft ? (
                  <div className="w-full flex flex-col bg-white border border-border-ice rounded-lg shadow-sm mt-2 overflow-hidden animate-fade-in">
                    
                    {/* Editor Status Bar */}
                    <div className="p-4 border-b border-border-ice bg-frost flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex items-center gap-3">
                         <span className="text-[12px] font-bold text-ink uppercase tracking-[0.05em]">{draft.status === 'IN_REVIEW' ? 'Pending Review' : draft.status || 'Draft'}</span>
                       </div>
                       <div className="flex items-center gap-3 text-[12px] text-muted">
                         <span>Audience: <strong className="text-ink">{draft.audience}</strong></span>
                         <span>·</span>
                         <span>Format: <strong className="text-ink">{draft.outputType}</strong></span>
                       </div>
                    </div>
                    
                    {/* Editor Content */}
                    <div className="w-full">
                      <label htmlFor="draft-content" className="sr-only">Draft Content</label>
                      <textarea
                        id="draft-content"
                        value={draft.content}
                        onChange={e => setDraft({ ...draft, content: e.target.value })}
                        className="w-full min-h-[400px] resize-y p-6 text-[16px] text-ink/90 leading-[1.6] bg-transparent focus:outline-none"
                        spellCheck="false"
                      />
                    </div>
                    
                    {/* Editor Action Bar */}
                    <div className="p-4 border-t border-border-ice bg-snow flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] font-bold text-muted uppercase tracking-[0.1em] line-clamp-1">Based on: {resource?.title}</span>
                      </div>
                      <button 
                        onClick={handleCopy} 
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-ice rounded-md text-[13px] font-bold text-ink hover:border-glacial-blue transition-colors shadow-sm shrink-0"
                      >
                        {copied ? <><Check className="w-4 h-4 text-glacial-blue" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Draft</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[400px] flex flex-col p-8 bg-white border border-border-ice rounded-lg mt-2 animate-pulse">
                    <div className="w-full h-6 bg-frost rounded-md mb-6 max-w-[60%]" />
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-4 bg-frost rounded-md" />
                      <div className="w-[95%] h-4 bg-frost rounded-md" />
                      <div className="w-[90%] h-4 bg-frost rounded-md" />
                      <div className="w-[40%] h-4 bg-frost rounded-md" />
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
