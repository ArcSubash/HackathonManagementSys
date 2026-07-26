import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hackathonAPI } from '../../api/hackathonService';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDynamicStatus, getStatusColor } from '../../utils/statusUtils';

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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
      </div>
    );
  }

  if (!hackathon) {
    return <div className="text-white text-center py-20">Hackathon not found</div>;
  }
  
  const currentStatus = getDynamicStatus(hackathon);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">{hackathon.title}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(currentStatus)}`}>
              {currentStatus}
            </span>
          </div>
          {user?.role === 'ADMIN' && (
            <Link to={`/admin/hackathons/${id}/edit`} className="btn-secondary text-sm">
              Edit
            </Link>
          )}
        </div>
        
        <p className="text-neutral-400 text-sm mb-6 whitespace-pre-wrap">{hackathon.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 text-neutral-400">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">Start Date</p>
              <p className="text-sm font-medium text-neutral-300">
                {new Date(hackathon.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">End Date</p>
              <p className="text-sm font-medium text-neutral-300">
                {new Date(hackathon.endDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <Clock className="w-4 h-4 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">Registration Deadline</p>
              <p className="text-sm font-medium text-neutral-300">
                {new Date(hackathon.registrationDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <Users className="w-4 h-4 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">Max Team Size</p>
              <p className="text-sm font-medium text-neutral-300">{hackathon.maxTeamSize}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetail;
