import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
});


axiosInstance.interceptors.request.use(
    (config) => {
        config.withCredentials = true
        const token = localStorage.getItem('ticket')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
