import React, { useState, useEffect, useRef } from 'react';
import { Bell, Info, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notices
    useEffect(() => {
        const fetchNotices = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Determine target audience based on role
                // Admin sees everything (or we can filter for 'All')
                // Student sees 'Student' and 'All'
                // Faculty sees 'Faculty' and 'All'

                // For simplicity, let's fetch all and filter client-side or assume backend filters if params passed
                // The current backend controller accepts 'targetAudience'.
                // Ideally, we'd make 2 calls or change backend to accept 'OR'.
                // BUT, to keep "fix without error" simple:
                // Let's just fetch all notices and filter in JS for now if backend strictly filters 'targetAudience=Student' (only Student) vs 'All'.

                // Actually, backend `getNotices` code:
                // if (targetAudience) query.targetAudience = targetAudience;
                // It does exact match. So if I request 'Student', I miss 'All'.

                // Workaround: Don't pass targetAudience to get ALL, then filter client side.
                // Admin gets everything.

                const { data } = await api.get('/notices');

                let filtered = data;
                if (user.role === 'student') {
                    filtered = data.filter(n => n.targetAudience === 'Student' || n.targetAudience === 'All');
                } else if (user.role === 'faculty') {
                    filtered = data.filter(n => n.targetAudience === 'Faculty' || n.targetAudience === 'All');
                }
                // Admin sees all

                setNotices(filtered.slice(0, 5)); // Show top 5
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();

        // Optional: Poll every minute
        const interval = setInterval(fetchNotices, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const getIcon = (type) => {
        switch (type) {
            case 'Important': return <AlertTriangle size={16} className="text-red-500" />;
            case 'Event': return <Calendar size={16} className="text-purple-500" />;
            case 'Exam': return <FileText size={16} className="text-blue-500" />;
            default: return <Info size={16} className="text-emerald-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-xl border border-white/5 group"
            >
                <Bell size={20} className={`group-hover:rotate-12 transition-transform ${isOpen ? 'text-emerald-400' : ''}`} />
                {notices.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl ring-1 ring-black/5"
                    >
                        <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                            <h3 className="font-bold text-white text-sm tracking-tight">Notifications</h3>
                            <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold">{notices.length} New</span>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500 text-xs">Loading updates...</div>
                            ) : notices.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-xs">No new notifications</div>
                            ) : (
                                notices.map((notice) => (
                                    <div key={notice._id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-default group">
                                        <div className="flex gap-3">
                                            <div className="mt-1 p-2 rounded-lg bg-white/5 h-fit border border-white/5">
                                                {getIcon(notice.type)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors leading-tight">{notice.title}</p>
                                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{notice.message}</p>
                                                <p className="text-[9px] font-bold text-gray-600 mt-2 uppercase tracking-widest">{new Date(notice.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {notices.length > 0 && (
                            <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                                <button className="w-full py-2 text-center text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-colors">
                                    View All Notices
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
