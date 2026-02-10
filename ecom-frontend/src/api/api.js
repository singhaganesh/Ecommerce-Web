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
            // Token expired or invalid, clear it and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;