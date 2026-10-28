import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Flame, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register, quickFillDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    const res = await login(emailOrPhone, password);
    setLoading(false);

    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      setTimeout(() => {
        navigate('/menu');
      }, 500);
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    const res = await register(name, emailOrPhone, phone, password);
    setLoading(false);

    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      setTimeout(() => {
        navigate('/menu');
      }, 500);
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const handleQuickCustomer = () => {
    quickFillDemoUser(false);
    navigate('/menu');
  };

  const handleQuickAdmin = () => {
    quickFillDemoUser(true);
    navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Brand Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Flame className="w-7 h-7 stroke-[2.5]" />
            </div>
          </Link>
          <h1 className="font-display font-black text-2xl text-neutral-900">
            {mode === 'login' ? 'Welcome Back to CrispyBite' : 'Join The CrispyBite Club'}
          </h1>
          <p className="text-xs text-stone-500">
            {mode === 'login'
              ? 'Log in to access your saved addresses & order history'
              : 'Sign up to unlock exclusive chicken deals & fast checkout'}
          </p>
        </div>

        {/* Quick Testing Shortcuts Box */}
        <div className="bg-stone-100/80 p-3.5 rounded-2xl border border-stone-200 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-500 block text-center">
            Quick 1-Click Evaluation Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickCustomer}
              className="p-2 bg-white hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-800 border border-stone-200 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-stone-600" />
              <span>Demo Customer</span>
            </button>
            <button
              onClick={handleQuickAdmin}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold text-white transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-lg space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold border border-stone-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setStatusMessage(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-stone-500 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setStatusMessage(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-stone-500 hover:text-neutral-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                statusMessage.isError
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {statusMessage.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Email or Phone Number *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="alex@example.com or +91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-700 block">Password *</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(!forgotPasswordOpen)}
                    className="text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Drawer */}
              {forgotPasswordOpen && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-800 text-[11px] block">
                    Reset Password
                  </span>
                  {!forgotSubmitted ? (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="flex-1 p-2 text-xs bg-white border border-stone-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (forgotEmail) setForgotSubmitted(true);
                        }}
                        className="px-3 py-1.5 bg-neutral-900 text-white font-bold rounded-lg text-xs"
                      >
                        Send Link
                      </button>
                    </div>
                  ) : (
                    <p className="text-emerald-700 text-[11px]">
                      A demo reset link has been dispatched to {forgotEmail}.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-display font-black text-sm rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In to CrispyBite'}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Create Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-display font-black text-sm rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Create CrispyBite Account'}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <span className="text-[11px] text-stone-400">
              By proceeding, you agree to CrispyBite's Terms & Conditions and Privacy Policy.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
