
import React, { useState, useEffect } from 'react';
import { Tour } from '../../types';
import { getTours } from '../../services/tourService';

const ManageTours: React.FC = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const data = await getTours();
                setTours(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch tours.');
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    if (loading) return <p>Loading tours...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Tours</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Add New Tour</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Title</th>
                                <th className="py-2 px-4 border-b text-left">Location</th>
                                <th className="py-2 px-4 border-b text-left">Price</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tours.map(tour => (
                                <tr key={tour._id}>
                                    <td className="py-2 px-4 border-b">{tour.title}</td>
                                    <td className="py-2 px-4 border-b">{tour.location}</td>
                                    <td className="py-2 px-4 border-b">₹{tour.price.toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="text-blue-500 hover:underline mr-4">Edit</button>
                                        <button className="text-red-500 hover:underline">Delete</button>
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

export default ManageTours;
