import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/adminService';
import { Zap, Users, ClipboardList, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalHackathons: 0,
    totalParticipants: 0,
    totalProjects: 0,
    totalJudges: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.data);
      } catch (err) {
        toast.error('Failed to load stats');
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Hackathons', value: stats.totalHackathons, icon: Zap },
    { label: 'Total Participants', value: stats.totalParticipants, icon: Users },
    { label: 'Total Projects', value: stats.totalProjects, icon: ClipboardList },
    { label: 'Total Judges', value: stats.totalJudges, icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome back, {user?.name}</h1>
        <p className="text-neutral-500 text-sm mt-1">Here's what's happening with your hackathons</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg border border-neutral-700 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-neutral-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
