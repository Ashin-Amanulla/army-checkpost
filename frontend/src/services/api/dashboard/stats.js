import axios from '../config/axios';

export const getStats = async (timeRange) => {
  try {
    const response = await axios.get('/api/dashboard/stats', {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 