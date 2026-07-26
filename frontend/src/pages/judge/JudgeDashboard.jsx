import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hackathonAPI } from '../../api/hackathonService';
import { Link } from 'react-router-dom';
import { HiOutlineClipboardList, HiOutlineStar, HiOutlineClipboardCheck, HiOutlineLightningBolt } from 'react-icons/hi';
import toast from 'react-hot-toast';

const JudgeDashboard = () => {
  const { user } = useAuth();
  const [assignedHackathons, setAssignedHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedHackathons = async () => {
      try {
        if (user?.assignedHackathons?.length > 0) {
          const promises = user.assignedHackathons.map(id => hackathonAPI.getById(id));
          const res = await Promise.allSettled(promises);
          const hackathons = [];
          res.forEach(r => {
            if (r.status === 'fulfilled' && r.value.data.data) {
              hackathons.push(r.value.data.data);
            }
          });
          setAssignedHackathons(hackathons);
        } else {
          setAssignedHackathons([]);
        }
      } catch (error) {
        toast.error('Failed to load assigned hackathons');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedHackathons();
  }, [user]);

  const stats = [
    { label: 'Assigned Hackathons', value: user?.assignedHackathons?.length || '0', icon: HiOutlineClipboardList, color: 'from-primary-500 to-primary-700' },
    { label: 'Pending Evaluations', value: '0', icon: HiOutlineStar, color: 'from-amber-500 to-amber-700' },
    { label: 'Completed Reviews', value: '0', icon: HiOutlineClipboardCheck, color: 'from-emerald-500 to-emerald-700' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome, Judge <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span>
        </h1>
        <p className="text-dark-400 mt-1">Review and evaluate projects assigned to you</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card-hover group cursor-default">
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

      {/* Assigned Hackathons Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">My Assigned Hackathons</h2>
        {loading ? (
          <div className="text-center py-10 text-dark-400">Loading hackathons...</div>
        ) : assignedHackathons.length === 0 ? (
          <div className="card border-dashed border-dark-600">
            <div className="text-center py-12">
              <HiOutlineStar className="w-12 h-12 text-dark-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-300">No Assignments Yet</h3>
              <p className="text-dark-500 mt-2">Hackathons assigned to you for evaluation will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedHackathons.map(h => (
              <div key={h.id} className="card flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">{h.title}</h3>
                  <span className="bg-primary-500/20 text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {h.status}
                  </span>
                </div>
                <p className="text-dark-300 text-sm mb-4 line-clamp-2 flex-grow">{h.description}</p>
                <div className="mt-auto">
                  <p className="text-xs text-dark-400 mb-4">Theme: {h.theme}</p>
                  <Link to="/judge/projects" className="btn-primary w-full text-center block">
                    View Projects
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeDashboard;
