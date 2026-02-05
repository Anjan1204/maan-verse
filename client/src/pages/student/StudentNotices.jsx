import React, { useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentNotices = () => {
    const notices = [
        { id: 1, title: 'Library Renovation', message: 'The central library will be closed for renovation from 15th to 20th Oct. Please return books before the 14th.', date: '2025-10-10', type: 'General' },
        { id: 2, title: 'Exam Registration Deadline', message: 'Last date to register for End Semester Exams is 25th Oct. Late fee will apply after that.', date: '2025-10-08', type: 'Important' },
        { id: 3, title: 'Tech Fest 2025', message: 'Registration open for hackathon and robotics events. Visit the student council office.', date: '2025-10-05', type: 'Event' },
    ];

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Notice Board</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Latest announcements, events, and important updates</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all flex items-center gap-2">
                        <Bell size={16} /> Configure Alerts
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {notices.map((notice, i) => (
                    <motion.div
                        key={notice.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all cursor-default"
                    >
                        {/* Status Bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${notice.type === 'Important' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                            notice.type === 'Event' ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
                                'bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                            }`}></div>

                        <div className="flex justify-between items-center mb-8">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${notice.type === 'Important' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                notice.type === 'Event' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                    'bg-primary/10 text-primary border-primary/20'
                                }`}>
                                {notice.type}
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                        </div>

                        <h3 className="text-xl font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors tracking-tight">
                            {notice.title}
                        </h3>

                        <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-1">
                            {notice.message}
                        </p>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2">
                                Access Attachment <ChevronRight size={14} />
                            </button>
                            <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-primary transition-colors shadow-lg shadow-primary/20" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State / More */}
            {notices.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active notices found</p>
                </div>
            )}
        </div>
    );
};

export default StudentNotices;
