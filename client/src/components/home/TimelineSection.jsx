import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, CheckCircle, Award } from 'lucide-react';

const TimelineSection = () => {
    const timeline = [
        { time: '09:00 AM', title: 'Live Class', desc: 'Join interactive sessions with polls and Q&A.', icon: Users, color: 'bg-blue-500' },
        { time: '11:00 AM', title: 'Practice Lab', desc: 'Apply concepts in our virtual coding environments.', icon: Zap, color: 'bg-yellow-500' },
        { time: '02:00 PM', title: 'Quiz Attempt', desc: 'Test your understanding with AI-generated quizzes.', icon: CheckCircle, color: 'bg-emerald-500' },
        { time: '04:00 PM', title: 'Performance Review', desc: 'Get detailed insights on where to improve.', icon: Award, color: 'bg-purple-500' },
    ];

    return (
        <div className="py-24 bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-primary font-bold tracking-wider text-sm uppercase">Experience</span>
                        <h2 className="text-4xl font-bold text-white mt-2 mb-6">A Day on MAAN-verse</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Our platform seamlessly integrates into your daily routine, making learning a habit rather than a chore.
                            From live interactions to self-paced practice, we've got you covered.
                        </p>
                        <a href="#features" className="text-white border-b-2 border-primary pb-1 font-bold hover:text-primary transition-colors">
                            Explore Features
                        </a>
                    </div>

                    <div className="relative border-l-2 border-gray-800 pl-8 space-y-12">
                        {timeline.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative"
                            >
                                <span className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-gray-900 ${item.color}`}></span>
                                <span className="text-sm font-bold text-gray-500 mb-1 block">{item.time}</span>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineSection;
