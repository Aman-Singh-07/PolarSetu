import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-deep-ocean text-white border-t border-white/10 mt-auto">
      <div className="container-standard py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent rounded-sm">
              <img
                alt="AICYGRAM Logo"
                className="h-6 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                src="/Aicygram.svg"
              />
              <span className="font-gluon text-[18px] tracking-[0.1em] font-medium text-white opacity-90 group-hover:opacity-100 transition-opacity ml-0.5">
                AICYGRAM
              </span>
            </Link>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <p className="hidden md:block text-[13px] text-white/50 font-medium">
              India’s Polar Science Knowledge Platform
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/explore" className="text-[13px] font-semibold text-ice-blue/80 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent rounded-sm">Research</Link>
            <Link to="/expeditions" className="text-[13px] font-semibold text-ice-blue/80 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent rounded-sm">Expeditions</Link>
            <Link to="/media" className="text-[13px] font-semibold text-ice-blue/80 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent rounded-sm">Media</Link>
            <Link to="/ai" className="text-[13px] font-semibold text-ice-blue/80 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent rounded-sm flex items-center gap-1">
              <span className="text-cyan-accent/80 text-[10px]">✧</span> Ask AI
            </Link>
            <div className="hidden sm:block w-px h-3 bg-white/20" />
            <Link to="/login" className="text-[12px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent rounded-sm">Admin</Link>
          </nav>

        </div>

        {/* BOTTOM: Legal */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/40">
            © 2026 Aicygram. Prototype Demonstration Platform.
          </p>
          <p className="text-[12px] text-white/40">
            AI outputs require human editorial review.
          </p>
        </div>
      </div>
    </footer>
  );
}
