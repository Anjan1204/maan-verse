import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Globe } from 'lucide-react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-dark">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-gray-400">Last updated: January 25, 2026</p>
                </motion.div>

                <div className="space-y-12 text-gray-300">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-primary" size={24} />
                            <h2 className="text-2xl font-bold text-white">Our Commitment to Privacy</h2>
                        </div>
                        <p className="leading-relaxed">
                            At MAAN-verse, we take your privacy seriously. This policy describes how we collect, use, and handle your information when you use our Learning Management System. We are committed to protecting your data and ensuring a safe learning environment for all students and faculty.
                        </p>
                    </section>

                    <section className="bg-surface p-8 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="text-secondary" size={24} />
                            <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>Account Information:</strong> Name, email, password, and role (student/faculty).</li>
                            <li><strong>Course Data:</strong> Enrollment details, progress, quiz results, and assignments.</li>
                            <li><strong>Technical Data:</strong> IP address, browser type, and device information for security.</li>
                            <li><strong>Communication:</strong> Records of your interactions with our support and community features.</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="text-emerald-400" size={24} />
                            <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
                        </div>
                        <p className="leading-relaxed">
                            We use your data to provide, maintain, and improve our services, specifically:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                                <h3 className="text-white font-bold mb-2">Personalization</h3>
                                <p className="text-sm text-gray-400">Customizing your course recommendations and learning path.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                                <h3 className="text-white font-bold mb-2">Analytics</h3>
                                <p className="text-sm text-gray-400">Tracking progress and performance to help you succeed.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                                <h3 className="text-white font-bold mb-2">Security</h3>
                                <p className="text-sm text-gray-400">Preventing unauthorized access and protecting your account.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                                <h3 className="text-white font-bold mb-2">Communication</h3>
                                <p className="text-sm text-gray-400">Sending platform updates and support notifications.</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-surface p-8 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="text-blue-400" size={24} />
                            <h2 className="text-2xl font-bold text-white">Data Sharing & Security</h2>
                        </div>
                        <p className="leading-relaxed mb-4">
                            MAAN-verse does not sell your personal data to third parties. We only share information when necessary to provide our services or comply with legal requirements.
                        </p>
                        <p className="leading-relaxed">
                            We implement enterprise-grade security measures including end-to-end encryption and regular security audits to keep your information safe.
                        </p>
                    </section>

                    <div className="text-center pt-8 border-t border-gray-800">
                        <p className="text-gray-400 mb-4">Questions about our Privacy Policy?</p>
                        <a href="mailto:privacy@maanverse.com" className="text-primary font-bold hover:underline">privacy@maanverse.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
