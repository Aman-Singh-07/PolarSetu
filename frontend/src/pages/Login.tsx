import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';
import { api } from '../services/api';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setError('');
    try {
      const res = await api.login(email, password);
      auth.setToken(res.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setEmail('admin@polarsetu.in');
    setPassword('password123');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] py-12 px-4 bg-snow relative overflow-y-auto">
      {/* ─── CINEMATIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-snow to-frost opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] flex flex-col gap-8 animate-fade-up">
        
        {/* ─── HEADER ─── */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-[20px] bg-white border border-border-ice flex items-center justify-center shadow-[0_12px_30px_rgba(7,20,38,0.06)]">
            <ShieldCheck className="w-8 h-8 text-cyan-accent" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-deep-ocean tracking-tight drop-shadow-sm">System Access</h1>
            <p className="text-[12px] text-muted mt-2 font-bold tracking-[0.2em] uppercase">POLARSETU Admin Console</p>
          </div>
        </div>

        {/* ─── FORM ─── */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-[24px] p-8 border border-white shadow-[0_20px_50px_rgba(7,20,38,0.08)] flex flex-col gap-6 relative overflow-hidden group">
          {/* Top glowing accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-accent via-glacial-blue to-cyan-accent opacity-90" />
          
          {error && (
            <div className="flex items-center gap-2 p-4 bg-error/5 border border-error/20 rounded-[14px] text-[13px] text-error font-bold animate-fade-in shadow-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email-input" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Email Address</label>
            <input 
              id="email-input"
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full px-5 py-4 bg-white/50 border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all placeholder:text-muted/40 font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" 
              placeholder="admin@polarsetu.in" 
              autoComplete="email" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password-input" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Password</label>
            <input 
              id="password-input"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-5 py-4 bg-white/50 border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all placeholder:text-muted/40 font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" 
              placeholder="••••••••" 
              autoComplete="current-password" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !email || !password} 
            className="w-full mt-4 py-4 bg-deep-ocean hover:bg-cyan-accent disabled:bg-border-ice disabled:text-muted disabled:shadow-none disabled:cursor-not-allowed disabled:hover:translate-y-0 text-white hover:text-deep-ocean text-[15px] font-extrabold rounded-[16px] transition-all duration-300 shadow-[0_8px_20px_rgba(7,20,38,0.15)] hover:shadow-[0_12px_25px_rgba(56,189,248,0.3)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group/btn"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</> : 'Authenticate Session'}
          </button>
        </form>

        <div className="text-center">
          <button onClick={handleDemo} className="text-[11px] text-muted/60 hover:text-cyan-accent uppercase tracking-widest font-bold transition-colors">
            Use Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
