import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Download,
    MoreVertical,
    DollarSign,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Users,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useSocket } from '../../hooks/useSocket';
import { toast, ToastContainer } from 'react-toastify';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';

const AdminFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('single'); // 'single' or 'bulk'
    const [studentSearch, setStudentSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const socket = useSocket();

    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        type: 'Tuition',
        semester: '1st',
        branch: '',
        dueDate: ''
    });

    useEffect(() => {
        fetchFees();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('admin:join');

            socket.on('fee:updated', ({ studentName, message }) => {
                fetchFees();
                toast.success(message || `Fee payment received from ${studentName}`);
            });

            return () => {
                socket.off('fee:updated');
            };
        }
    }, [socket]);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/fees');
            setFees(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSearch = async (val) => {
        setStudentSearch(val);
        if (val.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const { data } = await api.get(`/users/search?query=${val}&role=student`);
            setSearchResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = modalType === 'single' ? '/fees' : '/fees/bulk';

            const payload = modalType === 'single'
                ? { ...formData, studentId: selectedStudent?._id }
                : formData;

            await api.post(url, payload);

            setShowModal(false);
            setFormData({ studentId: '', amount: '', type: 'Tuition', semester: '1st', branch: '', dueDate: '' });
            setSelectedStudent(null);
            setStudentSearch('');
            fetchFees();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error creating fee record.');
        }
    };

    const markAsPaid = async (id) => {
        if (!window.confirm('Mark this fee as PAID?')) return;
        try {
            await api.put(`/fees/${id}`, { status: 'Paid' });
            fetchFees();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredFees = fees.filter(fee =>
        fee.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.student?.studentProfile?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Chart Data
    const chartData = [
        { name: 'Paid', value: fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0), color: '#10b981' },
        { name: 'Pending', value: fees.filter(f => f.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0), color: '#f59e0b' },
        { name: 'Overdue', value: fees.filter(f => f.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0), color: '#ef4444' }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">Fee Management</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Track and manage student fee payments</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setModalType('bulk'); setShowModal(true); }}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 border border-white/5 transition-all font-bold text-xs"
                    >
                        <Users size={16} />
                        Bulk Assign
                    </button>
                    <button
                        onClick={() => { setModalType('single'); setShowModal(true); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all font-bold text-xs"
                    >
                        <Plus size={16} />
                        Assign Fee
                    </button>
                </div>
            </div>

            {/* Stats & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <CheckCircle size={80} className="text-emerald-500" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Collected</p>
                        <h3 className="text-3xl font-black text-white mt-2 truncate" title={`₹${chartData[0].value.toLocaleString()}`}>
                            ₹{chartData[0].value.toLocaleString()}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active Collections
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Clock size={80} className="text-amber-500" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Pending</p>
                        <h3 className="text-3xl font-black text-white mt-2 truncate" title={`₹${chartData[1].value.toLocaleString()}`}>
                            ₹{chartData[1].value.toLocaleString()}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Awaiting Payment
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <XCircle size={80} className="text-red-500" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Overdue</p>
                        <h3 className="text-3xl font-black text-white mt-2 truncate" title={`₹${chartData[2].value.toLocaleString()}`}>
                            ₹{chartData[2].value.toLocaleString()}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            Past Due Date
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff', fontSize: '12px' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Search and List */}
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-700"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-slate-400 border border-white/5">
                            <Filter size={20} />
                        </button>
                        <button className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-slate-400 border border-white/5">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="p-6">Student</th>
                                <th className="p-6">Type</th>
                                <th className="p-6">Semester</th>
                                <th className="p-6">Amount</th>
                                <th className="p-6">Due Date</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 size={40} className="text-indigo-500 animate-spin" />
                                            <p className="font-black text-slate-500 uppercase tracking-widest text-xs">Syncing Ledger...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredFees.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-20 text-center">
                                        <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">No records found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredFees.map((fee) => (
                                    <tr key={fee._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-white">{fee.student?.name || 'Unknown student'}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{fee.student?.studentProfile?.rollNo || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">{fee.type}</span>
                                        </td>
                                        <td className="p-6 font-bold text-slate-400 text-xs">{fee.semester}</td>
                                        <td className="p-6">
                                            <p className="font-black text-white text-lg">₹{fee.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                                <Calendar size={14} className="text-slate-600" />
                                                {new Date(fee.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                fee.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {fee.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            {fee.status === 'Paid' ? (
                                                <button
                                                    onClick={() => generateInvoicePDF(fee, fee.student)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                                    title="Download Invoice"
                                                >
                                                    <Download size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => markAsPaid(fee._id)}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Fee Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl overflow-hidden"
                        >
                            <h2 className="text-3xl font-black text-white mb-2">{modalType === 'single' ? 'Assign Fee' : 'Bulk Assign Fees'}</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">{modalType === 'single' ? 'Create a specific record for one student' : 'Deploy fees to an entire group'}</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {modalType === 'single' ? (
                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Search Student</label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Enter name or email..."
                                                value={studentSearch}
                                                onChange={(e) => handleStudentSearch(e.target.value)}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                            />
                                            {searching && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />}
                                        </div>

                                        {searchResults.length > 0 && !selectedStudent && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                                                {searchResults.map(s => (
                                                    <div
                                                        key={s._id}
                                                        onClick={() => { setSelectedStudent(s); setStudentSearch(s.name); setSearchResults([]); }}
                                                        className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex items-center justify-between"
                                                    >
                                                        <div>
                                                            <p className="font-bold text-white text-sm">{s.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.studentProfile?.rollNo || s.email}</p>
                                                        </div>
                                                        <ChevronDown size={14} className="text-slate-600 -rotate-90" />
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}

                                        {selectedStudent && (
                                            <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-sm">{selectedStudent.name}</p>
                                                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{selectedStudent.email}</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => setSelectedStudent(null)} className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Change</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Branch</label>
                                            <select
                                                required
                                                value={formData.branch}
                                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                                            >
                                                <option value="">All Branches</option>
                                                <option>CSE</option>
                                                <option>ECE</option>
                                                <option>ME</option>
                                                <option>CE</option>
                                                <option>EE</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Semester</label>
                                            <select
                                                required
                                                value={formData.semester}
                                                onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                                            >
                                                <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                                                <option>5th</option><option>6th</option><option>7th</option><option>8th</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fee Amount (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fee Category</label>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                                        >
                                            <option>Tuition</option><option>Exam</option><option>Hostel</option>
                                            <option>Library</option><option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deadline Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.dueDate}
                                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-5 bg-slate-800 hover:bg-slate-750 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={modalType === 'single' && !selectedStudent}
                                        className="flex-1 px-4 py-5 bg-white text-black hover:bg-gray-200 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl disabled:opacity-50"
                                    >
                                        {modalType === 'single' ? 'Deploy Record' : 'Mass Deployment'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <ToastContainer theme="dark" position="bottom-right" />
        </div>
    );
};

export default AdminFees;
