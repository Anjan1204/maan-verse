import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, MessageSquare, CheckCircle, Shield } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const FacultyInquiryModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        query: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Attempting to submit inquiry:', formData);
        try {
            const response = await api.post('/inquiries', formData);
            console.log('Inquiry submission success:', response.data);
            setSubmitted(true);
            toast.success('Inquiry submitted successfully!');
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', query: '' });
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Inquiry submission failed:', error);
            toast.error(error.response?.data?.message || 'Failed to submit inquiry. Please check the console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Side Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md z-[101] bg-gray-900 shadow-2xl border-l border-white/10 flex flex-col"
                    >
                        {/* Premium Header */}
                        <div className="p-8 bg-gradient-to-br from-primary/20 to-secondary/10 border-b border-white/5 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <MessageSquare className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white leading-tight">Join Our Faculty</h2>
                                    <p className="text-indigo-300/80 text-sm font-medium">Shape the future of MAAN-verse</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center py-12"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="text-green-500" size={48} />
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900"
                                        />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">Inquiry Received!</h3>
                                    <p className="text-gray-400 text-lg">Thank you for your interest. Our academic team will review your profile and reach out shortly.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Personal Details</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl border-indigo-500/50 transition-all placeholder:text-gray-600 focus:bg-white/10"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Contact Details</label>
                                            <div className="relative group mb-4">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-indigo-500/50 transition-all placeholder:text-gray-600 focus:bg-white/10"
                                                    placeholder="Email address"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-indigo-500/50 transition-all placeholder:text-gray-600 focus:bg-white/10"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">A Little About You</label>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-4 top-4 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                                            <textarea
                                                name="query"
                                                required
                                                value={formData.query}
                                                onChange={handleChange}
                                                rows="5"
                                                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-indigo-500/50 transition-all placeholder:text-gray-600 focus:bg-white/10 resize-none font-sans"
                                                placeholder="Tell us about your area of expertise and why you want to join MAAN-verse..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full group bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Submit Application
                                                    <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                                            <Shield size={12} className="text-gray-600" /> Secure application process
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FacultyInquiryModal;
