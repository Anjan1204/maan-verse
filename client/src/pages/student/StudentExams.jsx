import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const StudentExams = () => {
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [examsRes, resultsRes] = await Promise.all([
                    api.get('/student/exams'),
                    api.get('/student/results')
                ]);
                setExams(examsRes.data);
                setResults(resultsRes.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch exams/results:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse uppercase tracking-widest text-xs">Loading Evaluations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 animate-pulse">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-white">Failed to Load</h2>
                <p className="text-gray-500 max-w-md text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Evaluations & Performance</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Track upcoming examinations and historical academic results</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Upcoming Exams */}
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                                <Calendar size={20} />
                            </div>
                            <h3 className="font-black text-white uppercase tracking-widest text-xs">Upcoming Schedule</h3>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            {new Date().getFullYear()}
                        </span>
                    </div>

                    <div className="p-8 overflow-x-auto custom-scrollbar">
                        {exams.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="font-bold uppercase tracking-widest text-xs">No Upcoming Exams</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                                    <tr>
                                        <th className="pb-6">Subject Module</th>
                                        <th className="pb-6">Date/Time</th>
                                        <th className="pb-6 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {exams.map((exam, i) => (
                                        <tr key={i} className="group cursor-default">
                                            <td className="py-6">
                                                <p className="font-bold text-white tracking-tight group-hover:text-primary transition-colors">{exam.subject}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{exam.location}</p>
                                            </td>
                                            <td className="py-6">
                                                <p className="text-sm text-gray-300 font-bold tracking-tighter">
                                                    {new Date(exam.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-medium">{exam.time}</p>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${exam.type === 'External'
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                                        : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                                    }`}>
                                                    {exam.type}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Results Preview */}
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                                <AlertCircle size={20} />
                            </div>
                            <h3 className="font-black text-white uppercase tracking-widest text-xs">Latest Results</h3>
                        </div>
                    </div>

                    <div className="p-8 space-y-4">
                        {results.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <AlertCircle size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="font-bold uppercase tracking-widest text-xs">No Results Published</p>
                            </div>
                        ) : (
                            <>
                                {results.slice(0, 5).map((result, j) => (
                                    <div key={j} className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] group hover:border-primary/30 transition-all hover:bg-white/[0.04]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${result.grade?.startsWith('A')
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                    : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                                }`}>
                                                {result.grade || 'N/A'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{result.subject}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                    Score: {result.marks}/{result.totalMarks}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${(result.marks / result.totalMarks) * 100 >= 90
                                                        ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                                        : 'bg-primary'
                                                    }`}
                                                style={{ width: `${(result.marks / result.totalMarks) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full mt-4 py-4 bg-white/5 border border-white/5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    View Full Marksheet Details
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentExams;
