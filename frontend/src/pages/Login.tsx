import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { api } from '../services/api';
import { auth } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.login(email, password);
      auth.setToken(response.token);
      navigate('/admin');
      window.location.reload(); // Refresh to update Navbar state
    } catch (err: any) {
      if (err.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Unable to connect to the POLARSETU API. Try Again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@polarsetu.in');
    setPassword('password123');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-surface relative">
      
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-md w-full relative z-10 flex flex-col gap-6">
        
        {/* Back Link */}
        <div className="flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-polar-midnight-deep font-label-sm text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to POLARSETU
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-pure-white p-8 sm:p-10 rounded-2xl shadow-xl border border-surface-variant flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col gap-2 items-center text-center">
            <img
              alt="POLARSETU"
              className="h-10 w-auto object-contain mb-2"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VXEr7AYLMmREImv4E52a7As9vSLcuPX2Tah0iKkNYpSXL-ZTRjw1tNmKkosj2FukeZj9LfB1KWGXuN-m1-MGKfRV6CkwD91Ufankky5MozJscRQ_7jMgBamSM7flV83WTRa8EwqmSG-PTLCeYe_96jRnhjagkkbl8PRO2Z8XF5RJlPUJrS0QAu0qZqx6bhG3wpA05rHjshP9RxV9o8N1MlnxYOPHjQnZ_hHTLWztoyBvyZuOTRw1g29_Gu"
            />
            <h1 className="text-3xl font-headline-lg font-bold text-polar-midnight-deep tracking-tight uppercase">Sign In</h1>
            <p className="font-body-sm text-sm text-on-surface-variant max-w-[280px]">
              Access the POLARSETU administration workspace.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            {error && (
              <div className="p-3 bg-error/5 border border-error/20 text-error text-sm font-label-md rounded-lg flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-label-sm text-xs font-bold text-polar-midnight-deep uppercase tracking-widest">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full pl-10 border border-surface-variant rounded-lg py-3 bg-surface-container-low text-on-surface font-body-md transition-all focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-label-sm text-xs font-bold text-polar-midnight-deep uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className="block w-full pl-10 pr-10 border border-surface-variant rounded-lg py-3 bg-surface-container-low text-on-surface font-body-md transition-all focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl font-label-md font-bold uppercase tracking-wider text-pure-white bg-polar-midnight-deep hover:bg-polar-navy-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Prototype Demo Access */}
          <div className="border-t border-surface-variant pt-5 flex flex-col gap-3">
             <span className="font-label-sm text-[10px] font-bold uppercase tracking-widest text-outline text-center">Prototype Demo Access</span>
             <button 
                type="button" 
                onClick={handleDemoLogin}
                className="w-full py-2.5 rounded-lg border border-surface-variant bg-surface-container-low hover:bg-surface-container text-polar-midnight-deep font-label-sm text-sm font-bold uppercase tracking-wider transition-colors text-center"
             >
               Use Prototype Administrator Account
             </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-on-surface-variant opacity-60">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-code-sm text-[10px] uppercase tracking-wider font-bold">Administrative access to POLARSETU</span>
          </div>

        </div>
      </div>
    </div>
  );
}
