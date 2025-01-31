import axios from '../config/axios';

export const generateReport = async (params) => {
  try {
    const response = await axios.get('/api/reports/generate', { params });
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