import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { OutreachDraft } from '../types';
import { CheckCircle2, XCircle, Clock, FileText, Edit3, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { auth } from '../services/auth';

export default function AdminReview() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<OutreachDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = auth.isAuthenticated();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchQueue();
  }, [navigate]);

  const fetchQueue = async () => {
    setLoading(true);
    const data = await api.getReviewQueue();
    setQueue(data);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);
    setError(null);
    try {
      await api.approveDraft(id);
      await fetchQueue();
    } catch (err) {
      console.error(err);
      setError('Failed to approve draft. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);
    setError(null);
    try {
      await api.rejectDraft(id, "Rejected by admin");
      await fetchQueue();
    } catch (err) {
      console.error(err);
      setError('Failed to reject draft. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Header */}
      <section className="relative w-full overflow-hidden bg-polar-midnight-deep text-pure-white py-10 lg:py-12 px-4 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-polar-midnight-deep via-polar-midnight-deep/95 to-polar-navy-surface z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-3">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-glacial-sky font-label-sm text-sm font-bold tracking-wider hover:text-white transition-colors self-start mb-1 uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-draft-amber-border flex items-center justify-center shrink-0 shadow-md">
              <Shield className="w-5 h-5 text-pure-white" />
            </div>
            <h1 className="font-headline-lg text-3xl lg:text-4xl font-bold tracking-tight uppercase">Editorial Review Queue</h1>
          </div>
          <p className="font-body-md text-base lg:text-lg text-pure-white/80 max-w-2xl mt-1 leading-relaxed">
            Approve or reject AI-generated outreach drafts before publication. Human review is mandatory.
          </p>
        </div>
      </section>

      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              <span className="font-label-md text-polar-midnight-deep font-bold uppercase tracking-widest">Loading queue...</span>
            </div>
          ) : queue.length === 0 ? (
            <div className="bg-pure-white rounded-2xl p-12 lg:p-16 text-center shadow-sm border border-surface-variant max-w-2xl mx-auto flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-aurora-emerald/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-aurora-emerald" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-polar-midnight-deep font-display">All caught up</h3>
              <p className="font-body-md text-base lg:text-lg text-on-surface-variant max-w-md">There are currently no pending drafts requiring editorial review.</p>
              <Link to="/admin" className="mt-4 px-6 py-3 rounded-lg bg-polar-midnight-deep hover:bg-polar-navy-surface text-pure-white font-label-md font-bold uppercase tracking-wider transition-all shadow-sm">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Queue count header */}
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {queue.filter(d => d.status === 'DRAFT').length} pending · {queue.filter(d => d.status === 'APPROVED').length} approved
                </span>
              </div>

              {error && (
                <div className="bg-error/10 text-error px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5" />
                  <span className="font-label-md text-sm">{error}</span>
                </div>
              )}
              {queue.map(draft => (
                <div key={draft.id} className="bg-pure-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-surface-variant overflow-hidden flex flex-col lg:flex-row">
                  <div className="flex-1 p-6 lg:p-8 flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {draft.status === 'DRAFT' ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-draft-amber-bg/40 text-draft-amber-text border border-draft-amber-border/40 font-label-sm text-[11px] font-bold uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" /> Pending Review
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-aurora-emerald/10 text-aurora-emerald border border-aurora-emerald/20 font-label-sm text-[11px] font-bold uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded bg-secondary/10 text-secondary font-code-sm text-[11px] font-bold tracking-widest uppercase border border-secondary/15">{draft.audience}</span>
                      <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-code-sm text-[11px] font-bold tracking-widest uppercase border border-surface-variant">{draft.outputType}</span>
                      <span className="font-code-sm text-[11px] text-outline ml-auto font-bold tracking-wider uppercase hidden sm:inline">{new Date(draft.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-surface-container-low p-5 rounded-xl font-body-md text-base text-on-surface whitespace-pre-wrap leading-relaxed border border-surface-variant/50 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary to-glacial-sky rounded-full"></div>
                      <div className="pl-3">{draft.content}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 font-code-sm text-xs text-on-surface-variant">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span className="uppercase tracking-widest font-bold">Source Evidence:</span>
                      <span className="bg-surface-container-low border border-surface-variant px-2 py-0.5 rounded font-bold text-secondary">{draft.sourceIds.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="bg-surface-container-low border-t lg:border-t-0 lg:border-l border-surface-variant p-6 lg:p-8 flex flex-row lg:flex-col items-center justify-center gap-3 w-full lg:w-56 shrink-0">
                    {draft.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => handleApprove(draft.id)}
                          disabled={processingId === draft.id}
                          className="w-full bg-aurora-emerald hover:bg-aurora-emerald/90 text-pure-white py-3 rounded-xl font-label-md text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          {processingId === draft.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          {processingId === draft.id ? 'Approving...' : 'Approve'}
                        </button>
                        <button 
                          onClick={() => handleReject(draft.id)}
                          disabled={processingId === draft.id}
                          className="w-full bg-pure-white hover:bg-error/5 text-error border border-error/20 hover:border-error/50 py-3 rounded-xl font-label-md text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {processingId === draft.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          {processingId === draft.id ? 'Rejecting...' : 'Reject'}
                        </button>
                        <button 
                          onClick={() => alert('Edit draft action not available in demo mode.')}
                          className="w-full text-on-surface-variant hover:text-polar-midnight-deep hover:bg-surface-container font-label-md text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" /> Edit <span className="opacity-50 text-xs">(Demo)</span>
                        </button>
                      </>
                    )}
                    {draft.status === 'APPROVED' && (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CheckCircle2 className="w-6 h-6 text-aurora-emerald" />
                        <span className="font-body-sm text-sm text-on-surface-variant">Reviewer action recorded.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
