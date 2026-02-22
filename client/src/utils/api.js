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
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

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
