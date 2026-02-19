import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Download } from 'lucide-react';

const FacultyPayroll = () => {
    const { user } = useAuth();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payroll/faculty/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayrolls(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user?._id) fetchPayroll();
    }, [user]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">My Payroll</h1>
                <p className="text-slate-400 text-sm">View your salary history and download payslips</p>
            </div>

            {/* Recent Salary Card */}
            {payrolls.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <p className="text-indigo-200 font-medium mb-1">Most recent payout</p>
                            <h2 className="text-4xl font-bold mb-4">${payrolls[0].netSalary.toLocaleString()}</h2>
                            <div className="flex gap-4 text-sm">
                                <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                                    Month: {payrolls[0].month}
                                </div>
                                <div className="bg-emerald-500/20 px-3 py-1 rounded-lg backdrop-blur-sm text-emerald-100">
                                    Status: {payrolls[0].status}
                                </div>
                            </div>
                        </div>
                        <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                            <Download size={20} />
                            Download Payslip
                        </button>
                    </div>
                </div>
            )}

            {/* History List */}
            <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h3 className="font-bold text-white">Salary History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-sm border-b border-white/5">
                                <th className="p-4">Month</th>
                                <th className="p-4">Base Salary</th>
                                <th className="p-4">Bonuses</th>
                                <th className="p-4">Deductions</th>
                                <th className="p-4">Net Salary</th>
                                <th className="p-4">Date processed</th>
                                <th className="p-4 text-right">Payslip</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300 text-sm">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center">Loading...</td></tr>
                            ) : payrolls.map((payroll) => (
                                <tr key={payroll._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="p-4 font-medium text-white">{payroll.month}</td>
                                    <td className="p-4">${payroll.baseSalary.toLocaleString()}</td>
                                    <td className="p-4 text-emerald-400">+${payroll.bonuses.toLocaleString()}</td>
                                    <td className="p-4 text-red-400">-${payroll.deductions.toLocaleString()}</td>
                                    <td className="p-4 font-bold text-indigo-400">${payroll.netSalary.toLocaleString()}</td>
                                    <td className="p-4 text-slate-500">{new Date(payroll.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                                            <Download size={16} />
                                        </button>
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

export default FacultyPayroll;
