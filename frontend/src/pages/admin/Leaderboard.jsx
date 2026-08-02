import { useState, useEffect } from 'react';
import { hackathonAPI } from '../../api/hackathonService';
import { leaderboardAPI } from '../../api/leaderboardService';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await hackathonAPI.getAll();
        setHackathons(res.data.data || []);
        if (res.data.data?.length > 0) {
          setSelectedHackathon(res.data.data[0].id);
        }
      } catch (err) {
        toast.error('Failed to load hackathons');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  useEffect(() => {
    if (!selectedHackathon) return;
    const fetchLeaderboard = async () => {
      try {
        const res = await leaderboardAPI.getLeaderboard(selectedHackathon);
        setLeaderboard(res.data.data || []);
      } catch (err) {
        setLeaderboard([]);
        toast.error(err.response?.data?.message || 'Failed to load leaderboard');
      }
    };
    fetchLeaderboard();
  }, [selectedHackathon]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-white">Leaderboard</h1>
          <p className="text-neutral-500 text-sm mt-1">View project rankings across hackathons</p>
        </div>
        <div className="w-56">
          <select className="input-field" value={selectedHackathon} onChange={e=>setSelectedHackathon(e.target.value)}>
            {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Team</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {leaderboard.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-neutral-500 text-sm">No results available yet.</td></tr>
              ) : (
                leaderboard.map((entry) => (
                  <tr key={entry.projectId} className="hover:bg-neutral-900/50">
                    <td className="px-5 py-3 font-semibold text-white">#{entry.rank}</td>
                    <td className="px-5 py-3 font-medium text-blue-400">{entry.projectTitle}</td>
                    <td className="px-5 py-3 text-neutral-400">{entry.teamName}</td>
                    <td className="px-5 py-3 font-semibold text-amber-400">{entry.averageScore.toFixed(2)}</td>
                    <td className="px-5 py-3 text-neutral-400">{entry.totalReviews}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Leaderboard;
