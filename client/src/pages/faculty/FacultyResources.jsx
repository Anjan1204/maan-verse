import React, { useState, useEffect } from 'react';
import { Folders, Plus, Trash2, FileText, Video, Link2, ExternalLink, Search } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const FacultyResources = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        url: '',
        type: 'PDF'
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            // Check if data is array before setting
            if (Array.isArray(data)) {
                setCourses(data);
            } else {
                console.error("API Error: Courses data is not an array", data);
                setCourses([]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load courses');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        try {
            const updatedResources = [...(selectedCourse.resources || []), formData];
            await api.put(`/admin/courses/${selectedCourse._id}`, { resources: updatedResources }); // Reusing admin update for now
            setSelectedCourse({ ...selectedCourse, resources: updatedResources });
            setFormData({ title: '', url: '', type: 'PDF' });
            setShowAddModal(false);
            toast.success('Resource added successfully!');
            fetchCourses(); // Sync list
        } catch (error) {
            console.error(error);
            toast.error('Failed to add resource');
        }
    };

    const handleDeleteResource = async (index) => {
        if (!window.confirm('Remove this resource?')) return;
        try {
            const updatedResources = selectedCourse.resources.filter((_, i) => i !== index);
            await api.put(`/admin/courses/${selectedCourse._id}`, { resources: updatedResources });
            setSelectedCourse({ ...selectedCourse, resources: updatedResources });
            toast.info('Resource removed');
            fetchCourses();
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove resource');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Video': return <Video className="text-indigo-400" />;
            case 'Link': return <Link2 className="text-emerald-400" />;
            default: return <FileText className="text-red-400" />;
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-emerald-500 font-bold">Syncing Library...</div>;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Digital Resource Library</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Manage supplemental study materials for your students</p>
                </div>
                {selectedCourse && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-2xl shadow-emerald-600/30 transition-all flex items-center gap-2"
                    >
                        Add Resource <Plus size={20} />
                    </button>
                )}
            </div>

            {!selectedCourse ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div
                            key={course._id}
                            onClick={() => setSelectedCourse(course)}
                            className="glass p-8 rounded-[2.5rem] border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Folders size={80} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 block">{course.category}</span>
                            <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                            <div className="mt-6 flex items-center justify-between text-xs text-gray-500 font-bold">
                                <span>{course.resources?.length || 0} Resources</span>
                                <span className="bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest text-[9px]">Open Folder</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 w-fit">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Managing Library:</span>
                        <h4 className="text-sm font-bold text-white">{selectedCourse.title}</h4>
                        <button onClick={() => setSelectedCourse(null)} className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white ml-4">Back to Classes</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedCourse.resources?.map((res, i) => (
                            <div key={i} className="glass p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        {getIcon(res.type)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{res.title}</h4>
                                        <p className="text-[10px] text-gray-500 font-black tracking-[0.2em]">{res.type}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => window.open(res.url, '_blank')} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-emerald-500 transition-all"><ExternalLink size={18} /></button>
                                    <button onClick={() => handleDeleteResource(i)} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedCourse.resources?.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                            <p className="font-bold text-gray-600 uppercase tracking-widest text-xs">Library is currently empty</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-10 rounded-[3rem] border border-emerald-500/30 w-full max-w-lg space-y-8">
                            <h3 className="text-2xl font-black text-white">Add Course Resource</h3>
                            <form onSubmit={handleAddResource} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Title</label>
                                    <input type="text" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Week 1 Lecture Notes" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Target URL</label>
                                    <input type="url" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Type</label>
                                    <select className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="PDF" className="bg-gray-900">PDF Document</option>
                                        <option value="Video" className="bg-gray-900">External Video</option>
                                        <option value="Link" className="bg-gray-900">Resource Link</option>
                                        <option value="Other" className="bg-gray-900">Other</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl font-bold">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl">Confirm Addition</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FacultyResources;
