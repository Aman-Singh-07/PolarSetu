import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Brain, Send, ShieldCheck, FileText, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { AIResponse } from '../types';

export default function AskAI() {
  const [searchParams] = useSearchParams();
  const resourceId = searchParams.get('resourceId') || undefined;
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-secondary rounded-full mb-4">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-3">Ask Polar AI</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Scientific assistant. Answers are constrained to retrieved repository sources and display supporting citations.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
        <form onSubmit={handleAsk} className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What were the key findings of the 43rd Antarctic expedition?"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 pr-16 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!question.trim() || loading}
            className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold uppercase tracking-wider text-emerald-700">Source-Grounded AI</span>
        </div>
      </div>

      {response && (
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="font-display font-semibold text-lg mb-4 text-primary">Answer</h3>
            {response.sources.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                <p>{response.answer}</p>
              </div>
            ) : (
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{response.answer}</p>
            )}
          </div>
          
          {response.sources.length > 0 && (
            <div className="bg-slate-50 p-6 md:p-8 border-t border-border">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Supporting Sources
              </h4>
              <div className="space-y-3">
                {response.sources.map((src, i) => (
                  <div key={i} className="bg-white border-l-2 border-secondary p-4 rounded shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="font-semibold text-primary text-sm">{src.title}</h5>
                      {src.pageOrSection && <p className="text-xs text-slate-500 mt-1">{src.pageOrSection}</p>}
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider self-start sm:self-center">
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
  );
}
