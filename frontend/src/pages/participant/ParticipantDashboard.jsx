import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, ClipboardList, BarChart3 } from 'lucide-react';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Browse Hackathons', icon: Zap, description: 'Find and register for hackathons', path: '/participant/hackathons' },
    { label: 'My Team', icon: Users, description: 'View or create your team', path: '/participant/team' },
    { label: 'My Project', icon: ClipboardList, description: 'Submit or edit your project', path: '/participant/project' },
    { label: 'Results', icon: BarChart3, description: 'Check leaderboard and results', path: '/participant/results' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Hello, {user?.name}</h1>
        <p className="text-neutral-500 text-sm mt-1">Ready to hack? Here's your dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="card hover:border-neutral-700 transition-colors cursor-pointer"
            onClick={() => navigate(action.path)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg border border-neutral-700 flex items-center justify-center flex-shrink-0">
                <action.icon className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{action.label}</h3>
                <p className="text-neutral-500 text-sm mt-0.5">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-dashed">
        <div className="text-center py-10">
          <Zap className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-neutral-300">Participant Dashboard</h3>
          <p className="text-neutral-500 text-sm mt-1">Your hackathon activity and details will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
