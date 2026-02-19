import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, BookOpen, CheckCircle, Target, Sparkles, Brain, Zap } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';

const AnalyticsPortal = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        fetchAnalytics();
        fetchBadges();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const endpoint = user.role === 'faculty' ? '/analytics/faculty' : '/analytics/student';
            const { data } = await api.get(endpoint);
            setData(data);
        } catch (error) {
            toast.error('Failed to sync performance data');
        } finally {
            setLoading(false);
        }
    };

    const fetchBadges = async () => {
        try {
            const { data } = await api.get('/badges/my');
            setBadges(data);
        } catch (error) { }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Processing Academic Intelligence...</div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-10 pb-20 font-sans">
            <ToastContainer theme="dark" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Performance Intel</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Data-driven insights into your learning journey</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 glass border border-white/5 rounded-2xl flex items-center gap-3">
                        <TrendingUp className="text-primary" size={20} />
                        <div>
                            <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Status</p>
                            <p className="text-xs font-black text-white uppercase tracking-tighter">Growth Phase</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Completion rate', value: user.role === 'faculty' ? `${data.totalStudents} Students` : `${Math.round(data.summary.overallProgress)}%`, icon: Target, color: 'text-primary' },
                    { label: user.role === 'faculty' ? 'Total Revenue' : 'Avg. Grade', value: user.role === 'faculty' ? `$${data.totalEarnings}` : `${Math.round(data.summary.averageGrade)}%`, icon: Sparkles, color: 'text-amber-500' },
                    { label: 'Active Tasks', value: user.role === 'faculty' ? data.coursePerformance.length : data.summary.totalCourses, icon: Brain, color: 'text-indigo-400' },
                    { label: 'Achievements', value: badges.length, icon: Award, color: 'text-emerald-500' }
                ].map((stat, i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="glass p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-white/10 transition-all">
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} border border-white/5`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-white tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass p-10 rounded-[3rem] border border-white/5 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-white">Course Progression</h3>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Live Progress</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={user.role === 'faculty' ? data.coursePerformance : data.courseProgress}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #ffffff10', fontWeight: 'bold' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar dataKey={user.role === 'faculty' ? 'students' : 'progress'} fill="#6366f1" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Achievements List */}
                <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-8">
                    <h3 className="text-xl font-black text-white flex items-center gap-3"><Award className="text-amber-500" /> Earned Badges</h3>
                    <div className="space-y-4">
                        {badges.length === 0 ? (
                            <div className="text-center py-10 opacity-20">
                                <Zap size={40} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No badges awarded yet</p>
                            </div>
                        ) : (
                            badges.map(badge => (
                                <div key={badge._id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-500 border border-amber-500/10">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white">{badge.name}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Unlocked Achievement</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">View All Challenges</button>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="glass p-10 rounded-[3rem] border border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">AI Knowledge Insight</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {user.role !== 'faculty' && data.courseProgress.map((cp, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex justify-between items-end">
                                <p className="text-xs font-black text-white truncate w-2/3">{cp.title}</p>
                                <p className="text-[10px] font-black text-primary">{cp.progress}%</p>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cp.progress}%` }}
                                    className="h-full bg-gradient-to-r from-primary to-indigo-400"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPortal;
