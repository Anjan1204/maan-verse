import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Phone, MapPin, Calendar, Mail, Save, Upload, GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const StudentProfile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.studentProfile?.phone || '',
        address: user?.studentProfile?.address || '',
        dob: user?.studentProfile?.dob ? new Date(user.studentProfile.dob).toISOString().split('T')[0] : '',
        rollNo: user?.studentProfile?.rollNo || '',
        branch: user?.studentProfile?.branch || '',
        semester: user?.studentProfile?.semester || '',
        avatar: user?.profile?.avatar || ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB');
            return;
        }

        // Convert to base64 for preview and storage
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setFormData(prev => ({ ...prev, avatar: base64String }));
            toast.success('Image selected - Click Update to Save');
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/users/profile', {
                name: formData.name,
                email: formData.email,
                studentProfile: {
                    phone: formData.phone,
                    address: formData.address,
                    dob: formData.dob,
                    rollNo: formData.rollNo,
                    branch: formData.branch,
                    semester: formData.semester
                },
                profile: {
                    avatar: formData.avatar
                }
            });

            // Update global auth state with merged data from database
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                setUser({ ...userInfo, ...data });
            }

            toast.success('System Records Updated');
        } catch (err) {
            const message = err.response?.data?.message || 'Data Synchronization Failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-10">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Identity Profile</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Manage your academic credentials and personal data</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">Account Active</span>
                    </div>
                </div>
            </div>

            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
                {/* Banner */}
                <div className="h-48 bg-gradient-to-r from-indigo-600 via-primary to-purple-800 relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 chalkboard-doodles opacity-20" />
                </div>

                <div className="px-10 pb-12">
                    <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-12 gap-6">
                        <div className="flex flex-col md:flex-row items-end gap-8 text-center md:text-left">
                            <div className="w-40 h-40 rounded-3xl bg-[#020617] p-1.5 shadow-2xl group relative overflow-hidden">
                                <img
                                    src={formData.avatar || user?.profile?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-[1.2rem] grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <label className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">Change</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
                                </label>
                            </div>
                            <div className="mb-2">
                                <h2 className="text-3xl font-black text-white tracking-tight">{user?.name}</h2>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                    <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">Roll No: {formData.rollNo || 'Not Assigned'}</span>
                                    <span className="px-3 py-1 bg-white/5 text-gray-400 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest">Branch: {formData.branch || 'Not Set'}</span>
                                    {formData.semester && (
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Sem: {formData.semester}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-primary/20 border border-primary/30 text-primary rounded-2xl font-black uppercase tracking-widest hover:bg-primary/30 transition-all active:scale-95 flex items-center gap-2 text-xs"
                        >
                            <Upload size={16} />
                            Upload Photo
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Legal Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-semibold transition-all focus:bg-white/[0.05] focus:border-primary/50 outline-none placeholder:text-gray-700"
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Official Email Address</label>
                            <div className="relative group opacity-60">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.01] border border-white/5 rounded-2xl text-gray-500 font-semibold cursor-not-allowed outline-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded-md">Locked</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Contact Identifier</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-semibold transition-all focus:bg-white/[0.05] focus:border-primary/50 outline-none placeholder:text-gray-700"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Date of Birth</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-semibold transition-all focus:bg-white/[0.05] focus:border-primary/50 outline-none [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Roll Number</label>
                            <div className="relative group">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-semibold transition-all focus:bg-white/[0.05] focus:border-primary/50 outline-none placeholder:text-gray-700"
                                    placeholder="Enter roll number"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Branch / Department</label>
                            <div className="relative group">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-semibold transition-all focus:bg-white/[0.05] focus:border-primary/50 outline-none placeholder:text-gray-700"
                                    placeholder="e.g. CSE"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Current Semester</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-semibold transition-all focus:bg-white/[0.05] focus:border-primary/50 outline-none placeholder:text-gray-700"
                                    placeholder="e.g., 5"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 block">Geographic Location / Residence</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-5 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-semibold transition-all focus:bg-white/[0.05] focus:border-primary/50 outline-none placeholder:text-gray-700 resize-none"
                                    placeholder="Enter your registered residence address"
                                ></textarea>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-[1.2rem] font-black uppercase tracking-widest hover:bg-primary/80 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-primary/20 group/btn"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} className="group-hover/btn:scale-110 transition-transform" />
                                        Update Intelligence Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
