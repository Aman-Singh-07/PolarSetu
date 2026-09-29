import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';
import { api } from '../services/api';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageTransition } from '../components/ui/PageTransition';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true); 
    setError('');
    
    try {
      const res = await api.login(email, password);
      if (res && res.token) {
        auth.setToken(res.token);
        navigate('/admin');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || '';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
        setError('Unable to sign in right now. Please try again.');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex w-full min-h-[calc(100vh-72px)] bg-snow">
        
        {/* ─── LEFT ATMOSPHERE ─── */}
        <div className="hidden lg:flex lg:w-[55%] relative bg-deep-ocean flex-col justify-center px-16 xl:px-24 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1549480614-722a7f5ea55a?auto=format&fit=crop&q=80" 
            alt="Polar Landscape" 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-deep-ocean/70 backdrop-blur-[1px] z-0" />
          
          <div className="relative z-10 flex flex-col gap-6">
            <span className="font-gluon text-[48px] tracking-[0.1em] text-white leading-none">
              AICYGRAM
            </span>
            <p className="text-lg font-medium text-white/70 max-w-md leading-relaxed tracking-wide">
              Polar Science Knowledge Platform
            </p>
          </div>
        </div>

        {/* ─── RIGHT LOGIN FORM ─── */}
        <div className="w-full lg:w-[45%] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-[400px] flex flex-col gap-8 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-border-ice">
            
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-3xl font-bold text-ink tracking-tight">Sign in</h1>
              <p className="text-[14px] text-ink/70 font-medium leading-relaxed">
                Sign in to access the AICYGRAM operations workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              
              {error && (
                <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-lg text-[13px] text-error font-medium leading-relaxed" role="alert">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="email-input" className="text-[12px] text-ink font-bold">Email</label>
                <Input 
                  id="email-input"
                  type="text" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="bg-white border-border-ice text-ink focus:border-glacial-blue h-[48px]" 
                  placeholder="name@example.com" 
                  autoComplete="email" 
                  disabled={loading}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="password-input" className="text-[12px] text-ink font-bold">Password</label>
                <div className="relative">
                  <Input 
                    id="password-input"
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="bg-white border-border-ice text-ink focus:border-glacial-blue h-[48px] pr-12" 
                    autoComplete="current-password" 
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-frost border border-border-ice rounded-[10px] p-4 flex flex-col gap-2 mt-2">
                <p className="text-[11px] font-bold text-ink/70 uppercase tracking-widest">Judge / Demo Access</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[13px] text-muted font-medium">Use demo credentials to evaluate the operations portal.</p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEmail('admin@ice.gov.in');
                      setPassword('admin@123');
                    }}
                    className="shrink-0 !h-8 !px-3 !text-[12px]"
                  >
                    Auto-Fill
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-[48px] flex items-center justify-center text-[15px]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
