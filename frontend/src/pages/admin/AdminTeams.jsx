import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { Users, Zap } from 'lucide-react';
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
      <div>
        <h1 className="text-2xl font-semibold text-white">Teams</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage all teams across the platform</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-300">No teams found</h3>
            <p className="text-neutral-500 text-sm mt-1">No teams have been created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-neutral-500 border-b border-neutral-800">
                  <th className="pb-3 font-medium">Team Name</th>
                  <th className="pb-3 font-medium">Leader</th>
                  <th className="pb-3 font-medium">Members</th>
                  <th className="pb-3 font-medium">Hackathon ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 text-xs font-medium">
                          {team.teamName?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-neutral-200 font-medium">{team.teamName}</p>
                          <p className="text-neutral-600 text-xs">ID: {team.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-400">{team.leaderName || 'Unknown'}</td>
                    <td className="py-3">
                      <div className="flex -space-x-1.5">
                        {team.memberNames?.map((memberName, i) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-neutral-925 flex items-center justify-center text-xs font-medium text-neutral-400" title={memberName}>
                            {memberName.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs">{team.hackathonId}</span>
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
