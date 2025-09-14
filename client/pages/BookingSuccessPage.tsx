
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Booking, Tour } from '../types';

const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { booking: Booking; tour: Tour } | undefined;

  // If state is not present, redirect to home. This can happen if the user navigates directly.
  if (!state || !state.booking || !state.tour) {
    return <Navigate to="/" replace />;
  }

  const { booking, tour } = state;

  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-150px)] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {tour.images && tour.images.length > 0 && (
          <img src={tour.images[0]} alt={tour.title} className="w-full h-64 object-cover" />
        )}
        <div className="p-8 text-center">
          <svg className="h-16 w-16 text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-4xl font-bold text-dark-text mb-2">Booking Confirmed!</h1>
          <p className="text-light-text mb-6">Your adventure awaits. Thank you for booking with TravelX.</p>
          
          <div className="bg-light-bg p-6 rounded-md text-left space-y-3 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-primary">{tour.title}</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Location:</strong> {tour.location}</p>
              <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p><strong>Travelers:</strong> {booking.travelers}</p>
              <p className="text-lg font-bold text-dark-text mt-2"><strong>Total Price:</strong> ₹{booking.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/my-bookings" 
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow"
            >
              View My Bookings
            </Link>
            <Link 
              to="/explore"
              className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Explore More Tours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;