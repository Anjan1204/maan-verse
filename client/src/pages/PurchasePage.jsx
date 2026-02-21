import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Mail, Lock, CheckCircle, ArrowLeft, Loader2, QrCode, Smartphone, Clock } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Course Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-10"
                    >
                        <div className="space-y-6">
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{course.title}</h1>
                            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">{course.description}</p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="px-4 py-2 glass rounded-full flex items-center gap-2 border border-primary/20 bg-primary/5">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-sm font-bold text-gray-200">{course.level || 'Beginner'}</span>
                                </div>
                                <div className="px-4 py-2 glass rounded-full flex items-center gap-2 border border-secondary/20 bg-secondary/5">
                                    <Clock size={16} className="text-secondary" />
                                    <span className="text-sm font-bold text-gray-200">{course.duration || 'Self-paced'}</span>
                                </div>
                                <div className="px-4 py-2 glass rounded-full flex items-center gap-2 border border-white/10">
                                    <CheckCircle size={16} className="text-green-400" />
                                    <span className="text-sm font-bold text-gray-200">{course.enrolledCount || 0} Students</span>
                                </div>
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <div className="glass p-8 rounded-[2rem] border border-white/5 bg-white/[0.02]">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="p-2 bg-primary/20 rounded-lg"><CheckCircle size={20} className="text-primary" /></span>
                                What you'll learn
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.learningOutcomes?.map((outcome, idx) => (
                                    <div key={idx} className="flex gap-3 text-gray-300">
                                        <CheckCircle size={18} className="text-green-500 shrink-0 mt-1" />
                                        <span className="text-sm leading-relaxed">{outcome}</span>
                                    </div>
                                )) || <p className="text-gray-500 italic">No specific outcomes listed.</p>}
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <span className="p-2 bg-secondary/20 rounded-lg"><Lock size={20} className="text-secondary" /></span>
                                Course Content
                            </h3>
                            <div className="space-y-3">
                                {course.chapters?.map((chapter, idx) => (
                                    <div key={idx} className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-400 group-hover:text-white transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-200">{chapter.title}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    {chapter.isFree ? <span className="text-green-400">Preview Available</span> : <span>Locked Content</span>}
                                                </p>
                                            </div>
                                        </div>
                                        {chapter.isFree ? (
                                            <button className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">Preview</button>
                                        ) : (
                                            <Lock size={16} className="text-gray-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="glass p-8 rounded-[2rem] border border-white/5">
                            <h3 className="text-2xl font-bold mb-6">Requirements</h3>
                            <ul className="space-y-3">
                                {course.requirements?.map((req, idx) => (
                                    <li key={idx} className="flex gap-3 text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0" />
                                        <span className="text-sm">{req}</span>
                                    </li>
                                )) || <li className="text-gray-500 italic">No specific requirements listed.</li>}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right Column: Checkout Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">
                            {/* Enrollment Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none" />

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400 font-bold">Course Price</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-500 line-through text-sm">₹{course.price * 2}</span>
                                            <span className="text-4xl font-black text-secondary">₹{course.price}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                                        <p className="text-xs text-green-400 font-bold flex items-center gap-2">
                                            <CheckCircle size={14} /> 50% Early Bird Discount Applied!
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <CheckCircle size={18} className="text-primary" />
                                            <span className="text-sm">Lifetime Access</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <CheckCircle size={18} className="text-primary" />
                                            <span className="text-sm">Verified Certificate</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <CheckCircle size={18} className="text-primary" />
                                            <span className="text-sm">Instructor Support</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const element = document.getElementById('checkout-anchor');
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </motion.div>

                            {/* Secure Payment Form Anchor */}
                            <div id="checkout-anchor" />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Checkout</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-2 rounded-lg transition-colors ${paymentMethod === 'card' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                        >
                                            <CreditCard size={18} />
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`p-2 rounded-lg transition-colors ${paymentMethod === 'upi' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                        >
                                            <QrCode size={18} />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handlePurchase} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                                            placeholder="jane@doe.com"
                                        />
                                    </div>

                                    {paymentMethod === 'card' ? (
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">Card Number</label>
                                                <input
                                                    type="text"
                                                    name="number"
                                                    value={cardData.number}
                                                    onChange={handleCardChange}
                                                    className={`w-full px-4 py-3 bg-white/5 border ${errors.number ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-primary transition-all`}
                                                    placeholder="0000 0000 0000 0000"
                                                />
                                                {errors.number && <p className="text-xs text-red-500 px-1">{errors.number}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">Name on Card</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={cardData.name}
                                                    onChange={handleCardChange}
                                                    className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-primary transition-all`}
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
                                                        value={cardData.expiry}
                                                        onChange={handleCardChange}
                                                        className={`w-full px-4 py-3 bg-white/5 border ${errors.expiry ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-primary transition-all`}
                                                        placeholder="MM/YY"
                                                    />
                                                    {errors.expiry && <p className="text-xs text-red-500 px-1">{errors.expiry}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">CVV</label>
                                                    <input
                                                        type="password"
                                                        name="cvv"
                                                        value={cardData.cvv}
                                                        onChange={handleCardChange}
                                                        className={`w-full px-4 py-3 bg-white/5 border ${errors.cvv ? 'border-red-500' : 'border-white/10'} rounded-xl text-sm focus:outline-none focus:border-primary transition-all`}
                                                        placeholder="***"
                                                    />
                                                    {errors.cvv && <p className="text-xs text-red-500 px-1">{errors.cvv}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 py-2">
                                            <div className="bg-white p-4 rounded-2xl w-40 h-40">
                                                <img src="/assets/qr.jpeg" alt="QR" className="w-full h-full object-contain" />
                                            </div>
                                            <p className="text-[10px] text-gray-500 text-center">Scan QR and click complete</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full py-4 mt-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-black text-sm hover:translate-y-[-2px] transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                                    >
                                        {paymentMethod === 'card' ? `Pay ₹${course.price}` : 'Complete Enrollment'}
                                    </button>
                                </form>
                                <div className="flex items-center justify-center gap-2 pt-2 grayscale opacity-40">
                                    <Lock size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
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
