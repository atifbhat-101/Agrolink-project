import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;

if (![ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE].every(Boolean)) {
  throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_PHONE in backend/.env first.');
}

await connectDB();
const email = ADMIN_EMAIL.toLowerCase();
const existingUser = await User.findOne({ email });

if (existingUser) {
  existingUser.name = ADMIN_NAME;
  existingUser.phone = ADMIN_PHONE;
  existingUser.role = 'admin';
  existingUser.isVerified = true;
  await existingUser.save();
  console.log(`Admin account updated: ${email}`);
} else {
  await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, phone: ADMIN_PHONE, role: 'admin', isVerified: true });
  console.log(`Admin account created: ${email}`);
}

await mongoose.disconnect();
