import api from './axios';

export const leaderboardAPI = {
  getLeaderboard: (hackathonId) => api.get(`/leaderboard/${hackathonId}`),
};
