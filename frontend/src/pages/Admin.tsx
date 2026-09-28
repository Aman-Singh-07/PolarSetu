import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Database, FileUp, CheckCircle2, Search, ArrowRight, Shield, Globe2, 
  Activity, Clock, FileText, LayoutDashboard, LogOut, Loader2
} from 'lucide-react';
import { api } from '../services/api';
import type { Resource, Expedition, OutreachDraft } from '../types';

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [drafts, setDrafts] = useState<OutreachDraft[]>([]);
  
  useEffect(() => {
    // Auth check
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [resData, expData, draftData] = await Promise.all([
          api.getResources(),
          api.getExpeditions(),
          api.getReviewQueue()
        ]);
        setResources(resData);
        setExpeditions(expData);
        setDrafts(draftData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    window.location.reload();
  };

  const pendingReviews = drafts.filter(d => d.status !== 'APPROVED' && d.status !== 'PUBLISHED');
  const approvedDrafts = drafts.filter(d => d.status === 'APPROVED');

  // Create a derived activity list from resources and drafts
  const activities = [
    ...drafts.map(d => ({
      id: d.id,
      type: 'review',
      title: 'Outreach draft submitted for review',
      subtitle: `${d.audience} • ${d.outputType}`,
      time: d.createdAt,
      status: d.status
    })),
    ...resources.map(r => ({
      id: r.id,
      type: 'resource',
      title: 'Resource indexed',
      subtitle: r.title,
      time: r.createdAt,
      status: r.status
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        <span className="font-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Admin Header */}
      <section className="w-full bg-surface-container-low py-8 px-4 lg:px-8 border-b border-slate-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <Shield className="w-4 h-4" />
              <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider">Authorized Admin Access</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep tracking-tight uppercase">Admin Dashboard</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Manage POLARSETU knowledge resources, review outreach content, and monitor repository activity.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 shrink-0">
             <div className="flex items-center justify-end gap-2 text-draft-amber-text">
                <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-draft-amber-bg rounded border border-draft-amber-border/50">
                  Prototype Demonstration Data
                </span>
             </div>
             <div className="flex flex-wrap items-center gap-3">
               <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-border font-label-sm text-label-sm hover:bg-surface-container transition-colors text-on-surface-variant">
                  <Globe2 className="w-4 h-4" /> View Public Platform
               </Link>
               <button onClick={handleSignOut} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-border font-label-sm text-label-sm hover:bg-surface-container transition-colors text-draft-amber-text">
                  <LogOut className="w-4 h-4" /> Sign Out
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pure-white p-5 rounded-xl border border-slate-border/50 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Repository Resources</span>
                <Database className="w-5 h-5 text-secondary opacity-80" />
              </div>
              <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">{resources.length}</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Total indexed items</span>
            </div>
            
            <div className="bg-pure-white p-5 rounded-xl border border-slate-border/50 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Expeditions</span>
                <Globe2 className="w-5 h-5 text-secondary opacity-80" />
              </div>
              <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">{expeditions.length}</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Cataloged missions</span>
            </div>

            <div className="bg-pure-white p-5 rounded-xl border border-slate-border/50 shadow-sm flex flex-col ring-1 ring-draft-amber-border/50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm font-bold text-draft-amber-text uppercase tracking-wider">Pending Reviews</span>
                <Clock className="w-5 h-5 text-draft-amber-text" />
              </div>
              <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">{pendingReviews.length}</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Awaiting human review</span>
            </div>

            <div className="bg-pure-white p-5 rounded-xl border border-slate-border/50 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm font-bold text-aurora-emerald uppercase tracking-wider">Approved Content</span>
                <CheckCircle2 className="w-5 h-5 text-aurora-emerald opacity-80" />
              </div>
              <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">{approvedDrafts.length}</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Ready for dissemination</span>
            </div>
          </div>

          {/* Workflow Indicator */}
          <div className="bg-surface-container-low px-6 py-4 rounded-xl border border-slate-border/50 flex flex-wrap items-center justify-center gap-3 md:gap-6 font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
             <span className="flex items-center gap-1.5"><FileUp className="w-4 h-4"/> Upload</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5"><Database className="w-4 h-4"/> Indexing</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4"/> Discovery</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5"><FileText className="w-4 h-4"/> Outreach</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5 text-draft-amber-text"><Clock className="w-4 h-4"/> Review</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5 text-aurora-emerald"><CheckCircle2 className="w-4 h-4"/> Dissemination</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Actions & Pending) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Quick Actions */}
              <div className="flex flex-col gap-4">
                <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/admin/upload" className="flex items-start gap-4 p-5 rounded-xl bg-pure-white hover:bg-surface-container-low border border-slate-border/50 transition-colors group shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-secondary text-pure-white flex items-center justify-center shrink-0">
                       <FileUp className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">Upload Resource</span>
                       <span className="font-body-sm text-body-sm text-on-surface-variant">Ingest new data or media</span>
                     </div>
                  </Link>
                  <Link to="/admin/review" className="flex items-start gap-4 p-5 rounded-xl bg-pure-white hover:bg-surface-container-low border border-slate-border/50 transition-colors group shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-draft-amber-border text-pure-white flex items-center justify-center shrink-0">
                       <Clock className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">Review Outreach</span>
                       <span className="font-body-sm text-body-sm text-on-surface-variant">Approve or revise drafts</span>
                     </div>
                  </Link>
                  <Link to="/explore" className="flex items-start gap-4 p-5 rounded-xl bg-pure-white hover:bg-surface-container-low border border-slate-border/50 transition-colors group shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-surface-container-high text-polar-midnight-deep flex items-center justify-center shrink-0">
                       <Search className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">View Repository</span>
                       <span className="font-body-sm text-body-sm text-on-surface-variant">Browse indexed content</span>
                     </div>
                  </Link>
                  <Link to="/expeditions" className="flex items-start gap-4 p-5 rounded-xl bg-pure-white hover:bg-surface-container-low border border-slate-border/50 transition-colors group shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-surface-container-high text-polar-midnight-deep flex items-center justify-center shrink-0">
                       <Globe2 className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">View Expeditions</span>
                       <span className="font-body-sm text-body-sm text-on-surface-variant">Explore mission logs</span>
                     </div>
                  </Link>
                </div>
              </div>

              {/* Pending Reviews Table */}
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                   <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Pending Review</h2>
                   <Link to="/admin/review" className="text-secondary font-label-sm text-label-sm hover:underline">View All →</Link>
                 </div>
                 
                 <div className="bg-pure-white rounded-xl border border-slate-border/50 shadow-sm overflow-hidden">
                    {pendingReviews.length === 0 ? (
                      <div className="p-8 text-center text-on-surface-variant font-body-sm">
                        All outreach drafts have been reviewed.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-border/50">
                        {pendingReviews.slice(0, 4).map(draft => (
                          <div key={draft.id} className="p-4 flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors">
                            <div className="flex flex-col gap-1 min-w-0">
                               <div className="flex items-center gap-2">
                                 <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider text-draft-amber-text border border-draft-amber-border/50 px-1.5 py-0.5 rounded bg-draft-amber-bg/50">Pending Review</span>
                                 <span className="font-code-sm text-[10px] text-outline uppercase">{draft.id}</span>
                               </div>
                               <span className="font-title-md font-semibold text-polar-midnight-deep truncate">{draft.outputType}</span>
                               <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Target: {draft.audience} • Source: {draft.sourceIds[0]}</span>
                            </div>
                            <Link to="/admin/review" className="shrink-0 px-3 py-1.5 rounded bg-polar-midnight-deep text-pure-white font-label-sm text-label-sm hover:bg-polar-navy-surface transition-colors">
                               Review →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
              </div>

            </div>

            {/* Right Column (Activity & System) */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* Recent Activity */}
              <div className="flex flex-col gap-4">
                 <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Recent Activity</h2>
                 <div className="bg-pure-white rounded-xl border border-slate-border/50 shadow-sm p-5 flex flex-col gap-5">
                   {activities.length === 0 ? (
                      <div className="text-center text-on-surface-variant font-body-sm">Repository activity will appear here.</div>
                   ) : (
                     <div className="flex flex-col gap-5 relative">
                        <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-border/50 z-0"></div>
                        {activities.map((act, i) => (
                          <div key={`${act.id}-${i}`} className="flex gap-4 relative z-10">
                            <div className="w-4 h-4 rounded-full bg-pure-white border-2 border-secondary shrink-0 mt-1"></div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                               <span className="font-label-sm font-bold text-polar-midnight-deep">{act.title}</span>
                               <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{act.subtitle}</span>
                               <div className="flex items-center gap-2 mt-1">
                                 <span className="font-code-sm text-[10px] text-outline uppercase">Prototype Activity</span>
                               </div>
                            </div>
                          </div>
                        ))}
                     </div>
                   )}
                 </div>
              </div>

              {/* System Status */}
              <div className="flex flex-col gap-4">
                 <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">System Status</h2>
                 <div className="bg-pure-white rounded-xl border border-slate-border/50 shadow-sm divide-y divide-slate-border/50">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Database className="w-4 h-4 text-secondary" />
                         <span className="font-label-sm font-semibold">Repository Database</span>
                      </div>
                      <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Demo Mode</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Activity className="w-4 h-4 text-aurora-emerald" />
                         <span className="font-label-sm font-semibold">Source-Grounded AI</span>
                      </div>
                      <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Demo Mode</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Globe2 className="w-4 h-4 text-secondary" />
                         <span className="font-label-sm font-semibold">Indexing Engine</span>
                      </div>
                      <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Prototype</span>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
