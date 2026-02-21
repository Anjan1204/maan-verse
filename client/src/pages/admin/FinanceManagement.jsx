import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Users, TrendingUp, Download, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
// import api from '../utils/api'; // Removed unused import
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';

const FinanceManagement = () => {
    const [fees, setFees] = useState([]);
    const [stats, setStats] = useState({ total: 0, collected: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            // Mock data for now as per ERP requirements
            const mockFees = [
                { _id: '1', student: { name: 'Aryan Sharma' }, amount: 2500, status: 'Paid', type: 'Tuition', date: '2025-10-15' },
                { _id: '2', student: { name: 'Priya Verma' }, amount: 1500, status: 'Pending', type: 'Exam', date: '2025-11-01' },
                { _id: '3', student: { name: 'Rahul Gupta' }, amount: 500, status: 'Paid', type: 'Library', date: '2025-10-20' },
                { _id: '4', student: { name: 'Sanya Malhotra' }, amount: 3000, status: 'Overdue', type: 'Hostel', date: '2025-09-30' },
            ];
            setFees(mockFees);
            setStats({ total: 7500, collected: 3000, pending: 4500 });
        } catch (error) {
            console.error(error);
            toast.error('Financial sync failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-indigo-400 font-bold tracking-widest uppercase text-xs">Syncing Ledger Records...</div>;

    return (
        <div className="space-y-10 pb-20 font-sans">
            <ToastContainer theme="dark" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight uppercase">Economic Terminal</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Enterprise-grade financial oversight and payroll</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all">Audit Report</button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-indigo-500/20">Generate Payroll</button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Receivables', value: `₹${stats.total}`, icon: CreditCard, color: 'text-indigo-400' },
                    { label: 'Revenue Collected', value: `₹${stats.collected}`, icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Variance / Pending', value: `₹${stats.pending}`, icon: ArrowDownLeft, color: 'text-amber-500' }
                ].map((stat, i) => (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center ${stat.color} border border-white/10`}>
                            <stat.icon size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ledger Table */}
            <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
                    <h3 className="text-xl font-black text-white">Active Ledger</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                            <input type="text" placeholder="Search accounts..." className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        <select className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-black uppercase text-gray-400 outline-none" value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Tuition">Tuition</option>
                            <option value="Exam">Exam</option>
                            <option value="Hostel">Hostel</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/[0.01]">
                            <tr>
                                {['Account Holder', 'Type', 'Amount', 'Filing Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {fees.map(fee => (
                                <tr key={fee._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover:scale-110 transition-transform">
                                                {fee.student.name.charAt(0)}
                                            </div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{fee.student.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6"><span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{fee.type}</span></td>
                                    <td className="px-8 py-6 font-black text-white text-base tracking-tighter">₹{fee.amount}</td>
                                    <td className="px-8 py-6 text-[10px] font-medium text-gray-500">{fee.date}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            fee.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>{fee.status}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceManagement;
