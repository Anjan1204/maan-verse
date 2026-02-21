import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contact', formData);
            toast.success('Message sent successfully! We will get back to you soon.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-dark relative overflow-hidden">
            <ToastContainer />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in <span className="text-gradient">Touch</span></h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have a question or just want to say hi? We'd love to hear from you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-400">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="glass p-8 rounded-3xl h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface border border-gray-700 flex items-center justify-center text-primary shadow-lg">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white">Email Us</h4>
                                            <p className="text-gray-400">maanverse85@gmail.com</p>
                                            <p className="text-gray-500 text-sm">Response within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface border border-gray-700 flex items-center justify-center text-primary shadow-lg">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white">Call Us</h4>
                                            <p className="text-gray-400">+91 7632895266</p>
                                            <p className="text-gray-500 text-sm">Mon-Fri, 9am - 6pm IST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface border border-gray-700 flex items-center justify-center text-primary shadow-lg">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white">Visit Our Offices</h4>
                                            <p className="text-gray-400">Surat, Gujarat</p>
                                            <p className="text-gray-400">Patna, Bihar</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                                <p className="text-white italic">"The art of teaching is the art of assisting discovery." - Mark Van Doren</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Send Message</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="He/She"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="he/she@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Send size={20} /> Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
