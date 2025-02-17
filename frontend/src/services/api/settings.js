import axios from './config/axios';

export const settingsAPI = {
    getSettings: async () => {
        try {
            const response = await axios.get('/api/settings');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateSettings: async (data) => {
        try {
            const response = await axios.put('/api/settings', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    verifyVehicle: async (vehicleNumber) => {
        try {
            const response = await axios.get(`/api/settings/verify-vehicle/${vehicleNumber}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 