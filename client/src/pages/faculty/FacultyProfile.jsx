import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { User, Mail, Phone, Briefcase, Calendar, Building2, Award, Camera, Save, X, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const FacultyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profile: {
            avatar: '',
            bio: ''
        },
        facultyProfile: {
            employeeId: '',
            department: '',
            designation: '',
            phone: '',
            subjects: [],
            joinDate: ''
        }
    });

    const [avatarPreview, setAvatarPreview] = useState('');
    const [subjectInput, setSubjectInput] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/faculty/profile');
            setProfile(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                profile: {
                    avatar: data.profile?.avatar || '',
                    bio: data.profile?.bio || ''
                },
                facultyProfile: {
                    employeeId: data.facultyProfile?.employeeId || '',
                    department: data.facultyProfile?.department || '',
                    designation: data.facultyProfile?.designation || '',
                    phone: data.facultyProfile?.phone || '',
                    subjects: data.facultyProfile?.subjects || [],
                    joinDate: data.facultyProfile?.joinDate ? new Date(data.facultyProfile.joinDate).toISOString().split('T')[0] : ''
                }
            });
            setAvatarPreview(data.profile?.avatar || '');
        } catch (err) {
            console.error('Failed to fetch profile', err);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('facultyProfile.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                facultyProfile: {
                    ...prev.facultyProfile,
                    [field]: value
                }
            }));
        } else if (name.startsWith('profile.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAvatarChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                avatar: url
            }
        }));
        setAvatarPreview(url);
    };

    // Handle file upload from device
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                setTimeout(() => setError(null), 3000);
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                setTimeout(() => setError(null), 3000);
                return;
            }

            // Convert to base64 for preview and storage
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setAvatarPreview(base64String);
                setFormData(prev => ({
                    ...prev,
                    profile: {
                        ...prev.profile,
                        avatar: base64String
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSubject = () => {
        if (subjectInput.trim() && !formData.facultyProfile.subjects.includes(subjectInput.trim())) {
            setFormData(prev => ({
                ...prev,
                facultyProfile: {
                    ...prev.facultyProfile,
                    subjects: [...prev.facultyProfile.subjects, subjectInput.trim()]
                }
            }));
            setSubjectInput('');
        }
    };

    const handleRemoveSubject = (subject) => {
        setFormData(prev => ({
            ...prev,
            facultyProfile: {
                ...prev.facultyProfile,
                subjects: prev.facultyProfile.subjects.filter(s => s !== subject)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const { data } = await api.put('/faculty/profile', formData);
            setProfile(data);

            // Update global auth state to keep session and localStorage in sync
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                setUser({ ...userInfo, ...data });
            }

            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update profile', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
        // Reset form to original profile data
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                profile: {
                    avatar: profile.profile?.avatar || '',
                    bio: profile.profile?.bio || ''
                },
                facultyProfile: {
                    employeeId: profile.facultyProfile?.employeeId || '',
                    department: profile.facultyProfile?.department || '',
                    designation: profile.facultyProfile?.designation || '',
                    phone: profile.facultyProfile?.phone || '',
                    subjects: profile.facultyProfile?.subjects || [],
                    joinDate: profile.facultyProfile?.joinDate ? new Date(profile.facultyProfile.joinDate).toISOString().split('T')[0] : ''
                }
            });
            setAvatarPreview(profile.profile?.avatar || '');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Profile</h1>
                    <p className="text-gray-400 mt-2">Manage your personal and professional information</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
                    >
                        <User size={18} />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3"
                    >
                        <CheckCircle className="text-emerald-500" size={20} />
                        <p className="text-emerald-500 font-medium">Profile updated successfully!</p>
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
                    >
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-500 font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Profile Picture</h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Faculty')}&size=200&background=10b981&color=fff&bold=true`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold">
                                        {formData.name?.charAt(0)?.toUpperCase() || 'F'}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={32} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
                                        Profile Picture
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
                                        >
                                            <Upload size={18} />
                                            Upload from Device
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="text-gray-500 text-sm">OR</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.profile.avatar}
                                            onChange={handleAvatarChange}
                                            placeholder="Enter image URL"
                                            className="w-full px-4 py-3 pl-14 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Upload an image from your device or enter a URL</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-400 text-sm">Current profile picture</p>
                                    <p className="text-xs text-gray-600 mt-1">Click "Edit Profile" to change</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <User size={14} className="inline mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <Mail size={14} className="inline mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Bio
                            </label>
                            <textarea
                                name="profile.bio"
                                value={formData.profile.bio}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                rows={3}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <Briefcase size={14} className="inline mr-2" />
                                Employee ID
                            </label>
                            <input
                                type="text"
                                name="facultyProfile.employeeId"
                                value={formData.facultyProfile.employeeId}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="EMP001"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <Building2 size={14} className="inline mr-2" />
                                Department
                            </label>
                            <input
                                type="text"
                                name="facultyProfile.department"
                                value={formData.facultyProfile.department}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Computer Science"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <Award size={14} className="inline mr-2" />
                                Designation
                            </label>
                            <input
                                type="text"
                                name="facultyProfile.designation"
                                value={formData.facultyProfile.designation}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Assistant Professor"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <Phone size={14} className="inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="facultyProfile.phone"
                                value={formData.facultyProfile.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="+1 234 567 8900"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <Calendar size={14} className="inline mr-2" />
                                Join Date
                            </label>
                            <input
                                type="date"
                                name="facultyProfile.joinDate"
                                value={formData.facultyProfile.joinDate}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Subjects Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Subjects Teaching</h3>
                    {isEditing && (
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={subjectInput}
                                onChange={(e) => setSubjectInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                                placeholder="Enter subject name"
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleAddSubject}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                            >
                                Add
                            </button>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                        {formData.facultyProfile.subjects.length > 0 ? (
                            formData.facultyProfile.subjects.map((subject, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium flex items-center gap-2"
                                >
                                    {subject}
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubject(subject)}
                                            className="hover:text-red-400 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No subjects added yet</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FacultyProfile;
