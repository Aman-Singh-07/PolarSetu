import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-deep-ocean text-white/90 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <img
                alt="POLARSETU"
                className="h-5 w-auto object-contain brightness-0 invert"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VXEr7AYLMmREImv4E52a7As9vSLcuPX2Tah0iKkNYpSXL-ZTRjw1tNmKkosj2FukeZj9LfB1KWGXuN-m1-MGKfRV6CkwD91Ufankky5MozJscRQ_7jMgBamSM7flV83WTRa8EwqmSG-PTLCeYe_96jRnhjagkkbl8PRO2Z8XF5RJlPUJrS0QAu0qZqx6bhG3wpA05rHjshP9RxV9o8N1MlnxYOPHjQnZ_hHTLWztoyBvyZuOTRw1g29_Gu"
              />
              <span className="font-display text-base font-bold text-white tracking-wide">POLARSETU</span>
            </div>
            <p className="text-[13px] text-white/60">
              Polar Science Knowledge & Outreach Platform
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/explore" className="text-[13px] text-ice-blue/70 hover:text-white transition-colors">Research</Link>
            <Link to="/expeditions" className="text-[13px] text-ice-blue/70 hover:text-white transition-colors">Expeditions</Link>
            <Link to="/media" className="text-[13px] text-ice-blue/70 hover:text-white transition-colors">Media</Link>
            <Link to="/map" className="text-[13px] text-ice-blue/70 hover:text-white transition-colors">Map</Link>
            <Link to="/login" className="text-[13px] text-ice-blue/70 hover:text-white transition-colors">Admin Sign In</Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/40 tracking-wide">© 2026 PolarSetu Prototype</p>
          <p className="text-[11px] text-white/40 tracking-wide">
            AI outputs require human editorial review.
          </p>
        </div>
      </div>
    </footer>
  );
}
