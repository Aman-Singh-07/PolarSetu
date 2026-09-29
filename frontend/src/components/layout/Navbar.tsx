import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { auth } from '../../services/auth';
import { Button } from '../ui/Button';

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
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminOpen(false);
      }
    };
    if (adminOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [adminOpen]);

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
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-[12px] border-b border-border-ice transition-all">
        <div className="h-[64px] lg:h-[72px] container-standard flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent rounded-md" aria-label="AICYGRAM Home">
              <img
                alt="AICYGRAM Logo"
                className="h-8 w-auto object-contain group-hover:opacity-90 transition-opacity"
                src="/Aicygram.svg"
              />
              <span className="font-gluon text-[22px] tracking-[0.1em] font-medium text-deep-ocean group-hover:opacity-80 transition-opacity ml-1">
                AICYGRAM
              </span>
            </Link>
          </div>

          {/* CENTER: Desktop Nav */}
          <nav className="hidden lg:flex flex-none items-center justify-center gap-1" aria-label="Main navigation">
            {PUBLIC_LINKS.map(link => {
              const active = isActive(link.path);
              const isAi = link.path === '/ai';
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'px-4 py-2 relative rounded-md font-sans text-[14.5px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent',
                    active
                      ? 'text-deep-ocean font-bold after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[2px] after:bg-deep-ocean after:rounded-full'
                      : isAi ? 'text-glacial-blue font-semibold hover:bg-frost' : 'text-muted font-medium hover:text-deep-ocean hover:bg-frost'
                  )}
                >
                  {isAi && <span className="inline-block mr-1.5 opacity-80 text-cyan-accent">✧</span>}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Auth & Mobile Menu */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {isAuth ? (
              <div className="relative hidden lg:block" ref={adminDropdownRef}>
                <button
                  onClick={() => setAdminOpen(prev => !prev)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-[10px] hover:bg-frost transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent"
                  aria-expanded={adminOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-deep-ocean text-white flex items-center justify-center text-[13px] font-bold">A</div>
                  <span className="text-[14px] font-bold text-deep-ocean">Admin</span>
                </button>
                {adminOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white backdrop-blur-xl rounded-[12px] shadow-elevated border border-border-ice flex flex-col p-2 z-50 animate-fade-up">
                    <Link to="/admin" onClick={() => setAdminOpen(false)} className="px-3 py-2.5 text-[14px] font-bold rounded-lg hover:bg-frost text-deep-ocean transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Dashboard</Link>
                    <Link to="/admin/resources" onClick={() => setAdminOpen(false)} className="px-3 py-2.5 text-[14px] font-medium rounded-lg hover:bg-frost text-ink transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Resources</Link>
                    <Link to="/admin/upload" onClick={() => setAdminOpen(false)} className="px-3 py-2.5 text-[14px] font-medium rounded-lg hover:bg-frost text-ink transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Upload</Link>
                    <Link to="/admin/review" onClick={() => setAdminOpen(false)} className="px-3 py-2.5 text-[14px] font-medium rounded-lg hover:bg-frost text-ink transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Review</Link>
                    <div className="h-px bg-border-ice mx-2 my-1.5" />
                    <button onClick={() => { setAdminOpen(false); handleLogout(); }} className="px-3 py-2.5 text-[14px] font-bold text-left text-error hover:text-white rounded-lg hover:bg-error transition-colors outline-none focus-visible:ring-2 focus-visible:ring-error">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:block">
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </div>
            )}

            <button
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-md hover:bg-frost transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6 text-ink" /> : <Menu className="w-6 h-6 text-ink" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-deep-ocean/30 backdrop-blur-[2px] transition-opacity" />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={clsx(
          'fixed top-[64px] right-0 bottom-0 w-full sm:w-80 z-50 bg-white shadow-elevated flex flex-col transform transition-transform duration-300 ease-out lg:hidden border-l border-border-ice',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <nav className="flex flex-col p-6 gap-2 flex-1 overflow-y-auto" aria-label="Mobile navigation">
          {PUBLIC_LINKS.map(link => {
            const active = isActive(link.path);
            const isAi = link.path === '/ai';
            return (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'flex items-center min-h-[44px] px-4 rounded-[10px] text-[16px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent',
                  active
                    ? 'text-deep-ocean bg-ice-blue/30 font-bold'
                    : isAi ? 'text-glacial-blue font-bold hover:bg-frost' : 'text-muted font-medium hover:bg-frost hover:text-deep-ocean'
                )}
              >
                {isAi && <span className="inline-block mr-2 text-cyan-accent">✧</span>}
                {link.label}
              </Link>
            );
          })}

          <div className="h-px bg-border-ice my-4 mx-2" />

          {isAuth ? (
            <>
              <div className="px-4 py-2 text-[12px] font-bold text-muted uppercase tracking-wider">Admin Panel</div>
              <Link to="/admin" className="flex items-center min-h-[44px] px-4 rounded-[10px] text-[15px] font-medium text-ink hover:bg-frost transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Dashboard</Link>
              <Link to="/admin/resources" className="flex items-center min-h-[44px] px-4 rounded-[10px] text-[15px] font-medium text-ink hover:bg-frost transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Resources</Link>
              <Link to="/admin/upload" className="flex items-center min-h-[44px] px-4 rounded-[10px] text-[15px] font-medium text-ink hover:bg-frost transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Upload</Link>
              <Link to="/admin/review" className="flex items-center min-h-[44px] px-4 rounded-[10px] text-[15px] font-medium text-ink hover:bg-frost transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent">Review</Link>
              <button onClick={handleLogout} className="flex items-center min-h-[44px] px-4 rounded-[10px] text-[15px] font-bold text-error hover:bg-error/10 transition-colors mt-2 outline-none focus-visible:ring-2 focus-visible:ring-error text-left">Sign Out</button>
            </>
          ) : (
            <div className="pt-2">
              <Button className="w-full" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
