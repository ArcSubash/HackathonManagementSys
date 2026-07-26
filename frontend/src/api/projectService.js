import api from './axios';

export const projectAPI = {
  submit: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  getById: (id) => api.get(`/projects/${id}`),
  getByHackathon: (hackathonId) => api.get(`/projects/hackathon/${hackathonId}`),
  getByTeam: (teamId) => api.get(`/projects/team/${teamId}`),
  delete: (id) => api.delete(`/projects/${id}`),
};
