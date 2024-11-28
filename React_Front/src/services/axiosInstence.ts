import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ticket')
        if (token) {
            config.headers.authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
) 
