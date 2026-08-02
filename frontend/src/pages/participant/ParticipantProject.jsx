import { useState, useEffect } from 'react';
import { projectAPI } from '../../api/projectService';
import { teamAPI } from '../../api/teamService';
import { hackathonAPI } from '../../api/hackathonService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getDynamicStatus } from '../../utils/statusUtils';
import { Pencil, Trash2, X } from 'lucide-react';

const ParticipantProject = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [endedHackathonIds, setEndedHackathonIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', githubLink: '', demoVideo: '', teamId: '', hackathonId: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, hackRes] = await Promise.all([
        teamAPI.getMyTeams(),
        hackathonAPI.getAll()
      ]);
      const myTeams = teamsRes.data.data || [];
      setTeams(myTeams);
      
      const allHackathons = hackRes.data.data || [];
      const endedIds = new Set(
        allHackathons.filter(h => getDynamicStatus(h) === 'ENDED').map(h => h.id)
      );
      setEndedHackathonIds(endedIds);

      const projectPromises = myTeams.map(t => projectAPI.getByTeam(t.id));
      const projectsRes = await Promise.allSettled(projectPromises);
      
      const foundProjects = projectsRes
        .filter(p => p.status === 'fulfilled' && p.value.data.data)
        .map(p => p.value.data.data);
        
      setProjects(foundProjects);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamChange = (e) => {
    const selectedTeamId = e.target.value;
    const team = teams.find(t => t.id === selectedTeamId);
    setFormData({
      ...formData,
      teamId: selectedTeamId,
      hackathonId: team ? team.hackathonId : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        await projectAPI.update(editingProjectId, formData);
        toast.success('Project updated!');
      } else {
        await projectAPI.submit(formData);
        toast.success('Project submitted!');
      }
      handleCancelEdit();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      githubLink: project.githubLink || '',
      demoVideo: project.demoVideo || '',
      teamId: project.teamId,
      hackathonId: project.hackathonId
    });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setFormData({ title: '', description: '', githubLink: '', demoVideo: '', teamId: '', hackathonId: '' });
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectAPI.delete(projectId);
      toast.success('Project deleted');
      if (editingProjectId === projectId) {
        handleCancelEdit();
      }
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
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
      <div>
        <h1 className="text-2xl font-semibold text-white">My Projects</h1>
        <p className="text-neutral-500 text-sm mt-1">Submit and manage your project submissions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-sm font-semibold text-white">
               {editingProjectId ? 'Edit Project' : 'Submit New Project'}
             </h3>
             {editingProjectId && (
                <button type="button" onClick={handleCancelEdit} className="text-neutral-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
             )}
          </div>
          <select value={formData.teamId} onChange={handleTeamChange} required className="input-field" disabled={editingProjectId !== null}>
            <option value="">Select Team (You must be leader)</option>
            {teams.filter(t => 
              t.leaderId === user.id && 
              (!endedHackathonIds.has(t.hackathonId) || editingProjectId !== null)
            ).map(t => {
              const hasProject = projects.some(p => p.teamId === t.id);
              const isDisabled = hasProject && editingProjectId === null;
              return (
                <option key={t.id} value={t.id} disabled={isDisabled}>
                  {t.teamName} - {t.hackathonTitle} {hasProject ? '(Already submitted)' : ''}
                </option>
              );
            })}
          </select>
          <input name="title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Project Title" required className="input-field" />
          <textarea name="description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Description" required rows="4" className="input-field" />
          <input name="githubLink" value={formData.githubLink} onChange={e=>setFormData({...formData, githubLink: e.target.value})} placeholder="GitHub Link" className="input-field" />
          <input name="demoVideo" value={formData.demoVideo} onChange={e=>setFormData({...formData, demoVideo: e.target.value})} placeholder="Demo Video URL" className="input-field" />
          <button type="submit" className="btn-primary w-full">
            {editingProjectId ? 'Save Changes' : 'Submit Project'}
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Submitted Projects</h3>
          {projects.length === 0 ? (
            <div className="card text-center text-neutral-500 py-10 text-sm">No projects submitted yet.</div>
          ) : (
            projects.map(p => (
              <div key={p.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-white">{p.title}</h4>
                    <p className="text-blue-400 text-xs mt-0.5">{p.hackathonTitle} — Team: {p.teamName}</p>
                  </div>
                  {(() => {
                     const team = teams.find(t => t.id === p.teamId);
                     const isLeader = team && team.leaderId === user.id;
                     const isEnded = endedHackathonIds.has(p.hackathonId);
                     
                     if (isLeader && !isEnded) {
                       return (
                         <div className="flex items-center gap-1">
                           <button onClick={() => handleEditClick(p)} className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-colors">
                             <Pencil className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(p.id)} className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       );
                     }
                     return null;
                  })()}
                </div>
                <p className="text-neutral-500 text-sm mt-2">{p.description}</p>
                <div className="flex gap-3 mt-3 text-xs">
                  {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">GitHub</a>}
                  {p.demoVideo && <a href={p.demoVideo} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Demo</a>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default ParticipantProject;
