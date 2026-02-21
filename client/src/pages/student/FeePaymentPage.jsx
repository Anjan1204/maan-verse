import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, ArrowLeft, Loader2, QrCode, Lock } from 'lucide-react';
import api from '../../utils/api';
// import { useAuth } from '../../hooks/useAuth'; // Removed unused import
import { toast } from 'react-toastify';

const FeePaymentPage = () => {
    const { feeId } = useParams();
    const navigate = useNavigate();
    // const { user } = useAuth(); // Removed unused variable 'user'
    const [fee, setFee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStage, setPaymentStage] = useState('initial'); // initial, redirecting, processing, success
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Card State
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchFee = async () => {
            try {
                const { data } = await api.get(`/fees/${feeId}`);
                setFee(data);
            } catch (error) {
                console.error('Error fetching fee:', error);
                toast.error('Failed to load fee details');
                navigate('/student/fees');
            } finally {
                setLoading(false);
            }
        };

        if (feeId) {
            fetchFee();
        }
    }, [feeId, navigate]);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'number') formattedValue = formatCardNumber(value).substring(0, 19);
        if (name === 'expiry') formattedValue = formatExpiry(value).substring(0, 5);
        if (name === 'cvv') formattedValue = value.replace(/[^0-9]/gi, '').substring(0, 3);
        if (name === 'name') formattedValue = value.replace(/[^a-zA-Z\s]/gi, '');

        setCardData(prev => ({ ...prev, [name]: formattedValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (paymentMethod === 'card') {
            if (cardData.number.replace(/\s/g, '').length !== 16) newErrors.number = 'Invalid card number';
            if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) newErrors.expiry = 'Invalid expiry';
            if (cardData.cvv.length !== 3) newErrors.cvv = 'Invalid CVV';
            if (cardData.name.length < 3) newErrors.name = 'Invalid name';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setPaymentStage('redirecting');

        // Stage 1: Redirecting
        setTimeout(async () => {
            setPaymentStage('processing');

            // Stage 2: Processing
            try {
                // Simulate payment processing delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                await api.put(`/fees/${feeId}`, {
                    status: 'Paid',
                    transactionId: `STU-PAY-${Date.now()}`
                });

                setPaymentStage('success');

                // Stage 3: Success
                setTimeout(() => {
                    toast.success('Fee paid successfully!');
                    navigate('/student/fees');
                }, 3000);

            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
                setPaymentStage('initial');
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!fee) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-dark text-white font-sans relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Fees
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Fee Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="glass p-8 rounded-[2rem] border border-white/10 bg-white/[0.02]">
                            <h2 className="text-3xl font-black mb-6">Fee Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Description</span>
                                    <span className="font-bold text-white uppercase tracking-wider">{fee.type} Fee</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Semester</span>
                                    <span className="font-bold text-white">{fee.semester}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Due Date</span>
                                    <span className="font-bold text-white">{new Date(fee.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-6">
                                    <span className="text-lg font-bold">Total Amount</span>
                                    <span className="text-3xl font-black text-indigo-400">₹{fee.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-white/5 bg-indigo-500/5 flex items-start gap-4">
                            <Lock className="text-indigo-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-sm">Secure Payment</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                                    Your transaction is protected by industry-standard encryption. We do not store your full card details.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Checkout Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Checkout</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-2 rounded-lg transition-colors ${paymentMethod === 'card' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                >
                                    <CreditCard size={18} />
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`p-2 rounded-lg transition-colors ${paymentMethod === 'upi' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                >
                                    <QrCode size={18} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-4">
                            {paymentMethod === 'card' ? (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">Card Number</label>
                                        <input
                                            type="text"
                                            name="number"
                                            required
                                            value={cardData.number}
                                            onChange={handleCardChange}
                                            className={`w-full px-4 py-3 bg-white/5 border ${errors.number ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all`}
                                            placeholder="0000 0000 0000 0000"
                                        />
                                        {errors.number && <p className="text-xs text-red-500 px-1">{errors.number}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">Name on Card</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={cardData.name}
                                            onChange={handleCardChange}
                                            className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all`}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-xs text-red-500 px-1">{errors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">Expiry</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                required
                                                value={cardData.expiry}
                                                onChange={handleCardChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.expiry ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all`}
                                                placeholder="MM/YY"
                                            />
                                            {errors.expiry && <p className="text-xs text-red-500 px-1">{errors.expiry}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">CVV</label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                required
                                                value={cardData.cvv}
                                                onChange={handleCardChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.cvv ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-all`}
                                                placeholder="***"
                                            />
                                            {errors.cvv && <p className="text-xs text-red-500 px-1">{errors.cvv}</p>}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div className="bg-white p-4 rounded-2xl w-48 h-48 flex items-center justify-center">
                                        <QrCode size={160} className="text-black" />
                                    </div>
                                    <p className="text-xs text-slate-400 text-center px-6">
                                        Scan this QR with any UPI app and click the complete button below once paid.
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                            >
                                {paymentMethod === 'card' ? `Pay ₹${fee.amount.toLocaleString()}` : 'Complete Payment'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Animation Overlays */}
            <AnimatePresence>
                {paymentStage !== 'initial' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/95 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="text-center space-y-8 max-w-md w-full"
                        >
                            {paymentStage === 'redirecting' && (
                                <div className="space-y-6">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="w-full h-full bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30"
                                        >
                                            <Lock size={48} className="text-indigo-400" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                            className="absolute inset-0 border-t-2 border-indigo-500 rounded-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black">Redirecting</h3>
                                        <p className="text-slate-400">Connecting to secure gateway...</p>
                                    </div>
                                </div>
                            )}

                            {paymentStage === 'processing' && (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 mx-auto relative">
                                        <motion.div
                                            animate={{
                                                rotate: 360,
                                                borderRadius: ["20%", "50%", "20%"]
                                            }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="w-full h-full border-4 border-dashed border-indigo-400 flex items-center justify-center"
                                        >
                                            <CreditCard size={40} className="text-indigo-400" />
                                        </motion.div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black">Processing</h3>
                                        <p className="text-slate-400">Validating payment details...</p>
                                    </div>
                                </div>
                            )}

                            {paymentStage === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                                        <CheckCircle size={64} className="text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black text-emerald-400">Success!</h3>
                                        <p className="text-slate-400">Your fee payment has been verified.</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeePaymentPage;
