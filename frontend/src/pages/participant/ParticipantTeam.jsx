import { useState, useEffect } from 'react';
import { teamAPI } from '../../api/teamService';
import { hackathonAPI } from '../../api/hackathonService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUserAdd, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

const ParticipantTeam = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHackathons, setActiveHackathons] = useState([]);
  const [formData, setFormData] = useState({ teamName: '', hackathonId: '' });
  const [inviteEmails, setInviteEmails] = useState({});
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'invitations'

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

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-dark-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Teams</h1>
          <p className="text-dark-400 mt-1">Manage your hackathon teams and invitations</p>
        </div>
        <div className="flex space-x-2 bg-dark-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'teams' ? 'bg-primary-500 text-white' : 'text-dark-300 hover:text-white hover:bg-dark-700'}`}
          >
            My Teams
          </button>
          <button 
            onClick={() => setActiveTab('invitations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'invitations' ? 'bg-primary-500 text-white' : 'text-dark-300 hover:text-white hover:bg-dark-700'}`}
          >
            <span>Invitations</span>
            {invitations.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{invitations.length}</span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'teams' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreate} className="card space-y-4">
              <h3 className="text-xl font-semibold text-white">Create a Team</h3>
              <select
                value={formData.hackathonId}
                onChange={(e) => setFormData({ ...formData, hackathonId: e.target.value })}
                required
                className="input-field"
              >
                <option value="">Select Hackathon</option>
                {activeHackathons.map(h => (
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

          <div className="lg:col-span-2 space-y-4">
            {teams.length === 0 ? (
              <div className="card text-center text-dark-400 py-10">You are not in any teams yet.</div>
            ) : (
              teams.map(team => (
                <div key={team.id} className="card flex flex-col justify-between items-start space-y-4">
                  <div className="flex justify-between w-full">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{team.teamName}</h3>
                      <p className="text-primary-400 text-sm mb-2">{team.hackathonTitle}</p>
                      <p className="text-dark-300 text-sm">Leader: {team.leaderName}</p>
                      <div className="mt-3 text-sm text-dark-400">
                        <p className="font-semibold text-dark-200">
                          Members ({team.memberNames?.length || 0}/{activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4}):
                        </p>
                        <ul className="list-disc pl-5 mt-1">
                          {team.memberNames?.map((name, i) => (
                            <li key={i}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                       {team.leaderId === user.id ? (
                          <button onClick={() => handleDelete(team.id)} className="btn-danger text-sm px-3 py-1.5">Disband</button>
                       ) : (
                          <button onClick={() => handleLeave(team.id)} className="btn-secondary text-sm px-3 py-1.5">Leave</button>
                       )}
                    </div>
                  </div>
                  
                  {/* Invite section (only for leader) */}
                  {team.leaderId === user.id && (
                    <div className="w-full pt-4 border-t border-dark-700">
                      <p className="text-sm text-dark-300 mb-2">Invite new member (by Email)</p>
                      <div className="flex space-x-2">
                        <input
                          type="email"
                          value={inviteEmails[team.id] || ''}
                          onChange={(e) => setInviteEmails({ ...inviteEmails, [team.id]: e.target.value })}
                          placeholder="participant@example.com"
                          className="input-field py-1.5 text-sm"
                          disabled={(team.memberNames?.length || 0) >= (activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4)}
                        />
                        <button 
                          onClick={() => handleInvite(team.id)} 
                          disabled={!inviteEmails[team.id] || (team.memberNames?.length || 0) >= (activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4)}
                          className="btn-primary py-1.5 px-3 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiOutlineUserAdd className="w-4 h-4" />
                          <span>{(team.memberNames?.length || 0) >= (activeHackathons.find(h => h.id === team.hackathonId)?.maxTeamSize || 4) ? 'Team Full' : 'Invite'}</span>
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
          <h2 className="text-xl font-semibold text-white mb-4">Pending Invitations</h2>
          {invitations.length === 0 ? (
            <div className="text-center text-dark-400 py-10 border border-dashed border-dark-600 rounded-lg">
              You have no pending team invitations.
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map(inv => (
                <div key={inv.id} className="p-4 bg-dark-800 rounded-lg border border-dark-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{inv.teamName}</h4>
                    <p className="text-sm text-dark-300 mt-1">Invited to join for a hackathon</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAcceptInvite(inv.id)}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors flex items-center space-x-1"
                      title="Accept"
                    >
                      <HiOutlineCheck className="w-5 h-5" />
                      <span className="text-sm font-medium pr-1">Accept</span>
                    </button>
                    <button 
                      onClick={() => handleRejectInvite(inv.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center space-x-1"
                      title="Reject"
                    >
                      <HiOutlineX className="w-5 h-5" />
                      <span className="text-sm font-medium pr-1">Reject</span>
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
