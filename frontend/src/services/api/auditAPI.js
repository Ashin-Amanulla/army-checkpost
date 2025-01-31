import axios from '../axios.js';

const auditAPI = {
  getLogs: (params) => axios.get('/audit-logs', { params }),
  getLogById: (id) => axios.get(`/audit-logs/${id}`),
  exportLogs: (params) => axios.get('/audit-logs/export', { 
    params,
    responseType: 'blob'
  })
};

export { auditAPI }; 