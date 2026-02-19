import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, Send, Plus, History } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const LeaveApplication = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showApply, setShowApply] = useState(false);
    const [view, setView] = useState(user?.role === 'admin' ? 'admin' : 'user');

    const [formData, setFormData] = useState({
        type: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const [adminRemarks, setAdminRemarks] = useState({});

    useEffect(() => {
        let isMounted = true;

        const fetchLeaves = async () => {
            setLoading(true);
            try {
                const endpoint = view === 'admin' ? '/leave/admin' : '/leave/my';
                const { data } = await api.get(endpoint);
                if (isMounted) {
                    setLeaves(data);
                }
            } catch (error) {
                console.error("Leave Sync Error:", error.response?.data || error.message);
                if (isMounted) {
                    toast.error(error.response?.data?.message || 'Failed to sync leave records');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchLeaves();

        return () => {
            isMounted = false;
        };
    }, [view]);

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leave', formData);
            toast.success('Leave application broadcasted');
            setShowApply(false);
            setFormData({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
            // Manual refresh since we're already in 'user' view
            const { data } = await api.get('/leave/my');
            setLeaves(data);
        } catch (error) {
            toast.error('Application failed to transmit');
        }
    };

    const handleAction = async (id, status) => {
        try {
            await api.put(`/leave/${id}/status`, { status, adminRemark: adminRemarks[id] || '' });
            toast.success(`Leave ${status} successfully`);
            setAdminRemarks(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            // Refresh list
            const { data } = await api.get('/leave/admin');
            setLeaves(data);
        } catch (error) {
            toast.error('Decision failed to sync');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-primary font-black uppercase text-xs">Syncing Personnel Status...</div>;

    return (
        <div className="space-y-10 pb-20 font-sans">
            <ToastContainer theme="dark" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Leave Management</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Digital absence tracking and approval system</p>
                </div>
                {user.role !== 'admin' && !showApply && (
                    <button
                        onClick={() => setShowApply(true)}
                        className="px-8 py-3 bg-primary text-white rounded-2xl font-black hover:scale-105 shadow-2xl shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        Apply for Leave <Plus size={20} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showApply && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="glass p-10 rounded-[3rem] border border-primary/20 overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-white">New Application</h3>
                            <button onClick={() => setShowApply(false)} className="text-gray-500 hover:text-white"><XCircle /></button>
                        </div>
                        <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Absence Type</label>
                                <select className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/20" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option className="bg-dark" value="Sick Leave">Sick Leave</option>
                                    <option className="bg-dark" value="Casual Leave">Casual Leave</option>
                                    <option className="bg-dark" value="Emergency">Emergency</option>
                                    <option className="bg-dark" value="Other">Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Start Date</label>
                                    <input type="date" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">End Date</label>
                                    <input type="date" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Reason for Absence</label>
                                <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white min-h-[120px] outline-none focus:ring-2 focus:ring-primary/20" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} placeholder="Briefly explain your situation..." required />
                            </div>
                            <button type="submit" className="md:col-span-2 py-5 bg-white text-black rounded-[2rem] font-black hover:scale-[1.02] shadow-2xl transition-all">Submit Application</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2 px-2">
                    <History size={18} className="text-gray-500" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">{view === 'admin' ? 'Pending Review Registry' : 'My Leave Protocol'}</h2>
                </div>
                {leaves.length === 0 ? (
                    <div className="text-center py-20 glass border border-dashed border-white/5 rounded-[3rem]">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-600">No active leave logs found</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {leaves.map(leave => (
                            <div key={leave._id} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.02] transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusStyle(leave.status)}`}>
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-black text-white">{leave.type}</h4>
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(leave.status)}`}>{leave.status}</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500">
                                                {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                                            </p>
                                            {view === 'admin' && (
                                                <p className="text-[10px] font-black text-primary uppercase mt-2">{leave.user.name} ({leave.role})</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 md:max-w-md">
                                        <p className="text-sm text-gray-400 font-medium italic">"{leave.reason}"</p>
                                        {leave.adminRemark && (
                                            <div className="mt-4 p-3 bg-white/5 border-l-2 border-primary rounded-r-xl">
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Admin Remark</p>
                                                <p className="text-xs text-gray-400 font-bold">{leave.adminRemark}</p>
                                            </div>
                                        )}
                                    </div>
                                    {view === 'admin' && leave.status === 'Pending' && (
                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            <input
                                                type="text"
                                                placeholder="Remark..."
                                                className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-primary/30"
                                                value={adminRemarks[leave._id] || ''}
                                                onChange={e => setAdminRemarks(prev => ({ ...prev, [leave._id]: e.target.value }))}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleAction(leave._id, 'Approved')} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest">Approve</button>
                                                <button onClick={() => handleAction(leave._id, 'Rejected')} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest">Reject</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveApplication;
