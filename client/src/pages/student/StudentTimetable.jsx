import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import { Clock, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [studentInfo, setStudentInfo] = useState({ branch: '', semester: '' });
    const socket = useSocket();

    const fetchTimetable = useCallback(async () => {
        try {
            const { data } = await api.get('/student/timetable');
            setTimetable(data);

            // Get current user info from localStorage to see what we're matching
            const user = JSON.parse(localStorage.getItem('userInfo'));
            setStudentInfo({
                branch: user?.studentProfile?.branch || 'Not Set',
                semester: user?.studentProfile?.semester || 'Not Set'
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchTimetable();
    }, [fetchTimetable]);

    useEffect(() => {
        if (socket) {
            socket.on('timetable:published', (data) => {
                fetchTimetable();
            });
        }
        return () => {
            if (socket) {
                socket.off('timetable:published');
            }
        };
    }, [socket, fetchTimetable]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Weekly Roadmap</h1>
                    <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] px-3 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full font-black uppercase tracking-widest">Branch: <span className="text-primary">{studentInfo.branch}</span></span>
                        <span className="text-[10px] px-3 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-full font-black uppercase tracking-widest">Semester: <span className="text-primary">{studentInfo.semester}</span></span>
                    </div>
                </div>
                {(studentInfo.branch === 'Not Set' || studentInfo.semester === 'Not Set') && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4 max-w-md"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                            <Clock size={20} />
                        </div>
                        <p className="text-[10px] text-orange-200/70 font-bold leading-relaxed">
                            Your profile is incomplete. Please update your <strong className="text-orange-400">Branch</strong> and <strong className="text-orange-400">Semester</strong> in settings to see your assigned timetable.
                        </p>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {days.map((day, dayIdx) => {
                    const daySchedule = timetable.find(d => d.day === day) || { slots: [] };

                    return (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: dayIdx * 0.1 }}
                            className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col hover:border-primary/20 transition-all group group/day"
                        >
                            <div className="bg-white/[0.02] px-8 py-6 border-b border-white/5 flex justify-between items-center group-hover/day:bg-white/[0.04] transition-colors">
                                <h3 className="font-black text-white text-lg tracking-tight group-hover/day:text-primary transition-colors">{day}</h3>
                                <span className="text-[9px] px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-black uppercase tracking-widest">{daySchedule.slots.length} Activities</span>
                            </div>
                            <div className="divide-y divide-white/5 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {daySchedule.slots.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center justify-center h-full opacity-40">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                                            <Clock size={24} className="text-gray-600" />
                                        </div>
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-relaxed text-center px-4">Nothing Scheduled</p>
                                        <p className="text-gray-600 text-[8px] font-bold uppercase tracking-widest text-center px-6">Ensure your Profile Branch/Sem match precisely with Faculty inputs</p>
                                    </div>
                                ) : (
                                    daySchedule.slots.map((slot, i) => (
                                        <div key={i} className="p-8 hover:bg-white/[0.03] transition-all group/slot cursor-default relative overflow-hidden">
                                            <div className="flex items-center gap-5 mb-4 relative z-10">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-lg group-hover/slot:shadow-primary/20 group-hover/slot:scale-110 transition-all duration-500">
                                                    <Clock size={20} className="group-hover/slot:rotate-12 transition-transform" />
                                                </div>
                                                <div>
                                                    <span className="font-black text-white text-xl tracking-tighter block leading-none">{slot.time}</span>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Class Period</span>
                                                </div>
                                            </div>
                                            <div className="ml-[68px] relative z-10">
                                                <h4 className="font-black text-gray-200 group-hover/slot:text-white transition-colors tracking-tight text-base leading-tight">{slot.subject}</h4>
                                                <div className="flex flex-wrap items-center gap-3 mt-4">
                                                    <span className="text-[9px] font-black px-2.5 py-1 bg-white/5 text-gray-400 rounded-lg border border-white/5 uppercase tracking-widest">Rm: {slot.room}</span>
                                                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none">{slot.teacher}</span>
                                                </div>
                                                {slot.meetingLink && (
                                                    <button
                                                        onClick={() => window.open(slot.meetingLink, '_blank')}
                                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
                                                    >
                                                        <Video size={14} /> Join Live Class
                                                    </button>
                                                )}
                                            </div>
                                            {/* Hover Accent */}
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover/slot:opacity-100 transition-opacity" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentTimetable;
