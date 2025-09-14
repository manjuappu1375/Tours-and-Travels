
import React from 'react';
import { MOCK_USERS } from '../../services/mockData';
import { User } from '../../types';

const ManageUsers: React.FC = () => {
    // This should be replaced with a fetch call in a real app
    // FIX: MOCK_USERS now correctly uses `_id`, so no mapping is needed.
    const users: User[] = MOCK_USERS;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Name</th>
                                <th className="py-2 px-4 border-b text-left">Email</th>
                                <th className="py-2 px-4 border-b text-left">Role</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="py-2 px-4 border-b">{user.name}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{user.role}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="text-blue-500 hover:underline mr-4">Edit</button>
                                        <button className="text-red-500 hover:underline">Ban</button>
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

export default ManageUsers;
