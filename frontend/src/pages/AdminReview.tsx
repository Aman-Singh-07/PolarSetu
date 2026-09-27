import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { OutreachDraft } from '../types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminReview() {
  const [queue, setQueue] = useState<OutreachDraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    const data = await api.getReviewQueue();
    setQueue(data);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await api.approveDraft(id);
    fetchQueue();
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Editorial Review Queue</h1>
        <p className="text-slate-500">Approve or reject AI-generated outreach drafts before publication.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading queue...</div>
      ) : queue.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">All caught up</h3>
          <p className="text-slate-500">There are no pending drafts in the queue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {queue.map(draft => (
            <div key={draft.id} className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
              <div className="flex-1 p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {draft.status === 'DRAFT' ? (
                    <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 mr-1.5" /> Pending Review
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Approved
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{draft.audience}</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">{draft.outputType}</span>
                  <span className="text-xs text-slate-400 ml-auto">{new Date(draft.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap mb-4">
                  {draft.content}
                </div>
                
                <div className="text-xs font-medium text-slate-500">
                  <span className="uppercase tracking-wider">Source Evidence:</span> <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded ml-1 text-primary">{draft.sourceIds.join(', ')}</span>
                </div>
              </div>
              
              <div className="bg-slate-50 border-t lg:border-t-0 lg:border-l border-border p-6 flex flex-row lg:flex-col items-center justify-center gap-3 w-full lg:w-48 shrink-0">
                {draft.status === 'DRAFT' && (
                  <>
                    <button 
                      onClick={() => handleApprove(draft.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded font-medium text-sm transition-colors flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve
                    </button>
                    <button className="w-full bg-white hover:bg-slate-100 text-rose-600 border border-slate-200 py-2.5 rounded font-medium text-sm transition-colors flex items-center justify-center">
                      <XCircle className="w-4 h-4 mr-1.5" /> Reject
                    </button>
                    <button className="w-full text-slate-500 hover:text-primary text-sm font-medium py-2 transition-colors">
                      Edit Draft
                    </button>
                  </>
                )}
                {draft.status === 'APPROVED' && (
                  <div className="text-center text-sm text-slate-500 font-medium">
                    Reviewer action recorded.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
