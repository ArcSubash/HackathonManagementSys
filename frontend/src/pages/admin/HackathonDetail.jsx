import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hackathonAPI } from '../../api/hackathonService';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';

const HackathonDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await hackathonAPI.getById(id);
        setHackathon(res.data.data);
      } catch (err) {
        toast.error('Failed to load hackathon details');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathon();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!hackathon) {
    return <div className="text-white text-center py-20">Hackathon not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{hackathon.title}</h1>
            <span className="bg-primary-500/20 text-primary-400 border border-primary-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              {hackathon.status}
            </span>
          </div>
          {user?.role === 'ADMIN' && (
            <Link to={`/admin/hackathons/${id}/edit`} className="btn-secondary">
              Edit
            </Link>
          )}
        </div>
        
        <p className="text-dark-300 text-lg mb-8 whitespace-pre-wrap">{hackathon.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3 text-dark-300">
            <HiOutlineCalendar className="w-6 h-6 text-primary-400" />
            <div>
              <p className="text-sm text-dark-400">Start Date</p>
              <p className="font-medium">{new Date(hackathon.startDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-dark-300">
            <HiOutlineCalendar className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-sm text-dark-400">End Date</p>
              <p className="font-medium">{new Date(hackathon.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-dark-300">
            <HiOutlineClock className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-sm text-dark-400">Registration Deadline</p>
              <p className="font-medium">{new Date(hackathon.registrationDeadline).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-dark-300">
            <HiOutlineUserGroup className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-dark-400">Max Team Size</p>
              <p className="font-medium">{hackathon.maxTeamSize}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetail;
