import User from '../models/User.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';
import generateOTP from '../utils/generateOTP.js';
import sendEmail from '../utils/sendEmail.js';

export const registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phone, role, isVerified: true });
    const otpCode = generateOTP();
    await OTP.create({ email, otp: otpCode });

    await sendEmail({
      email,
      subject: 'Verify your AgroLink Account',
      html: `<h1>Welcome to AgroLink</h1><p>Your verification OTP code is: <strong>${otpCode}</strong></p>`
    });

    res.status(201).json({ message: 'Registration successful. Verify your email with the OTP sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User matching credentials not found' });

    user.isVerified = true;
    await user.save();
    await OTP.deleteOne({ _id: record._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) return res.status(401).json({ message: 'Please verify your account email before logging in.' });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password parameter values' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account matching this email found' });

    const otpCode = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: otpCode });

    await sendEmail({
      email,
      subject: 'AgroLink Password Reset OTP',
      html: `<p>Your requested password reset security authorization code is: <strong>${otpCode}</strong></p>`
    });
    res.json({ message: 'Reset account code dispatched successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid security code credentials verification configuration match failed' });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();
    await OTP.deleteOne({ _id: record._id });

    res.json({ message: 'Account access password configurations saved securely' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
