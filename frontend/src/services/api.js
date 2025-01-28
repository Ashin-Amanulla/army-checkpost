import axios from 'axios';
import useStore from '../store/useStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
    const token = useStore.getState().user?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // If token is expired, logout user
            useStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    getAllUsers: () => api.get('/auth/users'),
    updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
    deleteUser: (id) => api.delete(`/auth/users/${id}`)
};

export const vehicleAPI = {
    createEntry: (data) => api.post('/vehicles', data),
    updateExit: (id) => api.put(`/vehicles/${id}/exit`),
    getEntries: (params) => api.get('/vehicles', { params }),
    getVehicleHistory: (vehicleNumber) => api.get(`/vehicles/history/${vehicleNumber}`),
    getEntry: (id) => api.get(`/vehicles/${id}`)
};

export const checkpostAPI = {
    create: (data) => api.post('/checkposts', data),
    getAll: () => api.get('/checkposts'),
    update: (id, data) => api.put(`/checkposts/${id}`, data),
    delete: (id) => api.delete(`/checkposts/${id}`)
};

export const vehicleTypeAPI = {
    create: (data) => api.post('/vehicletypes', data),
    getAll: () => api.get('/vehicletypes'),
    update: (id, data) => api.put(`/vehicletypes/${id}`, data),
    delete: (id) => api.delete(`/vehicletypes/${id}`)
};

export default api; 