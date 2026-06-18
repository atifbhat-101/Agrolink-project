import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Leaf, ShieldCheck, Apple, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide all authentication parameters.');
      return;
    }
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage:
          "linear-gradient(115deg, rgba(5, 46, 22, 0.92), rgba(20, 83, 45, 0.66), rgba(127, 29, 29, 0.45)), url('https://images.unsplash.com/photo-1576179634586-d8c5c8ae5d49?auto=format&fit=crop&w=1800&q=80')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(220,38,38,0.22),transparent_32%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl lg:grid-cols-[1fr_420px]">
        <div className="hidden min-h-[560px] flex-col justify-between p-8 text-white lg:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider">
              <Apple className="h-4 w-4" />
              Apple Farm Network
            </div>
            <h1 className="mt-8 max-w-md text-5xl font-black leading-tight">
              Harvest deals from orchard to market.
            </h1>
            <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-white/75">
              Sign in to manage lots, offers, and buyer messages from your AgroLink workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/15 p-4">
              <Leaf className="h-5 w-5" />
              <p className="mt-3 text-xs font-black uppercase tracking-wider">Fresh Inventory</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/15 p-4">
              <ShieldCheck className="h-5 w-5" />
              <p className="mt-3 text-xs font-black uppercase tracking-wider">Secure Access</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-6 sm:p-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
              <Apple className="h-3.5 w-3.5" />
              AgroLink
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900">
              Welcome back
            </h2>
            <p className="text-sm font-medium text-neutral-500">
              Open your apple farm workspace and continue today&apos;s harvest.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrolink.com"
                  className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-10 pr-4 text-sm font-semibold text-neutral-800 placeholder-neutral-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-black text-emerald-700 transition hover:text-emerald-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-10 pr-12 text-sm font-semibold text-neutral-800 placeholder-neutral-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 transition hover:text-emerald-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn className="h-4 w-4" /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-neutral-100 pt-5 text-center">
            <p className="text-xs font-medium text-neutral-500">
              New to the orchard network?{' '}
              <Link to="/signup" className="font-black text-emerald-700 transition hover:text-emerald-800">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
