import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hackathonAPI } from '../../api/hackathonService';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

const EditHackathon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', theme: '',
    startDate: '', endDate: '', registrationDeadline: '', status: '', maxTeamSize: 4,
  });

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await hackathonAPI.getById(id);
        const h = res.data.data;
        setFormData({
          title: h.title || '',
          description: h.description || '',
          theme: h.theme || '',
          startDate: h.startDate ? h.startDate.slice(0, 16) : '',
          endDate: h.endDate ? h.endDate.slice(0, 16) : '',
          registrationDeadline: h.registrationDeadline ? h.registrationDeadline.slice(0, 16) : '',
          status: h.status || 'UPCOMING',
          maxTeamSize: h.maxTeamSize || 4,
        });
      } catch (err) {
        toast.error('Failed to load hackathon');
        navigate('/admin/hackathons');
      } finally {
        setFetching(false);
      }
    };
    fetchHackathon();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? formData.startDate + ':00' : null,
        endDate: formData.endDate ? formData.endDate + ':00' : null,
        registrationDeadline: formData.registrationDeadline ? formData.registrationDeadline + ':00' : null,
      };
      await hackathonAPI.update(id, payload);
      toast.success('Hackathon updated!');
      navigate('/admin/hackathons');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-400 hover:text-white">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Hackathon</h1>
          <p className="text-dark-400 mt-1">Update hackathon details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Title *</label>
          <input name="title" value={formData.title} onChange={handleChange} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Theme</label>
          <input name="theme" value={formData.theme} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input-field">
            <option value="UPCOMING">Upcoming</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Start Date *</label>
            <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">End Date *</label>
            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Registration Deadline *</label>
            <input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Max Team Size *</label>
            <input type="number" name="maxTeamSize" min="1" max="100" value={formData.maxTeamSize} onChange={handleChange} required className="input-field" />
          </div>
        </div>
        <div className="flex space-x-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Update Hackathon</span>}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditHackathon;
