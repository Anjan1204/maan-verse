import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { Download, CheckCircle, Clock, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';

const StudentFees = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null); // Added error state
    const fetchFees = async () => {
        try {
            const { data } = await api.get(`/fees/student/${user._id}`);
            setFees(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Financial link broken');
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (fee) => {
        try {
            setDownloading(true);
            toast.info('Generating your invoice...');
            await generateInvoicePDF(fee, user);
            toast.success('Invoice downloaded!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate invoice');
        } finally {
            setDownloading(false);
        }
    };

    const handlePayment = (feeId) => {
        navigate(`/student/pay-fee/${feeId}`);
    };

    useEffect(() => {
        if (user?._id) fetchFees();
    }, [user]);

    if (loading && fees.length === 0) return (
        <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Financial Records...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">My Fees</h1>
                <p className="text-slate-400 text-sm">Track your tuition and other payments</p>
            </div>

            {/* Overview Cards */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 overflow-hidden">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1 truncate">Total Paid</p>
                    <h3 className="text-2xl font-bold text-emerald-400 truncate" title={`₹${fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`}>
                        ₹{fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </h3>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 overflow-hidden">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1 truncate">Pending</p>
                    <h3 className="text-2xl font-bold text-amber-400 truncate" title={`₹${fees.filter(f => f.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`}>
                        ₹{fees.filter(f => f.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </h3>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 overflow-hidden">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1 truncate">Overdue</p>
                    <h3 className="text-2xl font-bold text-red-400 truncate" title={`₹${fees.filter(f => f.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`}>
                        ₹{fees.filter(f => f.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
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
                                    <td className="p-4">
                                        <p className="font-black text-white text-lg">₹{fee.amount.toLocaleString()}</p>
                                    </td>
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
                                        <div className="flex justify-end gap-2">
                                            {fee.status === 'Paid' ? (
                                                <button
                                                    onClick={() => handleDownloadInvoice(fee)}
                                                    disabled={downloading}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white disabled:opacity-50"
                                                    title="Download Invoice"
                                                >
                                                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handlePayment(fee._id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
                                                >
                                                    <CreditCard size={12} /> Pay Now
                                                </button>
                                            )}
                                        </div>
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
