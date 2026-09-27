import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then((r) => r.data),
  getCategoryBreakdown: () => api.get('/dashboard/categories').then((r) => r.data),
  getPriorityBreakdown: () => api.get('/dashboard/priorities').then((r) => r.data),
  getRecentComplaints: () => api.get('/dashboard/recent').then((r) => r.data),
};
