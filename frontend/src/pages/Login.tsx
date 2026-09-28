import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for login
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
      window.location.reload(); // Refresh to update Navbar state
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-low">
      <div className="max-w-md w-full space-y-8 bg-pure-white p-8 sm:p-10 rounded-2xl shadow-xl border border-surface-variant relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-polar-midnight-deep via-glacial-sky to-azure-accent"></div>
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-surface-container-high rounded-full flex items-center justify-center text-polar-midnight-deep mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-display-hero font-bold text-polar-midnight-deep tracking-tight">Institutional Access</h2>
          <p className="mt-2 text-sm font-body-sm text-on-surface-variant">
            Sign in with your MoES or NCPOR credentials to access the editorial board and curation dashboards.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-label-sm font-semibold text-polar-midnight-deep mb-1">
                Institutional Email ID
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-surface-variant rounded-lg py-3 bg-surface-container-low text-on-surface"
                  placeholder="name@ncpor.res.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-label-sm font-semibold text-polar-midnight-deep mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-surface-variant rounded-lg py-3 bg-surface-container-low text-on-surface"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-secondary focus:ring-secondary border-surface-variant rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-body-sm text-on-surface-variant">
                Remember me
              </label>
            </div>
            <div className="text-sm font-label-sm">
              <a href="#" className="font-semibold text-secondary hover:text-polar-midnight-deep transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-title-md rounded-xl text-pure-white bg-polar-midnight-deep hover:bg-polar-navy-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all shadow-md disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <CheckCircle2 className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </span>
              )}
            </button>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-draft-amber-bg/50 border border-draft-amber-border/30 text-center">
            <span className="text-xs font-code-sm text-draft-amber-text font-semibold uppercase tracking-wider block mb-1">Security Notice</span>
            <span className="text-xs font-body-sm text-on-surface-variant">Unauthorised access to Government systems is prohibited. Actions are logged and monitored.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
