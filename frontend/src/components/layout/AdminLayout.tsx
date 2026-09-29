import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, Upload, ClipboardCheck, ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { auth } from '../../services/auth';
import { PageTransition } from '../ui/PageTransition';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const handleSignOut = () => {
    auth.clearToken();
    navigate('/login');
    window.location.reload();
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Resources', path: '/admin/resources', icon: Database },
    { name: 'Upload', path: '/admin/upload', icon: Upload },
    { name: 'Review', path: '/admin/review', icon: ClipboardCheck },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-deep-ocean border-r border-white/5">
      <div className="p-6 pb-8">
        <Link to="/admin" className="flex flex-col gap-1">
          <span className="font-gluon text-[24px] tracking-[0.1em] text-white">
            AICYGRAM
          </span>
          <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Operations</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-bold transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-cyan-accent' : 'text-white/40'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex flex-col gap-1.5 border-t border-white/5">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-bold text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-white/40" />
          View Public Platform
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-bold text-white/50 hover:text-white hover:bg-white/5 hover:text-error transition-colors text-left w-full"
        >
          <LogOut className="w-4 h-4 text-white/40" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-deep-ocean overflow-hidden text-white font-sans antialiased selection:bg-cyan-accent/20">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-[64px] bg-deep-ocean border-b border-white/5 flex items-center justify-between px-4 z-50">
        <Link to="/admin" className="flex flex-col">
          <span className="font-gluon text-[20px] tracking-[0.1em] text-white">
            AICYGRAM
          </span>
          <span className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">Operations</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-deep-ocean/90 backdrop-blur-sm pt-[64px] animate-fade-in">
          <SidebarContent />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[260px] h-full shrink-0 z-20">
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto pt-[64px] lg:pt-0 bg-deep-ocean relative z-0 flex flex-col">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
