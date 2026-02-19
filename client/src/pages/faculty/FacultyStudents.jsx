import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Search, Plus, FileText, Download, Calendar, BookOpen, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const FacultyStudents = () => {
    const [activeTab, setActiveTab] = useState('students');

    // Subjects State
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState('');
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await api.get('/faculty/students');
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const { data } = await api.get('/faculty/classes');
        } catch (error) {
            console.error("Failed to load subjects", error);
            toast.error("Failed to load subjects");
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubject.trim()) return;

        try {
            const updatedSubjects = [...subjects, newSubject.trim()];
            await api.post('/faculty/subjects', { subjects: updatedSubjects });
            setSubjects(updatedSubjects);
            setNewSubject('');
            toast.success("Subject added");
        } catch (error) {
            toast.error("Failed to add subject");
        }
    };

    const handleRemoveSubject = async (subjectToRemove) => {
        if (!window.confirm(`Remove ${subjectToRemove}?`)) return;

        try {
            const updatedSubjects = subjects.filter(s => s !== subjectToRemove);
            await api.post('/faculty/subjects', { subjects: updatedSubjects });
            setSubjects(updatedSubjects);
            toast.success("Subject removed");
        } catch (error) {
            toast.error("Failed to remove subject");
        }
    };

    return (
        <div className="space-y-8">
            <ToastContainer theme="dark" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Class Management</h1>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-white/5">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'students' ? 'border-emerald-500 text-emerald-500 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    Student List
                </button>
                <button
                    onClick={() => setActiveTab('grades')}
                    className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'grades' ? 'border-emerald-500 text-emerald-500 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    Grades & Results
                </button>
                <button
                    onClick={() => setActiveTab('exams')}
                    className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'exams' ? 'border-emerald-500 text-emerald-500 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    Exams
                </button>
                <button
                    onClick={() => setActiveTab('subjects')}
                    className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'subjects' ? 'border-emerald-500 text-emerald-500 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    My Subjects
                </button>
            </div>

            {/* Content Container */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl overflow-hidden p-8">

                {/* Controls */}
                <div className="flex justify-between items-center mb-10">
                    <div className="relative group w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a student by name or roll..."
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10 placeholder:text-gray-600"
                        />
                    </div>
                    {activeTab === 'exams' && (
                        <button className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all active:scale-95">
                            <Plus size={20} /> Create New Exam
                        </button>
                    )}
                    {activeTab === 'grades' && (
                        <button className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95">
                            <Download size={20} /> Export Records
                        </button>
                    )}
                </div>

                {activeTab === 'students' && (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Roll No</th>
                                <th className="px-8 py-5">Student Identity</th>
                                <th className="px-8 py-5">Class Section</th>
                                <th className="px-8 py-5">Attendance Rate</th>
                                <th className="px-8 py-5 text-center">Academic Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading students...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No students found.</td></tr>
                            ) : (
                                students.map((std) => (
                                    <tr key={std._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5 font-mono text-xs text-gray-500 group-hover:text-emerald-500 transition-colors">{std.studentProfile?.rollNo || 'N/A'}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                                                    {std.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-200 group-hover:text-white transition-colors block">{std.name}</span>
                                                    <span className="text-[10px] text-gray-500">{std.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-gray-400">{std.studentProfile?.branch || 'General'}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 max-w-[100px] bg-white/5 rounded-full h-1.5 border border-white/5 overflow-hidden">
                                                    <div className="bg-gray-600 h-full rounded-full" style={{ width: '0%' }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-400">N/A</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="px-3 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                                                N/A
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {activeTab === 'grades' && (
                    <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} className="text-indigo-400 opacity-60" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Gradebook Records</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Access and manage student performance data. Select a session to begin.</p>
                    </div>
                )}

                {activeTab === 'exams' && (
                    <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} className="text-emerald-400 opacity-60" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Exam Management</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">No upcoming examinations have been scheduled for your classes yet.</p>
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="space-y-8">
                        <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Plus size={24} className="text-emerald-500" /> Add New Subject
                            </h3>
                            <form onSubmit={handleAddSubject} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Enter subject name (e.g. Data Structures)..."
                                    className="flex-1 p-4 bg-gray-900 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all placeholder:text-gray-600"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!newSubject.trim()}
                                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Subject
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loadingSubjects ? (
                                <div className="text-gray-500 col-span-full text-center py-8">Loading subjects...</div>
                            ) : subjects.length === 0 ? (
                                <div className="text-gray-500 col-span-full text-center py-8">No subjects added yet.</div>
                            ) : (
                                subjects.map((subject, index) => (
                                    <div key={index} className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 group transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                                                <BookOpen size={20} />
                                            </div>
                                            <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{subject}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveSubject(subject)}
                                            className="p-3 text-gray-500 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default FacultyStudents;
