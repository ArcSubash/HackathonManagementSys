import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { hackathonAPI } from '../../api/hackathonService';
import { Pencil, KeyRound, Trash2, X, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminJudges = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [allHackathons, setAllHackathons] = useState([]);

  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: 'JUDGE' });
  const [pwdData, setPwdData] = useState({ newPassword: '' });

  useEffect(() => {
    fetchJudges();
    fetchAllHackathons();
  }, []);

  const fetchAllHackathons = async () => {
    try {
      const res = await hackathonAPI.getAll();
      setAllHackathons(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch hackathons for assignment');
    }
  };

  const fetchJudges = async () => {
    try {
      const res = await adminAPI.getJudges();
      setJudges(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load judges');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createJudge(formData);
      toast.success('Judge created');
      setShowForm(false);
      setFormData({ name: '', email: '', password: '' });
      fetchJudges();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create judge');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
    setEditModalOpen(true);
  };

  const openPwdModal = (user) => {
    setSelectedUser(user);
    setPwdData({ newPassword: '' });
    setPwdModalOpen(true);
  };

  const openAssignModal = (user) => {
    setSelectedUser(user);
    setAssignModalOpen(true);
  };

  const handleToggleAssign = async (hackathonId, isAssigned) => {
    try {
      if (isAssigned) {
        await adminAPI.unassignJudge({ judgeId: selectedUser.id, hackathonId });
        toast.success('Judge unassigned from hackathon');
      } else {
        await adminAPI.assignJudge({ judgeId: selectedUser.id, hackathonId });
        toast.success('Judge assigned to hackathon');
      }
      
      const updatedHackathons = isAssigned 
        ? (selectedUser.assignedHackathons || []).filter(id => id !== hackathonId)
        : [...(selectedUser.assignedHackathons || []), hackathonId];
        
      const updatedUser = { ...selectedUser, assignedHackathons: updatedHackathons };
      setSelectedUser(updatedUser);
      setJudges(judges.map(j => j.id === updatedUser.id ? updatedUser : j));
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update assignment');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateUser(selectedUser.id, editFormData);
      toast.success('Judge updated successfully');
      setEditModalOpen(false);
      fetchJudges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update judge');
    }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.changePassword(selectedUser.id, pwdData);
      toast.success('Password changed successfully');
      setPwdModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this judge? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('Judge deleted successfully');
      fetchJudges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete judge');
    }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center py-20">
         <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Judges</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Judge'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-4 max-w-md">
          <h3 className="text-base font-semibold text-white">New Judge</h3>
          <input name="name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="Name" required className="input-field" />
          <input name="email" type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="Email" required className="input-field" />
          <input name="password" type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} placeholder="Password" required minLength={6} className="input-field" />
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      )}

      <div className="card">
        {judges.length === 0 ? (
          <p className="text-neutral-500 text-center py-8 text-sm">No judges found.</p>
        ) : (
          <div className="space-y-0 divide-y divide-neutral-800">
            {judges.map(judge => (
              <div key={judge.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm font-medium text-white">{judge.name}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{judge.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">
                    {judge.assignedHackathons?.length || 0} assigned
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openAssignModal(judge)} className="p-1.5 text-neutral-500 hover:text-blue-400 hover:bg-neutral-800 rounded-md transition-colors" title="Assign Hackathons">
                      <ClipboardList className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEditModal(judge)} className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-colors" title="Edit Judge">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => openPwdModal(judge)} className="p-1.5 text-neutral-500 hover:text-amber-400 hover:bg-neutral-800 rounded-md transition-colors" title="Change Password">
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteUser(judge.id)} className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors" title="Delete Judge">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-800">
              <h3 className="text-base font-semibold text-white">Edit Judge</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
                <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Role</label>
                <select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} required className="input-field">
                  <option value="PARTICIPANT">Participant</option>
                  <option value="JUDGE">Judge</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {pwdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-800">
              <h3 className="text-base font-semibold text-white">Change Password</h3>
              <button onClick={() => setPwdModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePwdSubmit} className="p-5 space-y-4">
              <p className="text-sm text-neutral-400">Changing password for <strong className="text-white">{selectedUser?.name}</strong>.</p>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">New Password</label>
                <input type="password" value={pwdData.newPassword} onChange={(e) => setPwdData({ newPassword: e.target.value })} required minLength={6} className="input-field" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setPwdModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Hackathon Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-800 shrink-0">
              <h3 className="text-base font-semibold text-white">Assign Hackathons</h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <p className="text-sm text-neutral-400 mb-4">
                Assign <strong className="text-white">{selectedUser?.name}</strong> to evaluate projects:
              </p>
              
              {allHackathons.length === 0 ? (
                <p className="text-center text-neutral-500 py-4 text-sm">No hackathons available.</p>
              ) : (
                <div className="space-y-2">
                  {allHackathons.map(hackathon => {
                    const isAssigned = selectedUser?.assignedHackathons?.includes(hackathon.id);
                    return (
                      <div key={hackathon.id} className="flex items-center justify-between p-3 rounded-md bg-neutral-800/50 border border-neutral-800">
                        <div>
                          <p className="text-sm font-medium text-white">{hackathon.title}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{hackathon.status}</p>
                        </div>
                        <button
                          onClick={() => handleToggleAssign(hackathon.id, isAssigned)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            isAssigned 
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                              : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                          }`}
                        >
                          {isAssigned ? 'Unassign' : 'Assign'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="px-5 py-4 border-t border-neutral-800 shrink-0 flex justify-end">
              <button onClick={() => setAssignModalOpen(false)} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminJudges;
