import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Mail, Phone, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Signup = () => {
  const { register, verifyOtpCode, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer'
  });

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-6 shadow-xl">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-black">
            {step === 1 ? 'Create Account' : 'OTP Verification'}
          </h2>
          <p className="text-xs text-gray-400">
            {step === 1
              ? 'Join AgroLink ecosystem'
              : 'Enter verification code sent to email'}
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 p-3 text-red-600 text-xs rounded">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* SUCCESS */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 p-3 text-green-600 text-xs rounded">
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        {/* STEP 1: REGISTER */}
        {step === 1 ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
              required
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              {loading ? 'Creating...' : 'Next'}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP */
          <form onSubmit={handleOtpSubmit} className="space-y-4">

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter OTP"
              className="w-full text-center p-3 border rounded tracking-widest text-lg"
              required
            />

            <p className="text-xs text-gray-400 text-center">
              OTP sent to {formData.email}
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-gray-500"
            >
              Back to Signup
            </button>
          </form>
        )}

        {/* LOGIN LINK */}
        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;