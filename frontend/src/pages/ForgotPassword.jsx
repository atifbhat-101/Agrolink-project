import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Apple,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSuccess(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Access pipeline dispatch error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || !newPassword) {
      setError('Please provide validation payload elements.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccess(data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Password update verification mapping exception.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage:
          "linear-gradient(115deg, rgba(5, 46, 22, 0.92), rgba(20, 83, 45, 0.64), rgba(127, 29, 29, 0.46)), url('https://images.unsplash.com/photo-1576179634586-d8c5c8ae5d49?auto=format&fit=crop&w=1800&q=80')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_88%_82%,rgba(220,38,38,0.24),transparent_34%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl lg:grid-cols-[1fr_420px]">
        <div className="hidden min-h-[560px] flex-col justify-between p-8 text-white lg:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider">
              <Apple className="h-4 w-4" />
              Orchard Recovery
            </div>
            <h1 className="mt-8 max-w-md text-5xl font-black leading-tight">
              Get back to your harvest workspace.
            </h1>
            <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-white/75">
              Reset your password securely and return to managing lots, offers, and buyer conversations.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/15 p-4">
            <ShieldCheck className="h-5 w-5" />
            <p className="mt-3 text-xs font-black uppercase tracking-wider">Email OTP protected</p>
          </div>
        </div>

        <div className="bg-white/95 p-6 sm:p-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
              <Apple className="h-3.5 w-3.5" />
              Step {step > 2 ? 2 : step} of 2
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900">
              {step === 1 ? 'Account Recovery' : step === 2 ? 'Reset Password' : 'Password Saved'}
            </h2>
            <p className="text-sm font-medium text-neutral-500">
              {step === 1
                ? 'Send a recovery code to your registered email.'
                : step === 2
                  ? 'Enter your code and choose a new password.'
                  : 'Your account is ready for sign in.'}
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && step !== 3 && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="mt-8 space-y-5">
              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <Mail className="h-3.5 w-3.5" />
                  Registered Email
                </span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@agrolink.com"
                    className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-10 pr-4 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Sending code...' : 'Send Recovery Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Security OTP
                </span>
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full rounded-2xl border border-neutral-200 bg-white p-4 text-center text-2xl font-black tracking-[0.5em] text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <Lock className="h-3.5 w-3.5" />
                  New Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Saving password...' : 'Save New Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="mt-8 space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <KeyRound className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900">Credentials Saved</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-neutral-500">
                  Your password has been reset. Sign in again to continue.
                </p>
              </div>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-800">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          )}

          {step !== 3 && (
            <div className="mt-6 border-t border-neutral-100 pt-5 text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs font-black text-neutral-500 transition hover:text-emerald-700">
                <ArrowLeft className="h-3.5 w-3.5" /> Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
