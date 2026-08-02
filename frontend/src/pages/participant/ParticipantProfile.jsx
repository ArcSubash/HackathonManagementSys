import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Key, Edit2, Save, X } from 'lucide-react';
import { authAPI } from '../../api/authService';
import toast from 'react-hot-toast';

const ParticipantProfile = () => {
  const { user, login } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ name: user?.name || '', password: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = { name: formData.name };
      if (formData.password) {
        dataToSubmit.password = formData.password;
      }
      const res = await authAPI.updateProfile(dataToSubmit);
      // login also updates user context and localStorage
      login(res.data.data, res.data.data.token);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-white">My Profile</h1>
        <p className="text-neutral-500 text-sm mt-1">View and manage your account details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card md:col-span-1 flex flex-col items-center text-center p-8">
          <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-neutral-300 text-4xl font-semibold mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
          <span className="mt-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium uppercase tracking-wider">
            {user?.role}
          </span>
        </div>

        {/* Details Card */}
        <div className="card md:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-lg font-medium text-white">Personal Information</h3>
            {!isEditing && (
              <button onClick={handleEdit} className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5 text-sm font-medium transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="input-field w-full" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">New Password (leave blank to keep current)</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="input-field w-full" 
                    minLength={6}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-1.5">
                  <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} disabled={loading} className="btn-secondary flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-300 text-sm">
                {user?.name}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-300 text-sm truncate">
                {user?.email}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Account ID
              </label>
              <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-500 text-sm font-mono truncate">
                {user?.id}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Role Level
              </label>
              <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-300 text-sm">
                Standard Participant
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantProfile;
