import React from 'react';
import { motion } from 'framer-motion';
import { Search, Book, MessageSquare, Mail, HelpCircle, GraduationCap } from 'lucide-react';

const HelpPage = () => {
    const faqs = [
        { q: "How do I enroll in a course?", a: "Once logged in as a student, navigate to the Courses page, find your desired course, and click 'Enroll Now'. The course will then appear in your dashboard." },
        { q: "Can I be both direct student and faculty?", a: "No, each account is assigned a specific role. Students can learn and track progress, while faculty can manage classes and students." },
        { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password'. Follow the instructions sent to your registered email address." },
        { q: "Where can I find my exam schedule?", a: "Students can find their exam schedules in the 'Exams' section of their dedicated dashboard." },
        { q: "How do I mark attendance as Faculty?", a: "Faculty can go to their dashboard, select the 'Attendance' tab, choose a class and date, and mark students as present or absent." }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-dark">
            <div className="max-w-5xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-3xl p-12 text-center mb-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <HelpCircle size={120} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">How can we help you?</h1>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for help articles, FAQs..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-xl"
                        />
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="p-8 rounded-2xl bg-surface border border-gray-800 hover:border-primary transition-colors text-center group">
                        <Book className="mx-auto text-primary mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Documentation</h3>
                        <p className="text-sm text-gray-400">Detailed guides for students and faculty on platform features.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-surface border border-gray-800 hover:border-secondary transition-colors text-center group">
                        <GraduationCap className="mx-auto text-secondary mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Student Guides</h3>
                        <p className="text-sm text-gray-400">Learn how to make the most of your learning experience.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-surface border border-gray-800 hover:border-emerald-400 transition-colors text-center group">
                        <MessageSquare className="mx-auto text-emerald-400 mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Community Support</h3>
                        <p className="text-sm text-gray-400">Connect with other learners and experts in our forums.</p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-surface border border-gray-800"
                            >
                                <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
                                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="bg-surface rounded-3xl p-10 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Still need help?</h2>
                        <p className="text-gray-400">Our support team is available 24/7 to assist you.</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="mailto:support@maanverse.com" className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors">
                            <Mail size={18} /> Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
