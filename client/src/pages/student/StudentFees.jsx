import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StudentFees = () => {
    const { user } = useAuth();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/fees/student/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFees(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user?._id) fetchFees();
    }, [user]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">My Fees</h1>
                <p className="text-slate-400 text-sm">Track your tuition and other payments</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Paid</p>
                    <h3 className="text-2xl font-bold text-emerald-400">
                        ${fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </h3>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Pending</p>
                    <h3 className="text-2xl font-bold text-amber-400">
                        ${fees.filter(f => f.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </h3>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Overdue</p>
                    <h3 className="text-2xl font-bold text-red-400">
                        ${fees.filter(f => f.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Fee List */}
            <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h3 className="font-bold text-white">Fee History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-sm border-b border-white/5">
                                <th className="p-4">Description</th>
                                <th className="p-4">Semester</th>
                                <th className="p-4">Due Date</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center">Loading...</td></tr>
                            ) : fees.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No fee records found</td></tr>
                            ) : fees.map((fee) => (
                                <tr key={fee._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="p-4 font-medium text-white">{fee.type} Fee</td>
                                    <td className="p-4">{fee.semester}</td>
                                    <td className="p-4">{new Date(fee.dueDate).toLocaleDateString()}</td>
                                    <td className="p-4">${fee.amount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs font-bold border ${fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                fee.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {fee.status === 'Paid' ? <CheckCircle size={12} /> :
                                                fee.status === 'Pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                                            {fee.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        {fee.status === 'Paid' && (
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                                                <Download size={16} />
                                            </button>
                                        )}
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

export default StudentFees;
