import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../../api/projectService';
import { evaluationAPI } from '../../api/evaluationService';
import { teamAPI } from '../../api/teamService';
import toast from 'react-hot-toast';

const JudgeEvaluation = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    innovation: 5, technical: 5, presentation: 5, problemSolving: 5, comments: ''
  });

  useEffect(() => {
    const fetchProjectAndTeam = async () => {
      try {
        const res = await projectAPI.getById(projectId);
        const projData = res.data.data;

        // Check if already evaluated
        try {
          const evalRes = await evaluationAPI.getByJudge();
          const evals = evalRes.data.data || [];
          if (evals.some(e => e.projectId === projectId)) {
            toast.error("You have already evaluated this project.");
            navigate('/judge/projects');
            return;
          }
        } catch (evalErr) {
          console.error("Failed to check existing evaluations", evalErr);
        }

        setProject(projData);

        // Fetch team to get participant names
        try {
          const teamRes = await teamAPI.getById(projData.teamId);
          setTeamMembers(teamRes.data.data.memberNames || []);
        } catch (teamErr) {
          console.error("Failed to load team members", teamErr);
        }
      } catch (err) {
        toast.error('Failed to load project');
        navigate('/judge/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndTeam();
  }, [projectId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await evaluationAPI.submitScore({
        projectId,
        hackathonId: project.hackathonId,
        innovation: parseInt(formData.innovation),
        technical: parseInt(formData.technical),
        presentation: parseInt(formData.presentation),
        problemSolving: parseInt(formData.problemSolving),
        comments: formData.comments
      });
      toast.success('Evaluation submitted');
      navigate('/judge/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;
  if (!project) return <div className="text-white text-center py-20">Project not found</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Evaluate Project</h1>
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
        <p className="text-sm text-primary-400 mb-4">{project.hackathonTitle} | Team: {project.teamName}</p>
        
        {teamMembers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-dark-200 mb-1">Participants:</h4>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member, index) => (
                <span key={index} className="bg-dark-800 text-dark-300 border border-dark-700 px-2 py-1 rounded text-xs">
                  {member}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-dark-300 mb-4">{project.description}</p>
        <div className="flex space-x-4">
          {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">GitHub</a>}
          {project.demoVideo && <a href={project.demoVideo} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Demo Video</a>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <h3 className="text-xl font-bold text-white">Scoring (1-10)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-dark-300 mb-2">Innovation ({formData.innovation})</label>
            <input type="range" min="1" max="10" value={formData.innovation} onChange={e=>setFormData({...formData, innovation: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-2">Technical Execution ({formData.technical})</label>
            <input type="range" min="1" max="10" value={formData.technical} onChange={e=>setFormData({...formData, technical: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-2">Presentation ({formData.presentation})</label>
            <input type="range" min="1" max="10" value={formData.presentation} onChange={e=>setFormData({...formData, presentation: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-2">Problem Solving ({formData.problemSolving})</label>
            <input type="range" min="1" max="10" value={formData.problemSolving} onChange={e=>setFormData({...formData, problemSolving: e.target.value})} className="w-full" />
          </div>
        </div>
        <div>
           <label className="block text-sm text-dark-300 mb-2">Judge Comments</label>
           <textarea rows="4" className="input-field" value={formData.comments} onChange={e=>setFormData({...formData, comments: e.target.value})} placeholder="Provide constructive feedback..."></textarea>
        </div>
        <div className="flex space-x-4">
           <button type="submit" disabled={submitting} className="btn-primary w-full">Submit Evaluation</button>
           <button type="button" onClick={()=>navigate('/judge/projects')} className="btn-secondary w-full">Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default JudgeEvaluation;
