import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

import BrowseLots from './pages/BrowseLots';
import LotDetails from './pages/LotDetails';
import MyLots from './pages/MyLots';
import MyRequests from './pages/MyRequests';
import BuyerRequests from './pages/BuyerRequests';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Shared Protected Routes */}
            <Route
              element={
                <PrivateRoute allowedRoles={['farmer', 'buyer']} />
              }
            >
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/lots/:id" element={<LotDetails />} />
              </Route>
            </Route>

            {/* Buyer Routes */}
            <Route
              element={
                <PrivateRoute allowedRoles={['buyer']} />
              }
            >
              <Route element={<Layout />}>
                <Route path="/browse" element={<BrowseLots />} />
                <Route path="/my-requests" element={<MyRequests />} />
              </Route>
            </Route>

            {/* Farmer Routes */}
            <Route
              element={
                <PrivateRoute allowedRoles={['farmer']} />
              }
            >
              <Route element={<Layout />}>
                <Route path="/my-lots" element={<MyLots />} />
                <Route path="/buyer-requests" element={<BuyerRequests />} />
              </Route>
            </Route>

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />

          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;