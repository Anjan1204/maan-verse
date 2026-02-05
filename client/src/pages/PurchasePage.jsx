import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Mail, Lock, CheckCircle, ArrowLeft, Loader2, QrCode, Smartphone } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PurchasePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStage, setPaymentStage] = useState('initial'); // initial, redirecting, processing, success
    const [email, setEmail] = useState(user?.email || '');
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
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${courseId}`);
                setCourse(data);
            } catch (error) {
                console.error('Error fetching course:', error);
                toast.error('Failed to load course details');
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId, navigate]);

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
        if (!email) newErrors.email = 'Email is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.info('Please login to enroll');
            navigate('/login');
            return;
        }

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        // Start Animation Flow
        setPaymentStage('redirecting');

        // Stage 1: Redirecting (2s)
        setTimeout(async () => {
            setPaymentStage('processing');

            // Stage 2: Processing (2.5s)
            try {
                // Simulate payment call
                await api.post('/payment/complete', { courseId });

                // Enroll user
                await api.post('/enrollments', { courseId });

                setTimeout(() => {
                    setPaymentStage('success');

                    // Stage 3: Success (3s)
                    setTimeout(() => {
                        toast.success('Course unlocked successfully!');
                        navigate('/student/dashboard');
                    }, 3000);
                }, 2500);

            } catch (error) {
                toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
                setPaymentStage('initial');
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-dark text-white font-sans relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Course Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Order Summary</h2>
                        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl group hover:border-primary/30 transition-all duration-500">
                            <div className="relative overflow-hidden">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-3">{course.title}</h3>
                                <div className="flex items-center gap-3 text-gray-400 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
                                        {course.faculty?.name?.[0] || 'F'}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Instructor</p>
                                        <span className="text-sm font-medium text-gray-300">{course.faculty?.name || 'Instructor'}</span>
                                    </div>
                                </div>
                                <div className="space-y-3 py-6 border-y border-white/5">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Course Price</span>
                                        <span>${course.price}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Service Fee</span>
                                        <span className="text-green-400">FREE</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-6">
                                    <span className="text-lg font-bold">Total Amount</span>
                                    <span className="text-3xl font-black text-secondary">${course.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 glass rounded-2xl border border-white/10 hover:border-green-500/30 transition-colors group">
                                <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                                    <CheckCircle size={24} className="text-green-400" />
                                </div>
                                <h4 className="font-bold mb-1">Lifetime Access</h4>
                                <p className="text-sm text-gray-400">Learn at your own pace with forever access.</p>
                            </div>
                            <div className="p-6 glass rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors group">
                                <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                                    <CheckCircle size={24} className="text-blue-400" />
                                </div>
                                <h4 className="font-bold mb-1">Certificate</h4>
                                <p className="text-sm text-gray-400">Get recognized for your hard work.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="glass p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-[100px] pointer-events-none" />

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Secure Checkout</h2>
                                <p className="text-gray-400 text-sm">Choose your preferred payment method</p>
                            </div>

                            {/* Payment Method Toggle */}
                            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <CreditCard size={18} />
                                    Credit/Debit Card
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <QrCode size={18} />
                                    UPI Payment
                                </button>
                            </div>

                            <form onSubmit={handlePurchase} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 px-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="jane.doe@example.com"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-xs px-1">{errors.email}</p>}
                                </div>

                                <AnimatePresence mode="wait">
                                    {paymentMethod === 'card' ? (
                                        <motion.div
                                            key="card-payment"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-5"
                                        >
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-400 px-1">Card Holder Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={cardData.name}
                                                    onChange={handleCardChange}
                                                    required
                                                    placeholder="JANE DOE"
                                                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all uppercase"
                                                />
                                                {errors.name && <p className="text-red-400 text-xs px-1">{errors.name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-400 px-1">Card Number</label>
                                                <div className="relative group">
                                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                                    <input
                                                        type="text"
                                                        name="number"
                                                        value={cardData.number}
                                                        onChange={handleCardChange}
                                                        required
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                                    />
                                                </div>
                                                {errors.number && <p className="text-red-400 text-xs px-1">{errors.number}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-400 px-1">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        name="expiry"
                                                        value={cardData.expiry}
                                                        onChange={handleCardChange}
                                                        required
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-center"
                                                    />
                                                    {errors.expiry && <p className="text-red-400 text-xs px-1">{errors.expiry}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-400 px-1">CVV</label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            name="cvv"
                                                            value={cardData.cvv}
                                                            onChange={handleCardChange}
                                                            required
                                                            placeholder="***"
                                                            className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-center"
                                                        />
                                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                                    </div>
                                                    {errors.cvv && <p className="text-red-400 text-xs px-1">{errors.cvv}</p>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="upi-payment"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6 flex flex-col items-center"
                                        >
                                            <div className="p-6 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] group relative">
                                                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <img
                                                    src="/assets/qr.jpeg"
                                                    alt="UPI QR Code"
                                                    className="w-56 h-56 object-contain relative z-10"
                                                />
                                            </div>
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center gap-3 py-2 px-6 bg-secondary/10 rounded-full text-secondary font-black text-lg">
                                                    <Smartphone size={24} />
                                                    <span>Scan & Pay with Any App</span>
                                                </div>
                                                <p className="text-gray-500 text-sm max-w-xs mx-auto">Click 'Complete Purchase' after you've successfully scanned and paid via your mobile app.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] text-white rounded-[1.5rem] font-black text-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                                    >
                                        <Lock size={22} className="group-hover:scale-110 transition-transform" />
                                        {paymentMethod === 'card' ? `Pay $${course.price}` : 'Complete Purchase'}
                                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                                    </button>
                                    <div className="mt-6 flex items-center justify-center gap-6">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Mastercard" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="PayPal" />
                                    </div>
                                    <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-2">
                                        <Lock size={12} className="text-green-500" />
                                        Luma Secure Encryption Standard
                                    </p>
                                </div>
                            </form>
                        </div>
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
                                <motion.div
                                    key="redirecting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30"
                                        >
                                            <Lock size={48} className="text-primary" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                            className="absolute inset-0 border-t-2 border-primary rounded-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black">Redirecting</h3>
                                        <p className="text-gray-400">Connecting to secure payment gateway...</p>
                                    </div>
                                </motion.div>
                            )}

                            {paymentStage === 'processing' && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="w-24 h-24 mx-auto relative">
                                        <motion.div
                                            animate={{
                                                rotate: 360,
                                                borderRadius: ["20%", "50%", "20%"]
                                            }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="w-full h-full border-4 border-dashed border-secondary flex items-center justify-center"
                                        >
                                            <CreditCard size={40} className="text-secondary" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 bg-secondary/20 blur-2xl -z-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black">Processing</h3>
                                        <p className="text-gray-400">Validating your transaction...</p>
                                    </div>
                                </motion.div>
                            )}

                            {paymentStage === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="relative">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                                        >
                                            <CheckCircle size={64} className="text-white" />
                                        </motion.div>
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, x: 0, y: 0 }}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    x: Math.cos(i * 30 * Math.PI / 180) * 100,
                                                    y: Math.sin(i * 30 * Math.PI / 180) * 100
                                                }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black text-green-400">Success!</h3>
                                        <p className="text-gray-400">Payment verified. Unlocking your course content...</p>
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

export default PurchasePage;
