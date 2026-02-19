import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Download,
    DollarSign,
    Calendar,
    CheckCircle,
    Clock,
    User,
    Users,
    ChevronDown,
    Loader2,
    TrendingUp,
    CreditCard
} from 'lucide-react';

const AdminPayroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('single'); // 'single' or 'bulk'

    const [facultySearch, setFacultySearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    const [formData, setFormData] = useState({
        facultyId: '',
        month: '',
        baseSalary: '',
        bonuses: '0',
        deductions: '0'
    });

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const fetchPayrolls = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payroll`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayrolls(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFacultySearch = async (val) => {
        setFacultySearch(val);
        if (val.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/search?query=${val}&role=faculty`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            const token = localStorage.getItem('token');
            const url = modalType === 'single'
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payroll`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payroll/bulk`;

            const payload = modalType === 'single'
                ? { ...formData, facultyId: selectedFaculty?._id }
                : formData;

            await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });

            setShowModal(false);
            setFormData({ facultyId: '', month: '', baseSalary: '', bonuses: '0', deductions: '0' });
            setSelectedFaculty(null);
            setFacultySearch('');
            fetchPayrolls();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error generating payroll.');
        }
    };

    const markAsPaid = async (id) => {
        if (!window.confirm('Mark this payroll as PAID?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payroll/${id}`,
                { status: 'Paid' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPayrolls();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredPayrolls = payrolls.filter(p =>
        p.faculty?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.month.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPaid = payrolls.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.netSalary, 0);
    const totalPending = payrolls.filter(p => p.status === 'Generated').reduce((acc, curr) => acc + curr.netSalary, 0);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">Payroll Management</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manage faculty salaries and payouts</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setModalType('bulk'); setShowModal(true); }}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 border border-white/5 transition-all font-bold text-xs"
                    >
                        <Users size={16} />
                        Bulk Run
                    </button>
                    <button
                        onClick={() => { setModalType('single'); setShowModal(true); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all font-bold text-xs"
                    >
                        <Plus size={16} />
                        Generate Entry
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={80} className="text-indigo-500" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Disbursed</p>
                    <h3 className="text-3xl font-black text-white mt-2">${totalPaid.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2 text-indigo-400 text-xs font-bold">
                        <CreditCard size={14} /> System Records
                    </div>
                </div>
                <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Clock size={80} className="text-amber-500" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Pending Payouts</p>
                    <h3 className="text-3xl font-black text-white mt-2">${totalPending.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Awaiting Action
                    </div>
                </div>
                <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Users size={80} className="text-emerald-500" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Faculty Workforce</p>
                    <h3 className="text-3xl font-black text-white mt-2">{[...new Set(payrolls.map(p => p.faculty?._id))].length}</h3>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Staff
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search faculty name or month..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>
                    <button className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-slate-400 border border-white/5">
                        <Download size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="p-6">Faculty</th>
                                <th className="p-6">Month</th>
                                <th className="p-6">Base Salary</th>
                                <th className="p-6">Bonuses</th>
                                <th className="p-6">Deductions</th>
                                <th className="p-6">Net Salary</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 size={40} className="text-indigo-500 animate-spin" />
                                            <p className="font-black text-slate-500 uppercase tracking-widest text-xs">Computing Payroll...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayrolls.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-20 text-center">
                                        <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">No records found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPayrolls.map((payroll) => (
                                    <tr key={payroll._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-all">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-white">{payroll.faculty?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{payroll.faculty?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 font-bold text-slate-400">{payroll.month}</td>
                                        <td className="p-6 text-slate-500 font-medium">${payroll.baseSalary.toLocaleString()}</td>
                                        <td className="p-6 text-emerald-400 font-bold">+${payroll.bonuses.toLocaleString()}</td>
                                        <td className="p-6 text-red-500 font-bold">-${payroll.deductions.toLocaleString()}</td>
                                        <td className="p-6">
                                            <p className="font-black text-white text-lg">${payroll.netSalary.toLocaleString()}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${payroll.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {payroll.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            {payroll.status !== 'Paid' && (
                                                <button
                                                    onClick={() => markAsPaid(payroll._id)}
                                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    Disburse
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

            {/* Create Payroll Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl overflow-hidden"
                        >
                            <h2 className="text-3xl font-black text-white mb-2">{modalType === 'single' ? 'Generate Payroll' : 'Bulk Payroll Run'}</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">{modalType === 'single' ? 'Create a manual entry for one faculty' : 'Generate entries for all active faculty'}</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {modalType === 'single' && (
                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Search Faculty</label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Enter name or email..."
                                                value={facultySearch}
                                                onChange={(e) => handleFacultySearch(e.target.value)}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                            />
                                            {searching && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />}
                                        </div>

                                        {searchResults.length > 0 && !selectedFaculty && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                                                {searchResults.map(s => (
                                                    <div
                                                        key={s._id}
                                                        onClick={() => { setSelectedFaculty(s); setFacultySearch(s.name); setSearchResults([]); }}
                                                        className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex items-center justify-between"
                                                    >
                                                        <div>
                                                            <p className="font-bold text-white text-sm">{s.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.facultyProfile?.employeeId || s.email}</p>
                                                        </div>
                                                        <ChevronDown size={14} className="text-slate-600 -rotate-90" />
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}

                                        {selectedFaculty && (
                                            <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-sm">{selectedFaculty.name}</p>
                                                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{selectedFaculty.email}</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => setSelectedFaculty(null)} className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Change</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Billing Month</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. October 2025"
                                            required
                                            value={formData.month}
                                            onChange={e => setFormData({ ...formData, month: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Base Salary ($)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.baseSalary}
                                            onChange={e => setFormData({ ...formData, baseSalary: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bonuses ($)</label>
                                        <input
                                            type="number"
                                            value={formData.bonuses}
                                            onChange={e => setFormData({ ...formData, bonuses: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 text-emerald-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Deductions ($)</label>
                                    <input
                                        type="number"
                                        value={formData.deductions}
                                        onChange={e => setFormData({ ...formData, deductions: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 text-red-400"
                                        placeholder="0.00"
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
                                        disabled={modalType === 'single' && !selectedFaculty}
                                        className="flex-1 px-4 py-5 bg-white text-black hover:bg-gray-200 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl disabled:opacity-50"
                                    >
                                        {modalType === 'single' ? 'Deploy Entry' : 'Run Mass Payout'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPayroll;
