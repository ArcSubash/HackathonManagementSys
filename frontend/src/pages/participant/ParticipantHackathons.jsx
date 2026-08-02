import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hackathonAPI } from '../../api/hackathonService';
import toast from 'react-hot-toast';
import { getDynamicStatus, getStatusColor } from '../../utils/statusUtils';

const ParticipantHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
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
    fetchHackathons();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'ALL', label: 'All' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'ONGOING', label: 'Ongoing' },
    { id: 'ENDED', label: 'Ended' },
  ];

  const filteredHackathons = hackathons.filter((h) => {
    if (activeTab === 'ALL') return true;
    return getDynamicStatus(h) === activeTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Browse Hackathons</h1>
        <p className="text-neutral-500 text-sm mt-1">Find and join active hackathons</p>
      </div>

      <div className="flex space-x-1 bg-neutral-900 p-1 rounded-lg w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHackathons.map(h => (
          <div key={h.id} className="card flex flex-col h-full">
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="text-sm font-medium text-white">{h.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(getDynamicStatus(h))}`}>
                {getDynamicStatus(h)}
              </span>
            </div>
            <p className="text-neutral-500 text-sm mb-4 line-clamp-3 flex-grow">{h.description}</p>
            <div className="mt-auto">
               <p className="text-xs text-neutral-600 mb-0.5">Theme: {h.theme}</p>
               <p className="text-xs text-neutral-600 mb-3">Max Team Size: {h.maxTeamSize}</p>
               <Link to={`/participant/hackathons/${h.id}`} className="btn-primary w-full text-center block">
                 View Details
               </Link>
            </div>
          </div>
        ))}
        {filteredHackathons.length === 0 && (
          <div className="col-span-full text-center text-neutral-500 py-10 card border-dashed text-sm">
             No hackathons found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
export default ParticipantHackathons;
