import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Clock,
    Bell,
    User,
    LogOut,
    Menu,
    GraduationCap,
    FileText,
    MessageSquare,
    ClipboardPen,
    BarChart2,
    DollarSign
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationDropdown from '../components/NotificationDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import AITutor from '../components/AITutor';

const StudentLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard, category: 'Main' },
        { name: 'My Profile', href: '/student/profile', icon: User, category: 'Personal' },
        { name: 'Attendance', href: '/student/attendance', icon: Calendar, category: 'Academic' },
        { name: 'Timetable', href: '/student/timetable', icon: Clock, category: 'Academic' },
        { name: 'Analytics', href: '/student/analytics', icon: BarChart2, category: 'Academic' },
        { name: 'Exams & Results', href: '/student/exams', icon: FileText, category: 'Academic' },
        { name: 'Messaging', href: '/student/messaging', icon: MessageSquare, category: 'Support' },
        { name: 'My Fees', href: '/student/fees', icon: DollarSign, category: 'Personal' },
        { name: 'Apply Leave', href: '/student/leave', icon: ClipboardPen, category: 'Support' },
        { name: 'Notices', href: '/student/notices', icon: Bell, category: 'Support' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans selection:bg-primary/30 selection:text-white">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 260 }}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className={`${isSidebarOpen ? 'w-[260px]' : 'w-20'} glass border-r border-white/5 flex flex-col transition-all duration-300 fixed h-full z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]`}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center justify-between px-6 border-b border-white/5">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-lg font-bold truncate tracking-tight text-white"
                            >
                                MAAN<span className="text-primary">-verse</span>
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Info Card (Student specific) */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="px-4 py-6"
                        >
                            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-4 text-white shadow-xl backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full border-2 border-primary/50 overflow-hidden bg-white/10 p-0.5">
                                        <img
                                            src={user?.profile?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                            alt="avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm truncate">{user?.name || 'Student'}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Sem: {user?.studentProfile?.semester || '1st'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5 pt-3 border-t border-white/5">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-gray-500 font-bold uppercase">Branch</span>
                                        <span className="text-primary font-bold">{user?.studentProfile?.branch || 'CSE'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-gray-500 font-bold uppercase">Roll No</span>
                                        <span className="text-white font-bold">{user?.studentProfile?.rollNo || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Nav Items */}
                <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto custom-scrollbar">
                    {['Main', 'Academic', 'Personal', 'Support'].map((cat) => (
                        <div key={cat} className="mb-4">
                            {isSidebarOpen && (
                                <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{cat}</p>
                            )}
                            {navigation.filter(item => item.category === cat).map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative mb-1 ${isActive
                                            ? 'bg-primary/20 text-white shadow-[0_0_20px_rgba(79,70,229,0.1)]'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                            />
                                        )}
                                        <item.icon size={20} className={isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary transition-colors'} />
                                        {isSidebarOpen && (
                                            <span className={`text-sm font-semibold transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>
                                                {item.name}
                                            </span>
                                        )}
                                        {isActive && isSidebarOpen && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-300 group ${!isSidebarOpen && 'justify-center font-bold'}`}
                    >
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-wider">Logout System</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-[260px]' : 'ml-20'} relative`}>

                {/* Header */}
                <header className="h-24 bg-dark/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="text-gray-400 hover:text-white transition-all p-3 hover:bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 active:scale-95"
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
                            </h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Maan-Verse Academy Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Status Tags */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    System Online
                                </span>
                                <span className="text-[9px] text-gray-500 font-medium">Last Sync: Just now</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                        </div>

                        {/* Date Display */}
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-black text-white uppercase tracking-tighter">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Academic Year 2025-26</p>
                        </div>

                        {/* Notifications */}
                        <NotificationDropdown />
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-8 flex-1 overflow-y-auto w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>

            {/* Floating AI Tutor Widget */}
            <AITutor />


        </div>
    );
};

export default StudentLayout;
