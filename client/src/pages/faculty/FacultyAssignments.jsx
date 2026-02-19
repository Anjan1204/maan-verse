import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Users, Search, FileText, ScanText } from 'lucide-react';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const FacultyAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list', 'create', 'submissions'
    const [activeAssignment, setActiveAssignment] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        totalPoints: 100
    });

    const [gradingData, setGradingData] = useState({
        grade: '',
        feedback: ''
    });

    const [plagiarismResult, setPlagiarismResult] = useState(null);
    const [showPlagiarismModal, setShowPlagiarismModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            await api.get('/faculty/dashboard');
            // Assuming we get course list from dashboard or similar
            const coursesRes = await api.get('/courses');
            // Filter courses where faculty is current user (Logic depends on backend implementation)
            setCourses(coursesRes.data.filter(c => c.isPublished)); // Placeholder filter
        } catch {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async (courseId) => {
        try {
            const { data } = await api.get(`/assignments/course/${courseId}`);
            setAssignments(data);
        } catch {
            toast.error('Failed to load assignments');
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const { data } = await api.get(`/assignments/${assignmentId}/submissions`);
            setSubmissions(data);
        } catch {
            toast.error('Failed to load submissions');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments', { ...formData, courseId: selectedCourse._id });
            toast.success('Assignment created!');
            setFormData({ title: '', description: '', dueDate: '', totalPoints: 100 });
            setView('list');
            fetchAssignments(selectedCourse._id);
        } catch {
            toast.error('Failed to create assignment');
        }
    };

    const handleGrade = async (submissionId) => {
        try {
            await api.put(`/assignments/submissions/${submissionId}/grade`, gradingData);
            toast.success('Grade saved!');
            fetchSubmissions(activeAssignment._id);
            setGradingData({ grade: '', feedback: '' });
        } catch {
            toast.error('Failed to save grade');
        }
    };

    const handlePlagiarismCheck = async (submissionId) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/plagiarism/check/${submissionId}`);
            setPlagiarismResult(data);
            setShowPlagiarismModal(true);

            if (data.similarity > 0.3) {
                toast.warning('Potential Plagiarism Detected');
            } else {
                toast.success('Content verified as original');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Plagiarism check failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading && view !== 'submissions') return <div className="flex items-center justify-center min-h-[60vh] text-emerald-500 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Academic Data...</div>;

    return (
        <div className="space-y-10 pb-20">
            <ToastContainer theme="dark" />

            {/* Plagiarism Modal */}
            <AnimatePresence>
                {showPlagiarismModal && plagiarismResult && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-xl p-12 overflow-hidden relative"
                        >
                            <div className={`absolute top-0 right-0 py-20 px-40 opacity-[0.03] scale-[4] rotate-12 ${plagiarismResult.similarity > 0.3 ? 'text-red-500' : 'text-emerald-500'}`}>
                                <ScanText size={100} />
                            </div>

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${plagiarismResult.similarity > 0.3 ? 'border-red-500/30 text-red-500' : 'border-emerald-500/30 text-emerald-400'}`}>
                                    <h2 className="text-3xl font-black">{Math.round(plagiarismResult.similarity * 100)}%</h2>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">Similarity Report</h3>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Integrity Scan Result</p>
                                </div>

                                <div className="w-full bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-500">Analysis Status</span>
                                        <span className={plagiarismResult.similarity > 0.3 ? 'text-red-400' : 'text-emerald-400'}>
                                            {plagiarismResult.similarity > 0.3 ? 'Critical Alert' : 'Healthy / Original'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-500">Highest Match</span>
                                        <span className="text-white">{plagiarismResult.highestMatch || 'None'}</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 text-left italic text-slate-400 text-sm leading-relaxed">
                                        {plagiarismResult.message}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowPlagiarismModal(false)}
                                    className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] transition-transform"
                                >
                                    Acknowledge Findings
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Assignment Management</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Create, track, and grade student submissions</p>
                </div>
                {selectedCourse && (
                    <button
                        onClick={() => {
                            if (view === 'create') setView('list');
                            else setView('create');
                        }}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all flex items-center gap-2"
                    >
                        {view === 'create' ? 'Back to List' : 'New Assignment'} <Plus size={20} />
                    </button>
                )}
            </div>

            {!selectedCourse ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div
                            key={course._id}
                            onClick={() => {
                                setSelectedCourse(course);
                                fetchAssignments(course._id);
                            }}
                            className="glass p-8 rounded-[2.5rem] border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all group"
                        >
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 block">{course.category}</span>
                            <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                            <div className="mt-6 flex items-center justify-between text-gray-500">
                                <span className="flex items-center gap-2 text-xs font-bold"><Users size={16} /> {course.enrolledCount} Students</span>
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">Select Class</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 w-fit">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active Course:</span>
                        <h4 className="text-sm font-bold text-white">{selectedCourse.title}</h4>
                        <button onClick={() => setSelectedCourse(null)} className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white ml-4">Change Class</button>
                    </div>

                    {view === 'create' ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-10 rounded-[3rem] border border-emerald-500/20 max-w-2xl">
                            <h3 className="text-2xl font-black text-white mb-8">Deploy New Assignment</h3>
                            <form onSubmit={handleCreateAssignment} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                        placeholder="e.g. Intro to Data Structures"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Objective / Instructions</label>
                                    <textarea
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white min-h-[150px] focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                        placeholder="Describe the task and requirements..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Deadline Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Total Points</label>
                                        <input
                                            type="number"
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none"
                                            value={formData.totalPoints}
                                            onChange={(e) => setFormData({ ...formData, totalPoints: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-white text-black rounded-[2rem] font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl">
                                    Broadcast Assignment
                                </button>
                            </form>
                        </motion.div>
                    ) : view === 'submissions' ? (
                        <div className="space-y-8">
                            <button onClick={() => setView('list')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">← View Assignments</button>
                            <h3 className="text-2xl font-black text-white">Submissions: {activeAssignment.title}</h3>
                            <div className="grid gap-6">
                                {submissions.length === 0 ? (
                                    <div className="text-center py-20 glass rounded-[2.5rem] border-2 border-dashed border-white/5">
                                        <p className="font-bold text-gray-600 uppercase tracking-[0.2em] text-xs">No pending submissions</p>
                                    </div>
                                ) : (
                                    submissions.map(sub => (
                                        <div key={sub._id} className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-black text-emerald-500 border border-white/5">
                                                        {sub.student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white">{sub.student.name}</h4>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{sub.student.email}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${sub.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                    {sub.status}
                                                </div>
                                            </div>

                                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Student Content</span>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => handlePlagiarismCheck(sub._id)}
                                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:underline"
                                                        >
                                                            <ScanText size={12} /> Plagiarism Check
                                                        </button>
                                                        <button onClick={() => window.open(sub.fileUrl, '_blank')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:underline">View Attachment <FileText size={12} /></button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm">{sub.content || "No notes provided."}</p>
                                            </div>

                                            {sub.status !== 'Graded' ? (
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                                                    <div className="md:col-span-1">
                                                        <input
                                                            type="number"
                                                            placeholder="Score"
                                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                                                            onChange={(e) => setGradingData({ ...gradingData, grade: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Feedback (optional)"
                                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                                                            onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleGrade(sub._id)}
                                                        className="bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all"
                                                    >
                                                        Submit Grade
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-10 pt-4 border-t border-white/5">
                                                    <div>
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Score Awarded</span>
                                                        <span className="text-xl font-black text-emerald-500">{sub.grade} / {activeAssignment.totalPoints}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Feedback</span>
                                                        <span className="text-sm text-gray-300 font-medium italic">"{sub.feedback}"</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {assignments.map(assignment => (
                                <div key={assignment._id} className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-all">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                                                <ClipboardList size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white">{assignment.title}</h4>
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Deadline: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveAssignment(assignment);
                                            fetchSubmissions(assignment._id);
                                            setView('submissions');
                                        }}
                                        className="px-8 py-4 bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600/20 transition-all flex items-center gap-3"
                                    >
                                        <Users size={16} /> Submissions Overview
                                    </button>
                                </div>
                            ))}
                            {assignments.length === 0 && (
                                <div className="text-center py-20 glass rounded-[2.5rem] border-2 border-dashed border-white/5">
                                    <p className="font-bold text-gray-600 uppercase tracking-[0.2em] text-xs">No assignments deployed for this class</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyAssignments;
