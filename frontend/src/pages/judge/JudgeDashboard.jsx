import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hackathonAPI } from '../../api/hackathonService';
import { projectAPI } from '../../api/projectService';
import { evaluationAPI } from '../../api/evaluationService';
import { Link } from 'react-router-dom';
import { ClipboardList, Star, ClipboardCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDynamicStatus, getStatusColor } from '../../utils/statusUtils';

const JudgeDashboard = () => {
  const { user } = useAuth();
  const [assignedHackathons, setAssignedHackathons] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedHackathons = async () => {
      try {
        if (user?.assignedHackathons?.length > 0) {
          const promises = user.assignedHackathons.map(id => hackathonAPI.getById(id));
          const res = await Promise.allSettled(promises);
          const hackathons = [];
          res.forEach(r => {
            if (r.status === 'fulfilled' && r.value.data?.data) {
              hackathons.push(r.value.data.data);
            } else if (r.status === 'rejected') {
              console.error("Failed to fetch assigned hackathon:", r.reason);
            }
          });
          setAssignedHackathons(hackathons);

          // Fetch projects and evaluations for the stats
          const projectPromises = user.assignedHackathons.map(hid => projectAPI.getByHackathon(hid));
          const [projRes, evalsRes] = await Promise.all([
            Promise.allSettled(projectPromises),
            evaluationAPI.getByJudge().catch(() => ({ data: { data: [] } }))
          ]);
          
          let totalProjects = 0;
          projRes.forEach(r => {
            if (r.status === 'fulfilled' && r.value.data?.data) {
              totalProjects += r.value.data.data.length;
            }
          });
          
          const completed = evalsRes.data?.data?.length || 0;
          setCompletedCount(completed);
          setPendingCount(Math.max(0, totalProjects - completed));

        } else {
          setAssignedHackathons([]);
          setPendingCount(0);
          setCompletedCount(0);
        }
      } catch (error) {
        console.error("Error in fetchAssignedHackathons:", error);
        toast.error('Failed to load assigned hackathons');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedHackathons();
  }, [user]);

  const stats = [
    { label: 'Assigned Hackathons', value: assignedHackathons.length.toString(), icon: ClipboardList },
    { label: 'Pending Evaluations', value: pendingCount.toString(), icon: Star },
    { label: 'Completed Reviews', value: completedCount.toString(), icon: ClipboardCheck },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome, {user?.name}</h1>
        <p className="text-neutral-500 text-sm mt-1">Review and evaluate projects assigned to you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
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

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">My Assigned Hackathons</h2>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
          </div>
        ) : assignedHackathons.length === 0 ? (
          <div className="card border-dashed">
            <div className="text-center py-10">
              <Star className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-neutral-300">No assignments yet</h3>
              <p className="text-neutral-500 text-sm mt-1">Hackathons assigned to you will appear here.</p>
              {user?.assignedHackathons?.length > 0 && (
                <p className="text-red-400 text-xs mt-2">Note: Some assigned hackathons could not be found (they may have been deleted).</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedHackathons.map(h => (
              <div key={h.id} className="card flex flex-col h-full">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-sm font-medium text-white">{h.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(getDynamicStatus(h))}`}>
                    {getDynamicStatus(h)}
                  </span>
                </div>
                <p className="text-neutral-500 text-sm mb-3 line-clamp-2 flex-grow">{h.description}</p>
                <div className="mt-auto">
                  <p className="text-xs text-neutral-600 mb-3">Theme: {h.theme}</p>
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
