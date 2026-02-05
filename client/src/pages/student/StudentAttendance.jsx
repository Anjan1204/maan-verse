import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Calendar, Check, X, Filter } from 'lucide-react';

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await api.get('/student/attendance');
                setAttendance(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Attendance Ledger</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Verified records of your academic presence and participation</p>
                </div>
                <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                    <button className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Filter size={14} /> Filter Dataset
                    </button>
                </div>
            </div>

            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                            <Calendar size={20} />
                        </div>
                        <h3 className="font-black text-white uppercase tracking-widest text-xs">Chronological History</h3>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">Sync Complete</span>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">Date Stamp</th>
                                <th className="px-10 py-6">Weekday</th>
                                <th className="px-10 py-6">Subject Module</th>
                                <th className="px-10 py-6 text-center">Involvement Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-20">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest animate-pulse">Retrieving Ledger...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : attendance.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-20">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <Calendar size={40} className="text-gray-500" />
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No Records Found on Surface</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((record, index) => (
                                    <tr key={index} className="hover:bg-white/[0.03] transition-all group cursor-default">
                                        <td className="px-10 py-8 text-white font-bold tracking-tight">
                                            {new Date(record.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-10 py-8 text-gray-400 font-semibold text-sm uppercase tracking-wider">{record.day}</td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                <span className="text-gray-300 font-bold group-hover:text-white transition-colors">{record.subject}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase border transition-all ${record.status === 'Present'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:bg-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:bg-red-500/20'
                                                    }`}>
                                                    {record.status === 'Present' ? <Check size={14} className="stroke-[3]" /> : <X size={14} className="stroke-[3]" />}
                                                    {record.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;
