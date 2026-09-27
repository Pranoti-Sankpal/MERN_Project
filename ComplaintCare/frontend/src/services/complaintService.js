import api from './api';

export const complaintService = {
  createComplaint: (payload) => api.post('/complaints', payload).then((r) => r.data),
  getComplaints: (params) => api.get('/complaints', { params }).then((r) => r.data),
  getComplaintById: (id) => api.get(`/complaints/${id}`).then((r) => r.data),
  updateComplaint: (id, payload) => api.put(`/complaints/${id}`, payload).then((r) => r.data),
  deleteComplaint: (id) => api.delete(`/complaints/${id}`).then((r) => r.data),
  assignComplaint: (id, payload) => api.put(`/complaints/${id}/assign`, payload).then((r) => r.data),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }).then((r) => r.data),
  resolveComplaint: (id, resolution_remarks) =>
    api.put(`/complaints/${id}/resolve`, { resolution_remarks }).then((r) => r.data),
  closeComplaint: (id) => api.put(`/complaints/${id}/close`).then((r) => r.data),
  addComment: (id, comment) => api.post(`/complaints/${id}/comments`, { comment }).then((r) => r.data),
  getComments: (id) => api.get(`/complaints/${id}/comments`).then((r) => r.data),
};
