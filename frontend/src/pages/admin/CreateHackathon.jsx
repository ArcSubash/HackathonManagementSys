import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hackathonAPI } from '../../api/hackathonService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateHackathon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', theme: '',
    startDate: '', endDate: '', registrationDeadline: '', maxTeamSize: 4
  });

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
      await hackathonAPI.create(payload);
      toast.success('Hackathon created successfully!');
      navigate('/admin/hackathons');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create hackathon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors text-neutral-500 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white">Create Hackathon</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Set up a new hackathon event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">Title *</label>
          <input name="title" value={formData.title} onChange={handleChange} required className="input-field" placeholder="e.g. AI Innovation Challenge 2026" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="input-field" placeholder="Describe your hackathon..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">Theme</label>
          <input name="theme" value={formData.theme} onChange={handleChange} className="input-field" placeholder="e.g. Artificial Intelligence" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Start Date *</label>
            <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">End Date *</label>
            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Registration Deadline *</label>
            <input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Max Team Size *</label>
            <input type="number" name="maxTeamSize" min="1" max="100" value={formData.maxTeamSize} onChange={handleChange} required className="input-field" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin"></div> : <span>Create Hackathon</span>}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateHackathon;
