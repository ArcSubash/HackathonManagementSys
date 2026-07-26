import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/adminService';
import { HiOutlineLightningBolt, HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineStar } from 'react-icons/hi';
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
    { label: 'Total Hackathons', value: stats.totalHackathons, icon: HiOutlineLightningBolt, color: 'from-primary-500 to-primary-700' },
    { label: 'Total Participants', value: stats.totalParticipants, icon: HiOutlineUserGroup, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Total Projects', value: stats.totalProjects, icon: HiOutlineClipboardList, color: 'from-amber-500 to-amber-700' },
    { label: 'Total Judges', value: stats.totalJudges, icon: HiOutlineStar, color: 'from-purple-500 to-purple-700' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span>
        </h1>
        <p className="text-dark-400 mt-1">Here's what's happening with your hackathons</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="card-hover group cursor-default"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
