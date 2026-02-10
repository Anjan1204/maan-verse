import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldAlert } from 'lucide-react';

const AdminApprovalModal = ({ request, onApprove, onReject }) => {
    if (!request) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                >
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500">
                            <ShieldAlert size={32} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white">Login Approval Request</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Another admin is trying to log in. Do you approve this session?
                            </p>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 w-full text-left space-y-2 border border-gray-700/50">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">User:</span>
                                <span className="text-white font-medium">{request.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Email:</span>
                                <span className="text-white font-medium">{request.email}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">IP Address:</span>
                                <span className="text-mono text-gray-400">{request.ip || 'Unknown'}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full pt-2">
                            <button
                                onClick={() => onReject(request.requestId)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
                            >
                                <X size={18} />
                                Reject
                            </button>
                            <button
                                onClick={() => onApprove(request.requestId)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                <Check size={18} />
                                Approve
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdminApprovalModal;
