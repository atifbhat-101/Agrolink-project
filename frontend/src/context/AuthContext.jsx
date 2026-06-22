import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { disconnectSocket } from '../services/socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login operational failure.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', userData);
      return { success: true, ...data };
    } catch (error) {
      console.error('Register request failed', error.response?.data || error.message || error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration operational failure.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpCode = async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Verify OTP request failed', error.response?.data || error.message || error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Invalid or expired activation OTP.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    disconnectSocket();
  };

  const updateProfileState = async (updatedData) => {
    try {
      const { data } = await api.put('/users/profile', updatedData);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Profile save failure' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtpCode, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};
