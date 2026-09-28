import { Link } from 'react-router-dom';
import { Shield, BadgeCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-polar-midnight-deep text-ice-white pt-10 pb-6">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto flex flex-col gap-10">
        
        <div className="p-4 rounded-lg bg-draft-amber-bg text-draft-amber-text flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Shield className="w-5 h-5 text-draft-amber-border" />
            <span className="font-label-md text-label-md font-semibold tracking-wide uppercase">FAIR Data & Provenance Notice</span>
          </div>
          <p className="font-body-sm text-body-sm">All scientific outputs remain under institutional provenance. AI tools provide grounded drafts requiring human editorial sign-off.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-bold text-pure-white">POLARSETU</span>
              <span className="px-1.5 py-0.5 rounded bg-polar-navy-surface text-glacial-sky font-code-sm text-code-sm uppercase">MoES / NCPOR</span>
            </div>
            <p className="font-body-sm text-body-sm text-inverse-primary max-w-md">
              Official digital outreach and polar cryospheric knowledge infrastructure under the Ministry of Earth Sciences (MoES), Government of India, and the National Centre for Polar and Ocean Research (NCPOR), Vasco da Gama, Goa.
            </p>
            <p className="font-label-sm text-label-sm text-outline-variant mt-2">
              Coordinating Indian research operations in Antarctica, the Arctic, and the Himalayas.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md font-semibold text-glacial-sky uppercase tracking-wider mb-2">Polar Stations</span>
            <Link to="/expeditions" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Maitri Station (Antarctica)</Link>
            <Link to="/expeditions" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Bharati Station (Antarctica)</Link>
            <Link to="/expeditions" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Himadri (Ny-Ålesund, Arctic)</Link>
            <Link to="/expeditions" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Himansh (Spiti, Himalaya)</Link>
            <Link to="/expeditions" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">IndARC Mooring System</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md font-semibold text-glacial-sky uppercase tracking-wider mb-2">Programmes</span>
            <Link to="/explore" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Indian Antarctic Programme</Link>
            <Link to="/explore" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Arctic Observation Network</Link>
            <Link to="/explore" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Cryosphere & Climate Hub</Link>
            <Link to="/explore" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Open Repositories & DOI Data</Link>
            <Link to="/admin/review" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Editorial Review Queue</Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md font-semibold text-glacial-sky uppercase tracking-wider mb-2">Quick Navigation</span>
            <Link to="/" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">About PolarSetu</Link>
            <Link to="/expeditions" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Expedition Archives</Link>
            <Link to="/explore" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Datasets & Catalogs</Link>
            <Link to="/outreach" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Outreach Studio</Link>
            <Link to="/admin" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Public API & Standards</Link>
            <Link to="/" className="font-body-sm text-body-sm text-inverse-on-surface hover:text-glacial-sky transition-colors">Data Policy & Privacy</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-outline-variant font-label-sm text-label-sm border-t border-white/10">
          <p>© 2026 PolarSetu • Ministry of Earth Sciences (MoES), Govt. of India & NCPOR.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-aurora-emerald">
              <BadgeCheck className="w-4 h-4" /> NCPOR Provenance Verified
            </span>
            <span>ISO/TC 211 & FAIR Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
