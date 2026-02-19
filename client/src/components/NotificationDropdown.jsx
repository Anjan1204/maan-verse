import React, { useState, useEffect, useRef } from 'react';
import { Bell, Info, AlertTriangle, Calendar, FileText, MessageSquare, ExternalLink, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
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

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    // Socket Integration
    useEffect(() => {
        if (socket && user) {
            socket.on('notification:received', (notification) => {
                setNotifications(prev => [notification, ...prev].slice(0, 20));
            });

            return () => {
                socket.off('notification:received');
            };
        }
    }, [socket, user]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Message': return <MessageSquare size={16} className="text-blue-500" />;
            case 'Leave': return <Calendar size={16} className="text-purple-500" />;
            case 'Notice': return <AlertTriangle size={16} className="text-amber-500" />;
            default: return <Info size={16} className="text-emerald-500" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-xl border border-white/5 group"
            >
                <Bell size={20} className={`group-hover:rotate-12 transition-transform ${isOpen ? 'text-emerald-400' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
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
                            <h3 className="font-bold text-white text-sm tracking-tight">System Alerts</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-[10px] text-emerald-500 hover:text-emerald-400 font-black uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    <Check size={10} /> Mark all
                                </button>
                            )}
                        </div>

                        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                            {loading && notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-xs animate-pulse font-bold uppercase tracking-widest">Scanning Uplinks...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                        <Bell size={16} className="text-gray-600" />
                                    </div>
                                    <p className="font-bold uppercase tracking-widest text-[10px] opacity-40">No new signals detected</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => !n.read && markAsRead(n._id)}
                                        className={`p-4 border-b border-white/5 transition-all cursor-pointer relative group ${n.read ? 'opacity-50' : 'bg-white/[0.02]'}`}
                                    >
                                        {!n.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500"></div>}
                                        <div className="flex gap-3">
                                            <div className={`mt-1 p-2 rounded-lg h-fit border transition-colors ${n.read ? 'bg-white/5 border-white/5' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className={`text-xs font-black truncate ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.title}</p>
                                                    <span className="text-[8px] text-gray-600 font-bold whitespace-nowrap mt-0.5">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className={`text-[11px] mt-1 leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-300'}`}>{n.message}</p>
                                                {n.link && (
                                                    <a href={n.link} className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2 hover:text-emerald-400 transition-colors">
                                                        Access Node <ExternalLink size={8} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                            <button className="w-full py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">
                                Neural Network Status: Nominal
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
