import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: 0,
        thumbnail: '',
        isPublished: false
    });

    const categories = ['Development', 'Design', 'Business', 'Data Science', 'Marketing', 'Photography', 'Music', 'AI & ML'];

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/courses/admin/all?keyword=${search}`);
            setCourses(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleCreate = () => {
        setEditingCourse(null);
        setFormData({
            title: '',
            description: '',
            category: 'Development',
            price: 0,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
            isPublished: false
        });
        setIsModalOpen(true);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            price: course.price,
            thumbnail: course.thumbnail,
            isPublished: course.isPublished
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, formData);
                toast.success('Course updated successfully');
            } else {
                await api.post('/courses', formData);
                toast.success('Course created successfully');
            }
            setIsModalOpen(false);
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save course');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                toast.success('Course deleted successfully');
                fetchCourses();
            } catch (error) {
                toast.error('Failed to delete course');
            }
        }
    };

    const togglePublish = async (course) => {
        try {
            await api.put(`/courses/${course._id}`, { isPublished: !course.isPublished });
            toast.success(`Course ${!course.isPublished ? 'published' : 'unpublished'}`);
            fetchCourses();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <ToastContainer theme="dark" position="top-right" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Course Management</h1>
                    <p className="text-gray-400 mt-1">Manage all courses on the platform</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={20} />
                    Create Course
                </button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
                    />
                </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-700/50 text-gray-200 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : courses.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8">No courses found</td></tr>
                            ) : courses.map((course) => (
                                <tr key={course._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-16 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="text-white font-medium">{course.title}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{course.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {course.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-bold">${course.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => togglePublish(course)}
                                            className={`flex items-center gap-1 text-sm ${course.isPublished ? 'text-green-400' : 'text-gray-400'}`}
                                        >
                                            {course.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-blue-400 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="p-2 bg-gray-700 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800">
                            <h2 className="text-2xl font-bold text-white">
                                {editingCourse ? 'Edit Course' : 'Create New Course'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 h-24"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail URL</label>
                                <input
                                    type="url"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="isPublished" className="text-sm text-gray-300">
                                    Publish immediately
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    {editingCourse ? 'Update Course' : 'Create Course'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
