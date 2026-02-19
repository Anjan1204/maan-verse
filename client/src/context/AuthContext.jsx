import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    });
    const [loading, setLoading] = useState(false);


    // Synchronize user state with localStorage whenever it changes
    const syncUser = (userData) => {
        if (userData) {
            localStorage.setItem('userInfo', JSON.stringify(userData));
        } else {
            localStorage.removeItem('userInfo');
        }
        setUser(userData);
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });

        if (!data.requireApproval) {
            syncUser(data);
        }
        return data;
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });

        if (!data.pendingApproval) {
            syncUser(data);
        }
        return data;
    };

    const logout = () => {
        syncUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser: syncUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
