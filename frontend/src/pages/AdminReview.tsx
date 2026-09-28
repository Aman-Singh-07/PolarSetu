import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { OutreachDraft } from '../types';
import { CheckCircle2, XCircle, Clock, FileText, Edit3, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminReview() {
  const [queue, setQueue] = useState<OutreachDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    const data = await api.getReviewQueue();
    setQueue(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (id: string) => {
    await api.approveDraft(id);
    fetchQueue();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <Link to="/admin" className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:text-polar-midnight-deep transition-colors self-start">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Editorial Review Queue</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Approve or reject AI-generated outreach drafts before publication. Human review is mandatory.</p>
        </div>
      </section>

      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant font-body-md">Loading queue...</div>
          ) : queue.length === 0 ? (
            <div className="bg-pure-white rounded-xl p-12 text-center shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-aurora-emerald mx-auto mb-4" />
              <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">All caught up</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">No pending drafts in the queue.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {queue.map(draft => (
                <div key={draft.id} className="bg-pure-white rounded-xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {draft.status === 'DRAFT' ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-draft-amber-bg text-draft-amber-text font-label-sm text-label-sm font-bold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" /> Pending Review
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm font-semibold">{draft.audience}</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-code-sm">{draft.outputType}</span>
                      <span className="font-code-sm text-code-sm text-outline ml-auto">{new Date(draft.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-surface-container-low p-4 rounded-xl font-body-sm text-body-sm text-on-surface whitespace-pre-wrap mb-4 leading-relaxed">
                      {draft.content}
                    </div>
                    
                    <div className="flex items-center gap-2 font-code-sm text-code-sm text-on-surface-variant">
                      <FileText className="w-3.5 h-3.5 text-secondary" />
                      <span className="uppercase tracking-wider font-semibold">Source Evidence:</span>
                      <span className="bg-pure-white border border-slate-border px-1.5 py-0.5 rounded font-semibold text-secondary">{draft.sourceIds.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="bg-surface-container-low border-t lg:border-t-0 lg:border-l border-slate-border p-6 flex flex-row lg:flex-col items-center justify-center gap-3 w-full lg:w-48 shrink-0">
                    {draft.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => handleApprove(draft.id)}
                          className="w-full bg-aurora-emerald hover:bg-aurora-emerald/90 text-on-secondary py-2.5 rounded-lg font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button 
                          onClick={() => alert('Reject draft action not available in demo mode.')}
                          className="w-full bg-pure-white hover:bg-surface-container text-error border border-slate-border-strong py-2.5 rounded-lg font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" /> Reject (Demo)
                        </button>
                        <button 
                          onClick={() => alert('Edit draft action not available in demo mode.')}
                          className="w-full text-on-surface-variant hover:text-on-surface font-label-md text-label-md font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-4 h-4" /> Edit Draft (Demo)
                        </button>
                      </>
                    )}
                    {draft.status === 'APPROVED' && (
                      <div className="text-center font-body-sm text-body-sm text-on-surface-variant">Reviewer action recorded.</div>
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
