import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { hackathonAPI } from '../../api/hackathonService';
import { HiOutlinePencilAlt, HiOutlineKey, HiOutlineTrash, HiOutlineX, HiOutlineClipboardList } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminJudges = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Modals state
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
      
      // Update local state to reflect changes instantly without re-fetching all judges
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
     return <div className="text-center py-20 text-white">Loading judges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Judges</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Judge'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-4 max-w-md">
          <h3 className="text-xl text-white font-semibold">New Judge</h3>
          <input name="name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="Name" required className="input-field" />
          <input name="email" type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="Email" required className="input-field" />
          <input name="password" type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} placeholder="Password" required minLength={6} className="input-field" />
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      )}

      <div className="card">
        {judges.length === 0 ? (
          <p className="text-dark-400 text-center py-8">No judges found.</p>
        ) : (
          <div className="space-y-4">
            {judges.map(judge => (
              <div key={judge.id} className="flex justify-between items-center border-b border-dark-700 pb-4">
                <div>
                  <p className="text-white font-semibold">{judge.name}</p>
                  <p className="text-dark-400 text-sm">{judge.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-dark-300">
                    Assigned: {judge.assignedHackathons?.length || 0} Hackathons
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => openAssignModal(judge)} className="p-2 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg text-primary-500 transition-colors" title="Assign Hackathons">
                      <HiOutlineClipboardList className="w-5 h-5" />
                    </button>
                    <button onClick={() => openEditModal(judge)} className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-dark-300 transition-colors" title="Edit Judge">
                      <HiOutlinePencilAlt className="w-5 h-5" />
                    </button>
                    <button onClick={() => openPwdModal(judge)} className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg text-amber-500 transition-colors" title="Change Password">
                      <HiOutlineKey className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteUser(judge.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Delete Judge">
                      <HiOutlineTrash className="w-5 h-5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-dark-700">
              <h3 className="text-xl font-bold text-white">Edit Judge</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-dark-400 hover:text-white transition-colors">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
                <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Role</label>
                <select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} required className="input-field">
                  <option value="PARTICIPANT">Participant</option>
                  <option value="JUDGE">Judge</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setEditModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {pwdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-dark-700">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <button onClick={() => setPwdModalOpen(false)} className="text-dark-400 hover:text-white transition-colors">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handlePwdSubmit} className="p-6 space-y-4">
              <p className="text-sm text-dark-300 mb-4">You are changing the password for <strong className="text-white">{selectedUser?.name}</strong>.</p>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">New Password</label>
                <input type="password" value={pwdData.newPassword} onChange={(e) => setPwdData({ newPassword: e.target.value })} required minLength={6} className="input-field" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setPwdModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Hackathon Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-6 border-b border-dark-700 shrink-0">
              <h3 className="text-xl font-bold text-white">Assign Hackathons</h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-dark-400 hover:text-white transition-colors">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-dark-300 mb-6">
                Assign <strong className="text-white">{selectedUser?.name}</strong> to evaluate projects in the following hackathons:
              </p>
              
              {allHackathons.length === 0 ? (
                <p className="text-center text-dark-400 py-4">No hackathons available.</p>
              ) : (
                <div className="space-y-3">
                  {allHackathons.map(hackathon => {
                    const isAssigned = selectedUser?.assignedHackathons?.includes(hackathon.id);
                    return (
                      <div key={hackathon.id} className="flex items-center justify-between p-4 rounded-lg bg-dark-800 border border-dark-700">
                        <div>
                          <p className="text-white font-medium">{hackathon.title}</p>
                          <p className="text-xs text-dark-400 mt-1">{hackathon.status}</p>
                        </div>
                        <button
                          onClick={() => handleToggleAssign(hackathon.id, isAssigned)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isAssigned 
                              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                              : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20'
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
            
            <div className="p-6 border-t border-dark-700 shrink-0 flex justify-end">
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
