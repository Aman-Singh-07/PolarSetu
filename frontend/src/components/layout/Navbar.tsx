import { Link, useLocation } from 'react-router-dom';
import { Compass, Search, Map, Database, LayoutDashboard, Brain, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const location = useLocation();
  const navItems = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Repository', path: '/explore', icon: Database },
    { name: 'Expeditions', path: '/expeditions', icon: Map },
    { name: 'Media', path: '/media', icon: Search },
    { name: 'Ask AI', path: '/ai', icon: Brain },
    { name: 'Outreach', path: '/outreach', icon: MessageSquare },
    { name: 'Admin', path: '/admin', icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-[1360px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display font-bold text-xl tracking-tight">PolarSetu</span>
        </Link>
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  );
}
