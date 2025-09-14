
import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';
import { getAllBookings, cancelBooking } from '../../services/bookingService';

const ManageBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings();
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
        if (!window.confirm('Are you sure you want to cancel this booking? This action is for administrative purposes.')) {
            return;
        }
        try {
            const updatedBooking = await cancelBooking(bookingId);
            setBookings(bookings.map(b => b._id === bookingId ? updatedBooking : b));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
        }
    };

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Bookings</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Tour</th>
                                <th className="py-2 px-4 border-b text-left">User</th>
                                <th className="py-2 px-4 border-b text-left">Date</th>
                                <th className="py-2 px-4 border-b text-left">Status</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td className="py-2 px-4 border-b">{booking.tour.title}</td>
                                    <td className="py-2 px-4 border-b">{booking.user.name}</td>
                                    <td className="py-2 px-4 border-b">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">
                                       <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>{booking.status}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {booking.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;