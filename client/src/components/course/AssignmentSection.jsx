import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, Upload, AlertCircle, FileText } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AssignmentSection = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submissionData, setSubmissionData] = useState({ fileUrl: '', content: '' });
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, [courseId]);

    const fetchAssignments = async () => {
        try {
            const { data } = await api.get(`/assignments/course/${courseId}`);
            setAssignments(data);
        } catch (error) {
            toast.error('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

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
            fetchAssignments(); // Refresh to show status
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse text-gray-500">Syncing Assignments...</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            {selectedAssignment ? (
                <div className="glass p-10 rounded-[3rem] border border-primary/30 space-y-8">
                    <button onClick={() => setSelectedAssignment(null)} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">← Back to List</button>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black">{selectedAssignment.title}</h2>
                        <div className="flex gap-6">
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <Clock size={14} /> Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                Points: {selectedAssignment.totalPoints}
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-lg">{selectedAssignment.description}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-10 border-t border-white/5">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Submission URL (Google Drive/Dropbox)</label>
                            <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white font-bold"
                                value={submissionData.fileUrl}
                                onChange={(e) => setSubmissionData({ ...submissionData, fileUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Text Notes (Optional)</label>
                            <textarea
                                placeholder="Add any comments for the instructor..."
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white min-h-[120px]"
                                value={submissionData.content}
                                onChange={(e) => setSubmissionData({ ...submissionData, content: e.target.value })}
                            />
                        </div>
                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-5 bg-primary text-white rounded-[2rem] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            {submitting ? 'Broadcasting Submission...' : 'Finish & Submit'}
                            <Upload size={20} />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid gap-6">
                    {assignments.length === 0 ? (
                        <div className="text-center py-20 glass rounded-[3rem] border-2 border-dashed border-white/5">
                            <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-black text-gray-500">No Assignments Yet</h3>
                        </div>
                    ) : (
                        assignments.map(assignment => (
                            <div key={assignment._id} className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/5">
                                            <ClipboardList size={20} />
                                        </div>
                                        <h4 className="text-xl font-black text-white group-hover:text-primary transition-colors">{assignment.title}</h4>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                                            <Clock size={12} /> {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                                            <CheckCircle size={12} /> {assignment.totalPoints} Points
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAssignment(assignment)}
                                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-white/10 hover:border-primary/30 transition-all active:scale-95"
                                >
                                    Open Task
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AssignmentSection;
