import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Navigation, FileCheck, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Resource, Expedition, OutreachDraft, Activity as ActivityType } from '../types';
import { Button } from '../components/ui/Button';

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [resources, setResources] = useState<Resource[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [drafts, setDrafts] = useState<OutreachDraft[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  
  // Error states to localize failures
  const [metricsError, setMetricsError] = useState(false);
  const [activityError, setActivityError] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchDashboardData = async () => {
      try {
        const [r, e, d] = await Promise.all([
          api.getResources().catch(() => { setMetricsError(true); return []; }),
          api.getExpeditions().catch(() => { setMetricsError(true); return []; }),
          api.getReviewQueue().catch(() => { setMetricsError(true); return []; })
        ]);
        if (mounted) {
          setResources(r);
          setExpeditions(e);
          setDrafts(d);
        }
      } catch (err) {
        if (mounted) setMetricsError(true);
      }

      try {
        const a = await api.getActivities();
        if (mounted) setActivities(a || []);
      } catch (err) {
        if (mounted) setActivityError(true);
      }

      if (mounted) setLoading(false);
    };
    
    fetchDashboardData();
    return () => { mounted = false; };
  }, []);

  const pending = drafts.filter(d => d.status !== 'APPROVED' && d.status !== 'PUBLISHED');

  if (loading) return (
    <div className="flex items-center justify-center min-h-full bg-deep-ocean p-12">
      <div className="flex flex-col gap-6 w-full max-w-[1200px]">
        <div className="w-[30%] h-12 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-full pb-12">
      
      {/* ─── DASHBOARD HEADER ─── */}
      <section className="w-full px-4 lg:px-8 pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-2">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">ADMIN / DASHBOARD</span>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Repository Operations
          </h1>
          <p className="text-[14px] text-white/60 font-medium max-w-2xl">
            Monitor and manage the scientific knowledge base, field expeditions, and outreach communications.
          </p>
        </div>
      </section>

      {/* ─── METRICS GRID ─── */}
      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-[1200px] mx-auto">
          {metricsError && (
             <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error text-[13px] font-bold">
               <AlertTriangle className="w-4 h-4 shrink-0" />
               Some operational metrics could not be loaded from the database.
             </div>
          )}
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Total Resources', value: resources.length, icon: Database, bg: 'bg-white/5', color: 'text-white' },
              { label: 'Active Expeditions', value: expeditions.length, icon: Navigation, bg: 'bg-white/5', color: 'text-white' },
              { label: 'Pending Review', value: pending.length, icon: FileCheck, bg: pending.length > 0 ? 'bg-amber-warn/10 border-amber-warn/20 text-amber-warn' : 'bg-white/5', color: pending.length > 0 ? 'text-amber-warn' : 'text-white', link: '/admin/review' },
              { label: 'Outreach Drafts', value: drafts.length, icon: FileText, bg: 'bg-white/5', color: 'text-white' },
            ].map(m => {
              const content = (
                <div className={`rounded-[12px] p-6 border ${m.bg.includes('border') ? m.bg : 'border-white/10 bg-deep-blue'} shadow-sm flex flex-col gap-4 h-full`}>
                  <div className="flex items-center justify-between">
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <div>
                    <p className={`font-display text-3xl font-extrabold leading-none mb-1 ${m.color}`}>{m.value}</p>
                    <p className="text-[12px] text-white/50 uppercase tracking-[0.05em] font-bold">{m.label}</p>
                  </div>
                </div>
              );
              
              return m.link ? (
                <Link key={m.label} to={m.link} className="block group hover:-translate-y-0.5 transition-transform">
                  {content}
                </Link>
              ) : (
                <div key={m.label}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WORKSPACE PANELS ─── */}
      <section className="w-full px-4 lg:px-8 flex-1">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Actions & Queue) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/upload" className="bg-ocean-navy rounded-[12px] p-6 border border-white/10 hover:bg-white/5 transition-colors flex flex-col gap-2 relative group">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-white/70" />
                  <p className="text-[15px] font-bold text-white flex items-center gap-2">
                    Upload Resource
                  </p>
                </div>
                <p className="text-[13px] text-white/50 font-medium">Inject new scientific data into the main repository.</p>
                <ArrowRight className="w-4 h-4 text-white/30 absolute right-6 top-1/2 -translate-y-1/2 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              
              <Link to="/admin/review" className="bg-ocean-navy rounded-[12px] p-6 border border-white/10 hover:bg-white/5 transition-colors flex flex-col gap-2 relative group">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-white/70" />
                  <p className="text-[15px] font-bold text-white flex items-center gap-2">
                    Review Queue
                  </p>
                </div>
                <p className="text-[13px] text-white/50 font-medium">{pending.length} AI-generated drafts await editorial approval.</p>
                <ArrowRight className="w-4 h-4 text-white/30 absolute right-6 top-1/2 -translate-y-1/2 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            {/* Editorial Queue List */}
            <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-white flex items-center gap-2">
                  Editorial Queue
                </h2>
                {pending.length > 0 && (
                  <Link to="/admin/review" className="text-[11px] font-bold text-cyan-accent uppercase tracking-[0.1em] hover:text-white transition-colors">View All</Link>
                )}
              </div>
              
              {pending.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
                  <FileCheck className="w-6 h-6 text-white/20" />
                  <p className="text-[14px] text-white/50 font-medium">Queue is completely empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5 flex flex-col">
                  {pending.slice(0, 5).map(d => (
                    <div key={d.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[14px] text-white font-bold">
                          {d.outputType.replace('_', ' ')}
                        </p>
                        <p className="text-[11px] text-white/50 font-medium">
                          Source Ref: {d.sourceIds[0]}
                        </p>
                      </div>
                      <Button variant="secondary" onClick={() => navigate('/admin/review')} className="!border-white/20 !text-white hover:!bg-white/10 !h-8 !px-4 !text-[12px]">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Activity Feed) */}
          <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-[14px] font-bold text-white flex items-center gap-2">
                Recent Activity
              </h2>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {activityError ? (
                <div className="flex flex-col gap-2 items-center justify-center h-full text-center p-4">
                  <AlertTriangle className="w-5 h-5 text-error/70" />
                  <p className="text-[12px] text-error/70 font-medium">Recent activity could not be loaded.</p>
                  <button onClick={() => window.location.reload()} className="text-[11px] text-white/40 hover:text-white underline mt-2">Retry</button>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center text-white/50 text-[13px] py-12 font-medium">
                  <p>No recent activity.</p>
                  <p className="text-[11px] mt-1 text-white/30">Repository activity will appear here as records are added.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 relative before:absolute before:inset-y-0 before:left-[5px] before:w-[2px] before:bg-white/5">
                  {activities.map((a, i) => (
                    <div key={`${a.id}-${i}`} className="flex gap-4 relative">
                      <div className="w-[12px] h-[12px] rounded-full bg-deep-ocean border-2 border-white/20 mt-0.5 shrink-0 z-10" />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] text-white font-bold leading-tight">{a.title}</p>
                          <span className="text-[10px] text-white/40 shrink-0 mt-0.5">{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        {a.description && <p className="text-[12px] text-white/60 leading-relaxed font-medium">{a.description}</p>}
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
  );
}
