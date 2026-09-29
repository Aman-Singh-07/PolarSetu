import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, X, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import type { AIResponse, Resource, Expedition } from '../types';
import { Skeleton, ErrorState, Button } from '../components/ui';

export default function AskAI() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resourceId = searchParams.get('resourceId') || undefined;
  const expeditionId = searchParams.get('expeditionId') || undefined;
  const initialQuery = searchParams.get('q');
  
  const [contextResource, setContextResource] = useState<Resource | null>(null);
  const [contextExpedition, setContextExpedition] = useState<Expedition | null>(null);
  
  const [question, setQuestion] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

  useEffect(() => {
    if (resourceId) {
      api.getResource(resourceId).then(res => { if (res) setContextResource(res); });
    }
  }, [resourceId]);

  useEffect(() => {
    if (expeditionId) {
      api.getExpedition(expeditionId).then(res => { if (res) setContextExpedition(res); });
    }
  }, [expeditionId]);

  useEffect(() => {
    if (initialQuery && !response && !loading) {
      setQuestion(initialQuery);
      handleAsk(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleAsk = async (q?: string) => {
    const queryToAsk = q || question;
    if (!queryToAsk.trim()) return;
    
    setQuestion(queryToAsk);
    setCurrentQuery(queryToAsk);
    setLoading(true);
    setError(false);
    setResponse(null);
    
    try {
      const res = await api.askPolarAI({ question: queryToAsk, resourceId });
      setResponse(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const clearContext = () => {
    setContextResource(null);
    setContextExpedition(null);
    navigate('/ai');
  };

  const SUGGESTED = [
    "What research has been documented from India's Antarctic expeditions?",
    "Which polar resources are available in the repository?",
    "What topics appear in the available polar research?"
  ];

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow items-center pb-24">
      <div className="w-full max-w-[1040px] px-4 md:px-8 pt-10 md:pt-16 flex flex-col gap-6">
        
        {/* ─── HEADER ─── */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted">Source-Grounded AI</span>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-ink tracking-tight leading-tight">
            Ask about polar science.
          </h1>
          <p className="text-[16px] text-ink/70">
            Ask questions using the available research repository as context.
          </p>
        </div>

        {/* ─── DISCLAIMER ─── */}
        <div className="bg-frost border border-border-ice rounded-lg px-4 py-3 flex items-start gap-3 mt-2 max-w-[800px]">
          <p className="text-[13px] text-ink/70 leading-relaxed font-medium">
            Responses are generated from available indexed sources and should be reviewed against the cited material.
          </p>
        </div>

        {/* ─── CONTEXT INDICATOR ─── */}
        {contextResource && (
          <div className="bg-white border border-border-ice rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 shadow-sm max-w-[800px]">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">About this resource</span>
              <span className="text-[14px] font-bold text-ink line-clamp-1">{contextResource.title}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link to={`/research/${contextResource.id}`} className="text-[12px] font-bold text-glacial-blue hover:text-deep-ocean transition-colors flex items-center gap-1">
                View Resource <ExternalLink className="w-3 h-3" />
              </Link>
              <div className="w-[1px] h-4 bg-border-ice hidden sm:block" />
              <button onClick={clearContext} className="text-muted hover:text-error transition-colors flex items-center gap-1 text-[12px] font-semibold" aria-label="Clear context">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
        )}

        {contextExpedition && (
          <div className="bg-white border border-border-ice rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 shadow-sm max-w-[800px]">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">About this expedition</span>
              <span className="text-[14px] font-bold text-ink line-clamp-1">{contextExpedition.name}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link to={`/expeditions/${contextExpedition.id}`} className="text-[12px] font-bold text-glacial-blue hover:text-deep-ocean transition-colors flex items-center gap-1">
                View Expedition <ExternalLink className="w-3 h-3" />
              </Link>
              <div className="w-[1px] h-4 bg-border-ice hidden sm:block" />
              <button onClick={clearContext} className="text-muted hover:text-error transition-colors flex items-center gap-1 text-[12px] font-semibold" aria-label="Clear context">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
        )}

        {/* ─── INPUT ─── */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
          className="w-full flex flex-col sm:flex-row gap-3 mt-4 max-w-[800px]"
        >
          <div className="flex-1 relative">
            <label htmlFor="ai-input" className="sr-only">What would you like to understand about India’s polar research?</label>
            <input 
              id="ai-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to understand about India’s polar research?"
              className="w-full h-[56px] px-5 bg-white border border-border-ice rounded-[12px] text-[16px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-glacial-blue/50 focus:border-glacial-blue transition-all shadow-sm"
              disabled={loading}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={!question.trim() || loading} 
            className="h-[56px] px-8 shrink-0 flex items-center justify-center min-w-[120px]"
          >
            {loading ? "Asking..." : "Ask"}
          </Button>
        </form>

        {/* ─── SUGGESTIONS (Initial State) ─── */}
        {!loading && !response && !error && currentQuery === '' && (
          <div className="flex flex-col gap-3 mt-6 max-w-[800px]">
            <span className="text-[11px] font-bold text-muted uppercase tracking-[0.1em]">Suggested questions</span>
            <div className="flex flex-col gap-2">
              {SUGGESTED.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => { setQuestion(sug); handleAsk(sug); }}
                  className="px-5 py-3.5 bg-white border border-border-ice rounded-lg text-[14px] text-ink/80 hover:text-deep-ocean hover:border-glacial-blue/40 transition-colors text-left flex items-center justify-between group shadow-sm"
                >
                  <span className="pr-4">{sug}</span>
                  <ArrowRight className="w-4 h-4 text-border-ice group-hover:text-glacial-blue transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── LOADING STATE ─── */}
        {loading && (
          <div className="flex flex-col gap-10 mt-12 w-full max-w-[800px] animate-pulse">
            <div className="flex flex-col gap-4">
               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted border-b border-border-ice pb-2">Answer</span>
               <div className="bg-white border border-border-ice rounded-[12px] p-6 md:p-8 flex flex-col gap-4 shadow-sm">
                 <Skeleton className="w-full h-4 rounded-sm" />
                 <Skeleton className="w-[90%] h-4 rounded-sm" />
                 <Skeleton className="w-[95%] h-4 rounded-sm" />
                 <Skeleton className="w-[60%] h-4 rounded-sm" />
               </div>
            </div>
            
            <div className="flex flex-col gap-4">
               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted border-b border-border-ice pb-2">Sources used</span>
               <div className="flex flex-col gap-3">
                 <Skeleton className="w-full h-[88px] rounded-lg" />
                 <Skeleton className="w-full h-[88px] rounded-lg" />
               </div>
            </div>
          </div>
        )}

        {/* ─── ERROR STATE ─── */}
        {error && !loading && (
          <div className="mt-12 bg-white border border-border-ice rounded-[12px] p-8 max-w-[800px]">
            <ErrorState 
              message="Unable to generate an answer."
              onRetry={() => handleAsk(currentQuery)}
            />
          </div>
        )}

        {/* ─── ANSWER STATE ─── */}
        {response && !loading && !error && (
          <div className="flex flex-col gap-10 mt-8 md:mt-12 w-full max-w-[800px] animate-fade-up">
            
            {/* Answer */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted border-b border-border-ice pb-2">Answer</span>
              <div className="bg-white border border-border-ice rounded-[12px] p-6 md:p-8 shadow-sm">
                <p className="text-[16px] text-ink/90 leading-[1.8] whitespace-pre-wrap font-light">
                  {response.answer}
                </p>
              </div>
            </div>

            {/* Sources */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted border-b border-border-ice pb-2">Sources used</span>
              
              {!response.sources || response.sources.length === 0 ? (
                <div className="bg-white border border-border-ice rounded-lg p-6 flex items-center justify-center shadow-sm">
                  <p className="text-[14px] text-muted">No relevant sources were found in the current repository.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {response.sources.map((src) => (
                    <div key={src.id} className="bg-white border border-border-ice rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-glacial-blue/30 transition-colors shadow-sm">
                      <div className="flex flex-col gap-1.5 flex-1 pr-4">
                        <h4 className="font-display font-bold text-[15px] text-ink leading-snug">{src.title}</h4>
                        <div className="flex items-center gap-2 text-[12px] text-muted font-medium">
                          {src.type && <span className="uppercase tracking-[0.05em]">{src.type}</span>}
                          {src.type && src.pageOrSection && <span>·</span>}
                          {src.pageOrSection && <span>{src.pageOrSection}</span>}
                        </div>
                      </div>
                      <Link 
                        to={`/research/${src.id}`} 
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-frost text-[13px] font-bold text-glacial-blue rounded-md group-hover:bg-ice-blue group-hover:text-deep-ocean transition-colors shrink-0"
                      >
                        Open Resource <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}
