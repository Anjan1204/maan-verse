import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const FacultyTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        day: 'Monday',
        time: '',
        subject: '',
        room: '',
        class: '',
        semester: '',
        meetingLink: '' // Added meeting link
    });
    const [publishLoading, setPublishLoading] = useState(false);

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const { data } = await api.get('/faculty/timetable');
            setTimetable(data);
        } catch (error) {
            console.error("Failed to fetch timetable", error);
            // toast.error("Failed to fetch timetable");
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        // Find a representative branch/sem from the current timetable to publish
        // This button normally publishes for the currently edited/viewed branch
        // For now, we'll try to publish for any branch found in the list, 
        // OR we can make it more explicit.
        if (timetable.length === 0) {
            toast.warn('Add some classes before publishing');
            return;
        }

        const uniqueSets = [...new Set(timetable.map(t => `${t.branch}|${t.semester}`))];

        try {
            setPublishLoading(true);
            for (const set of uniqueSets) {
                const [branch, semester] = set.split('|');
                await api.post('/faculty/timetable/publish', { branch, semester });
            }
            toast.success('Timetable published to students!');
            fetchTimetable();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to publish');
        } finally {
            setPublishLoading(false);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            // Need to ensure branch is handled. For now assuming branch is part of 'class' or hardcoded/profile driven.
            // But the backend expects 'branch' and 'semester'.
            // The form has 'class' (e.g. CSE-A) and 'semester' (new).
            // Let's assume 'branch' is the "Class" field for now, or split it.
            // Actually, in the tasks I said "Add Semester field".
            // I'll treat 'class' input as 'branch' for now or adding a "Branch" field would be better but let's stick to the plan.
            // Wait, the backend requires 'branch'. I'll map 'class' input to 'branch' payload.

            const payload = {
                ...formData,
                branch: formData.class, // Map Class input to Branch (e.g. CSE)
            };

            await api.post('/faculty/timetable', payload);

            // Optimistic update or refetch
            // Refetch is safer to get the correct IDs
            fetchTimetable();

            toast.success('Class added to draft!');
            setFormData({ day: 'Monday', time: '', subject: '', room: '', class: '', semester: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule class');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Cancel this class?')) {
            try {
                await api.delete(`/faculty/timetable/${id}`);
                setTimetable(timetable.filter(t => t.id !== id));
                toast.info('Class cancelled');
            } catch (error) {
                toast.error('Failed to cancel class');
            }
        }
    };

    return (
        <div className="space-y-8">
            <ToastContainer theme="dark" />
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Manage Timetable</h1>
                    <p className="text-gray-500 text-sm mt-1">Schedule and manage your weekly class sessions</p>
                </div>
                <button
                    onClick={handlePublish}
                    disabled={publishLoading}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {publishLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Publishing...
                        </>
                    ) : (
                        'Publish Changes'
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl h-fit">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Plus size={24} className="text-emerald-500" /> New Class
                    </h3>
                    <form onSubmit={handleAddClass} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 ml-1">Day of Week</label>
                            <select
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10"
                                value={formData.day}
                                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                                    <option key={d} value={d} className="bg-gray-900">{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 ml-1">Session Time</label>
                            <input
                                type="time"
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 ml-1">Subject Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Computer Networks"
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10 placeholder:text-gray-600"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 ml-1">Branch / Department</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CSE"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10 placeholder:text-gray-600"
                                    value={formData.class}
                                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 ml-1">Semester</label>
                                <input
                                    type="text"
                                    placeholder="6"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10 placeholder:text-gray-600"
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 ml-1">Room</label>
                            <input
                                type="text"
                                placeholder="302"
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10 placeholder:text-gray-600"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 ml-1">Live Meeting Link (Optional)</label>
                            <input
                                type="url"
                                placeholder="https://zoom.us/j/..."
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-white transition-all hover:bg-white/10 placeholder:text-gray-600"
                                value={formData.meetingLink}
                                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 border border-white/10 transition-all active:scale-95">
                            Add Session
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 bg-white/5 border-b border-white/5 font-bold text-white text-lg tracking-tight">
                        Weekly Schedule
                    </div>
                    <div className="divide-y divide-white/5 flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-20 text-center text-gray-500 font-medium">Loading schedule...</div>
                        ) : timetable.length === 0 ? (
                            <div className="p-20 text-center text-gray-500 font-medium">No sessions scheduled for this week.</div>
                        ) : (
                            timetable.map((item) => (
                                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-all gap-5 group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex flex-col items-center justify-center font-bold text-[10px] uppercase border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                            {item.day.substring(0, 3)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-gray-100 text-lg group-hover:text-emerald-400 transition-colors">{item.subject}</h4>
                                                <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border ${item.isPublished
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                                    {item.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-xs text-gray-500 font-medium">{item.time}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                <span className="text-xs text-gray-400 font-bold border border-white/5 px-2 py-0.5 rounded-md bg-white/5">Room {item.room}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                <span className="text-xs text-emerald-500/80 font-bold">{item.class}</span>
                                                {item.meetingLink && (
                                                    <span className="ml-3 px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[9px] font-bold text-indigo-400">Live Available</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-3 text-gray-500 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all self-end md:self-auto border border-transparent hover:border-red-500/20"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyTimetable;

