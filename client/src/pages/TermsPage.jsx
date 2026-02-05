import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserCheck, AlertCircle, HelpCircle } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-dark">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-gray-400">Last updated: January 25, 2026</p>
                </motion.div>

                <div className="space-y-12 text-gray-300">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="text-primary" size={24} />
                            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
                        </div>
                        <p className="leading-relaxed">
                            By accessing or using MAAN-verse, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our platform. These terms apply to all visitors, students, faculty, and others who access or use the Service.
                        </p>
                    </section>

                    <section className="bg-surface p-8 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <UserCheck className="text-secondary" size={24} />
                            <h2 className="text-2xl font-bold text-white">2. User Accounts</h2>
                        </div>
                        <p className="leading-relaxed mb-4">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                        </p>
                        <p className="leading-relaxed font-medium text-white italic">
                            "You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password."
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-orange-400" size={24} />
                            <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
                        </div>
                        <p className="leading-relaxed">
                            The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of MAAN-verse and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MAAN-verse.
                        </p>
                    </section>

                    <section className="bg-surface p-8 rounded-2xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="text-blue-400" size={24} />
                            <h2 className="text-2xl font-bold text-white">4. Termination</h2>
                        </div>
                        <p className="leading-relaxed">
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p className="leading-relaxed">
                            In no event shall MAAN-verse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <div className="text-center pt-8 border-t border-gray-800">
                        <p className="text-gray-400 mb-4">By using our services, you acknowledge you have read and agree to these terms.</p>
                        <p className="text-sm text-gray-500">For legal inquiries: <a href="mailto:legal@maanverse.com" className="hover:text-primary transition-colors">legal@maanverse.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
