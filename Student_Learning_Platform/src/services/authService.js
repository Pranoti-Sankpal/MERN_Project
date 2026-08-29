import api from './api';

export const loginAdmin = (email, password) => api.post('/auth/login', { email, password });
