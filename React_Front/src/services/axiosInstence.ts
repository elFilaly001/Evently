import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token on every request
        const token = localStorage.getItem('ticket');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;  // Note the capital 'A' in Authorization
        }
        return config;
    },
    (error) => Promise.reject(error)
);
