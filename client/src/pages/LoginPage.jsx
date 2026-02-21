import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [waitingForApproval, setWaitingForApproval] = useState(false);
    const { login } = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login(email, password);

            if (response.requireApproval) {
                setWaitingForApproval(true);
                if (socket) {
                    socket.emit('login:wait', response.requestId);
                }
            } else {
                handleLoginSuccess(response);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setWaitingForApproval(false);
        }
    };

    const handleLoginSuccess = (user) => {
        if (user.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (user.role === 'faculty') {
            navigate('/faculty/dashboard');
        } else if (user.role === 'student') {
            navigate('/student/dashboard');
        } else {
            setError('Unknown user role. Please contact support.');
        }
    };

    useEffect(() => {
        if (socket && waitingForApproval) {
            const handleLoginResult = (data) => {
                if (data.success) {
                    // Manually set user in local storage and context is tricky here 
                    // because `login` usually does it. 
                    // We need to re-use the AuthContext's mechanism or manually update it.
                    // For now, let's assume `login` returned the user object on direct success
                    // but here we get { success: true, token, user }.
                    // We need to update localStorage and redirect.
                    localStorage.setItem('userInfo', JSON.stringify({ ...data.user, token: data.token }));
                    // Force a reload or update context? 
                    // Simpler to just redirect and let AuthProvider read from LS on mount? 
                    // No, AuthProvider listens to LS only on mount.
                    // We should probably reload the page to pick up the new user state or use a method from AuthContext.
                    // Since we can't easily access `setUser` from here without exposing it, 
                    // a full reload is a safe fallback, or we can assume AuthProvider will pick it up if we navigate.
                    // Actually, navigate won't trigger a re-mount of AuthProvider.
                    // Let's do a window.location.href to force reload/redirect.
                    window.location.href = '/admin/dashboard';
                } else {
                    setWaitingForApproval(false);
                    setError(data.message || 'Login rejected');
                }
            };

            socket.on('login:result', handleLoginResult);

            return () => {
                socket.off('login:result', handleLoginResult);
            };
        }
    }, [socket, waitingForApproval]);

    if (waitingForApproval) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="glass p-8 rounded-2xl flex flex-col items-center max-w-sm w-full text-center">
                    <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                        <Loader className="w-16 h-16 text-primary animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-white mt-6">Waiting for Approval</h3>
                    <p className="text-gray-400 mt-2">
                        An existing admin has been notified. Please wait for them to approve this session.
                    </p>
                    <button
                        onClick={() => setWaitingForApproval(false)}
                        className="mt-6 text-sm text-red-400 hover:text-red-300 font-medium"
                    >
                        Cancel Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="glass py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                        <h2 className="text-center text-3xl font-extrabold text-white">Welcome Back</h2>
                        <p className="text-center text-gray-400 mt-2">Sign in to your account</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">{error}</div>}

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 sm:text-sm transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 appearance-none block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 sm:text-sm transition-colors"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-secondary hover:text-pink-400">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
