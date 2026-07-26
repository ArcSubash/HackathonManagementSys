import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Zap,
  Users,
  ClipboardList,
  Star,
  BarChart3,
  User,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Zap, label: 'Hackathons', path: '/admin/hackathons' },
          { icon: Users, label: 'Participants', path: '/admin/participants' },
          { icon: Users, label: 'Teams', path: '/admin/teams' },
          { icon: ClipboardList, label: 'Projects', path: '/admin/projects' },
          { icon: Star, label: 'Judges', path: '/admin/judges' },
          { icon: BarChart3, label: 'Leaderboard', path: '/admin/leaderboard' },
        ];
      case 'PARTICIPANT':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/participant/dashboard' },
          { icon: Zap, label: 'Hackathons', path: '/participant/hackathons' },
          { icon: Users, label: 'My Team', path: '/participant/team' },
          { icon: ClipboardList, label: 'My Project', path: '/participant/project' },
          { icon: BarChart3, label: 'Results', path: '/participant/results' },
          { icon: User, label: 'Profile', path: '/participant/profile' },
        ];
      case 'JUDGE':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/judge/dashboard' },
          { icon: ClipboardList, label: 'Assigned Projects', path: '/judge/projects' },
          { icon: Star, label: 'Evaluations', path: '/judge/evaluations' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-56 border-r border-neutral-800 min-h-[calc(100vh-3.5rem)] hidden lg:block bg-neutral-950">
      <div className="p-3 space-y-0.5">
        <div className="px-3 py-2 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            {user?.role}
          </span>
        </div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-100 ${
                isActive
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
