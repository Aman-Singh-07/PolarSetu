import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Loader2, AlertCircle, Globe2, Snowflake, Mountain, Database, RotateCcw, SlidersHorizontal, Compass, Shield, Search as SearchIcon, Mic, CheckCircle, Megaphone, ArrowRight, Copy, Code, ThumbsUp, ExternalLink, Verified } from 'lucide-react';
import { api } from '../services/api';
import type { AIResponse, Resource } from '../types';

const SCOPES = [
  { id: 'all', label: 'All Polar Repositories', icon: Globe2, detail: 'Active', color: 'text-glacial-sky', desc: 'Active' },
  { id: 'antarctica', label: 'Antarctica (Maitri & Bharati)', icon: Snowflake, detail: '43 Expeditions', color: 'text-outline', desc: '43 Expeditions' },
  { id: 'arctic', label: 'Arctic Himadri (Ny-Ålesund)', icon: Globe2, detail: 'IndARC', color: 'text-outline', desc: 'IndARC' },
  { id: 'himalayas', label: 'Himalayan Cryosphere (Himansh)', icon: Mountain, detail: 'Spiti Basin', color: 'text-outline', desc: 'Spiti Basin' },
];

const SUGGESTED_QUERIES = [
  "What were the major findings related to Antarctic sea ice dynamics in 2024?",
  "How does black carbon deposition affect Himadri glacier melt rates?",
  "List oceanographic datasets collected during the 43rd Antarctic expedition",
  "Explain psychrotolerant bacteria discovered in Lake Priyadarshini for a school student"
];

