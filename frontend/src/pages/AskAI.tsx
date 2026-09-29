import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, X, Send, Mic, Sparkles, Copy, FileText, Beaker } from 'lucide-react';
import { api } from '../services/api';
import type { AIResponse, Resource } from '../types';

export default function AskAI() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resourceId = searchParams.get('resourceId') || undefined;
  const initialQuery = searchParams.get('q');
  
  const [contextResource, setContextResource] = useState<Resource | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (resourceId) {
      api.getResource(resourceId).then(res => { if (res) setContextResource(res); });
    }
  }, [resourceId]);

  useEffect(() => {
    if (initialQuery && !response && !loading) {
      setQuestion(initialQuery);
      handleAsk(undefined, initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(prev => (prev ? prev + ' ' : '') + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone access was not granted. You can continue with text input.');
        } else {
          setVoiceError('Voice input error: ' + event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }
    setVoiceError('');
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleAsk = async (e?: React.FormEvent, q?: string) => {
    if (e) e.preventDefault();
    if (isListening) recognitionRef.current?.stop();
    const queryToAsk = q || question;
    if (!queryToAsk.trim()) return;
    setQuestion(queryToAsk);
    setLoading(true);
    setResponse(null);
    setCopied(false);
    try {
      const res = await api.askPolarAI({ question: queryToAsk, resourceId });
      setResponse(res);
    } catch {
      setResponse({ answer: "Unable to reach the AI service at this time.", sources: [], evidenceStatus: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const clearContext = () => { setContextResource(null); navigate('/ai'); };
  
  const handleCopy = () => {
    if (response?.answer) {
      navigator.clipboard.writeText(response.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const SUGGESTED = [
    { text: "What were the major findings related to Antarctic sea ice in recent expeditions?", icon: Sparkles },
    { text: "How does black carbon deposition affect Himalayan glacier melt rates?", icon: Beaker },
    { text: "List oceanographic datasets collected during the 43rd Antarctic expedition", icon: FileText }
  ];

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow relative">
      {/* ─── CINEMATIC HEADER ─── */}
      <section className="relative w-full bg-deep-ocean pt-16 pb-16 px-4 lg:px-8 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-navy via-deep-ocean to-deep-ocean" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top, rgba(56,189,248,0.4) 0%, transparent 50%)' }} />
        
        <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center gap-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-4 h-4 text-cyan-accent" />
            <span className="text-white text-[11px] font-bold tracking-[0.25em] uppercase">AI Knowledge Engine</span>
          </div>
          <h1 className="font-display text-5xl md:text-[64px] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            Ask Polar AI
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl leading-relaxed drop-shadow-md">
            Query the entire repository. Answers are strictly constrained to verified official sources and generate automatic citations.
          </p>
        </div>
      </section>

      {/* ─── MAIN INTERFACE ─── */}
      <section className="w-full px-4 lg:px-8 pb-32 flex-1 flex flex-col items-center z-20">
        <div className="max-w-[800px] w-full flex flex-col gap-6 flex-1 relative">
          
          {/* Context Banner */}
          {contextResource && (
            <div className="bg-white/95 backdrop-blur-xl border border-white p-5 rounded-[20px] shadow-[0_16px_40px_rgba(7,20,38,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in relative group overflow-hidden mt-6">
              <div className="absolute inset-0 bg-cyan-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col gap-1.5 relative z-10">
                <span className="text-[10px] text-cyan-accent uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse" />
                  Active Context Window
                </span>
                <span className="text-base font-bold text-deep-ocean line-clamp-1">{contextResource.title}</span>
              </div>
              <button onClick={clearContext} className="shrink-0 text-xs font-bold text-muted hover:text-error hover:bg-error/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative z-10" aria-label="Clear Context">
                <X className="w-4 h-4" /> Clear Context
              </button>
            </div>
          )}

          {voiceError && (
            <div className="bg-amber-bg text-amber-text p-4 border border-amber-border rounded-[16px] text-sm font-medium shadow-sm animate-fade-in">
               {voiceError}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 animate-pulse">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-accent/20 blur-xl rounded-full" />
                <div className="w-12 h-12 rounded-full border-2 border-border-ice border-t-cyan-accent animate-spin relative z-10" />
              </div>
              <span className="text-xs font-bold text-muted tracking-[0.2em] uppercase">Consulting Archive...</span>
            </div>
          )}

          {/* Chat Response */}
          {response && !loading && (
            <div className="flex flex-col gap-8 animate-fade-up w-full mt-8">
              {/* User Question */}
              <div className="self-end bg-deep-ocean text-white px-6 py-4 rounded-[24px] rounded-tr-[4px] max-w-[85%] shadow-[0_12px_30px_rgba(7,20,38,0.15)] border border-white/10">
                <p className="text-[15px] font-medium leading-relaxed">{question}</p>
              </div>

              {/* AI Answer Card */}
              <div className="self-start bg-white/95 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[24px] rounded-tl-[4px] w-full flex flex-col gap-8 shadow-[0_20px_50px_rgba(7,20,38,0.06)] relative overflow-hidden group">
                {/* Decorative glowing edge */}
                <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-cyan-accent to-glacial-blue" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-accent/5 rounded-full blur-[80px] -mr-[150px] -mt-[150px] pointer-events-none" />
                
                <div className="flex items-start justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-3 mb-2 absolute -top-4 -left-2">
                    <Sparkles className="w-4 h-4 text-cyan-accent" />
                  </div>
                  <p className="text-[16px] text-ink leading-[1.8] whitespace-pre-line font-light mt-4">
                    {response.answer}
                  </p>
                  
                  <button onClick={handleCopy} className="shrink-0 text-[10px] uppercase tracking-[0.2em] font-bold text-muted hover:text-cyan-accent transition-colors flex flex-col items-center gap-1 mt-4">
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {/* Citations Grid */}
                {response.sources && response.sources.length > 0 && (
                  <div className="pt-8 border-t border-border-ice/60 flex flex-col gap-4 relative z-10">
                    <span className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> Verified Sources
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {response.sources.map((src, i) => (
                        <Link key={i} to={`/research/${src.id}`} className="p-4 bg-frost/50 hover:bg-white rounded-[16px] border border-border-ice/50 hover:border-cyan-accent/30 hover:shadow-medium transition-all flex flex-col gap-2 group/src">
                          <span className="font-display font-bold text-[15px] text-deep-ocean group-hover/src:text-glacial-blue transition-colors line-clamp-2 leading-snug">
                            {src.title}
                          </span>
                          {(src as any).snippet && <p className="text-[13px] text-muted/80 italic line-clamp-2 font-light">"{(src as any).snippet}"</p>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Action */}
                {resourceId && (
                  <div className="pt-2 relative z-10">
                    <Link to={`/outreach?sourceId=${resourceId}`} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-deep-ocean text-white text-sm font-bold rounded-[14px] hover:bg-ocean-navy transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                      Create Outreach Draft <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Suggestions List (Shown initially) */}
          {!response && !loading && !initialQuery && (
            <div className="flex flex-col gap-6 mt-12 w-full animate-fade-in">
              <span className="text-[11px] text-muted font-bold uppercase tracking-[0.2em] text-center mb-2">Example Queries</span>
              <div className="grid grid-cols-1 gap-4">
                {SUGGESTED.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuestion(sug.text); handleAsk(undefined, sug.text); }}
                    className="text-left px-6 py-5 rounded-[20px] bg-white border border-white hover:border-cyan-accent/30 shadow-[0_8px_30px_rgba(7,20,38,0.04)] hover:shadow-[0_16px_40px_rgba(56,189,248,0.08)] transition-all duration-300 text-[15px] text-ink font-light group flex items-center gap-5 hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-[12px] bg-frost flex items-center justify-center shrink-0 group-hover:bg-cyan-accent/10 transition-colors">
                      <sug.icon className="w-5 h-5 text-muted group-hover:text-cyan-accent transition-colors" />
                    </div>
                    <span className="flex-1 leading-relaxed">"{sug.text}"</span>
                    <ArrowRight className="w-5 h-5 text-border-ice group-hover:text-cyan-accent group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 min-h-[140px]" />

          {/* ─── FLOATING INPUT AREA ─── */}
          <div className="sticky bottom-8 z-40 w-full pt-4">
            {isListening && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-deep-ocean text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2 rounded-full animate-soft-pulse flex items-center gap-2 shadow-[0_8px_20px_rgba(7,20,38,0.1)] border border-border-ice">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse" /> Listening...
              </div>
            )}
            
            <form onSubmit={handleAsk} className="relative group/form">
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-cyan-accent/20 blur-[30px] rounded-full opacity-0 group-focus-within/form:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative bg-white/95 backdrop-blur-2xl p-2 rounded-full shadow-[0_16px_40px_rgba(7,20,38,0.12)] border border-white flex items-center gap-2 transition-all duration-300 group-focus-within/form:border-cyan-accent/40 group-focus-within/form:shadow-[0_20px_50px_rgba(56,189,248,0.15)]">
                
                <div className="flex-1 flex items-center pl-6">
                  <label htmlFor="ai-input" className="sr-only">Ask a question</label>
                  <input 
                    id="ai-input"
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask Polar AI anything about Indian polar science..."
                    className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-deep-ocean placeholder:text-muted/60"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex items-center gap-2 shrink-0 pr-1">
                  <button
                    type="button"
                    onClick={toggleListen}
                    disabled={loading}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-error/10 text-error' : 'bg-transparent hover:bg-frost text-muted hover:text-deep-ocean'}`}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    title="Voice Input"
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} aria-hidden="true" />
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={!question.trim() || loading}
                    className="w-12 h-12 bg-deep-ocean hover:bg-cyan-accent disabled:opacity-50 disabled:hover:bg-deep-ocean text-white hover:text-deep-ocean font-bold rounded-full transition-all duration-300 flex items-center justify-center shadow-md disabled:cursor-not-allowed group/btn"
                    aria-label="Send question"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" aria-hidden="true" />
                    )}
                  </button>
                </div>
                
              </div>
            </form>
          </div>
          
        </div>
      </section>
    </div>
  );
}
