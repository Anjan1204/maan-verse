import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, PenTool, Database, TrendingUp, Cpu, Globe, Music, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const CategoriesSection = () => {
    const [counts, setCounts] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/courses/categories/stats');
                setCounts(data);
            } catch (error) {
                console.error('Error fetching category stats:', error);
            }
        };
        fetchStats();
    }, []);

    const categories = [
        { name: 'Development', icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { name: 'Design', icon: PenTool, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { name: 'Business', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { name: 'Data Science', icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { name: 'Marketing', icon: Globe, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { name: 'Photography', icon: Camera, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { name: 'Music', icon: Music, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        { name: 'AI & ML', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    ];

    return (
        <div className="py-24 bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Explore Top Categories</h2>
                    <p className="text-gray-400">Browse our most popular topics and find something new to learn</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link to={`/courses?category=${cat.name}`} className={`group block p-6 rounded-2xl border ${cat.border} ${cat.bg} hover:bg-gray-800 transition-all duration-300`}>
                                <cat.icon size={32} className={`${cat.color} mb-4 group-hover:scale-110 transition-transform`} />
                                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {counts[cat.name] || 0} {counts[cat.name] === 1 ? 'Course' : 'Courses'}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesSection;
