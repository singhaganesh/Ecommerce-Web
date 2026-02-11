import axios from "axios";

const api = axios.create({
    baseURL:`${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

// Add request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const publicPaths = ['/', '/categories', '/search', '/login', '/register'];
            
            if (!publicPaths.includes(currentPath) && !currentPath.startsWith('/seller/register')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;