import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            navigate('/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="glass py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                        <h2 className="text-center text-3xl font-extrabold text-white">Create Account</h2>
                        <p className="text-center text-gray-400 mt-2">Join MAAN-verse today</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">{error}</div>}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 appearance-none block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary text-gray-900 sm:text-sm transition-colors"
                            />
                        </div>
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
                            <label className="block text-sm font-medium text-gray-300">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 sm:text-sm"
                            >
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-secondary hover:text-pink-400">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
