import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { Users, Mail, Pencil, KeyRound, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({ name: '', email: '', role: 'PARTICIPANT' });
  const [pwdData, setPwdData] = useState({ newPassword: '' });

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await adminAPI.getParticipants();
      setParticipants(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditModalOpen(true);
  };

  const openPwdModal = (user) => {
    setSelectedUser(user);
    setPwdData({ newPassword: '' });
    setPwdModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateUser(selectedUser.id, formData);
      toast.success('User updated successfully');
      setEditModalOpen(false);
      fetchParticipants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
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
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchParticipants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Participants</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage all registered participants</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-300">No participants found</h3>
            <p className="text-neutral-500 text-sm mt-1">No one has registered as a participant yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-neutral-500 border-b border-neutral-800">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {participants.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 text-xs font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-neutral-200 font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-500 font-mono text-xs">{user.id}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEditModal(user)} className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-colors" title="Edit User">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => openPwdModal(user)} className="p-1.5 text-neutral-500 hover:text-amber-400 hover:bg-neutral-800 rounded-md transition-colors" title="Change Password">
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-800">
              <h3 className="text-base font-semibold text-white">Edit User</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required className="input-field">
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
    </div>
  );
};

export default AdminParticipants;
