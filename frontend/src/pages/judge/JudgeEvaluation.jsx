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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
      </div>
    );
  }
  if (!project) return <div className="text-white text-center py-20">Project not found</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-white">Evaluate Project</h1>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-1">{project.title}</h2>
        <p className="text-xs text-blue-400 mb-3">{project.hackathonTitle} | Team: {project.teamName}</p>
        
        {teamMembers.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-neutral-400 mb-1.5">Participants:</h4>
            <div className="flex flex-wrap gap-1.5">
              {teamMembers.map((member, index) => (
                <span key={index} className="bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded text-xs">
                  {member}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-neutral-400 text-sm mb-3">{project.description}</p>
        <div className="flex gap-3 text-xs">
          {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">GitHub</a>}
          {project.demoVideo && <a href={project.demoVideo} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Demo Video</a>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <h3 className="text-sm font-semibold text-white">Scoring (1–10)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Innovation ({formData.innovation})</label>
            <input type="range" min="1" max="10" value={formData.innovation} onChange={e=>setFormData({...formData, innovation: e.target.value})} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Technical Execution ({formData.technical})</label>
            <input type="range" min="1" max="10" value={formData.technical} onChange={e=>setFormData({...formData, technical: e.target.value})} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Presentation ({formData.presentation})</label>
            <input type="range" min="1" max="10" value={formData.presentation} onChange={e=>setFormData({...formData, presentation: e.target.value})} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Problem Solving ({formData.problemSolving})</label>
            <input type="range" min="1" max="10" value={formData.problemSolving} onChange={e=>setFormData({...formData, problemSolving: e.target.value})} className="w-full accent-blue-600" />
          </div>
        </div>
        <div>
           <label className="block text-sm text-neutral-400 mb-2">Comments</label>
           <textarea rows="4" className="input-field" value={formData.comments} onChange={e=>setFormData({...formData, comments: e.target.value})} placeholder="Provide constructive feedback..."></textarea>
        </div>
        <div className="flex gap-3">
           <button type="submit" disabled={submitting} className="btn-primary w-full">Submit Evaluation</button>
           <button type="button" onClick={()=>navigate('/judge/projects')} className="btn-secondary w-full">Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default JudgeEvaluation;
