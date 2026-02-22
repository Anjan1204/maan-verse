import React, { createContext, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Initial auth check failed:', error);
            localStorage.removeItem('userInfo');
            return null;
        }
    });
    // const [loading, setLoading] = useState(false); // Removed unused variable 'loading'


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
        <AuthContext.Provider value={{ user, setUser: syncUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
