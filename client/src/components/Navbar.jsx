import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Logo from './Logo';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group decoration-0">
                            <Logo />
                        </Link>
                        <div className="hidden md:ml-12 md:flex md:space-x-8">
                            {['Home', 'Courses', 'About', 'Contact'].map((item) => {
                                const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                                const isActive = location.pathname === path;

                                return (
                                    <Link
                                        key={item}
                                        to={path}
                                        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all relative group ${isActive ? 'text-secondary' : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {item}
                                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}></span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all focus:outline-none group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary shadow-lg group-hover:bg-white/10 transition-all">
                                        <UserIcon size={18} />
                                    </div>
                                    <span className="text-sm font-semibold">{user.name}</span>
                                    <ChevronDown size={14} className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-56 rounded-2xl bg-dark/95 border border-white/10 py-2 z-50 overflow-hidden backdrop-blur-xl shadow-2xl"
                                        >
                                            <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Scholar Profile</p>
                                                <p className="text-sm font-bold text-white truncate">{user.email}</p>
                                            </div>
                                            <div className="p-1">
                                                <Link
                                                    to={`/${user.role}/dashboard`}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/5 rounded-xl transition-all font-medium"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link to="/login" className="text-slate-400 hover:text-white font-bold transition-all px-2">
                                    Log In
                                </Link>
                                <Link to="/register" className="bg-secondary text-dark px-7 py-3 rounded-xl font-bold hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-secondary/10">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2 bg-white/5 rounded-lg border border-white/10">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-gray-700"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                            <Link to="/courses" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Courses</Link>
                            {user ? (
                                <>
                                    <Link to={`/${user.role}/dashboard`} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Sign out</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Log In</Link>
                                    <Link to="/register" className="text-secondary hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
