import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hackathonAPI } from '../../api/hackathonService';
import toast from 'react-hot-toast';

const ParticipantHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        // Fetch all hackathons for participants to see
        const res = await hackathonAPI.getAll();
        setHackathons(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load hackathons');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  if (loading) return <div className="text-center text-white py-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Browse Hackathons</h1>
      <p className="text-dark-400">Find and join active hackathons</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map(h => (
          <div key={h.id} className="card flex flex-col h-full">
            <h3 className="text-xl font-semibold text-white mb-2">{h.title}</h3>
            <p className="text-dark-300 text-sm mb-4 line-clamp-3 flex-grow">{h.description}</p>
            <div className="mt-auto">
               <p className="text-xs text-dark-400 mb-1">Theme: {h.theme}</p>
               <p className="text-xs text-dark-400 mb-4">Max Team Size: {h.maxTeamSize}</p>
               <Link to={`/participant/hackathons/${h.id}`} className="btn-primary w-full text-center block">
                 View Details
               </Link>
            </div>
          </div>
        ))}
        {hackathons.length === 0 && (
          <div className="col-span-full text-center text-dark-400 py-10 card border-dashed border-dark-600">
             No hackathons available right now.
          </div>
        )}
      </div>
    </div>
  );
};
export default ParticipantHackathons;
