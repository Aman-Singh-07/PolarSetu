import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Send, ShieldCheck, FileText, Loader2, AlertCircle, Globe2, Snowflake, Mountain, Database, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import type { AIResponse } from '../types';

const SCOPES = [
  { id: 'all', label: 'All Polar Repositories', icon: Globe2, detail: 'Active', color: 'text-glacial-sky' },
  { id: 'antarctica', label: 'Antarctica (Maitri & Bharati)', icon: Snowflake, detail: '43 Expeditions', color: 'text-outline' },
  { id: 'arctic', label: 'Arctic Himadri (Ny-Ålesund)', icon: Globe2, detail: 'IndARC', color: 'text-outline' },
  { id: 'himalayas', label: 'Himalayan Cryosphere (Himansh)', icon: Mountain, detail: 'Spiti Basin', color: 'text-outline' },
];

export default function AskAI() {
  const [searchParams] = useSearchParams();
  const resourceId = searchParams.get('resourceId') || undefined;
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [activeScope, setActiveScope] = useState('all');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    setResponse(null);
    try {
      const res = await api.askPolarAI({ question, resourceId });
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Command & Provenance Bar */}
      <section className="w-full bg-surface-container-low py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-aurora-emerald animate-pulse"></span>
              <span>MoES / NCPOR Grounded Scientific RAG Pipeline</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-draft-amber-bg text-draft-amber-text font-label-sm text-label-sm">
              <ShieldCheck className="w-4 h-4 text-draft-amber-border" />
              <span>Source-Grounded AI: Answers constrained to repository sources with citations.</span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-3xl flex flex-col gap-1">
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep tracking-tight">Ask Polar AI</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Explore India's Polar Science through grounded repository evidence
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-pure-white shadow-sm">
              <Database className="text-secondary w-6 h-6" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Active Grounding Index</span>
                <span className="font-code-sm text-code-sm font-semibold text-polar-midnight-deep">186 Papers • 320 Datasets • 44 Expedition Dossiers</span>
              </div>
              <span className="ml-2 px-2 py-0.5 rounded bg-surface-container-high text-polar-navy-surface font-code-sm text-code-sm font-bold">Groq Llama-3-70B</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Scope Selector */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-pure-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h2 className="font-headline-sm text-headline-sm text-polar-midnight-deep font-semibold">Corpus Scope</h2>
                </div>
                <button onClick={() => setActiveScope('all')} className="text-secondary font-label-sm text-label-sm hover:underline flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1">Geographic Domain</label>
                {SCOPES.map(scope => (
                  <button
                    key={scope.id}
                    onClick={() => setActiveScope(scope.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-label-md text-label-md flex items-center justify-between transition-all ${
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
                      {activeScope === scope.id ? 'Active' : scope.detail}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Queries */}
            <div className="bg-pure-white rounded-xl p-6 shadow-sm flex flex-col gap-3">
              <h3 className="font-title-md text-title-md text-polar-midnight-deep font-semibold">Suggested Queries</h3>
              {[
                'What were the key findings of the 43rd Antarctic expedition?',
                'How has Arctic sea ice changed at Ny-Ålesund?',
                'Describe the permafrost monitoring at Himansh station.',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="text-left p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-colors border border-transparent hover:border-secondary/20"
                >
                  {q}
                </button>
              ))}
            </div>
          </aside>

          {/* Right: Main Chat Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-pure-white rounded-xl shadow-sm p-6">
              <form onSubmit={handleAsk} className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question grounded in India's polar research corpus..."
                  className="w-full bg-surface rounded-lg p-4 pr-16 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-azure-accent transition-all font-body-md text-body-md text-on-surface placeholder:text-outline"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  className="absolute bottom-4 right-4 bg-polar-midnight-deep hover:bg-polar-navy-surface disabled:opacity-50 disabled:cursor-not-allowed text-on-primary p-2.5 rounded-lg transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center gap-2 text-label-sm font-label-sm text-outline">
                <ShieldCheck className="w-4 h-4 text-aurora-emerald" />
                <span className="font-semibold uppercase tracking-wider text-aurora-emerald">Source-Grounded AI</span>
                <span className="text-outline-variant">— Every answer cites exact documents.</span>
              </div>
            </div>

            {response && (
              <div className="bg-pure-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-azure-accent" />
                    <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep">Answer</h3>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm font-semibold ml-auto">Grounded Response</span>
                  </div>
                  {response.sources.length === 0 ? (
                    <div className="bg-draft-amber-bg border border-draft-amber-border text-draft-amber-text p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="font-body-md text-body-md">{response.answer}</p>
                    </div>
                  ) : (
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{response.answer}</p>
                  )}
                </div>
                
                {response.sources.length > 0 && (
                  <div className="bg-surface-container-low p-6 border-t border-slate-border">
                    <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Supporting Sources ({response.sources.length} citations)
                    </h4>
                    <div className="flex flex-col gap-3">
                      {response.sources.map((src, i) => (
                        <div key={i} className="bg-pure-white border-l-2 border-secondary p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h5 className="font-title-md text-title-md font-semibold text-polar-midnight-deep">{src.title}</h5>
                            {src.pageOrSection && <p className="text-code-sm font-code-sm text-on-surface-variant mt-0.5">{src.pageOrSection}</p>}
                          </div>
                          <span className="font-code-sm text-code-sm font-bold bg-surface-container-high text-secondary px-2 py-1 rounded self-start sm:self-center">
                            {src.id}
                          </span>
                        </div>
                      ))}
                    </div>
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
