import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Database, FileUp, CheckCircle2, Search, ArrowRight, Shield, Globe2, 
  Activity, Clock, FileText, LayoutDashboard, LogOut
} from 'lucide-react';
import { api } from '../services/api';
import { auth } from '../services/auth';
import type { Resource, Expedition, OutreachDraft, Activity as ActivityType } from '../types';

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [drafts, setDrafts] = useState<OutreachDraft[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  
  useEffect(() => {
    // Auth check
    const isAuthenticated = auth.isAuthenticated();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [resData, expData, draftData, actData] = await Promise.all([
          api.getResources(),
          api.getExpeditions(),
          api.getReviewQueue(),
          api.getActivities()
        ]);
        setResources(resData);
        setExpeditions(expData);
        setDrafts(draftData);
        setActivities(actData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  const handleSignOut = () => {
    auth.clearToken();
    navigate('/login');
    window.location.reload();
  };

  const pendingReviews = drafts.filter(d => d.status !== 'APPROVED' && d.status !== 'PUBLISHED');
  const approvedDrafts = drafts.filter(d => d.status === 'APPROVED');



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-surface-variant border-t-secondary rounded-full animate-spin"></div>
        <span className="font-label-md font-bold text-polar-midnight-deep uppercase tracking-widest">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Admin Header */}
      <section className="relative w-full overflow-hidden bg-polar-midnight-deep text-pure-white py-10 lg:py-12 px-4 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-polar-midnight-deep via-polar-midnight-deep/95 to-polar-navy-surface z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-glacial-sky">
              <Shield className="w-4 h-4" />
              <span className="font-label-sm text-xs font-bold uppercase tracking-widest">Authorized Command Center</span>
            </div>
            <h1 className="font-headline-lg text-3xl lg:text-4xl font-bold tracking-tight uppercase">Admin Dashboard</h1>
            <p className="font-body-md text-base lg:text-lg text-pure-white/80 max-w-2xl leading-relaxed">
              Manage POLARSETU knowledge resources, review outreach content, and monitor repository activity.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 shrink-0">
             <div className="flex items-center justify-start md:justify-end">
                <span className="font-code-sm text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-draft-amber-bg/15 text-draft-amber-border rounded border border-draft-amber-border/30 backdrop-blur-sm flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Prototype Demonstration
                </span>
             </div>
             <div className="flex flex-wrap items-center gap-3">
               <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 font-label-sm text-sm hover:bg-white/10 transition-all text-pure-white">
                  <Globe2 className="w-4 h-4" /> Public Platform
               </Link>
               <button onClick={handleSignOut} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-label-sm text-sm hover:bg-error/20 hover:border-error/40 hover:text-error transition-all text-pure-white/80">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-pure-white p-5 lg:p-6 rounded-2xl border border-surface-variant shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1 group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-[10px] lg:text-xs font-bold text-on-surface-variant uppercase tracking-widest">Resources</span>
                <div className="p-2 rounded-lg bg-surface-container group-hover:bg-secondary group-hover:text-pure-white transition-colors text-secondary">
                  <Database className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              </div>
              <span className="text-3xl lg:text-4xl font-bold text-polar-midnight-deep font-display">{resources.length}</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Total indexed items</span>
            </div>
            
            <div className="bg-pure-white p-5 lg:p-6 rounded-2xl border border-surface-variant shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1 group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-sm text-[10px] lg:text-xs font-bold text-on-surface-variant uppercase tracking-widest">Expeditions</span>
                <div className="p-2 rounded-lg bg-surface-container group-hover:bg-secondary group-hover:text-pure-white transition-colors text-secondary">
                  <Globe2 className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              </div>
              <span className="text-3xl lg:text-4xl font-bold text-polar-midnight-deep font-display">{expeditions.length}</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Cataloged missions</span>
            </div>

            <div className="bg-pure-white p-5 lg:p-6 rounded-2xl border border-draft-amber-border/40 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-draft-amber-bg/60 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="font-label-sm text-[10px] lg:text-xs font-bold text-draft-amber-text uppercase tracking-widest">Pending</span>
                <div className="p-2 rounded-lg bg-draft-amber-bg text-draft-amber-text group-hover:bg-draft-amber-border group-hover:text-pure-white transition-colors">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              </div>
              <span className="text-3xl lg:text-4xl font-bold text-polar-midnight-deep font-display relative z-10">{pendingReviews.length}</span>
              <span className="font-body-sm text-xs text-on-surface-variant relative z-10">Awaiting human review</span>
            </div>

            <div className="bg-pure-white p-5 lg:p-6 rounded-2xl border border-surface-variant shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-aurora-emerald/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="font-label-sm text-[10px] lg:text-xs font-bold text-aurora-emerald uppercase tracking-widest">Approved</span>
                <div className="p-2 rounded-lg bg-aurora-emerald/10 text-aurora-emerald group-hover:bg-aurora-emerald group-hover:text-pure-white transition-colors">
                  <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              </div>
              <span className="text-3xl lg:text-4xl font-bold text-polar-midnight-deep font-display relative z-10">{approvedDrafts.length}</span>
              <span className="font-body-sm text-xs text-on-surface-variant relative z-10">Ready for dissemination</span>
            </div>
          </div>

          {/* Workflow Indicator */}
          <div className="bg-pure-white px-5 py-3.5 rounded-xl border border-surface-variant shadow-sm flex flex-wrap items-center justify-center gap-3 md:gap-5 font-label-sm text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
             <span className="flex items-center gap-1.5"><FileUp className="w-3.5 h-3.5"/> Upload</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5"/> Indexing</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5"><LayoutDashboard className="w-3.5 h-3.5"/> Discovery</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Outreach</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5 text-draft-amber-text"><Clock className="w-3.5 h-3.5"/> Review</span>
             <ArrowRight className="w-3 h-3 text-outline" />
             <span className="flex items-center gap-1.5 text-aurora-emerald"><CheckCircle2 className="w-3.5 h-3.5"/> Dissemination</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Actions & Pending) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Quick Actions */}
              <div className="flex flex-col gap-4">
                <h2 className="font-label-md text-sm font-bold text-polar-midnight-deep uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-secondary" /> Core Operations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/admin/upload" className="flex items-start gap-4 p-5 rounded-2xl bg-pure-white hover:bg-surface-container-low border border-surface-variant hover:border-secondary/30 transition-all group shadow-sm hover:shadow-md">
                     <div className="w-11 h-11 rounded-xl bg-polar-midnight-deep text-pure-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                       <FileUp className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1 pt-0.5">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">Ingest Resource</span>
                       <span className="font-body-sm text-sm text-on-surface-variant leading-tight">Upload & index new polar datasets or media</span>
                     </div>
                  </Link>
                  <Link to="/admin/review" className="flex items-start gap-4 p-5 rounded-2xl bg-pure-white hover:bg-draft-amber-bg/20 border border-surface-variant hover:border-draft-amber-border/50 transition-all group shadow-sm hover:shadow-md">
                     <div className="w-11 h-11 rounded-xl bg-draft-amber-border text-pure-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                       <Clock className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1 pt-0.5">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-draft-amber-text transition-colors">Review Outreach</span>
                       <span className="font-body-sm text-sm text-on-surface-variant leading-tight">Approve AI-generated educational drafts</span>
                     </div>
                  </Link>
                  <Link to="/explore" className="flex items-start gap-4 p-5 rounded-2xl bg-pure-white hover:bg-surface-container-low border border-surface-variant hover:border-secondary/30 transition-all group shadow-sm hover:shadow-md">
                     <div className="w-11 h-11 rounded-xl bg-azure-accent/10 text-azure-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                       <Search className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1 pt-0.5">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">View Repository</span>
                       <span className="font-body-sm text-sm text-on-surface-variant leading-tight">Browse FAIR-compliant indexed content</span>
                     </div>
                  </Link>
                  <Link to="/expeditions" className="flex items-start gap-4 p-5 rounded-2xl bg-pure-white hover:bg-surface-container-low border border-surface-variant hover:border-secondary/30 transition-all group shadow-sm hover:shadow-md">
                     <div className="w-11 h-11 rounded-xl bg-surface-container-high text-polar-midnight-deep flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                       <Globe2 className="w-5 h-5" />
                     </div>
                     <div className="flex flex-col gap-1 pt-0.5">
                       <span className="font-label-md font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">Mission Control</span>
                       <span className="font-body-sm text-sm text-on-surface-variant leading-tight">Explore structured expedition logs & data</span>
                     </div>
                  </Link>
                </div>
              </div>

              {/* Pending Reviews Table */}
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                   <h2 className="font-label-md text-sm font-bold text-polar-midnight-deep uppercase tracking-widest flex items-center gap-2">
                     <Shield className="w-4 h-4 text-draft-amber-text" /> Editorial Queue
                   </h2>
                   <Link to="/admin/review" className="text-secondary font-label-sm text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
                 </div>
                 
                 <div className="bg-pure-white rounded-2xl border border-surface-variant shadow-sm overflow-hidden">
                    {pendingReviews.length === 0 ? (
                      <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
                        <CheckCircle2 className="w-10 h-10 text-aurora-emerald opacity-40" />
                        <span className="text-on-surface-variant font-label-sm uppercase tracking-widest font-bold">Queue Empty — All Reviewed</span>
                      </div>
                    ) : (
                      <div className="divide-y divide-surface-variant">
                        {pendingReviews.slice(0, 4).map(draft => (
                          <div key={draft.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low/50 transition-colors group">
                            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                               <div className="flex flex-wrap items-center gap-2">
                                 <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider text-draft-amber-text border border-draft-amber-border/40 px-2 py-0.5 rounded bg-draft-amber-bg/30">Pending</span>
                                 <span className="font-code-sm text-[10px] text-outline uppercase">{draft.id}</span>
                                 <span className="hidden sm:inline font-code-sm text-[10px] text-outline ml-auto">{new Date(draft.createdAt).toLocaleDateString()}</span>
                               </div>
                               <span className="font-title-md text-base font-bold text-polar-midnight-deep truncate group-hover:text-secondary transition-colors">{draft.outputType}</span>
                               <span className="font-body-sm text-sm text-on-surface-variant truncate">Target: {draft.audience} • Source: {draft.sourceIds[0]}</span>
                            </div>
                            <Link to="/admin/review" className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-polar-midnight-deep text-pure-white font-label-sm text-xs font-bold uppercase tracking-wider hover:bg-polar-navy-surface transition-all shadow-sm text-center">
                               Review Draft
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
                 <h2 className="font-label-md text-sm font-bold text-polar-midnight-deep uppercase tracking-widest flex items-center gap-2">
                   <Clock className="w-4 h-4 text-secondary" /> Recent Activity
                 </h2>
                 <div className="bg-pure-white rounded-2xl border border-surface-variant shadow-sm p-5">
                   {activities.length === 0 ? (
                      <div className="text-center text-on-surface-variant font-body-sm py-6">Repository activity will appear here.</div>
                   ) : (
                     <div className="flex flex-col gap-0">
                        {activities.map((act, i) => (
                          <div key={`${act.id}-${i}`} className="flex gap-4 relative">
                            {/* Timeline connector */}
                            {i < activities.length - 1 && (
                              <div className="absolute left-[9px] top-6 bottom-0 w-px bg-surface-variant"></div>
                            )}
                            {/* Timeline dot */}
                            <div className="w-[18px] h-[18px] rounded-full shrink-0 mt-0.5 border-2 relative z-10 border-secondary bg-surface-container"></div>
                            <div className="flex flex-col gap-0.5 min-w-0 pb-5">
                               <span className="font-label-sm text-sm font-bold text-polar-midnight-deep leading-tight">{act.title}</span>
                               <span className="font-body-sm text-sm text-on-surface-variant truncate leading-tight">{act.description}</span>
                               <span className="font-code-sm text-[10px] text-outline uppercase tracking-wider mt-1">{new Date(act.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                     </div>
                   )}
                 </div>
              </div>

              {/* System Status */}
              <div className="flex flex-col gap-4">
                 <h2 className="font-label-md text-sm font-bold text-polar-midnight-deep uppercase tracking-widest flex items-center gap-2">
                   <Activity className="w-4 h-4 text-aurora-emerald" /> System Status
                 </h2>
                 <div className="bg-pure-white rounded-2xl border border-surface-variant shadow-sm divide-y divide-surface-variant overflow-hidden">
                    <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                           <Database className="w-4 h-4 text-secondary" />
                         </div>
                         <span className="font-label-sm text-sm font-bold text-polar-midnight-deep">Repository Database</span>
                      </div>
                      <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant border border-surface-variant">Demo Mode</span>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-aurora-emerald/10 flex items-center justify-center">
                           <Activity className="w-4 h-4 text-aurora-emerald" />
                         </div>
                         <span className="font-label-sm text-sm font-bold text-polar-midnight-deep">Source-Grounded AI</span>
                      </div>
                      <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant border border-surface-variant">Demo Mode</span>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                           <Globe2 className="w-4 h-4 text-secondary" />
                         </div>
                         <span className="font-label-sm text-sm font-bold text-polar-midnight-deep">Indexing Engine</span>
                      </div>
                      <span className="font-code-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant border border-surface-variant">Prototype</span>
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
