import axios from '../axios';

export const reportsAPI = {
  exportReport: async (params) => {
    const response = await axios.get('/reports/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  getReportPreview: async (params) => {
    const response = await axios.get('/reports/preview', { params });
    return response.data;
  }
}; 