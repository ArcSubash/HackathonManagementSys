import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../../api/projectService';
import { evaluationAPI } from '../../api/evaluationService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const JudgeProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [evaluatedProjectIds, setEvaluatedProjectIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        // Find projects for hackathons this judge is assigned to
        if (user?.assignedHackathons?.length > 0) {
          const promises = user.assignedHackathons.map(hid => projectAPI.getByHackathon(hid));
          // Also fetch evaluations to know which projects are already evaluated
          const [res, evalsRes] = await Promise.all([
            Promise.allSettled(promises),
            evaluationAPI.getByJudge()
          ]);
          
          const allProjects = [];
          res.forEach(r => {
            if (r.status === 'fulfilled' && r.value.data.data) {
              allProjects.push(...r.value.data.data);
            }
          });
          setProjects(allProjects);
          
          const evals = evalsRes.data.data || [];
          setEvaluatedProjectIds(new Set(evals.map(e => e.projectId)));
        } else {
           setProjects([]);
        }
      } catch (err) {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedProjects();
  }, [user]);

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Assigned Projects</h1>
      <p className="text-dark-400">Evaluate projects submitted for your assigned hackathons</p>
      
      {projects.length === 0 ? (
        <div className="card text-center py-10 text-dark-400">No projects to evaluate right now.</div>
      ) : (
        <div className="grid gap-4">
          {projects.map(p => (
            <div key={p.id} className="card flex justify-between items-center">
               <div>
                  <h3 className="text-lg font-bold text-white">{p.title}</h3>
                  <p className="text-sm text-primary-400 mb-1">{p.hackathonTitle}</p>
                  <p className="text-xs text-dark-400">Team: {p.teamName}</p>
               </div>
               {evaluatedProjectIds.has(p.id) ? (
                 <span className="btn-secondary opacity-50 cursor-not-allowed">Evaluated</span>
               ) : (
                 <Link to={`/judge/evaluate/${p.id}`} className="btn-primary">Evaluate</Link>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default JudgeProjects;
