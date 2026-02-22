import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
});

if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL) {
    console.warn('VITE_API_URL is not defined in production environment!');
}

api.interceptors.request.use((config) => {
    try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    } catch (error) {
        console.error('Error parsing userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
    }
    return config;
});

// Auto-toast for API errors in production
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data?.message || error.message);
        // We can't use toast here easily without importing it, 
        // but we'll log it clearly for the user to find in console
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
