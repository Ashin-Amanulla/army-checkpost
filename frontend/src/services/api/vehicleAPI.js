import axios from '../axios.js';

const vehicleAPI = {
    createEntry: async (data) => {
        // Log the actual FormData contents
        console.log('API Request Data:');
        for (let pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`);
        }

        return axios.post('/api/vehicles', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getEntries: async (params) => {
        try {
            const response = await axios.get('/api/vehicles', { params });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getEntry: async (id) => {
        try {
            const response = await axios.get(`/api/vehicles/${id}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getVehicleHistory: async (vehicleNumber) => {
        try {
            const response = await axios.get(`/api/vehicles/history/${vehicleNumber}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    // ... other methods
};

export default vehicleAPI; 