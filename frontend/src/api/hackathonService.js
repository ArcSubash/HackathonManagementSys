import api from './axios';

export const hackathonAPI = {
  getAll: () => api.get('/hackathons'),
  getById: (id) => api.get(`/hackathons/${id}`),
  getByStatus: (status) => api.get(`/hackathons/status/${status}`),
  create: (data) => api.post('/hackathons', data),
  update: (id, data) => api.put(`/hackathons/${id}`, data),
  delete: (id) => api.delete(`/hackathons/${id}`),
};
