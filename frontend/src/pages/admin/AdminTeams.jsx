import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { HiOutlineUserGroup, HiOutlineLightningBolt } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await adminAPI.getTeams();
      setTeams(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Teams</h1>
          <p className="text-dark-400 mt-1">Manage all teams across the platform</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineUserGroup className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-300">No Teams Found</h3>
            <p className="text-dark-500 mt-2">No teams have been created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-dark-400 border-b border-dark-700">
                  <th className="pb-3 font-medium">Team Name</th>
                  <th className="pb-3 font-medium">Leader</th>
                  <th className="pb-3 font-medium">Members</th>
                  <th className="pb-3 font-medium">Hackathon ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
                          <span className="text-emerald-400 font-bold">
                            {team.teamName?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{team.teamName}</p>
                          <p className="text-dark-400 text-xs">ID: {team.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-dark-300">{team.leaderName || 'Unknown'}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex -space-x-2">
                        {team.memberNames?.map((memberName, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-900 flex items-center justify-center text-xs font-medium text-white" title={memberName}>
                            {memberName.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2 text-dark-400">
                        <HiOutlineLightningBolt className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-mono">{team.hackathonId}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeams;
