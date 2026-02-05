import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, Zap, Shield } from 'lucide-react';

const FeaturesSection = () => {
    return (
        <div id="features" className="py-24 bg-dark pt-24 relative overflow-hidden">
            <div className="absolute inset-0 chalkboard-doodles opacity-5 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose MAAN-verse?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Elevating the academic experience through a blend of heritage and modern technology.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'Scholarly Curriculum', icon: BookOpen, desc: 'Masterfully crafted content that bridges tradition and innovation.', color: 'text-primary' },
                        { title: 'Expert Mentorship', icon: User, desc: 'Engage with educators who are masters of their specific domains.', color: 'text-secondary' },
                        { title: 'Smart Analytics', icon: Zap, desc: 'Gain deep insights into your academic progress and potential.', color: 'text-accent' },
                        { title: 'Absolute Security', icon: Shield, desc: 'Your intellectual assets are protected by enterprise encryption.', color: 'text-purple-400' },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon size={24} className={`${feature.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
