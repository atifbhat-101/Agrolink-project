import User from '../models/User.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';
import generateOTP from '../utils/generateOTP.js';
import sendEmail from '../utils/sendEmail.js';

const createAndSendOtp = async (email) => {
  const otpCode = generateOTP();
  await OTP.deleteMany({ email });
  await OTP.create({ email, otp: otpCode });

  try {
    await sendEmail({
      email,
      subject: 'Verify your AgroLink Account',
      html: `<h1>Welcome to AgroLink</h1><p>Your verification OTP code is: <strong>${otpCode}</strong></p>`,
    });

    return { message: 'Registration successful. Verify your email with the OTP sent.' };
  } catch (emailError) {
    console.error(`Email send failed for ${email}:`, emailError.message || emailError);
    throw new Error(`Failed to send OTP email: ${emailError.message || 'unknown SMTP error'}`);
  }
};

export const registerUser = async (req, res) => {
  const { name, password, phone, role } = req.body;
  const email = req.body.email?.trim().toLowerCase();
  let createdUserId = null;

  try {
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: 'Please provide all required signup fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const otpResponse = await createAndSendOtp(email);
      return res.status(200).json(otpResponse);
    }

    const user = await User.create({ name, email, password, phone, role, isVerified: false });
    createdUserId = user._id;

    const otpResponse = await createAndSendOtp(email);
    res.status(201).json(otpResponse);
  } catch (error) {
    console.error(`Registration failed for ${email || 'unknown email'}: ${error.message}`);

    if (createdUserId) {
      await User.deleteOne({ _id: createdUserId });
      await OTP.deleteMany({ email });
    }

    res.status(500).json({ message: `Registration failed: ${error.message}` });
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
