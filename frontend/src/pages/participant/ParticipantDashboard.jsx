import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLightningBolt, HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineChartBar } from 'react-icons/hi';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Browse Hackathons', icon: HiOutlineLightningBolt, color: 'from-primary-500 to-primary-700', description: 'Find and register for hackathons', path: '/participant/hackathons' },
    { label: 'My Team', icon: HiOutlineUserGroup, color: 'from-emerald-500 to-emerald-700', description: 'View or create your team', path: '/participant/team' },
    { label: 'My Project', icon: HiOutlineClipboardList, color: 'from-amber-500 to-amber-700', description: 'Submit or edit your project', path: '/participant/project' },
    { label: 'Results', icon: HiOutlineChartBar, color: 'from-purple-500 to-purple-700', description: 'Check leaderboard and results', path: '/participant/results' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Hello, <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span> 👋
        </h1>
        <p className="text-dark-400 mt-1">Ready to hack? Here's your dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="card-hover group cursor-pointer"
            onClick={() => navigate(action.path)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{action.label}</h3>
                <p className="text-dark-400 text-sm mt-1">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="card border-dashed border-dark-600">
        <div className="text-center py-12">
          <HiOutlineLightningBolt className="w-12 h-12 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-300">Participant Dashboard</h3>
          <p className="text-dark-500 mt-2">Your hackathon activity and details will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
