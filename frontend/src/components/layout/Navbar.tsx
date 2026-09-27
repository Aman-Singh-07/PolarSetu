import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Sparkles, Beaker } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore' },
    { path: '/expeditions', label: 'Expeditions' },
    { path: '/media', label: 'Media' },
    { path: '/map', label: 'Polar Map' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-pure-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-4 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-max">
          <Link to="/" className="flex items-center gap-2">
            <img
              alt="POLARSETU Emblem"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VXEr7AYLMmREImv4E52a7As9vSLcuPX2Tah0iKkNYpSXL-ZTRjw1tNmKkosj2FukeZj9LfB1KWGXuN-m1-MGKfRV6CkwD91Ufankky5MozJscRQ_7jMgBamSM7flV83WTRa8EwqmSG-PTLCeYe_96jRnhjagkkbl8PRO2Z8XF5RJlPUJrS0QAu0qZqx6bhG3wpA05rHjshP9RxV9o8N1MlnxYOPHjQnZ_hHTLWztoyBvyZuOTRw1g29_Gu"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-polar-midnight-deep">POLARSETU</span>
                <span className="px-1 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm uppercase tracking-wider">SIH26063 Prototype</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">India's Polar Science Knowledge & Outreach Platform</span>
            </div>
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-4">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'transition-colors font-body-sm text-body-sm px-2 py-1 rounded-lg',
                location.pathname === link.path
                  ? 'text-secondary font-semibold bg-surface-container-low'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 min-w-max">
          <Link to="/ai" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-polar-midnight-deep text-on-primary font-label-md text-label-md hover:bg-polar-navy-surface transition-all">
            <Sparkles className="w-4 h-4 text-glacial-sky" />
            <span>Ask Polar AI</span>
          </Link>
          <Link to="/outreach" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low text-secondary font-label-md text-label-md hover:bg-surface-container hover:text-on-secondary-container transition-all">
            <Beaker className="w-4 h-4" />
            <span>Outreach Studio</span>
          </Link>
          <Link to="/admin" className="hidden sm:inline-flex items-center px-2 py-2 rounded-lg text-on-surface-variant font-label-md text-label-md hover:text-on-surface hover:bg-surface-container-low transition-all">
            Institutional Admin
          </Link>
          <div className="w-8 h-8 rounded-full bg-polar-midnight-deep flex items-center justify-center text-on-primary font-label-sm text-label-sm font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
