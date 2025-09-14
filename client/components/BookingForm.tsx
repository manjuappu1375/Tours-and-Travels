
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tour } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { createBooking } from '../services/bookingService';
import { applyCoupon } from '../services/couponService';

interface BookingFormProps {
  tour: Tour;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [travelers, setTravelers] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercentage: number } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [couponError, setCouponError] = useState('');

  const [totalPrice, setTotalPrice] = useState(tour.price * travelers);
  const [originalPrice, setOriginalPrice] = useState(tour.price * travelers);

  useEffect(() => {
    const newOriginalPrice = tour.price * travelers;
    setOriginalPrice(newOriginalPrice);

    if (appliedCoupon) {
      const discount = newOriginalPrice * (appliedCoupon.discountPercentage / 100);
      setTotalPrice(newOriginalPrice - discount);
    } else {
      setTotalPrice(newOriginalPrice);
    }
  }, [travelers, tour.price, appliedCoupon]);


  const handleApplyCoupon = async () => {
    if (!couponCode) {
        setCouponError('Please enter a coupon code.');
        return;
    }
    setCouponError('');
    try {
        const coupon = await applyCoupon(couponCode);
        setAppliedCoupon({ code: coupon.code, discountPercentage: coupon.discountPercentage });
    } catch (err: any) {
        setCouponError(err.response?.data?.message || 'Invalid coupon code.');
        setAppliedCoupon(null);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bookingDate) {
      setError('Please select a date.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newBooking = await createBooking({
        tourId: tour._id,
        bookingDate,
        travelers,
        couponCode: appliedCoupon?.code
      });
      setSuccess('Booking successful!');
      // Navigate to success page with booking details
      navigate('/booking-success', { state: { booking: newBooking, tour: tour }});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
      
      <div>
        <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">Travelers</label>
        <input 
          type="number" 
          id="travelers" 
          value={travelers}
          onChange={(e) => setTravelers(Number(e.target.value) > 0 ? Number(e.target.value) : 1)}
          min="1"
          required
          disabled={!!success}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input 
          type="date" 
          id="date" 
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          required
          disabled={!!success}
           min={new Date().toISOString().split("T")[0]}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
        />
      </div>

      {/* Coupon Section */}
      <div>
          <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">Coupon Code</label>
          <div className="mt-1 flex rounded-md shadow-sm">
              <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon || !!success}
                  className="flex-1 block w-full rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="E.G. SUMMER20"
              />
              <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!!appliedCoupon || !!success}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-r-md disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                  {appliedCoupon ? 'Applied!' : 'Apply'}
              </button>
          </div>
          {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
      </div>

      <div className="border-t pt-4 space-y-2">
        {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                <span>- ₹{(originalPrice - totalPrice).toLocaleString()}</span>
            </div>
        )}
        <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Price:</span>
            <div>
                 {appliedCoupon && <span className="text-base font-normal text-gray-500 line-through mr-2">₹{originalPrice.toLocaleString()}</span>}
                <span>₹{totalPrice.toLocaleString()}</span>
            </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading || !!success}
        className="w-full bg-secondary text-white py-3 rounded-lg font-semibold text-lg hover:bg-secondary-dark transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : success ? 'Booked!' : user ? 'Book Now' : 'Login to Book'}
      </button>
    </form>
  );
};

export default BookingForm;
