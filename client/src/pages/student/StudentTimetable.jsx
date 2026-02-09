import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentTimetable = () => {
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const { data } = await api.get('/student/timetable');
                setTimetable(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTimetable();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Weekly Roadmap</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Strategize your academic journey with precise scheduling</p>
                </div>
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
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Operational Break</p>
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
