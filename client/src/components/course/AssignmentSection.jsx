import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, Upload, AlertCircle, FileText, ChevronLeft, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AssignmentSection = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submissionData, setSubmissionData] = useState({ fileUrl: '', content: '' });
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const fetchAssignments = React.useCallback(async () => {
        try {
            const { data } = await api.get(`/assignments/course/${courseId}`);
            setAssignments(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submissionData.fileUrl && !submissionData.content) {
            toast.warn('Please provide a file URL or text content');
            return;
        }

        setSubmitting(true);
        try {
            await api.post(`/assignments/${selectedAssignment._id}/submit`, submissionData);
            toast.success('Assignment submitted successfully!');
            setSelectedAssignment(null);
            setSubmissionData({ fileUrl: '', content: '' });
            fetchAssignments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Synchronizing Academic Tasks...</p>
        </div>
    );

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-24">
            {selectedAssignment ? (
                <div className="glass p-10 md:p-16 rounded-[4rem] border border-primary/20 space-y-12 relative overflow-hidden bg-gradient-to-br from-primary/[0.03] to-transparent shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <ClipboardList size={300} />
                    </div>

                    <button
                        onClick={() => setSelectedAssignment(null)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5"
                    >
                        <ChevronLeft size={14} /> Back to Repository
                    </button>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Active Submission</span>
                            <div className="h-1 w-1 bg-gray-500 rounded-full" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID: {selectedAssignment._id.slice(-8)}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{selectedAssignment.title}</h2>

                        <div className="flex flex-wrap gap-8 py-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Submission Window</span>
                                <span className="flex items-center gap-2 text-sm font-bold text-emerald-500 italic">
                                    <Clock size={16} /> Due {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Academic Weight</span>
                                <span className="text-sm font-black text-white">{selectedAssignment.totalPoints} Excellence Points</span>
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative group">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Task Directive</h4>
                            <p className="text-gray-400 leading-relaxed text-lg font-medium italic">"{selectedAssignment.description}"</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pt-12 border-t border-white/10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Artifact Repository URL</label>
                                    <span className="text-[9px] text-gray-600 font-bold">PDF, ZIP OR DOCS</span>
                                </div>
                                <input
                                    type="url"
                                    placeholder="https://cloud-storage.com/your-submission"
                                    className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white font-bold transition-all placeholder:text-gray-700"
                                    value={submissionData.fileUrl}
                                    onChange={(e) => setSubmissionData({ ...submissionData, fileUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] px-2">Executive Summary (Optional)</label>
                                <textarea
                                    placeholder="Briefly describe your approach and methodology..."
                                    className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white min-h-[160px] font-medium transition-all placeholder:text-gray-700"
                                    value={submissionData.content}
                                    onChange={(e) => setSubmissionData({ ...submissionData, content: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-7 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-3xl hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-30 group"
                        >
                            {submitting ? 'Broadcasting to Cloud...' : 'Commit Submission'}
                            <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid gap-8 px-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Evaluation Path</span>
                            <h3 className="text-2xl font-black text-white">Academic Deliverables</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary italic font-black">
                            {assignments.length}
                        </div>
                    </div>

                    {assignments.length === 0 ? (
                        <div className="text-center py-32 glass rounded-[4rem] border-2 border-dashed border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                <ClipboardList size={48} className="opacity-20" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-500 italic">No deliverables assigned</h3>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.25em] mt-4">Awaiting academic roadmap update</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {assignments.map(assignment => (
                                <div key={assignment._id} className="glass p-10 rounded-[3.5rem] border border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-10 group hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-700 shadow-2xl relative overflow-hidden">
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-primary border border-white/10 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                <ClipboardList size={28} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Task Protocol</p>
                                                <h4 className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-all underline decoration-white/0 underline-offset-8 group-hover:decoration-primary/40 group-hover:underline-offset-4">{assignment.title}</h4>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-8 items-center">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                                                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/10">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                    {assignment.totalPoints} Excellence Points
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedAssignment(assignment)}
                                        className="px-10 py-5 bg-white text-black border border-white/10 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-white hover:border-primary hover:scale-105 transition-all duration-500 active:scale-95 shadow-2xl z-10"
                                    >
                                        Execute Task
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AssignmentSection;
