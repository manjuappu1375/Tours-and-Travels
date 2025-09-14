
import React from 'react';
import { MOCK_TOURS, MOCK_BOOKINGS, MOCK_USERS } from '../../services/mockData';

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="text-4xl text-primary">{icon}</div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const totalRevenue = MOCK_BOOKINGS.reduce((acc, booking) => acc + booking.totalPrice, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}k`} icon="💰" />
                <StatCard title="Total Bookings" value={MOCK_BOOKINGS.length.toString()} icon="📅" />
                <StatCard title="Total Users" value={MOCK_USERS.length.toString()} icon="👥" />
                <StatCard title="Total Tours" value={MOCK_TOURS.length.toString()} icon="✈️" />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Tour</th>
                                <th className="py-2 px-4 border-b text-left">User</th>
                                <th className="py-2 px-4 border-b text-left">Price</th>
                                <th className="py-2 px-4 border-b text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_BOOKINGS.slice(0, 5).map(booking => (
                                <tr key={booking._id}>
                                    <td className="py-2 px-4 border-b">{booking.tour.title}</td>
                                    <td className="py-2 px-4 border-b">{booking.user.name}</td>
                                    <td className="py-2 px-4 border-b">₹{booking.totalPrice.toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>{booking.status}</span>
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

export default AdminDashboard;