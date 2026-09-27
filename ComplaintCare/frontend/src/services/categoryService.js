import api from './api';

export const categoryService = {
  getCategories: () => api.get('/categories').then((r) => r.data),
  createCategory: (payload) => api.post('/categories', payload).then((r) => r.data),
  updateCategory: (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
