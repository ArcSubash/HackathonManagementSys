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
        toast.error('Failed to load leaderboard');
      }
    };
    fetchLeaderboard();
  }, [selectedHackathon]);

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
           <p className="text-dark-400">View project rankings across hackathons</p>
        </div>
        <div className="w-64">
           <select className="input-field" value={selectedHackathon} onChange={e=>setSelectedHackathon(e.target.value)}>
              {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
           </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-dark-300">
             <thead className="bg-dark-900 text-xs uppercase text-dark-400">
               <tr>
                 <th className="px-6 py-4">Rank</th>
                 <th className="px-6 py-4">Project</th>
                 <th className="px-6 py-4">Team</th>
                 <th className="px-6 py-4">Score</th>
                 <th className="px-6 py-4">Reviews</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-dark-700">
               {leaderboard.length === 0 ? (
                 <tr><td colSpan="5" className="text-center py-8">No results available yet.</td></tr>
               ) : (
                 leaderboard.map((entry) => (
                   <tr key={entry.projectId} className="hover:bg-dark-800/50">
                     <td className="px-6 py-4 font-bold text-white">#{entry.rank}</td>
                     <td className="px-6 py-4 font-semibold text-primary-400">{entry.projectTitle}</td>
                     <td className="px-6 py-4">{entry.teamName}</td>
                     <td className="px-6 py-4 font-bold text-amber-400">{entry.averageScore.toFixed(2)}</td>
                     <td className="px-6 py-4">{entry.totalReviews}</td>
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
