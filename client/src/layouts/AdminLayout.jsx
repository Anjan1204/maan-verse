import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NotificationDropdown from '../components/NotificationDropdown';
import AdminApprovalModal from '../components/AdminApprovalModal';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [globalSearch, setGlobalSearch] = useState('');
    const [inquiries, setInquiries] = useState([]);
    const [approvalRequest, setApprovalRequest] = useState(null);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const { data } = await api.get('/inquiries');
                setInquiries(data.filter(inq => inq.status === 'Pending'));
            } catch (error) {
                console.error('Failed to fetch inquiries', error);
            }
        };
        fetchInquiries();
    }, []);

    // Listen for admin approval requests and handle connection/reconnection
    useEffect(() => {
        if (socket) {
            const joinAdminRoom = () => {
                socket.emit('admin:join');
            };

            // Join immediately if connected
            if (socket.connected) {
                joinAdminRoom();
            }

            // Join upon connection (handling initial connect and reconnects)
            socket.on('connect', joinAdminRoom);

            const handleApprovalRequest = (request) => {
                setApprovalRequest(request);
            };

            socket.on('admin:approval_request', handleApprovalRequest);

            return () => {
                socket.off('connect', joinAdminRoom);
                socket.off('admin:approval_request', handleApprovalRequest);
            };
        }
    }, [socket]);

    const handleApproveLogin = (requestId) => {
        if (socket) {
            socket.emit('admin:response', {
                requestId,
                approved: true,
                adminName: user?.name
            });
            setApprovalRequest(null);
        }
    };

    const handleRejectLogin = (requestId) => {
        if (socket) {
            socket.emit('admin:response', {
                requestId,
                approved: false,
                adminName: user?.name
            });
            setApprovalRequest(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleGlobalSearch = (e) => {
        e.preventDefault();
        if (globalSearch.trim()) {
            navigate(`/admin/users?search=${encodeURIComponent(globalSearch)}`);
            setGlobalSearch('');
        }
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-dark flex text-slate-300 font-sans">
            <AdminApprovalModal
                request={approvalRequest}
                onApprove={handleApproveLogin}
                onReject={handleRejectLogin}
            />

            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-dark border-r border-white/5 flex flex-col transition-all duration-300 fixed h-full z-20 shadow-2xl`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3 overflow-hidden text-indigo-400">
                        <Settings size={24} />
                        {isSidebarOpen && <span className="text-xl font-bold truncate tracking-tight text-white uppercase italic">Admin Panel</span>}
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-6 space-y-1.5 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-500">
                    {/* ... (rest of nav code remains same, included for context if full replacement) */}
                    {isSidebarOpen && <div className="px-2 mb-2">Systems</div>}
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-indigo-400 capitalize text-sm font-medium'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                                {isSidebarOpen && (
                                    <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-white/5 bg-white/5">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold border border-white/10">
                            <span>{user?.name?.charAt(0)}</span>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administrator</p>
                            </div>
                        )}
                        {isSidebarOpen && (
                            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>

                {/* Header */}
                <header className="h-20 bg-dark/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shadow-black/20 font-sans">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg border border-white/5"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-6">
                        <form onSubmit={handleGlobalSearch} className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search systems..."
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                                className="bg-white/5 border border-white/10 text-white placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 w-64 transition-all shadow-xl"
                            />
                        </form>
                        <div className="relative">
                            <NotificationDropdown />
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <img
                                src="https://ui-avatars.com/api/?name=Admin+User&background=random"
                                alt="Admin"
                                className="w-8 h-8 rounded-full border-2 border-gray-600"
                            />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
