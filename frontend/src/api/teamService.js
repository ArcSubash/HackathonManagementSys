import api from './axios';

export const teamAPI = {
  create: (data) => api.post('/teams', data),
  join: (teamId) => api.post(`/teams/${teamId}/join`),
  leave: (teamId) => api.post(`/teams/${teamId}/leave`),
  getById: (id) => api.get(`/teams/${id}`),
  getByHackathon: (hackathonId) => api.get(`/teams/hackathon/${hackathonId}`),
  getMyTeams: () => api.get('/teams/my-teams'),
  getMyTeamForHackathon: (hackathonId) => api.get(`/teams/my-team/${hackathonId}`),
  delete: (id) => api.delete(`/teams/${id}`),
  removeMember: (teamId, memberId) => api.delete(`/teams/${teamId}/members/${memberId}`),
  inviteParticipant: (teamId, email) => api.post(`/teams/${teamId}/invite?email=${encodeURIComponent(email)}`),
  getMyInvitations: () => api.get('/teams/invitations'),
  acceptInvitation: (invitationId) => api.post(`/teams/invitations/${invitationId}/accept`),
  rejectInvitation: (invitationId) => api.post(`/teams/invitations/${invitationId}/reject`),
};
