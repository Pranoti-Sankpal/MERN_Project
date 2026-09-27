import api from './api';

export const userService = {
  getUsers: (params) => api.get('/users', { params }).then((r) => r.data),
  getUserById: (id) => api.get(`/users/${id}`).then((r) => r.data),
  createEmployee: (payload) => api.post('/users/employees', payload).then((r) => r.data),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload).then((r) => r.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};
