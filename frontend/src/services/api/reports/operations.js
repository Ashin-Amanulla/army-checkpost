import axios from '../config/axios';

export const generateReport = async (params) => {
  try {
      const response = await axios.get('/api/reports/export', {
          params,
          responseType: 'blob'  // Ensure response is treated as a file
      });
      return response.data;
  } catch (error) {
      console.error('Error generating report:', error);
      throw error;
  }
};

export const downloadReport = async (id) => {
  try {
    const response = await axios.get(`/api/reports/download/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
}; 

export const getTodayStats = async () => {
  try {
    const response = await axios.get('/api/dashboard/today');
    return response.data;
  } catch (error) {
    console.error('Error fetching today stats:', error);
    throw error;
  }
};