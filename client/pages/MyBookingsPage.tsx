import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { Link } from 'react-router-dom';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    try {
      const updatedBooking = await cancelBooking(bookingId);
      setBookings(bookings.map(b => b._id === bookingId ? updatedBooking : b));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
      {loading ? (
        <p>Loading your bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold">No Bookings Found</h3>
          <p className="text-light-text mt-2">You haven't booked any tours yet. Let's find your next adventure!</p>
           <Link to="/explore" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Explore Tours
            </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-primary">{booking.tour.title}</h2>
                 <p className="text-gray-500 text-sm">{booking.tour.location}</p>
                <p className="text-gray-600 mt-2">
                  Booking Date: {new Date(booking.bookingDate).toLocaleDateString()} for {booking.travelers} traveler(s)
                </p>
                {booking.couponApplied && (
                    <p className="text-sm text-green-600 font-medium">
                        Coupon Applied: "{booking.couponApplied.code}" ({booking.couponApplied.discountPercentage}%)
                    </p>
                )}
                <p className="font-semibold text-lg mt-1">Total: ₹{booking.totalPrice.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(booking.status)} capitalize`}>
                  {booking.status}
                </span>
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;