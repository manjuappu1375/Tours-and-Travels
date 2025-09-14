
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();

    const linkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200";
    const activeLinkClasses = "bg-primary text-white hover:bg-primary-dark";

    return (
        <div className="w-64 bg-white shadow-md flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-2xl font-bold text-primary">TravelX Admin</h2>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Dashboard</NavLink>
                <NavLink to="/admin/tours" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Manage Tours</NavLink>
                <NavLink to="/admin/bookings" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Manage Bookings</NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Manage Users</NavLink>
                <NavLink to="/admin/coupons" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Manage Coupons</NavLink>
            </nav>
            <div className="p-4 border-t">
                <NavLink to="/" className="w-full block text-center mb-2 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200">Back to Site</NavLink>
                <button onClick={logout} className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Logout</button>
            </div>
        </div>
    );
};

export default AdminSidebar;