import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Globe2, Activity, Database, Navigation, FileCheck, FileText, ArrowRight } from 'lucide-react';
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
    if (!auth.isAuthenticated()) { navigate('/login'); return; }
    Promise.all([api.getResources(), api.getExpeditions(), api.getReviewQueue(), api.getActivities()])
      .then(([r, e, d, a]) => { setResources(r); setExpeditions(e); setDrafts(d); setActivities(a || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSignOut = () => { auth.clearToken(); navigate('/login'); window.location.reload(); };

  const pending = drafts.filter(d => d.status !== 'APPROVED' && d.status !== 'PUBLISHED');

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)] bg-snow">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-border-ice border-t-cyan-accent animate-spin" />
        <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">Initializing Workspace...</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow relative overflow-hidden">
      {/* ─── CINEMATIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-snow to-frost opacity-80" />
      </div>

      <div className="relative z-10 w-full flex flex-col flex-1">
        {/* ─── HEADER ─── */}
        <section className="w-full border-b border-border-ice pt-10 pb-8 px-4 lg:px-8 bg-white/60 backdrop-blur-md">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 w-fit">
                <Activity className="w-4 h-4 text-cyan-accent" />
                <span className="text-[10px] font-bold text-deep-ocean uppercase tracking-[0.2em]">Live System Operations</span>
              </div>
              <h1 className="font-display text-4xl font-extrabold text-deep-ocean tracking-tight">Command Dashboard</h1>
              <p className="text-[15px] text-muted font-medium">Manage repository data, expeditions, and approve AI outreach drafts.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-bold text-deep-ocean bg-white hover:bg-frost border border-border-ice transition-colors shadow-sm hover:shadow-md">
                <Globe2 className="w-4 h-4" /> Public Site
              </Link>
              <button onClick={handleSignOut} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-bold text-error bg-white hover:bg-error hover:text-white border border-border-ice hover:border-error transition-all shadow-sm hover:shadow-md group">
                <LogOut className="w-4 h-4 group-hover:text-white transition-colors" /> Sign Out
              </button>
            </div>
          </div>
        </section>

        {/* ─── METRICS GRID ─── */}
        <section className="w-full px-4 lg:px-8 pt-10 pb-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Data Resources', value: resources.length, icon: Database, color: 'text-cyan-accent', bg: 'bg-cyan-accent/10' },
              { label: 'Active Expeditions', value: expeditions.length, icon: Navigation, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
              { label: 'Pending Review', value: pending.length, icon: FileCheck, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
              { label: 'Total Outreach', value: drafts.length, icon: FileText, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
            ].map(m => (
              <div key={m.label} className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 border border-white shadow-[0_8px_30px_rgba(7,20,38,0.04)] hover:shadow-[0_16px_40px_rgba(7,20,38,0.08)] transition-shadow flex flex-col gap-5 relative overflow-hidden group">
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity ${m.bg}`} />
                <div className="flex items-center justify-between relative z-10">
                  <div className={`w-12 h-12 rounded-[14px] ${m.bg} flex items-center justify-center border border-white`}>
                    <m.icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="font-display text-4xl font-extrabold text-deep-ocean leading-none mb-2">{m.value}</p>
                  <p className="text-[11px] text-muted uppercase tracking-[0.1em] font-bold">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── WORKSPACE PANELS ─── */}
        <section className="w-full px-4 lg:px-8 pb-12 flex-1">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Actions & Queue) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/admin/upload" className="bg-white rounded-[24px] p-8 border border-white hover:border-cyan-accent/30 transition-all duration-300 group shadow-[0_8px_30px_rgba(7,20,38,0.04)] hover:shadow-[0_12px_40px_rgba(56,189,248,0.12)] flex flex-col gap-3 relative overflow-hidden hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-full bg-frost flex items-center justify-center mb-1 group-hover:bg-cyan-accent/10 transition-colors">
                    <Database className="w-6 h-6 text-muted group-hover:text-cyan-accent transition-colors" />
                  </div>
                  <p className="text-xl font-bold text-deep-ocean group-hover:text-cyan-accent transition-colors flex items-center gap-2">
                    Upload Resource <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </p>
                  <p className="text-[14px] text-muted font-medium">Inject new scientific data into the main repository.</p>
                </Link>
                
                <Link to="/admin/review" className="bg-white rounded-[24px] p-8 border border-white hover:border-[#F59E0B]/30 transition-all duration-300 group shadow-[0_8px_30px_rgba(7,20,38,0.04)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.12)] flex flex-col gap-3 relative overflow-hidden hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-full bg-amber-bg/50 flex items-center justify-center mb-1 group-hover:bg-[#F59E0B]/10 transition-colors">
                    <FileCheck className="w-6 h-6 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xl font-bold text-deep-ocean group-hover:text-[#F59E0B] transition-colors flex items-center gap-2">
                    Review Queue <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </p>
                  <p className="text-[14px] text-muted font-medium">{pending.length} AI-generated drafts await editorial approval.</p>
                </Link>
              </div>

              {/* Editorial Queue List */}
              <div className="bg-white rounded-[24px] border border-border-ice shadow-[0_8px_30px_rgba(7,20,38,0.04)] overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-border-ice flex items-center justify-between bg-frost/50">
                  <h2 className="text-[15px] font-bold text-deep-ocean flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-accent" /> Editorial Queue
                  </h2>
                  <Link to="/admin/review" className="text-[11px] font-bold text-cyan-accent uppercase tracking-[0.1em] hover:text-deep-ocean transition-colors bg-white px-3 py-1.5 rounded-lg border border-border-ice shadow-sm hover:shadow-md">View Full Queue</Link>
                </div>
                
                {pending.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
                    <div className="w-16 h-16 rounded-full bg-frost flex items-center justify-center border border-border-ice">
                      <FileCheck className="w-7 h-7 text-muted/50" />
                    </div>
                    <p className="text-[15px] text-muted font-medium">Queue is completely empty.<br/>All drafts have been reviewed.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-ice flex flex-col bg-white">
                    {pending.slice(0, 5).map(d => (
                      <div key={d.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-frost transition-colors group">
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[16px] text-deep-ocean font-bold group-hover:text-cyan-accent transition-colors">
                            {d.outputType.replace('_', ' ')}
                          </p>
                          <p className="text-[11px] text-muted uppercase tracking-[0.1em] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-warn" /> Source Ref: {d.sourceIds[0]}
                          </p>
                        </div>
                        <Link to="/admin/review" className="px-5 py-2.5 rounded-[10px] text-[13px] font-bold text-deep-ocean bg-ice-blue hover:bg-cyan-accent hover:text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center">
                          Review Draft
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Activity Feed) */}
            <div className="bg-white rounded-[24px] border border-border-ice shadow-[0_8px_30px_rgba(7,20,38,0.04)] overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-border-ice bg-frost/50">
                <h2 className="text-[15px] font-bold text-deep-ocean flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#10B981]" /> System Activity
                </h2>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto bg-white">
                {activities.length === 0 ? (
                  <div className="text-center text-muted text-sm py-12 font-medium">No recent activity</div>
                ) : (
                  <div className="flex flex-col gap-6 relative before:absolute before:inset-y-0 before:left-[5px] before:w-[2px] before:bg-border-ice">
                    {activities.map((a, i) => (
                      <div key={`${a.id}-${i}`} className="flex gap-4 relative group">
                        <div className="w-3 h-3 rounded-full bg-white border-[2px] border-cyan-accent mt-1 shrink-0 z-10 group-hover:bg-cyan-accent transition-colors shadow-[0_0_0_4px_white]" />
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[14px] text-deep-ocean font-bold leading-tight">{a.title}</p>
                          <p className="text-[13px] text-muted leading-relaxed font-medium">{a.description}</p>
                          <p className="text-[10px] text-subtle uppercase tracking-[0.1em] font-bold mt-1">
                            {new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
