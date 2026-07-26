import { HiOutlineCog } from 'react-icons/hi';

const AdminPlaceholder = ({ title }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-dark-400 mt-1">Manage all {title.toLowerCase()} in the system.</p>
      </div>

      <div className="card text-center py-16">
        <HiOutlineCog className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-white mb-2">Coming Soon!</h3>
        <p className="text-dark-300 max-w-md mx-auto">
          The {title} dashboard is currently under construction. Please check back later when we have fully integrated this feature!
        </p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
