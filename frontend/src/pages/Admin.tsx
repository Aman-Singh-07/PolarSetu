import { Link } from 'react-router-dom';
import { Database, FileUp, CheckCircle2, Search, PieChart, ArrowRight } from 'lucide-react';

export default function Admin() {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Institutional Governance</span>
          <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Admin Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage repository content, outreach approvals, and system telemetry.</p>
        </div>
      </section>

      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Resources', value: '6', icon: Database, highlight: false },
              { label: 'Pending Reviews', value: '2', icon: CheckCircle2, highlight: true },
              { label: 'Expeditions Indexed', value: '5', icon: Search, highlight: false },
              { label: 'AI Queries (30 Days)', value: '—', icon: PieChart, highlight: false },
            ].map(stat => (
              <div key={stat.label} className={`bg-pure-white p-6 rounded-xl shadow-sm ${stat.highlight ? 'ring-2 ring-draft-amber-border' : ''}`}>
                <stat.icon className={`w-8 h-8 mb-4 ${stat.highlight ? 'text-draft-amber-border' : 'text-secondary'}`} />
                <div className="font-headline-md text-headline-md font-bold text-polar-midnight-deep mb-1">{stat.value}</div>
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{stat.label}</div>
                <div className="font-code-sm text-[10px] text-outline mt-1">Verified</div>
              </div>
            ))}
          </div>

          {/* Quick Actions & Recent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pure-white rounded-xl p-6 shadow-sm">
              <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <Link to="/admin/upload" className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-secondary text-pure-white flex items-center justify-center shrink-0">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-title-md text-title-md font-semibold text-polar-midnight-deep group-hover:text-secondary transition-colors">Ingest New Resource</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Upload reports, datasets, or media files.</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-outline group-hover:text-secondary transition-colors" />
                </Link>
                <Link to="/admin/review" className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-draft-amber-border text-pure-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-title-md text-title-md font-semibold text-polar-midnight-deep group-hover:text-secondary transition-colors">Review Outreach Drafts</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">4 pending items require approval.</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-outline group-hover:text-secondary transition-colors" />
                </Link>
              </div>
            </div>

            <div className="bg-pure-white rounded-xl p-6 shadow-sm">
              <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep mb-4">Recent Ingestions</h2>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Sea Ice Thickness Dataset — Prydz Bay', time: '2 hours ago' },
                  { title: 'Atmospheric Trace Gas Report — Himadri', time: '6 hours ago' },
                  { title: 'Glacier Bed Topography Survey — Maitri', time: '1 day ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-surface-container-low last:border-0 pb-4 last:pb-0">
                    <div>
                      <div className="font-title-md text-title-md font-medium text-polar-midnight-deep">{item.title}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Uploaded by Admin • {item.time}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold uppercase">Indexed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
