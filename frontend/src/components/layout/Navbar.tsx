import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Sparkles, Beaker, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore' },
    { path: '/expeditions', label: 'Expeditions' },
    { path: '/media', label: 'Media' },
    { path: '/map', label: 'Polar Map' },
  ];

  return (
    <>
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
              <span className="hidden sm:inline">Ask Polar AI</span>
            </Link>
            <Link to="/outreach" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low text-secondary font-label-md text-label-md hover:bg-surface-container hover:text-on-secondary-container transition-all">
              <Beaker className="w-4 h-4" />
              <span>Outreach Studio</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container transition-colors focus:outline-none">
                  <div className="flex flex-col items-end">
                    <span className="font-label-sm text-label-sm font-bold text-polar-midnight-deep">Admin.Dr.Rao</span>
                    <span className="font-code-sm text-[10px] text-on-surface-variant uppercase tracking-wider">MoES Director</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-polar-midnight-deep text-pure-white flex items-center justify-center font-title-md font-bold shadow-sm">
                    DR
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-0 w-48 bg-pure-white rounded-xl shadow-xl border border-surface-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-50">
                   <Link to="/admin" className="px-3 py-2 text-label-sm font-label-md hover:bg-surface-container-low rounded-lg text-on-surface transition-colors">Dashboard</Link>
                   <Link to="/admin/upload" className="px-3 py-2 text-label-sm font-label-md hover:bg-surface-container-low rounded-lg text-on-surface transition-colors">Ingest Resource</Link>
                   <Link to="/admin/review" className="px-3 py-2 text-label-sm font-label-md hover:bg-surface-container-low rounded-lg text-on-surface transition-colors mb-2">Review Queue</Link>
                   <div className="h-px bg-surface-variant mx-2 my-1"></div>
                   <button onClick={handleLogout} className="px-3 py-2 text-label-sm font-label-md text-left text-draft-amber-text hover:bg-draft-amber-bg rounded-lg transition-colors mt-1 font-bold">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:inline-flex items-center px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md hover:text-on-surface hover:bg-surface-container-high transition-all">
                Sign In
              </Link>
            )}

            {/* Mobile hamburger button */}
            <button
              className="xl:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-on-surface" /> : <Menu className="w-5 h-5 text-on-surface" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-polar-midnight-deep/30 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile menu panel */}
      <div
        className={clsx(
          'fixed top-20 right-0 bottom-0 w-72 z-50 bg-pure-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out xl:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-2 px-3">Navigation</span>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'px-3 py-2.5 rounded-lg font-label-md text-label-md transition-colors',
                location.pathname === link.path
                  ? 'text-secondary font-semibold bg-surface-container-low'
                  : 'text-on-surface hover:bg-surface-container-low hover:text-secondary'
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-slate-border my-3" />
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-2 px-3">Tools</span>

          <Link to="/ai" className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-polar-midnight-deep text-on-primary font-label-md text-label-md hover:bg-polar-navy-surface transition-colors">
            <Sparkles className="w-4 h-4 text-glacial-sky" />
            Ask Polar AI
          </Link>
          <Link to="/outreach" className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-container-low text-secondary font-label-md text-label-md hover:bg-surface-container transition-colors">
            <Beaker className="w-4 h-4" />
            Outreach Studio
          </Link>

          <div className="h-px bg-slate-border my-3" />
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-2 px-3">Admin</span>

          <Link to="/admin" className="px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low hover:text-on-surface transition-colors">
            Dashboard
          </Link>
          <Link to="/admin/upload" className="px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low hover:text-on-surface transition-colors">
            Ingest Resource
          </Link>
          <Link to="/admin/review" className="px-3 py-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low hover:text-on-surface transition-colors">
            Review Queue
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-border">
          <span className="font-code-sm text-code-sm text-outline">MoES / NCPOR</span>
        </div>
      </div>
    </>
  );
}
