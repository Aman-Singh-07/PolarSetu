import { Link } from 'react-router-dom';
import { Database, FileUp, CheckCircle, Search, PieChart } from 'lucide-react';

export default function Admin() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Institutional Dashboard</h1>
        <p className="text-slate-500">Manage repository content and outreach approvals.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Resources', value: '1,200', icon: Database },
          { label: 'Pending Reviews', value: '4', icon: CheckCircle, highlight: true },
          { label: 'Active Expeditions', value: '45', icon: Search },
          { label: 'Search Queries (30d)', value: '12.4k', icon: PieChart },
        ].map(stat => (
          <div key={stat.label} className={`bg-white border p-6 rounded-xl ${stat.highlight ? 'border-amber-400 shadow-[0_0_15px_-3px_rgba(251,191,36,0.3)]' : 'border-border'}`}>
            <stat.icon className={`w-8 h-8 mb-4 ${stat.highlight ? 'text-amber-500' : 'text-slate-400'}`} />
            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/upload" className="block p-4 rounded-lg border border-slate-200 hover:border-secondary hover:bg-slate-50 transition-colors flex items-center">
              <FileUp className="w-5 h-5 text-secondary mr-3" />
              <div>
                <div className="font-semibold text-sm text-primary">Ingest New Resource</div>
                <div className="text-xs text-slate-500">Upload reports, datasets or media files.</div>
              </div>
            </Link>
            <Link to="/admin/review" className="block p-4 rounded-lg border border-slate-200 hover:border-secondary hover:bg-slate-50 transition-colors flex items-center">
              <CheckCircle className="w-5 h-5 text-amber-500 mr-3" />
              <div>
                <div className="font-semibold text-sm text-primary">Review Outreach Drafts</div>
                <div className="text-xs text-slate-500">4 pending items require approval.</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Recent Ingestions</h2>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                <div>
                  <div className="font-medium text-sm text-primary">Arctic Sea Ice Dataset {i}</div>
                  <div className="text-xs text-slate-500">Uploaded by Admin • 2 hours ago</div>
                </div>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Indexed</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
