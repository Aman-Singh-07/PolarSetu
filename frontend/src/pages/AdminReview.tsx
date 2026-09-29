import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { OutreachDraft } from '../types';
import { CheckCircle2, Search, FileText, X, AlertTriangle } from 'lucide-react';
import { auth } from '../services/auth';
import { Button } from '../components/ui/Button';
import { StatusLabel } from '../components/ui/StatusLabel';

export default function AdminReview() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<OutreachDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) { navigate('/login'); return; }
    let mounted = true;
    
    const fetchQueue = async () => {
      setLoading(true);
      setError(null);
      try { 
        const data = await api.getReviewQueue();
        if (mounted) {
          setQueue(data);
          if (data.length > 0) setSelectedId(data[0].id);
        }
      } catch {
        if (mounted) setError('We couldn\'t load the review queue.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchQueue();
    return () => { mounted = false; };
  }, [navigate]);

  const refreshQueue = async () => {
    try {
      const data = await api.getReviewQueue();
      setQueue(data);
      // Auto-select first item if the currently selected item is gone
      if (!data.find(d => d.id === selectedId) && data.length > 0) {
        setSelectedId(data[0].id);
      } else if (data.length === 0) {
        setSelectedId(null);
      }
    } catch {
      setError('We couldn\'t refresh the review queue.');
    }
  };

  const handleApprove = async () => {
    if (!selectedId || processingId) return;
    setProcessingId(selectedId);
    try {
      await api.approveDraft(selectedId);
      await refreshQueue();
    } catch {
      setError('The item could not be approved. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedId || processingId) return;
    setProcessingId(selectedId);
    try {
      await api.rejectDraft(selectedId, rejectReason.trim() || undefined);
      setRejectDialogOpen(false);
      setRejectReason('');
      await refreshQueue();
    } catch {
      setError('The item could not be rejected. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const selectedItem = queue.find(d => d.id === selectedId);

  return (
    <div className="flex flex-col w-full min-h-full pb-12">
      {/* ─── HEADER ─── */}
      <section className="w-full px-4 lg:px-8 pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">CONTENT REVIEW</span>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
              Review Queue
            </h1>
            <p className="text-[14px] text-white/60 font-medium max-w-2xl">
              Review generated and submitted content before it moves through the repository workflow.
            </p>
          </div>
          {!loading && !error && queue.length > 0 && (
            <div className="text-[13px] font-bold text-white/50 uppercase tracking-[0.05em] shrink-0">
              {queue.length} items pending review
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="w-full px-4 lg:px-8 py-8 flex-1 flex flex-col">
        <div className="max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
          
          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-4 rounded-[10px] text-[13px] mb-6 font-bold flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
              <Button onClick={() => window.location.reload()} variant="secondary" className="!h-8 !px-3 !text-[12px] !border-error/20 !text-error hover:!bg-error/20">
                Retry
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-full min-h-[600px]">
              {/* Queue Skeleton */}
              <div className="col-span-1 border-r border-white/10 pr-6 flex flex-col gap-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="p-4 rounded-[12px] border border-white/5 bg-deep-blue animate-pulse flex flex-col gap-3">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                ))}
              </div>
              {/* Detail Skeleton */}
              <div className="col-span-2 pl-0 lg:pl-6 flex flex-col gap-6">
                <div className="h-8 bg-white/10 rounded w-1/3 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 bg-white/5 rounded w-24 animate-pulse" />
                  <div className="h-6 bg-white/5 rounded w-32 animate-pulse" />
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                  <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                  <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                  <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                </div>
              </div>
            </div>
          ) : queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-deep-blue border border-white/10 rounded-[12px] shadow-sm text-center flex-1">
              <div className="w-12 h-12 rounded-[12px] bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <CheckCircle2 className="w-6 h-6 text-white/30" />
              </div>
              <h2 className="text-[16px] font-bold text-white mb-2">Review queue is clear</h2>
              <p className="text-[14px] text-white/50 mb-6 font-medium">
                There are no items waiting for review.
              </p>
              <Button onClick={() => navigate('/admin')} variant="secondary" className="!border-white/20 !text-white hover:!bg-white/5">
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
              
              {/* LEFT: QUEUE LIST */}
              <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-3 lg:border-r lg:border-white/5 lg:pr-8 overflow-y-auto custom-scrollbar">
                {queue.map(item => {
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`text-left p-4 rounded-[12px] border transition-colors ${
                        isSelected 
                          ? 'bg-ocean-navy border-cyan-accent/30 shadow-sm' 
                          : 'bg-deep-blue border-white/5 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[13px] font-bold text-white line-clamp-2 leading-tight">
                          {item.outputType.replace('_', ' ')} for {item.audience}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-white/50">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <StatusLabel status={item.status} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT: SELECTED ITEM DETAIL */}
              <div className="flex-1 flex flex-col min-w-0 pb-12">
                {selectedItem ? (
                  <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm flex flex-col overflow-hidden h-full">
                    
                    {/* Detail Header */}
                    <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-bold text-white capitalize">
                          {selectedItem.outputType.replace('_', ' ')}
                        </h2>
                        <StatusLabel status={selectedItem.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="px-3 py-1.5 rounded-[6px] bg-ocean-navy border border-white/10 text-[12px] font-bold text-white/70">
                          Target: {selectedItem.audience}
                        </div>
                        <div className="px-3 py-1.5 rounded-[6px] bg-ocean-navy border border-white/10 text-[12px] font-bold text-white/70">
                          Created: {new Date(selectedItem.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Source Information */}
                    {selectedItem.sourceIds && selectedItem.sourceIds.length > 0 && (
                      <div className="p-6 border-b border-white/5">
                        <h3 className="text-[12px] font-bold text-white/50 uppercase tracking-[0.1em] mb-3">Source</h3>
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-white/40" />
                          <span className="text-[13px] font-medium text-white font-mono">Resource ID: {selectedItem.sourceIds[0]}</span>
                          <Link to={`/research/${selectedItem.sourceIds[0]}`} target="_blank" className="text-[12px] font-bold text-cyan-accent hover:underline ml-auto">
                            View Resource ↗
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Full Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                      <div className="text-[15px] leading-[1.75] text-white/90 whitespace-pre-wrap font-medium">
                        {selectedItem.content}
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="p-6 border-t border-white/10 bg-ocean-navy/50 flex flex-col sm:flex-row items-center gap-3">
                      <Button 
                        onClick={handleApprove}
                        disabled={processingId !== null}
                        className="w-full sm:flex-1 justify-center py-5 h-auto text-[14px]"
                      >
                        {processingId === selectedItem.id ? 'Approving...' : 'Approve'}
                      </Button>
                      
                      <Button 
                        variant="secondary"
                        onClick={() => setRejectDialogOpen(true)}
                        disabled={processingId !== null}
                        className="w-full sm:flex-1 justify-center py-5 h-auto text-[14px] !border-error/30 !text-error hover:!bg-error/10 hover:!border-error/50"
                      >
                        {processingId === selectedItem.id ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-deep-blue border border-white/10 rounded-[12px] text-center">
                    <Search className="w-8 h-8 text-white/20 mb-4" />
                    <p className="text-[14px] font-medium text-white/50">Select an item from the queue to review its content.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* ─── REJECT DIALOG ─── */}
      {rejectDialogOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-ocean/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-deep-blue border border-white/10 rounded-[12px] w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
              <h3 className="text-[15px] font-bold text-white">Reject Content</h3>
              <button onClick={() => setRejectDialogOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <p className="text-[13px] text-white/70 font-medium leading-relaxed">
                You are about to reject the generated <strong>{selectedItem.outputType.replace('_', ' ')}</strong> for <strong>{selectedItem.audience}</strong>.
              </p>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="reject-reason" className="text-[12px] font-bold text-white/70">Reason for rejection (Optional)</label>
                <textarea
                  id="reject-reason"
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why this content is being rejected..."
                  rows={3}
                  className="w-full px-3 py-3 bg-ocean-navy border border-white/10 rounded-[8px] text-[13px] text-white font-medium focus:outline-none focus:border-error/50 resize-y placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="p-5 border-t border-white/5 bg-white/5 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setRejectDialogOpen(false)} className="!h-9 !px-4 !text-[13px] !border-white/20 !text-white hover:!bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleReject} disabled={processingId !== null} className="!h-9 !px-4 !text-[13px] !bg-error !text-white hover:!bg-error/90">
                {processingId === selectedItem.id ? 'Rejecting...' : 'Reject Content'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
