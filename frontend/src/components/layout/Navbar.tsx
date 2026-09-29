import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { auth } from '../../services/auth';

const PUBLIC_LINKS = [
  { path: '/',             label: 'Discover' },
  { path: '/explore',      label: 'Research' },
  { path: '/expeditions',  label: 'Expeditions' },
  { path: '/media',        label: 'Media' },
  { path: '/map',          label: 'Map' },
  { path: '/ai',           label: 'Ask AI' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => { setIsAuth(auth.isAuthenticated()); }, [location.pathname]);
  useEffect(() => { setMobileOpen(false); setAdminOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close mobile on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); setAdminOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    auth.clearToken();
    setIsAuth(false);
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#F8FBFD]/90 backdrop-blur-[12px] border-b border-border-ice/80 transition-all">
        <div className="h-[72px] w-full max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="POLARSETU Home">
            <img
              alt="POLARSETU"
              className="h-7 w-auto object-contain group-hover:opacity-90 transition-opacity"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VXEr7AYLMmREImv4E52a7As9vSLcuPX2Tah0iKkNYpSXL-ZTRjw1tNmKkosj2FukeZj9LfB1KWGXuN-m1-MGKfRV6CkwD91Ufankky5MozJscRQ_7jMgBamSM7flV83WTRa8EwqmSG-PTLCeYe_96jRnhjagkkbl8PRO2Z8XF5RJlPUJrS0QAu0qZqx6bhG3wpA05rHjshP9RxV9o8N1MlnxYOPHjQnZ_hHTLWztoyBvyZuOTRw1g29_Gu"
            />
            <span className="font-display text-lg font-bold tracking-tight text-deep-ocean group-hover:text-cyan-accent transition-colors">POLARSETU</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main navigation">
            {PUBLIC_LINKS.map(link => {
              const isAi = link.path === '/ai';
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'relative px-1 py-2 mx-3 font-sans text-[14px] transition-all duration-300',
                    isActive(link.path)
                      ? 'text-deep-ocean font-bold'
                      : isAi ? 'text-glacial-blue font-semibold hover:text-cyan-accent' : 'text-muted font-medium hover:text-deep-ocean'
                  )}
                >
                  {isActive(link.path) && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-deep-ocean rounded-full" />}
                  {isAi && <span className="inline-block mr-1.5 opacity-80 text-cyan-accent">✧</span>}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuth ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setAdminOpen(prev => !prev)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-frost transition-colors"
                  aria-expanded={adminOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-full bg-deep-ocean text-white flex items-center justify-center text-xs font-bold">A</div>
                  <span className="text-sm font-medium text-deep-ocean">Admin</span>
                </button>
                {adminOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAdminOpen(false)} />
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-xl rounded-[16px] shadow-[0_16px_40px_rgba(7,20,38,0.12)] border border-border-ice flex flex-col p-2 z-50 animate-fade-up">
                      <Link to="/admin" onClick={() => setAdminOpen(false)} className="px-3 py-2 text-[13px] font-bold rounded-lg hover:bg-frost text-deep-ocean transition-colors">Dashboard</Link>
                      <Link to="/admin/upload" onClick={() => setAdminOpen(false)} className="px-3 py-2 text-[13px] font-medium rounded-lg hover:bg-frost text-ink transition-colors">Upload</Link>
                      <Link to="/admin/review" onClick={() => setAdminOpen(false)} className="px-3 py-2 text-[13px] font-medium rounded-lg hover:bg-frost text-ink transition-colors">Review</Link>
                      <div className="h-px bg-border-ice/60 mx-2 my-1.5" />
                      <button onClick={() => { setAdminOpen(false); handleLogout(); }} className="px-3 py-2 text-[13px] font-bold text-left text-error hover:text-white rounded-lg hover:bg-error transition-colors">Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden lg:inline-flex px-4 py-1.5 rounded-md text-sm font-medium text-muted hover:text-deep-ocean hover:bg-frost transition-colors">
                Sign In
              </Link>
            )}

            <button
              className="lg:hidden p-2 rounded-md hover:bg-frost transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-deep-ocean/20 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={clsx(
          'fixed top-16 right-0 bottom-0 w-72 z-50 bg-white shadow-elevated flex flex-col transform transition-transform duration-300 ease-out lg:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
      >
        <nav className="flex flex-col p-4 gap-0.5 flex-1 overflow-y-auto" aria-label="Mobile navigation">
          {PUBLIC_LINKS.map(link => {
            const isAi = link.path === '/ai';
            return (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'text-deep-ocean bg-ice-blue/50 font-semibold'
                    : isAi ? 'text-glacial-blue hover:bg-frost hover:text-deep-ocean' : 'text-muted hover:bg-frost hover:text-deep-ocean'
                )}
              >
                {isAi && <span className="inline-block mr-1.5 opacity-70">✧</span>}
                {link.label}
              </Link>
            );
          })}

          <div className="h-px bg-border-ice my-3" />

          {isAuth ? (
            <>
              <Link to="/admin" className="px-3 py-2.5 rounded-md text-sm text-muted hover:bg-frost hover:text-deep-ocean transition-colors">Dashboard</Link>
              <Link to="/admin/upload" className="px-3 py-2.5 rounded-md text-sm text-muted hover:bg-frost hover:text-deep-ocean transition-colors">Upload</Link>
              <Link to="/admin/review" className="px-3 py-2.5 rounded-md text-sm text-muted hover:bg-frost hover:text-deep-ocean transition-colors">Review</Link>
              <button onClick={handleLogout} className="px-3 py-2.5 rounded-md text-sm text-left text-error hover:bg-red-50 transition-colors mt-1">Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-2.5 rounded-md text-sm font-medium text-muted hover:bg-frost hover:text-deep-ocean transition-colors">Sign In</Link>
          )}
        </nav>
      </div>
    </>
  );
}
