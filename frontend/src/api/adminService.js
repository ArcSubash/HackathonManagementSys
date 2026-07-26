import api from './axios';

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getJudges: () => api.get('/admin/judges'),
  getParticipants: () => api.get('/admin/participants'),
  getTeams: () => api.get('/admin/teams'),
  getProjects: () => api.get('/admin/projects'),
  createJudge: (data) => api.post('/admin/judges', data),
  assignJudge: (data) => api.post('/admin/judges/assign', data),
  unassignJudge: (data) => api.post('/admin/judges/unassign', data),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  changePassword: (userId, data) => api.put(`/admin/users/${userId}/password`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};
