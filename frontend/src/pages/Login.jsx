import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="flex min-h-[85vh] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-neutral-800">
            Welcome to <span className="text-emerald-600">AgroLink</span>
          </h2>
          <p className="text-xs font-medium text-neutral-400">
            Authenticate credentials to manage your agricultural inventory.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-100">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@agrolink.com"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-xs text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-xs text-neutral-800 placeholder-neutral-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="h-4 w-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="border-t border-neutral-100 pt-4 text-center">
          <p className="text-xs font-medium text-neutral-500">
            Don't have an operational workspace?{' '}
            <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700 transition">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
