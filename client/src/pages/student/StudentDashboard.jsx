import React, { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';
import {
    Calendar, Clock, BookOpen, ChevronRight, Bell, Activity, Award, PlayCircle, Star, ShoppingBag, CheckCircle, TrendingUp, AlertCircle, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const [dashboardData, setDashboardData] = useState(null);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // DEBUG LOGGING
    console.log('StudentDashboard Render:', { loading, error, dashboardData, availableCourses });

    const fetchDashboard = useCallback(async () => {
        try {
            console.log('Fetching Dashboard Data...');
            setLoading(true);
            const { data } = await api.get('/student/dashboard');
            console.log('Dashboard Data Received:', data);
            setDashboardData(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCourses = useCallback(async () => {
        try {
            console.log('Fetching Courses...');
            const { data } = await api.get('/courses');
            console.log('Courses Received:', data);
            // Filter out already enrolled
            const enrolledIds = dashboardData?.enrollments?.map(e => e.course._id) || [];
            const filtered = data.filter(c => !enrolledIds.includes(c._id));
            setAvailableCourses(filtered.slice(0, 4));
        } catch (err) {
            console.error('Failed to fetch courses', err);
            // Don't block dashboard if courses fail
        }
    }, [dashboardData]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        if (dashboardData) {
            fetchCourses();
        }
    }, [dashboardData, fetchCourses]);

    useEffect(() => {
        if (socket) {
            socket.on('notice:new', (newNotice) => {
                console.log('Socket notice:new:', newNotice);
                setDashboardData(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        notices: [newNotice, ...prev.notices].slice(0, 5) // Keep top 5
                    };
                });
            });
        }
        return () => {
            if (socket) {
                socket.off('notice:new');
            }
        };
    }, [socket]);

    // Mock chart data for attendance graph
    const attendanceData = [
        { name: 'Mon', present: 1 },
        { name: 'Tue', present: 1 },
        { name: 'Wed', present: 0.8 },
        { name: 'Thu', present: 1 },
        { name: 'Fri', present: 0.9 },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse uppercase tracking-widest text-xs">Authenticating Academic Data...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 animate-pulse">
                <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-white">Connection Interrupted</h2>
            <p className="text-gray-500 max-w-md text-center">{error}</p>
            <button
                onClick={fetchDashboard}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/80 transition-all active:scale-95"
            >
                Retry Connection
            </button>
        </div>
    );

    const stats = [
        { title: 'Attendance', value: `${dashboardData?.stats?.attendancePercentage || 0}%`, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', footer: 'Total Lectures: 120' },
        { title: 'Enrolled Courses', value: dashboardData?.stats?.enrolledCount || 0, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', footer: '2 New Assignments' },
        { title: 'Pending Notices', value: dashboardData?.notices?.length || 0, icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', footer: 'Priority: High' },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 rounded-[2.5rem] p-12 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] relative overflow-hidden border border-white/10 group"
            >
                <div className="relative z-10 max-w-2xl">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block"
                    >
                        Academic Overview
                    </motion.span>
                    <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">
                        Welcome Back,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">{dashboardData?.profile?.name || 'Scholar'}! 👋</span>
                    </h1>
                    <p className="text-indigo-100/80 text-lg font-medium leading-relaxed mb-10">
                        Your academic performance is <span className="text-white font-bold italic underline underline-offset-4 decoration-white/30">Exemplary</span> this week. You have <span className="text-white font-bold">{dashboardData?.exams?.length || 0} exams</span> scheduled soon.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/student/timetable')}
                            className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-black/20 flex items-center gap-2 group/btn">
                            View Study Plan
                            <TrendingUp size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/student/exams')}
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black hover:bg-white/20 transition-all active:scale-95">
                            Exam Center
                        </button>
                    </div>
                </div>
                {/* Visual Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.05] rounded-full -mr-40 -mt-40 blur-[80px] group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 right-10 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <GraduationCap size={400} />
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-[2rem] p-8 border border-white/5 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-black text-white tracking-tighter block">{stat.value}</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{stat.title}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.footer}</p>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>

            {/* My Learning Section */}
            {dashboardData?.enrollments?.length > 0 && (
                <section className="space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Resume Learning</span>
                            <h3 className="text-3xl font-black text-white tracking-tight">Your Enrolled Courses</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardData.enrollments.map((enrollment, i) => (
                            <motion.div
                                key={enrollment._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => navigate(`/student/course/${enrollment.course._id}`)}
                                className="glass rounded-[2rem] p-6 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex gap-5">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                                        <img
                                            src={enrollment.course.thumbnail}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h4 className="text-white font-bold text-sm line-clamp-1">{enrollment.course.title}</h4>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            <div className="w-1 h-1 rounded-full bg-primary"></div>
                                            <span>Progress: {enrollment.progress || 0}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${enrollment.progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="self-center p-3 rounded-full bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Attendance Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/5 shadow-2xl"
                >
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Performance Analytics</span>
                            <h3 className="text-3xl font-black text-white tracking-tight">Academic Engagement</h3>
                        </div>
                        <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                            <span className="flex items-center text-[10px] font-bold text-gray-400 px-3 py-1.5 rounded-xl bg-white/5"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div> Weekly</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#ffffff08" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#ffffff03' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                        backdropFilter: 'blur(12px)',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Bar
                                    dataKey="present"
                                    fill="url(#colorBar)"
                                    radius={[12, 12, 4, 4]}
                                    barSize={60}
                                    animationDuration={2000}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Upcoming Notices/Events */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="glass rounded-[2.5rem] p-10 border border-white/5 shadow-2xl flex flex-col"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black text-white tracking-tight">Intelligence Feed</h3>
                        <button onClick={() => navigate('/student/notices')} className="text-secondary text-xs font-black uppercase tracking-widest hover:text-white transition-colors">History</button>
                    </div>
                    <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {(!dashboardData?.notices || dashboardData.notices.length === 0) ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center bg-white/[0.02] rounded-[2rem] border border-white/5 border-dashed">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-600">
                                    <Bell size={32} />
                                </div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No Active Updates</p>
                            </div>
                        ) : (
                            dashboardData?.notices?.map((notice, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex gap-4 relative z-10">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex flex-col items-center justify-center text-primary font-black border border-white/5">
                                            <span className="text-sm leading-none">{new Date(notice.date).getDate()}</span>
                                            <span className="text-[10px] uppercase tracking-tighter mt-1">{new Date(notice.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-1">{notice.title}</h4>
                                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">{notice.message}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 relative z-10">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-[0.1em] uppercase border ${notice.type === 'Important'
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                            : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                            }`}>
                                            {notice.type}
                                        </span>
                                        <Clock size={12} className="text-gray-600" />
                                    </div>
                                    {/* Active Background */}
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors" />
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* New Courses Section */}
            {availableCourses.length > 0 && (
                <section className="space-y-8 mt-12">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 block">Upgrade Your Skills</span>
                            <h3 className="text-3xl font-black text-white tracking-tight">New Courses for You</h3>
                        </div>
                        <button
                            onClick={() => navigate('/courses')}
                            className="text-gray-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            Explore All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {availableCourses.map((course, i) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-500 group"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                                        {course.category}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="text-white font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h4>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            <Star size={10} className="text-secondary" />
                                            <span>{course.faculty?.name || 'Top Faculty'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-xl font-black text-white">${course.price}</span>
                                        <button
                                            onClick={() => navigate(`/purchase/${course._id}`)}
                                            className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10 active:scale-90"
                                        >
                                            <ShoppingBag size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default StudentDashboard;
