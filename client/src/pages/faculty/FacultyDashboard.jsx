import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext'; // Import Socket
import { Users, BookOpen, Clock, Activity } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const FacultyDashboard = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        todayClasses: 0,
        pendingTasks: 0
    });
    const [loading, setLoading] = useState(true);

    const [attendanceData, setAttendanceData] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/faculty/dashboard');
                setStats(data.stats);
                setAttendanceData(data.attendanceChart || []);
                setSchedule(data.todaySchedule || []);
            } catch (error) {
                console.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();

        if (socket) {
            // Real-time updates
            socket.on('enrollment:new', () => {
                // Ideally trigger a specific update, but re-fetching stats is easier for now
                fetchStats();
            });
            socket.on('attendance:new', () => {
                fetchStats();
            });
        }

        return () => {
            if (socket) {
                socket.off('enrollment:new');
                socket.off('attendance:new');
            }
        }
    }, [socket]);

    const cards = [
        { title: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { title: 'Today\'s Classes', value: stats.todayClasses, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { title: 'Pending Tasks', value: stats.pendingTasks, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];



    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((stat, i) => (
                    <div key={i} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group flex items-center justify-between shadow-xl">
                        <div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} shadow-lg`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Chart */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Average Attendance by Course</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #ffffff10', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar dataKey="attendance" fill="url(#facultyBar)" radius={[6, 6, 0, 0]} barSize={40}>
                                    <defs>
                                        <linearGradient id="facultyBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#059669" />
                                        </linearGradient>
                                    </defs>
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Upcoming Classes</h3>
                    <div className="space-y-4">
                        {schedule.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No classes scheduled for today.</p>
                        ) : schedule.map((cls, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-white/5 hover:border-white/10 active:scale-[0.98]">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex flex-col items-center justify-center font-bold border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                    <span className="text-sm leading-none">{cls.time.split(' ')[0]}</span>
                                    <span className="text-[10px] uppercase mt-1">{cls.time.split(' ')[1] || 'AM'}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-100 text-lg group-hover:text-emerald-400 transition-colors">{cls.subject}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{cls.class} • Room {cls.room}</p>
                                </div>
                                <button className="ml-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-90">
                                    Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
