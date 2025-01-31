import axios from '../config/axios';

export const getLogs = async (params) => {
  try {
    const response = await axios.get('/api/audit-logs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

export const getLog = async (id) => {
  try {
    const response = await axios.get(`/api/audit-logs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log:', error);
    throw error;
  }
};

export const exportLogs = async (params) => {
  try {
    const response = await axios.get('/api/audit-logs/export', {
      params,
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    throw error;
  }
}; 