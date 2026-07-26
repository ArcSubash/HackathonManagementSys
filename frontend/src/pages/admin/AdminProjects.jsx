import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { ClipboardList, ExternalLink, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await adminAPI.getProjects();
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <p className="text-neutral-500 text-sm mt-1">Review all submitted projects</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-white"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-300">No projects found</h3>
            <p className="text-neutral-500 text-sm mt-1">No teams have submitted projects yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-neutral-500 border-b border-neutral-800">
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Team ID</th>
                  <th className="pb-3 font-medium text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                          <Code className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div>
                          <p className="text-neutral-200 font-medium">{project.title}</p>
                          <p className="text-neutral-600 text-xs">ID: {project.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-neutral-400 text-sm max-w-xs truncate" title={project.description}>
                        {project.description}
                      </p>
                    </td>
                    <td className="py-3">
                      <span className="text-neutral-500 font-mono text-xs">{project.teamId}</span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-colors" title="GitHub Repository">
                            <Code className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-neutral-500 hover:text-blue-400 hover:bg-neutral-800 rounded-md transition-colors" title="Live Demo">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
