import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineChartBar,
  HiOutlineUser,
} from 'react-icons/hi';

const Sidebar = () => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { icon: HiOutlineViewGrid, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: HiOutlineLightningBolt, label: 'Hackathons', path: '/admin/hackathons' },
          { icon: HiOutlineUserGroup, label: 'Participants', path: '/admin/participants' },
          { icon: HiOutlineUserGroup, label: 'Teams', path: '/admin/teams' },
          { icon: HiOutlineClipboardList, label: 'Projects', path: '/admin/projects' },
          { icon: HiOutlineStar, label: 'Judges', path: '/admin/judges' },
          { icon: HiOutlineChartBar, label: 'Leaderboard', path: '/admin/leaderboard' },
        ];
      case 'PARTICIPANT':
        return [
          { icon: HiOutlineViewGrid, label: 'Dashboard', path: '/participant/dashboard' },
          { icon: HiOutlineLightningBolt, label: 'Hackathons', path: '/participant/hackathons' },
          { icon: HiOutlineUserGroup, label: 'My Team', path: '/participant/team' },
          { icon: HiOutlineClipboardList, label: 'My Project', path: '/participant/project' },
          { icon: HiOutlineChartBar, label: 'Results', path: '/participant/results' },
          { icon: HiOutlineUser, label: 'Profile', path: '/participant/profile' },
        ];
      case 'JUDGE':
        return [
          { icon: HiOutlineViewGrid, label: 'Dashboard', path: '/judge/dashboard' },
          { icon: HiOutlineClipboardList, label: 'Assigned Projects', path: '/judge/projects' },
          { icon: HiOutlineStar, label: 'Evaluations', path: '/judge/evaluations' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-dark-900/50 border-r border-dark-700/50 min-h-[calc(100vh-4rem)] hidden lg:block">
      <div className="p-4 space-y-1">
        {/* Role Badge */}
        <div className="px-3 py-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-dark-400">
            {user?.role} Panel
          </span>
        </div>

        {/* Navigation Items */}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20'
                  : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/50'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
