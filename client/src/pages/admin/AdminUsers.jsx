import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import { Search, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users?keyword=${search}&pageNumber=${page}`);
            setUsers(data.users);
            setPage(data.page);
            setPages(data.pages);

            // Also fetch pending registration requests
            const { data: requests } = await api.get('/admin/pending-requests');
            setPendingRequests(requests);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                toast.success('User deleted');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const toggleStatus = async (user) => {
        try {
            await api.put(`/users/${user._id}`, { isActive: !user.isActive });
            toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${editingUser._id}`, formData);
            toast.success('User updated successfully');
            setIsEditModalOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    return (
        <div className="space-y-6">
            <ToastContainer theme="dark" />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 w-64 transition-all"
                    />
                </div>
            </div>

            {/* Pending Approvals Section */}
            {(pendingRequests.length > 0 || users.some(u => u.role === 'admin' && !u.isApproved)) && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 space-y-4">
                    <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                        <CheckCircle size={20} />
                        Pending Admin Approvals
                    </h2>
                    <div className="grid gap-4">
                        {/* Show New Model Requests */}
                        {pendingRequests.map(request => (
                            <div key={request._id} className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between border border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                        {request.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{request.name} <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full ml-2">New Request</span></p>
                                        <p className="text-xs text-gray-500">{request.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.put(`/admin/approve/${request._id}`);
                                                toast.success('Admin approved successfully');
                                                fetchUsers();
                                            } catch (error) {
                                                toast.error('Failed to approve admin');
                                            }
                                        }}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to reject this admin request?')) {
                                                try {
                                                    await api.delete(`/admin/reject/${request._id}`);
                                                    toast.success('Admin request rejected');
                                                    fetchUsers();
                                                } catch (error) {
                                                    toast.error('Failed to reject admin');
                                                }
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-600/20 transition-colors text-sm font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Fallback: Show Legacy Unapproved Users */}
                        {users.filter(u => u.role === 'admin' && !u.isApproved).map(user => (
                            <div key={user._id} className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between border border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user.name} <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full ml-2">Legacy User</span></p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.put(`/admin/approve/${user._id}`);
                                                toast.success('Admin approved successfully');
                                                fetchUsers();
                                            } catch (error) {
                                                toast.error('Failed to approve admin');
                                            }
                                        }}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to reject this admin request? User will be deleted.')) {
                                                try {
                                                    await api.delete(`/admin/reject/${user._id}`);
                                                    toast.success('Admin request rejected');
                                                    fetchUsers();
                                                } catch (error) {
                                                    toast.error('Failed to reject admin');
                                                }
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-600/20 transition-colors text-sm font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-700/50 text-gray-200 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                            ) : users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            user.role === 'faculty' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(user)}
                                            className={`flex items-center gap-1 text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}
                                        >
                                            {user.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-blue-400 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="p-4 border-t border-gray-700 flex justify-center gap-2">
                        {[...Array(pages).keys()].map((x) => (
                            <button
                                key={x + 1}
                                onClick={() => setPage(x + 1)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${page === x + 1
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                            >
                                {x + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Edit User</h2>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingUser(null);
                                    }}
                                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
