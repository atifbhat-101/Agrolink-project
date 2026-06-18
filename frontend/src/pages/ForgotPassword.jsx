
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, KeyRound, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset processing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setStep(3); // Success closure sequence
    } catch (err) {
      setError(err.response?.data?.message || 'Password update verification mapping exception.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-neutral-800">Account Recovery</h2>
          <p className="text-xs font-medium text-neutral-400">
            {step === 1 ? 'Dispatch a system access reset authorization parameter token.' : step === 2 ? 'Save secure connection secrets changes.' : 'Operations finalized.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-100">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && step !== 3 && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrolink.com"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-xs text-neutral-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'Routing parameters...' : 'Send Recovery Token'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Security Recovery OTP
              </label>
              <input
                type="text"
                required
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center tracking-widest font-bold rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs text-neutral-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                New Secured Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 px-4 text-xs text-neutral-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              {loading ? 'Applying architecture updates...' : 'Save New Credentials'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <KeyRound className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-800">Credentials Saved Securely</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Your recovery parameters matching configuration was validated. Authenticate with your new password.
              </p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        )}

        {step !== 3 && (
          <div className="border-t border-neutral-100 pt-4 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-neutral-600 transition">
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;