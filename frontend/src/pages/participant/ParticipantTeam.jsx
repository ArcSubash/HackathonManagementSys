import { useState, useEffect } from 'react';
import { teamAPI } from '../../api/teamService';
import { hackathonAPI } from '../../api/hackathonService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Check, X } from 'lucide-react';

const ParticipantTeam = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHackathons, setActiveHackathons] = useState([]);
  const [formData, setFormData] = useState({ teamName: '', hackathonId: '' });
  const [inviteEmails, setInviteEmails] = useState({});
  const [activeTab, setActiveTab] = useState('teams');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, hackRes, invRes] = await Promise.all([
        teamAPI.getMyTeams(),
        hackathonAPI.getAll(),
        teamAPI.getMyInvitations()
      ]);
      setTeams(teamsRes.data.data || []);
      setActiveHackathons(hackRes.data.data || []);
      setInvitations(invRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.create(formData);
      toast.success('Team created!');
      setFormData({ teamName: '', hackathonId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleLeave = async (teamId) => {
    if (!window.confirm('Leave this team?')) return;
    try {
      await teamAPI.leave(teamId);
      toast.success('Left team');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave');
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await teamAPI.removeMember(teamId, memberId);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };
  
  const handleDelete = async (teamId) => {
    if (!window.confirm('Disband this team?')) return;
    try {
      await teamAPI.delete(teamId);
      toast.success('Team disbanded');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disband');
    }
  };

  const handleInvite = async (teamId) => {
    const email = inviteEmails[teamId];
    if (!email) return;
    try {
      await teamAPI.inviteParticipant(teamId, email);
      toast.success('Invitation sent!');
      setInviteEmails({ ...inviteEmails, [teamId]: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    }
  };

  const handleAcceptInvite = async (invitationId) => {
    try {
      await teamAPI.acceptInvitation(invitationId);
      toast.success('Joined team!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept invitation');
    }
  };

  const handleRejectInvite = async (invitationId) => {
    try {
      await teamAPI.rejectInvitation(invitationId);
      toast.success('Invitation rejected');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject invitation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Teams</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your hackathon teams and invitations</p>
        </div>
        <div className="flex gap-1 bg-neutral-900 border border-neutral-800 p-0.5 rounded-md">
          <button 
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'teams' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
          >
            My Teams
          </button>
          <button 
            onClick={() => setActiveTab('invitations')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'invitations' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
          >
            <span>Invitations</span>
            {invitations.length > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{invitations.length}</span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'teams' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreate} className="card space-y-3">
              <h3 className="text-sm font-semibold text-white">Create a Team</h3>
              <select
                value={formData.hackathonId}
                onChange={(e) => setFormData({ ...formData, hackathonId: e.target.value })}
                required
                className="input-field"
              >
                <option value="">Select Hackathon</option>
                {activeHackathons.filter(h => new Date(h.registrationDeadline) > new Date()).map(h => (
                  <option key={h.id} value={h.id}>{h.title}</option>
                ))}
              </select>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Team Name"
                required
                className="input-field"
              />
              <button type="submit" className="btn-primary w-full">Create Team</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {teams.length === 0 ? (
              <div className="card text-center text-neutral-500 py-10 text-sm">You are not in any teams yet.</div>
            ) : (
              teams.map(team => (
                <div key={team.id} className="card space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">{team.teamName}</h3>
                      <p className="text-blue-400 text-xs mt-0.5">{team.hackathonTitle}</p>
                      <p className="text-neutral-500 text-xs mt-1">Leader: {team.leaderName}</p>
                      <div className="mt-2 text-xs text-neutral-500">
                        <p className="font-medium text-neutral-400">
                          Members ({team.memberNames?.length || 0}/{activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4}):
                        </p>
                        <ul className="mt-1.5 space-y-1">
                          {team.memberNames?.map((name, i) => (
                            <li key={i} className="flex justify-between items-center bg-neutral-900/50 p-1.5 rounded border border-neutral-800 text-xs">
                              <span className="text-neutral-300">
                                {name} {team.memberIds[i] === team.leaderId && <span className="text-blue-400 ml-1">(Leader)</span>}
                              </span>
                              {team.leaderId === user.id && team.memberIds[i] !== user.id && (
                                <button
                                  onClick={() => handleRemoveMember(team.id, team.memberIds[i])}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-1.5 py-0.5 rounded transition-colors flex items-center"
                                  title="Remove member"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                       {team.leaderId === user.id ? (
                          <button onClick={() => handleDelete(team.id)} className="btn-danger text-xs px-2.5 py-1">Disband</button>
                       ) : (
                          <button onClick={() => handleLeave(team.id)} className="btn-secondary text-xs px-2.5 py-1">Leave</button>
                       )}
                    </div>
                  </div>
                  
                  {team.leaderId === user.id && (
                    <div className="pt-3 border-t border-neutral-800">
                      <p className="text-xs text-neutral-500 mb-2">Invite member by email</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={inviteEmails[team.id] || ''}
                          onChange={(e) => setInviteEmails({ ...inviteEmails, [team.id]: e.target.value })}
                          placeholder="participant@example.com"
                          className="input-field py-1.5 text-xs"
                          disabled={(team.memberNames?.length || 0) >= (activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4)}
                        />
                        <button 
                          onClick={() => handleInvite(team.id)} 
                          disabled={!inviteEmails[team.id] || (team.memberNames?.length || 0) >= (activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4)}
                          className="btn-primary py-1.5 px-3 flex items-center gap-1 text-xs whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{(team.memberNames?.length || 0) >= (activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4) ? 'Full' : 'Invite'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="card max-w-3xl">
          <h2 className="text-sm font-semibold text-white mb-4">Pending Invitations</h2>
          {invitations.length === 0 ? (
            <div className="text-center text-neutral-500 py-10 border border-dashed border-neutral-800 rounded-md text-sm">
              You have no pending team invitations.
            </div>
          ) : (
            <div className="space-y-2">
              {invitations.map(inv => (
                <div key={inv.id} className="p-3 bg-neutral-900 rounded-md border border-neutral-800 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-white">{inv.teamName}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Invited to join for a hackathon</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => handleAcceptInvite(inv.id)}
                      className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-md transition-colors flex items-center gap-1"
                      title="Accept"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Accept</span>
                    </button>
                    <button 
                      onClick={() => handleRejectInvite(inv.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-1"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-xs font-medium">Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantTeam;
