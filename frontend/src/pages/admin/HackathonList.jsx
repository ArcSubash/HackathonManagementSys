import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hackathonAPI } from '../../api/hackathonService';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineLightningBolt } from 'react-icons/hi';
import toast from 'react-hot-toast';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await hackathonAPI.getAll();
      setHackathons(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hackathon?')) return;
    try {
      await hackathonAPI.delete(id);
      toast.success('Hackathon deleted');
      fetchHackathons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'COMPLETED': return 'bg-dark-500/20 text-dark-400 border-dark-500/30';
      default: return 'bg-dark-500/20 text-dark-400 border-dark-500/30';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Hackathons</h1>
          <p className="text-dark-400 mt-1">Manage all hackathon events</p>
        </div>
        <Link to="/admin/hackathons/create" className="btn-primary flex items-center space-x-2">
          <HiOutlinePlus className="w-5 h-5" />
          <span>Create Hackathon</span>
        </Link>
      </div>

      {hackathons.length === 0 ? (
        <div className="card border-dashed border-dark-600">
          <div className="text-center py-12">
            <HiOutlineLightningBolt className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-300">No hackathons yet</h3>
            <p className="text-dark-500 mt-2">Create your first hackathon to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {hackathons.map((h) => (
            <div key={h.id} className="card-hover">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">{h.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusColor(h.status)}`}>
                      {h.status}
                    </span>
                  </div>
                  <p className="text-dark-400 text-sm mt-1 line-clamp-1">{h.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-dark-500">
                    {h.theme && <span>Theme: {h.theme}</span>}
                    <span>Start: {formatDate(h.startDate)}</span>
                    <span>End: {formatDate(h.endDate)}</span>
                    <span>Deadline: {formatDate(h.registrationDeadline)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/admin/hackathons/${h.id}`}
                    className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <HiOutlineEye className="w-5 h-5" />
                  </Link>
                  <Link
                    to={`/admin/hackathons/${h.id}/edit`}
                    className="p-2 text-dark-400 hover:text-amber-400 hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <HiOutlinePencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonList;
