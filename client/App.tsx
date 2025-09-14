

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';

import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import TourDetailsPage from './pages/TourDetailsPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTours from './pages/admin/ManageTours';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCoupons from './pages/admin/ManageCoupons';

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    return children;
  }
  return <Navigate to="/login" replace />;
};

const UserRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="tours/:id" element={<TourDetailsPage />} />
        <Route path="wishlist" element={<UserRoute><WishlistPage /></UserRoute>} />
        <Route path="profile" element={<UserRoute><ProfilePage /></UserRoute>} />
        <Route path="my-bookings" element={<UserRoute><MyBookingsPage /></UserRoute>} />
        <Route path="booking-success" element={<UserRoute><BookingSuccessPage /></UserRoute>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tours" element={<ManageTours />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="coupons" element={<ManageCoupons />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;