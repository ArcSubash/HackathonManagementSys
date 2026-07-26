import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../../api/projectService';
import { evaluationAPI } from '../../api/evaluationService';
import { hackathonAPI } from '../../api/hackathonService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getDynamicStatus } from '../../utils/statusUtils';

const JudgeProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [evaluatedProjectIds, setEvaluatedProjectIds] = useState(new Set());
  const [endedHackathonIds, setEndedHackathonIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        if (user?.assignedHackathons?.length > 0) {
          const projectPromises = user.assignedHackathons.map(hid => projectAPI.getByHackathon(hid));
          const hackathonPromises = user.assignedHackathons.map(hid => hackathonAPI.getById(hid));

          const [res, evalsRes, hackRes] = await Promise.all([
            Promise.allSettled(projectPromises),
            evaluationAPI.getByJudge().catch(() => ({ data: { data: [] } })),
            Promise.allSettled(hackathonPromises)
          ]);
          
          const allProjects = [];
          res.forEach(r => {
            if (r.status === 'fulfilled' && r.value.data?.data) {
              allProjects.push(...r.value.data.data);
            }
          });
          setProjects(allProjects);
          
          const endedIds = new Set();
          hackRes.forEach(r => {
            if (r.status === 'fulfilled' && r.value.data?.data) {
               const hack = r.value.data.data;
               if (getDynamicStatus(hack) === 'ENDED') {
                  endedIds.add(hack.id);
               }
            }
          });
          setEndedHackathonIds(endedIds);
          
          const evals = evalsRes.data?.data || [];
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
        <h1 className="text-2xl font-semibold text-white">Assigned Projects</h1>
        <p className="text-neutral-500 text-sm mt-1">Evaluate projects submitted for your assigned hackathons</p>
      </div>
      
      {projects.length === 0 ? (
        <div className="card text-center py-10 text-neutral-500 text-sm">No projects to evaluate right now.</div>
      ) : (
        <div className="space-y-2">
          {projects.map(p => (
            <div key={p.id} className="card flex justify-between items-center">
               <div>
                 <h3 className="text-sm font-medium text-white">{p.title}</h3>
                 <p className="text-xs text-blue-400 mt-0.5">{p.hackathonTitle}</p>
                 <p className="text-xs text-neutral-500 mt-0.5">Team: {p.teamName}</p>
               </div>
               {evaluatedProjectIds.has(p.id) ? (
                 <span className="btn-secondary opacity-50 cursor-not-allowed text-xs">Evaluated</span>
               ) : endedHackathonIds.has(p.hackathonId) ? (
                 <span className="btn-danger opacity-50 cursor-not-allowed text-xs px-2.5 py-1 rounded-md">Hackathon Ended</span>
               ) : (
                 <Link to={`/judge/evaluate/${p.id}`} className="btn-primary text-xs">Evaluate</Link>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default JudgeProjects;
