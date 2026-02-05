import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Users, GraduationCap, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-dark border-b border-white/5">
            {/* Custom Scholarly Background Image - Enhanced Visibility */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 transition-opacity duration-1000"
                style={{
                    backgroundImage: 'url("/assets/background.jpg")',
                    filter: 'contrast(1.5) brightness(1.9) saturate(1.1)'
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/40 to-dark/90 pointer-events-none"></div>

            {/* Secondary Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20 pb-32">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 mb-6"
                    >
                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-lg shadow-primary/5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            20+ Classes Live Now
                        </span>
                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold border border-secondary/20 shadow-lg shadow-secondary/5">
                            <Users size={12} />
                            15k+ Students Learning
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                    >
                        Master the Galaxy <br /> with <span className="text-secondary drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">MAAN-verse</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto"
                    >
                        Welcome to your scholarly haven. A platform where
                        curiosity meets expertise in a timeless learning environment.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="relative max-w-2xl mx-auto mb-10"
                    >
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="What do you want to learn today?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 rounded-full bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xl"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary/90 hover:-translate-y-1 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 group">
                            Enroll Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button
                            onClick={() => setIsDemoModalOpen(true)}
                            className="w-full sm:w-auto px-10 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2"
                        >
                            <Play size={20} fill="currentColor" className="text-secondary" /> Watch Session
                        </button>
                    </motion.div>
                </div>

                {/* Role Entry Cards - Positioned to bridge Hero and Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-20 translate-y-12">
                    {[
                        { role: 'Student', icon: GraduationCap, color: 'text-primary', border: 'hover:border-primary/50', link: '/student/dashboard', desc: 'Step into your personalized classroom' },
                        { role: 'Faculty', icon: Users, color: 'text-accent', border: 'hover:border-accent/50', link: '/faculty/dashboard', desc: 'Lead and inspire the next generation' },
                        { role: 'Admin', icon: Shield, color: 'text-purple-400', border: 'hover:border-purple-400/50', link: '/admin/dashboard', desc: 'The architect of the ecosystem' }
                    ].map((card, i) => (
                        <motion.div
                            key={card.role}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                        >
                            <Link to={card.link} className={`block h-full glass border border-white/10 p-8 rounded-2xl transition-all duration-300 group ${card.border} hover:-translate-y-2 hover:shadow-2xl`}>
                                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-white/10`}>
                                    <card.icon size={32} className={card.color} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    I am a {card.role}
                                    <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-white/50" />
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Demo Modal */}
            <AnimatePresence>
                {isDemoModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setIsDemoModalOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all z-10"
                            >
                                <X size={24} />
                            </button>
                            <iframe
                                className="w-full h-full"
                                src="https://go.screenpal.com/watch/cOVTqXn32ZT"
                                title="Platform Demo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HeroSection;
