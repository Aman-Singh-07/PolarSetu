import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { OutreachDraft } from '../types';
import { CheckCircle2, XCircle, ArrowLeft, Loader2, FileCheck, Search, ShieldCheck } from 'lucide-react';
import { auth } from '../services/auth';

export default function AdminReview() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<OutreachDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) { navigate('/login'); return; }
    fetchQueue();
  }, [navigate]);

  const fetchQueue = async () => {
    setLoading(true);
    try { setQueue(await api.getReviewQueue()); } catch {}
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    if (processingId) return;
    setProcessingId(id); setError(null);
    try { await api.approveDraft(id); await fetchQueue(); }
    catch { setError('Failed to approve.'); }
    finally { setProcessingId(null); }
  };

  const handleReject = async (id: string) => {
    if (processingId) return;
    setProcessingId(id); setError(null);
    try { await api.rejectDraft(id, 'Rejected by admin'); await fetchQueue(); }
    catch { setError('Failed to reject.'); }
    finally { setProcessingId(null); }
  };

  const pending = queue.filter(d => d.status !== 'APPROVED' && d.status !== 'PUBLISHED');
  const approved = queue.filter(d => d.status === 'APPROVED' || d.status === 'PUBLISHED');

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow relative overflow-hidden">
      {/* ─── CINEMATIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-snow to-frost opacity-80" />
      </div>

      <div className="relative z-10 w-full flex flex-col flex-1">
        {/* ─── HEADER ─── */}
        <section className="w-full border-b border-border-ice pt-10 pb-8 px-4 lg:px-8 bg-white/60 backdrop-blur-md">
          <div className="max-w-[1000px] mx-auto flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <Link to="/admin" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-accent uppercase tracking-[0.2em] hover:text-deep-ocean transition-colors w-fit mb-3 bg-white px-3 py-1.5 rounded-lg border border-border-ice shadow-sm">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="font-display text-4xl font-extrabold text-deep-ocean tracking-tight flex items-center gap-4">
                Editorial Review Queue
              </h1>
              <p className="text-[15px] text-muted font-medium max-w-xl">
                Review, approve, or reject AI-generated outreach drafts before they are published to the public or distributed to stakeholders.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CONTENT ─── */}
        <section className="w-full px-4 lg:px-8 py-12 flex-1">
          <div className="max-w-[1000px] mx-auto">
            {error && (
              <div className="bg-error/5 border border-error/20 text-error p-5 rounded-[16px] text-[14px] mb-8 font-bold flex items-center gap-3 shadow-sm animate-fade-in">
                <XCircle className="w-5 h-5 shrink-0" /> {error}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#F59E0B]/10 blur-xl rounded-full" />
                  <div className="w-12 h-12 rounded-full border-[3px] border-border-ice border-t-[#F59E0B] animate-spin relative z-10" />
                </div>
                <span className="text-[10px] text-[#F59E0B] uppercase tracking-[0.2em] font-bold">Synchronizing Queue...</span>
              </div>
            ) : queue.length === 0 ? (
              <div className="bg-white rounded-[32px] p-20 text-center border border-white shadow-[0_20px_50px_rgba(7,20,38,0.06)] flex flex-col items-center justify-center animate-fade-up">
                <div className="w-24 h-24 rounded-full bg-frost flex items-center justify-center mb-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-border-ice">
                  <ShieldCheck className="w-12 h-12 text-muted/40" />
                </div>
                <h2 className="text-3xl font-display font-extrabold text-deep-ocean mb-3">All Clear</h2>
                <p className="text-muted text-[16px] mb-10 max-w-md mx-auto font-medium leading-relaxed">
                  There are no pending drafts in the review queue. All AI-generated outreach has been successfully processed.
                </p>
                <Link to="/admin" className="px-8 py-4 bg-deep-ocean text-white font-bold text-[15px] rounded-[16px] hover:bg-cyan-accent hover:text-deep-ocean transition-all shadow-[0_8px_20px_rgba(7,20,38,0.1)] hover:-translate-y-1">
                  Return to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-8 animate-fade-up">
                {/* Status Summary Bar */}
                <div className="flex items-center gap-6 pb-6 border-b border-border-ice">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.4)]" />
                    <span className="text-[12px] text-deep-ocean font-bold uppercase tracking-[0.1em]">{pending.length} Pending Review</span>
                  </div>
                  <div className="w-[2px] h-5 bg-border-ice" />
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                    <span className="text-[12px] text-muted font-bold uppercase tracking-[0.1em]">{approved.length} Approved</span>
                  </div>
                </div>

                {/* Draft Items */}
                <div className="flex flex-col gap-8">
                  {queue.map(draft => {
                    const isPending = draft.status !== 'APPROVED' && draft.status !== 'PUBLISHED';
                    const isProcessing = processingId === draft.id;
                    
                    return (
                      <article key={draft.id} className={`bg-white rounded-[32px] border ${isPending ? 'border-[#F59E0B]/30 shadow-[0_16px_40px_rgba(245,158,11,0.08)] scale-[1.01]' : 'border-white shadow-[0_12px_40px_rgba(7,20,38,0.06)]'} overflow-hidden relative group transition-all duration-300`}>
                        {isPending && <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-[#F59E0B] to-amber-bg" />}
                        
                        <div className="p-8 sm:p-10 flex flex-col gap-8">
                          
                          {/* Top Meta Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="px-4 py-2 rounded-lg text-[11px] font-bold text-deep-ocean uppercase tracking-[0.2em] bg-frost border border-border-ice flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-cyan-accent" /> {draft.outputType.replace('_', ' ')}
                              </span>
                              <span className="px-4 py-2 rounded-lg text-[11px] font-bold text-muted uppercase tracking-[0.2em] bg-white border border-border-ice flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
                                Target: {draft.audience}
                              </span>
                            </div>
                            
                            <span className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] border shadow-sm ${
                              draft.status === 'APPROVED' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                              draft.status === 'REJECTED' ? 'bg-error/5 text-error border-error/20' :
                              'bg-amber-bg text-amber-warn border-[#F59E0B]/20 animate-pulse'
                            }`}>
                              {draft.status === 'DRAFT' ? 'Awaiting Approval' : draft.status}
                            </span>
                          </div>

                          {/* Source Ref */}
                          <div className="flex items-center gap-2 text-[13px] text-muted bg-snow p-4 rounded-[16px] border border-border-ice font-mono font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                            <Search className="w-4 h-4" /> Source Entity: {draft.sourceIds.join(', ')}
                          </div>
                          
                          {/* Content Preview */}
                          <div className="bg-white rounded-[20px] p-8 text-[16px] text-ink leading-[1.8] font-medium max-h-[450px] overflow-y-auto border border-border-ice shadow-[0_8px_30px_rgba(7,20,38,0.04)] whitespace-pre-line custom-scrollbar">
                            {draft.content}
                          </div>

                          {/* Action Buttons */}
                          {isPending && (
                            <div className="flex items-center gap-4 pt-6 border-t border-border-ice">
                              <button 
                                onClick={() => handleApprove(draft.id)} 
                                disabled={isProcessing} 
                                className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-8 py-4 bg-[#10B981] text-white text-[15px] font-extrabold rounded-[16px] hover:bg-[#10B981]/90 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300 hover:-translate-y-1"
                              >
                                {isProcessing && processingId === draft.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} 
                                Approve Draft
                              </button>
                              
                              <button 
                                onClick={() => handleReject(draft.id)} 
                                disabled={isProcessing} 
                                className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-error text-[15px] font-bold rounded-[16px] border border-error/20 hover:bg-error hover:text-white hover:border-error hover:shadow-[0_8px_20px_rgba(220,38,38,0.2)] disabled:opacity-50 transition-all duration-300 hover:-translate-y-1"
                              >
                                {isProcessing && processingId === draft.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />} 
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
