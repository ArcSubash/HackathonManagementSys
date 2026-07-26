import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { HiOutlineUserGroup, HiOutlineMail, HiOutlinePencilAlt, HiOutlineKey, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Participants</h1>
          <p className="text-dark-400 mt-1">Manage all registered participants</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineUserGroup className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-300">No Participants Found</h3>
            <p className="text-dark-500 mt-2">No one has registered as a participant yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-dark-400 border-b border-dark-700">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {participants.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-primary-500/20">
                          <span className="text-primary-400 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2 text-dark-300">
                        <HiOutlineMail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 text-dark-400 text-sm">{user.id}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openEditModal(user)} className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-dark-300 transition-colors" title="Edit User">
                          <HiOutlinePencilAlt className="w-5 h-5" />
                        </button>
                        <button onClick={() => openPwdModal(user)} className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg text-amber-500 transition-colors" title="Change Password">
                          <HiOutlineKey className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Delete User">
                          <HiOutlineTrash className="w-5 h-5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-dark-700">
              <h3 className="text-xl font-bold text-white">Edit User</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-dark-400 hover:text-white transition-colors">
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required className="input-field">
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

    </div>
  );
};

export default AdminParticipants;
