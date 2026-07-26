import { useState, useEffect } from 'react';
import { projectAPI } from '../../api/projectService';
import { teamAPI } from '../../api/teamService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ParticipantProject = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', githubLink: '', demoVideo: '', teamId: '', hackathonId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamsRes = await teamAPI.getMyTeams();
      const myTeams = teamsRes.data.data || [];
      setTeams(myTeams);

      // Fetch projects for each team (simple approach)
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
      await projectAPI.submit(formData);
      toast.success('Project submitted!');
      setFormData({ title: '', description: '', githubLink: '', demoVideo: '', teamId: '', hackathonId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit project');
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">My Projects</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="text-xl font-semibold text-white">Submit New Project</h3>
          <select value={formData.teamId} onChange={handleTeamChange} required className="input-field">
            <option value="">Select Team (You must be leader)</option>
            {teams.filter(t => t.leaderId === user.id).map(t => (
              <option key={t.id} value={t.id}>{t.teamName} - {t.hackathonTitle}</option>
            ))}
          </select>
          <input name="title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Project Title" required className="input-field" />
          <textarea name="description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Description" required rows="4" className="input-field" />
          <input name="githubLink" value={formData.githubLink} onChange={e=>setFormData({...formData, githubLink: e.target.value})} placeholder="GitHub Link" className="input-field" />
          <input name="demoVideo" value={formData.demoVideo} onChange={e=>setFormData({...formData, demoVideo: e.target.value})} placeholder="Demo Video URL" className="input-field" />
          <button type="submit" className="btn-primary w-full">Submit Project</button>
        </form>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Submitted Projects</h3>
          {projects.length === 0 ? (
            <div className="card text-center text-dark-400 py-10">No projects submitted yet.</div>
          ) : (
            projects.map(p => (
              <div key={p.id} className="card">
                <h4 className="text-lg font-bold text-white">{p.title}</h4>
                <p className="text-primary-400 text-sm mb-2">{p.hackathonTitle} - Team: {p.teamName}</p>
                <p className="text-dark-300 text-sm mb-4">{p.description}</p>
                <div className="flex space-x-4 text-sm text-dark-200">
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