export default function AskAI() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resourceId = searchParams.get('resourceId') || undefined;
  const initialQuery = searchParams.get('q');
  
  const [contextResource, setContextResource] = useState<Resource | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [activeScope, setActiveScope] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) return;

    setSpeechError(null);
    setIsListening(true);
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(prev => (prev ? prev + ' ' + transcript : transcript));
    };
    
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setSpeechError("Microphone access was not granted. You can continue with text input.");
      } else {
        setSpeechError("Voice recognition error occurred.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const handleCopy = () => {
    if (response?.answer) {
      navigator.clipboard.writeText(response.answer).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  useEffect(() => {
    if (resourceId) {
      api.getResource(resourceId).then(res => {
        if (res) setContextResource(res);
      });
    }
  }, [resourceId]);

  useEffect(() => {
    if (initialQuery && !response && !loading) {
      handleAsk(undefined, initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleAsk = async (e?: React.FormEvent, q?: string) => {
    if (e) e.preventDefault();
    const queryToAsk = q || question;
    if (!queryToAsk.trim()) return;
    
    setQuestion(queryToAsk);
    setLoading(true);
    setResponse(null);
    try {
      const res = await api.askPolarAI({ question: queryToAsk, resourceId });
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-surface">
      
      {/* Top Command & Provenance Bar */}
      <section className="w-full bg-surface-container-low py-6 px-4 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-aurora-emerald animate-pulse"></span>
              <span>MoES / NCPOR Grounded Scientific RAG Pipeline</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-draft-amber-bg text-draft-amber-text font-label-sm text-label-sm">
              <ShieldCheck className="w-4 h-4 text-draft-amber-border" />
              <span>Source-Grounded AI: Answers are constrained to retrieved repository sources and display supporting citations.</span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl flex flex-col gap-1">
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep tracking-tight">Ask Polar AI</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Explore India's Polar Science through grounded repository evidence
              </p>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-pure-white shadow-sm border border-slate-border/50">
              <Database className="text-secondary w-6 h-6" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Active Grounding Index</span>
                <span className="font-code-sm text-code-sm font-semibold text-polar-midnight-deep">186 Papers • 320 Datasets • 44 Expedition Dossiers</span>
              </div>
              <span className="ml-2 px-2 py-0.5 rounded bg-surface-container-high text-polar-navy-surface font-code-sm text-code-sm font-bold hidden sm:inline-block">Prototype Demonstration Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Scope Filter Card */}
            <div className="bg-pure-white rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-slate-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-secondary" />
                  <h2 className="font-headline-sm text-headline-sm text-polar-midnight-deep font-semibold">Corpus Scope</h2>
                </div>
                <button onClick={() => setActiveScope('all')} className="text-secondary font-label-sm text-label-sm hover:underline">Reset</button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1">Geographic Domain</label>
                {SCOPES.map(scope => (
                  <button
                    key={scope.id}
                    onClick={() => setActiveScope(scope.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg font-label-md text-label-md flex items-center justify-between transition-all ${
                      activeScope === scope.id
                        ? 'bg-polar-midnight-deep text-pure-white'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <scope.icon className={`w-4 h-4 ${activeScope === scope.id ? 'text-glacial-sky' : 'text-outline'}`} />
                      {scope.label}
                    </span>
                    <span className={`font-code-sm text-code-sm ${activeScope === scope.id ? 'text-glacial-sky px-1.5 py-0.5 rounded bg-polar-navy-surface' : 'text-outline'}`}>
                      {scope.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Queries */}
            <div className="bg-pure-white rounded-xl p-6 shadow-sm flex flex-col gap-4 border border-slate-border/50">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-secondary" />
                <h3 className="font-title-md text-title-md text-polar-midnight-deep font-semibold">Suggested Scientific Queries</h3>
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTED_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(undefined, q)}
                    className="text-left p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:text-secondary text-on-surface font-body-sm text-body-sm transition-all group flex items-start gap-2"
                  >
                    <ArrowRight className="w-4 h-4 text-secondary mt-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>"{q}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Repository Integrity Notice */}
            <div className="bg-polar-midnight-deep text-ice-white rounded-xl p-5 shadow-sm flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-secondary/20 blur-xl pointer-events-none"></div>
              <div className="flex items-center gap-2 text-glacial-sky font-label-md text-label-md font-semibold uppercase tracking-wider">
                <Shield className="w-5 h-5" />
                <span>Repository Integrity Mandate</span>
              </div>
              <p className="font-body-sm text-body-sm text-inverse-on-surface opacity-90 leading-relaxed relative z-10">
                Scientific sources remain primary authoritative documents. AI synthesis is strictly grounded in cited passages. Any synthesis without an explicit NCPOR or peer-reviewed anchor is flagged and discarded.
              </p>
            </div>
          </aside>

          {/* RIGHT MAIN AREA */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Resource Context (if applicable) */}
            {contextResource && (
              <div className="bg-surface-container rounded-xl p-4 border border-slate-border flex items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-[10px] font-bold text-outline uppercase tracking-wider">Current Research Context</span>
                  <span className="font-title-md text-title-md font-semibold text-polar-midnight-deep">{contextResource.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-pure-white text-secondary font-medium">{contextResource.type}</span>
                    <span className="font-code-sm text-code-sm text-outline-variant">{contextResource.year}</span>
                    <span className="font-code-sm text-code-sm text-outline-variant">• {contextResource.region}</span>
                  </div>
                </div>
                <button onClick={() => { setContextResource(null); navigate('/ai'); }} className="p-2 text-outline hover:text-on-surface transition-colors shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Query Input Bar */}
            <div className="bg-pure-white rounded-xl p-2 shadow-md flex flex-col sm:flex-row items-center gap-2 border border-slate-border/50">
              <form onSubmit={handleAsk} className="flex items-center gap-2 flex-1 w-full pl-3">
                <SearchIcon className="text-secondary w-6 h-6 shrink-0" />
                <input 
                  type="text" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask polar questions grounded in NCPOR expedition datasets..."
                  className="w-full py-3 bg-transparent text-polar-midnight-deep font-body-md text-body-md placeholder-outline focus:outline-none"
                  disabled={loading}
                />
              </form>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-end pr-1 pb-1 sm:pb-0 relative">
                {speechError && (
                  <div className="absolute -top-10 right-0 bg-draft-amber-bg text-draft-amber-text border border-draft-amber-border text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap z-10">
                    {speechError}
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={handleVoice}
                  className={`p-3 rounded-lg hover:bg-surface-container-high transition-all shrink-0 hidden sm:flex ${isListening ? 'bg-aurora-emerald/10 text-aurora-emerald animate-pulse' : 'bg-surface-container text-on-surface'}`}
                  title={isListening ? "Listening..." : "Use voice input"}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => handleAsk(e as any)}
                  disabled={!question.trim() || loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-polar-midnight-deep hover:bg-polar-navy-surface disabled:opacity-50 text-pure-white font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-glacial-sky" /> : <Sparkles className="w-5 h-5 text-glacial-sky" />}
                  <span>Ask Polar AI</span>
                </button>
              </div>
            </div>

            {/* Response Area */}
            {response && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <article className="bg-pure-white rounded-xl shadow-md p-6 flex flex-col gap-6 border border-slate-border/50">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 bg-surface-container-low -mx-6 -mt-6 p-5 rounded-t-xl border-b border-slate-border/50">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded bg-polar-midnight-deep text-glacial-sky font-code-sm text-code-sm font-semibold uppercase">Grounded Response</span>
                      <span className="font-label-md text-label-md text-polar-midnight-deep font-semibold truncate max-w-sm sm:max-w-md" title={question}>
                        Query: {question}
                      </span>
                    </div>
                    {response.sources.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-aurora-emerald font-label-sm text-label-sm font-bold uppercase tracking-wider">
                        <Verified className="w-4 h-4" />
                        <span>{response.evidenceStatus || '100% Provenance Matched'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-draft-amber-text font-label-sm text-label-sm font-bold uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" />
                        <span>{response.evidenceStatus || 'Insufficient Evidence'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
                      {response.answer}
                    </p>
                  </div>

                  {response.sources.length > 0 && (
                    <div className="p-3 rounded-lg bg-surface-container flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-polar-midnight-deep">
                        <CheckCircle className="w-5 h-5 text-aurora-emerald" />
                        <span className="font-code-sm text-code-sm font-semibold">
                          Grounded in {response.sources.length} Verified Repository Sources • Unverified claims omitted.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={() => navigate('/outreach', { state: { sourceId: response.sources[0]?.id } })}
                        disabled={response.sources.length === 0}
                        className="px-4 py-2.5 rounded-lg bg-polar-midnight-deep hover:bg-polar-navy-surface text-pure-white font-label-md text-label-md flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Megaphone className="w-5 h-5 text-glacial-sky" />
                        <span>Send to Outreach Studio</span>
                      </button>
                      <button 
                        onClick={handleCopy}
                        className="px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-2 transition-all"
                      >
                        {copied ? <CheckCircle className="w-5 h-5 text-aurora-emerald" /> : <Copy className="w-5 h-5 text-secondary" />}
                        <span className="hidden sm:inline">{copied ? "Copied" : "Copy Answer"}</span>
                      </button>
                      <button disabled className="px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface opacity-50 cursor-not-allowed font-label-md text-label-md flex items-center gap-2 transition-all">
                        <Code className="w-5 h-5 text-secondary" />
                        <span className="hidden sm:inline">Export BibTeX (Demo)</span>
                      </button>
                    </div>
                    <button disabled className="px-3 py-2.5 rounded-lg text-outline font-label-sm text-label-sm flex items-center gap-1.5 transition-all opacity-50 cursor-not-allowed">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="hidden sm:inline">Provide Feedback (Demo)</span>
                    </button>
                  </div>
                </article>

                {/* Source Evidence Cards Grid */}
                {response.sources.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-secondary" />
                        <h3 className="font-headline-sm text-headline-sm text-polar-midnight-deep font-semibold">
                          Grounding Source Documents & Datasets ({response.sources.length})
                        </h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {response.sources.map((src, i) => (
                        <div key={i} className="bg-pure-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 border border-slate-border/50">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-1 rounded bg-surface-container text-secondary font-label-sm text-[10px] font-bold uppercase tracking-wider">
                                {src.type}
                              </span>
                              <span className="font-code-sm text-[11px] font-bold text-outline uppercase">{src.id}</span>
                            </div>
                            <h4 className="font-title-md text-title-md font-semibold text-polar-midnight-deep line-clamp-3">
                              {src.title}
                            </h4>
                            {src.pageOrSection && (
                              <p className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1">
                                Reference: {src.pageOrSection}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-border/50 mt-1">
                            <span className="inline-flex items-center gap-1 font-label-sm text-[10px] uppercase font-bold text-aurora-emerald">
                              <Verified className="w-3.5 h-3.5" /> Indexed
                            </span>
                            <button 
                              onClick={() => navigate(`/research/${src.id}`)}
                              className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:underline font-semibold"
                            >
                              <span>View Resource</span>
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {response.sources.length === 0 && (
                   <div className="bg-surface-container rounded-xl p-6 flex flex-col items-center text-center gap-4 border border-slate-border/50">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                         <AlertCircle className="w-6 h-6 text-outline" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep">No Matching Repository Sources</h3>
                         <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">The system could not identify relevant, authoritative repository resources to support an answer to this query.</p>
                      </div>
                      <button onClick={() => navigate('/explore')} className="mt-2 px-6 py-2.5 rounded-lg bg-polar-midnight-deep hover:bg-polar-navy-surface text-pure-white font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm transition-all">
                         <SearchIcon className="w-4 h-4 text-glacial-sky" /> Explore Repository
                      </button>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
