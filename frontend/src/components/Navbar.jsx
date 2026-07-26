import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../router/ProtectedRoute';
import { Terminal, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            to={isAuthenticated ? getDashboardPath(user?.role) : '/login'}
            className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors"
          >
            <Terminal className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-tight">HackManager</span>
          </Link>

          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-200">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-md hover:bg-neutral-900 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
