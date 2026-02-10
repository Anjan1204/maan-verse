import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import { Users, GraduationCap, Video, Activity, Mail, Phone, TrendingUp, Check, X } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { toast, ToastContainer } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalFaculty: 0,
        totalCourses: 0,
    });
    const [inquiries, setInquiries] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [usageData, setUsageData] = useState([]);
    const [pieData, setPieData] = useState([]);

    const [adminUsers, setAdminUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchStats = async () => {
        try {
            const [{ data: statsData }, { data: inqData }, { data: adminsData }] = await Promise.all([
                api.get('/users/stats'),
                api.get('/inquiries'),
                api.get('/admin/users')
            ]);
            setStats(statsData.stats);
            setRecentUsers(statsData.recentUsers || []);
            setPieData(statsData.distribution || []);
            // If graphData is empty (no new users in 7 days), provide simplified placeholder or empty
            setUsageData(statsData.graphData && statsData.graphData.length > 0 ? statsData.graphData : []);
            setInquiries(inqData);
            setAdminUsers(adminsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAdmin = async (id) => {
        try {
            await api.put(`/admin/approve/${id}`);
            toast.success('Admin approved successfully');
            fetchStats();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve admin');
        }
    };

    useEffect(() => {
        fetchStats();

        if (socket) {
            socket.on('user:new', () => {
                fetchStats();
                toast.info('New User Registered');
            });
            socket.on('inquiry:new', (newInq) => {
                setInquiries(prev => [newInq, ...prev]);
                toast.info('New Inquiry Received');
            });
        }

        return () => {
            if (socket) {
                socket.off('user:new');
                socket.off('inquiry:new');
            }
        };
    }, [socket]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/inquiries/${id}`, { status });
            toast.success(`Inquiry marked as ${status}`);
            fetchStats(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    // Download Report as CSV
    const handleDownloadReport = () => {
        try {
            const timestamp = new Date().toISOString().split('T')[0];
            const csvContent = [
                ['MAAN-verse Dashboard Report', `Generated: ${new Date().toLocaleString()}`],
                [],
                ['Metric', 'Value'],
                ['Total Users', stats.totalUsers],
                ['Active Students', stats.totalStudents],
                ['Faculty Members', stats.totalFaculty],
                ['Total Courses', stats.totalCourses],
                [],
                ['Weekly Activity Data'],
                ['Day', 'Active Users', 'New Users'],
                ...usageData.map(day => [day.name, day.active, day.new])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `dashboard-report-${timestamp}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Report downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download report');
            console.error(error);
        }
    };





    const COLORS = ['#6366f1', '#ec4899', '#10b981'];

    const cards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { title: 'Active Students', value: stats.totalStudents, icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Faculty Members', value: stats.totalFaculty, icon: Activity, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { title: 'Total Courses', value: stats.totalCourses, icon: Video, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    if (loading) return <div className="p-10 text-center text-white">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <ToastContainer theme="dark" position="top-right" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadReport}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((item, index) => (
                    <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">{item.title}</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{item.value}</h3>
                                <div className="flex items-center mt-2 text-sm text-green-400">
                                    <TrendingUp size={14} className="mr-1" />
                                    <span>+12.5% from last month</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                <item.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">User Activity</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usageData}>
                                <defs>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Area type="monotone" dataKey="active" stroke="#6366f1" fillOpacity={1} fill="url(#colorActive)" />
                                <Area type="monotone" dataKey="new" stroke="#ec4899" fillOpacity={1} fill="url(#colorNew)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6">User Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-6">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span className="text-gray-300 text-sm">{entry.name}</span>
                                </div>
                                <span className="text-white font-bold">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pending Admin Requests Table */}
            {adminUsers.some(u => !u.isApproved) && (
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden mt-8 mb-8">
                    <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-indigo-900/20">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="text-indigo-400" size={20} />
                                Pending Admin Requests
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">New admins waiting for your approval</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-400">
                            <thead className="bg-gray-700/50 text-gray-200 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Admin Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Joined Date</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {adminUsers.filter(u => !u.isApproved).map((admin) => (
                                    <tr key={admin._id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <span className="text-white font-medium">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{admin.email}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(admin.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleApproveAdmin(admin._id)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-emerald-500/20"
                                            >
                                                <Check size={14} />
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Faculty Inquiries Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">Faculty Applications</h3>
                        <p className="text-sm text-gray-400 mt-1">People interested in joining our faculty</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-700/50 text-gray-200 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Inquirer</th>
                                <th className="px-6 py-4">Contact Detail</th>
                                <th className="px-6 py-4">Query / Message</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {inquiries.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8">No inquiries found</td></tr>
                            ) : inquiries.map((inq) => (
                                <tr key={inq._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                {inq.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{inq.name}</p>
                                                <p className="text-[10px] text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <p className="text-sm text-gray-300">{inq.email}</p>
                                        <p className="text-xs text-gray-400">{inq.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm text-gray-300 truncate" title={inq.query}>{inq.query}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border
                                            ${inq.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                inq.status === 'Accepted' || inq.status === 'Contacted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            {inq.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {inq.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(inq._id, 'Accepted')}
                                                        className="p-2 bg-gray-700 rounded-lg hover:bg-emerald-600 transition-colors text-white"
                                                        title="Accept"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(inq._id, 'Rejected')}
                                                        className="p-2 bg-gray-700 rounded-lg hover:bg-red-600 transition-colors text-white"
                                                        title="Decline"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                            <a href={`mailto:${inq.email}`} className="p-2 bg-gray-700 rounded-lg hover:bg-indigo-600 transition-colors text-white" title="Email">
                                                <Mail size={14} />
                                            </a>
                                            <a href={`tel:${inq.phone}`} className="p-2 bg-gray-700 rounded-lg hover:bg-emerald-600 transition-colors text-white" title="Call">
                                                <Phone size={14} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity Table (Mock) */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Recent Registrations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-700/50 text-gray-200 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {recentUsers.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4">No recent registrations</td></tr>
                            ) : recentUsers.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">{item.name.charAt(0)}</div>
                                        <span className="text-white">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{item.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
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
