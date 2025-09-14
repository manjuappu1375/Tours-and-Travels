
import React, { useState, useEffect } from 'react';
import { Coupon } from '../../types';
import { getCoupons, createCoupon, updateCoupon } from '../../services/couponService';

const ManageCoupons: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState(10);
    const [expiryDate, setExpiryDate] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await getCoupons();
            setCoupons(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch coupons.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);
    
    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCoupon({ code, discountPercentage: discount, expiryDate });
            // Reset form and refetch
            setCode('');
            setDiscount(10);
            setExpiryDate('');
            setIsFormVisible(false);
            fetchCoupons();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create coupon.');
        }
    };

    const handleToggleActive = async (coupon: Coupon) => {
        try {
            await updateCoupon(coupon._id, { isActive: !coupon.isActive });
            fetchCoupons(); // Refetch to show updated status
        } catch (err: any) {
             alert(err.response?.data?.message || 'Failed to update coupon status.');
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Coupons</h1>
                <button 
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    {isFormVisible ? 'Cancel' : 'Add New Coupon'}
                </button>
            </div>
            
            {isFormVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Create New Coupon</h2>
                    <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Coupon Code (e.g., SUMMER20)"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            required
                            className="p-2 border rounded-md"
                        />
                         <input
                            type="number"
                            placeholder="Discount %"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                            required
                            min="1"
                            max="100"
                            className="p-2 border rounded-md"
                        />
                         <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                             min={new Date().toISOString().split("T")[0]}
                            className="p-2 border rounded-md"
                        />
                        <button type="submit" className="bg-secondary text-white p-2 rounded-md hover:bg-secondary-dark">
                            Create Coupon
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <p>Loading coupons...</p> : (
                     <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Code</th>
                                    <th className="py-2 px-4 border-b text-left">Discount</th>
                                    <th className="py-2 px-4 border-b text-left">Expiry Date</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map(coupon => (
                                    <tr key={coupon._id}>
                                        <td className="py-2 px-4 border-b font-mono">{coupon.code}</td>
                                        <td className="py-2 px-4 border-b">{coupon.discountPercentage}%</td>
                                        <td className="py-2 px-4 border-b">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">
                                             <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                                coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>{coupon.isActive ? 'Active' : 'Inactive'}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button 
                                                onClick={() => handleToggleActive(coupon)}
                                                className={`text-sm font-medium ${coupon.isActive ? 'text-red-500 hover:underline' : 'text-green-500 hover:underline'}`}
                                            >
                                                {coupon.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCoupons;