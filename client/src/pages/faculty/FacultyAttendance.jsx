import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Check, Save } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const FacultyAttendance = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch students when class changes
        // For demo, we just fetch all students
        if (selectedClass) {
            const fetchStudents = async () => {
                setLoading(true);
                try {
                    const { data } = await api.get('/faculty/students');
                    // Add local status state
                    const studentsWithStatus = data.map(s => ({ ...s, status: 'Present' }));
                    setStudents(studentsWithStatus);
                } catch (error) {
                    toast.error('Failed to load students');
                } finally {
                    setLoading(false);
                }
            };
            fetchStudents();
        }
    }, [selectedClass]);

    const toggleStatus = (id) => {
        setStudents(students.map(s =>
            s._id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
        ));
    };

    const handleSubmit = async () => {
        if (!selectedClass) return toast.warning('Please select a class');

        try {
            await api.post('/faculty/attendance', {
                date,
                subject: selectedClass,
                students: students.map(s => ({ studentId: s._id, status: s.status }))
            });
            toast.success('Attendance submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit attendance');
        }
    };

    return (
        <div className="space-y-8">
            <ToastContainer theme="dark" />
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Mark Attendance</h1>
                    <p className="text-gray-500 text-sm mt-1">Select a class to start recording attendance</p>
                </div>
                <div className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row gap-6 items-end">
                <div className="w-full md:w-80">
                    <label className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3 ml-1">Select Subject / Class</label>
                    <div className="relative group">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white appearance-none cursor-pointer transition-all hover:bg-white/10"
                        >
                            <option value="" className="bg-gray-900">-- Choose Class --</option>
                            <option value="Computer Networks" className="bg-gray-900">Computer Networks (CSE-A)</option>
                            <option value="Database Management" className="bg-gray-900">Database Management (CSE-B)</option>
                            <option value="Operating Systems" className="bg-gray-900">Operating Systems (CSE-A)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-emerald-500 transition-colors mt-0.5">
                            <Calendar size={18} />
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <label className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3 ml-1">Attendance Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10"
                    />
                </div>
            </div>

            {/* Student List */}
            {selectedClass && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-white tracking-tight text-lg">Student Enrollment</h3>
                        <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                            {students.filter(s => s.status === 'Present').length} / {students.length} Marked Present
                        </div>
                    </div>

                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10">
                                <tr>
                                    <th className="px-8 py-5">Roll Number</th>
                                    <th className="px-8 py-5">Student Identity</th>
                                    <th className="px-8 py-5 text-center">Current Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-20 bg-white/5 text-gray-500 font-medium">Loading class roster...</td></tr>
                                ) : students.map((std) => (
                                    <tr key={std._id} className="hover:bg-white/5 transition-all cursor-pointer group" onClick={() => toggleStatus(std._id)}>
                                        <td className="px-8 py-5 font-mono text-xs text-gray-500 group-hover:text-emerald-500 transition-colors uppercase">{std.studentProfile?.rollNo || 'N/A'}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center text-indigo-400 font-bold">
                                                    {std.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{std.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button
                                                className={`min-w-[100px] py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${std.status === 'Present'
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/20'
                                                    : 'bg-white/5 text-gray-500 border border-white/10 hover:border-red-500/50 hover:text-red-400'
                                                    }`}
                                            >
                                                {std.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all active:scale-95"
                        >
                            <Save size={20} /> Submit Records
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyAttendance;
