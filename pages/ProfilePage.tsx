
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>
      {user && (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-light-text">{user.email}</p>
            <p className="mt-4 text-sm font-medium uppercase text-gray-500">Role: {user.role}</p>
        </div>
      )}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Booking History</h2>
        <p className="text-light-text">Your past and upcoming bookings will be shown here.</p>
        {/* Booking history items would be rendered here */}
      </div>
    </div>
  );
};

export default ProfilePage;
