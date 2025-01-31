import axios from '../config/axios';

export const getStats = async () => {
  try {
    const response = await axios.get('/api/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 