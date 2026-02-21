import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    CheckSquare,
    Users,
    LogOut,
    Menu,
    ChevronRight,
    Award,
    Bell,
    User,
    ClipboardList,
    Folders,
    MessageSquare,
    ClipboardPen,
    DollarSign,
    BarChart2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationDropdown from '../components/NotificationDropdown';
import { motion } from 'framer-motion';

const FacultyLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/faculty/dashboard', icon: LayoutDashboard },
        { name: 'Profile', href: '/faculty/profile', icon: User },
        { name: 'My Classes', href: '/faculty/classes', icon: BookOpen },
        { name: 'Attendance', href: '/faculty/attendance', icon: CheckSquare },
        { name: 'Analytics', href: '/faculty/analytics', icon: BarChart2 },
        { name: 'Assignments', href: '/faculty/assignments', icon: ClipboardList },
        { name: 'Resources', href: '/faculty/resources', icon: Folders },
        { name: 'Messaging', href: '/faculty/messaging', icon: MessageSquare },
        { name: 'Leave Requests', href: '/faculty/leave', icon: ClipboardPen, category: 'Academic' },
        { name: 'My Payroll', href: '/faculty/payroll', icon: DollarSign, category: 'Personal' },
        { name: 'Notices', href: '/faculty/notices', icon: Bell, category: 'Support' },
        { name: 'Students', href: '/faculty/students', icon: Users },
        { name: 'Grades', href: '/faculty/grades', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-dark flex text-slate-300 font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 260 }}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-dark border-r border-white/5 flex flex-col transition-all duration-300 fixed h-full z-20 shadow-2xl`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3 overflow-hidden text-emerald-500">
                        <Users size={24} />
                        {isSidebarOpen && <span className="text-xl font-bold truncate tracking-tight text-white uppercase italic">Faculty Panel</span>}
                    </div>
                </div>

                {/* Info Card */}
                {isSidebarOpen && (
                    <div className="px-4 py-6">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <span className="font-bold">{user?.name?.charAt(0)}</span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm truncate">{user?.name}</p>
                                    <p className="text-xs text-white/80 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <p className="text-xs text-white/70 mt-2">{user?.facultyProfile?.department || 'Department of Engg.'}</p>
                        </div>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 py-6 space-y-1.5 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-500 overflow-y-auto scrollbar-hide">
                    {isSidebarOpen && <div className="px-2 mb-2">Academic</div>}
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-emerald-500 capitalize text-sm font-medium'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-500'} />
                                {isSidebarOpen && (
                                    <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                                        {item.name}
                                    </span>
                                )}
                                {isActive && isSidebarOpen && (
                                    <ChevronRight size={16} className="ml-auto text-white/50" />
                                )}
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:bg-red-500/10 hover:text-red-500 capitalize text-sm font-medium w-full mt-1`}
                    >
                        <LogOut size={20} className="text-slate-500 group-hover:text-red-500" />
                        {isSidebarOpen && (
                            <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                                Logout
                            </span>
                        )}
                    </button>
                </nav>

                <div className="p-4 border-t border-white/5 text-gray-400">
                    <p className="text-[10px] text-center uppercase tracking-widest opacity-30">© 2026 MAAN-verse</p>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="h-20 bg-dark/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 font-sans">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg border border-white/5"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white tracking-tight italic">
                            {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-8">
                        <NotificationDropdown />
                        <div className="relative group cursor-pointer">
                            <img
                                src={user?.profile?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                alt="Faculty"
                                className="w-11 h-11 rounded-full border-2 border-white/10 p-0.5 group-hover:border-emerald-500/50 transition-all shadow-xl"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-dark"></span>
                        </div>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-y-auto w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FacultyLayout;
