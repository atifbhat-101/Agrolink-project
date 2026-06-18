import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  AlertCircle,
  Apple,
  Sprout,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

const Signup = () => {
  const { register, verifyOtpCode, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
  });

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(formData);

    if (result.success) {
      setSuccessMsg(result.message);
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP');
      return;
    }

    const result = await verifyOtpCode(formData.email, otp);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage:
          "linear-gradient(115deg, rgba(5, 46, 22, 0.9), rgba(20, 83, 45, 0.62), rgba(127, 29, 29, 0.48)), url('https://images.unsplash.com/photo-1576179634586-d8c5c8ae5d49?auto=format&fit=crop&w=1800&q=80')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(220,38,38,0.24),transparent_34%)]" />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl lg:grid-cols-[360px_1fr]">
        <div className="hidden min-h-[500px] flex-col justify-between bg-white/10 p-7 text-white lg:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider">
              <Apple className="h-4 w-4" />
              AgroLink Orchard
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight">
              Create your farm market profile.
            </h1>
            <p className="mt-3 text-sm font-medium leading-6 text-white/75">
              Join the apple farm network to publish harvest lots, receive offers, and talk with buyers.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/15 bg-white/15 p-3.5">
              <Sprout className="h-5 w-5" />
              <p className="mt-3 text-xs font-black uppercase tracking-wider">Grow your reach</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/15 p-3.5">
              <ShieldCheck className="h-5 w-5" />
              <p className="mt-3 text-xs font-black uppercase tracking-wider">Email verified access</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-5 sm:p-7">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
              <Apple className="h-3.5 w-3.5" />
              Step {step} of 2
            </div>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-sm font-medium text-neutral-500">
              {step === 1
                ? 'Set up your apple farm trading workspace.'
                : 'Enter the code sent to your email to activate your account.'}
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <p>{successMsg}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="space-y-1.5 sm:col-span-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <User className="h-3.5 w-3.5" />
                    Full Name
                  </span>
                  <input
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    required
                  />
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    placeholder="farmer@agrolink.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </span>
                  <input
                    name="phone"
                    placeholder="Contact number"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <Lock className="h-3.5 w-3.5" />
                    Password
                  </span>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 pr-12 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      required
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
              </div>

              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Workspace Role</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" />
                {loading ? 'Creating...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full rounded-2xl border border-neutral-200 bg-white p-4 text-center text-2xl font-black tracking-[0.5em] text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                required
              />

              <p className="text-center text-xs font-semibold text-neutral-500">
                OTP sent to {formData.email}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4" />
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full rounded-2xl border border-neutral-200 bg-white py-3 text-xs font-black text-neutral-600 transition hover:bg-neutral-50"
              >
                Back to Signup
              </button>
            </form>
          )}

          <p className="mt-6 border-t border-neutral-100 pt-5 text-center text-xs font-medium text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-emerald-700 transition hover:text-emerald-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
