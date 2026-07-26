import { Settings } from 'lucide-react';

const AdminPlaceholder = ({ title }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage all {title.toLowerCase()} in the system.</p>
      </div>

      <div className="card text-center py-16">
        <Settings className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          The {title} dashboard is currently under construction.
        </p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
