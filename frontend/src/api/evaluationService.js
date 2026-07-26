import api from './axios';

export const evaluationAPI = {
  submitScore: (data) => api.post('/evaluations', data),
  getByProject: (projectId) => api.get(`/evaluations/project/${projectId}`),
  getByJudge: () => api.get('/evaluations/judge'),
  getByJudgeAndHackathon: (hackathonId) => api.get(`/evaluations/judge/hackathon/${hackathonId}`),
};
