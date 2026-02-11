import axios from "axios";

const api = axios.create({
    baseURL:`${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true, // Important: allows cookies to be sent with requests
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect to login for protected routes, not for public pages
            const currentPath = window.location.pathname;
            const publicPaths = ['/', '/categories', '/search', '/login', '/register'];
            
            // Only clear token and redirect if user was on a protected route
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