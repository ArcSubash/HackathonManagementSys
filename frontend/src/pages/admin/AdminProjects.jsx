import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/adminService';
import { HiOutlineClipboardList, HiOutlineExternalLink, HiOutlineCode } from 'react-icons/hi';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-dark-400 mt-1">Review all submitted projects</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineClipboardList className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-300">No Projects Found</h3>
            <p className="text-dark-500 mt-2">No teams have submitted projects yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-dark-400 border-b border-dark-700">
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Team ID</th>
                  <th className="pb-3 font-medium text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
                          <HiOutlineCode className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{project.title}</p>
                          <p className="text-dark-400 text-xs">ID: {project.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-dark-300 text-sm max-w-xs truncate" title={project.description}>
                        {project.description}
                      </p>
                    </td>
                    <td className="py-4">
                      <span className="text-dark-400 text-sm font-mono">{project.teamId}</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-dark-300 transition-colors"
                            title="GitHub Repository"
                          >
                            <HiOutlineCode className="w-5 h-5" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg text-primary-400 transition-colors"
                            title="Live Demo"
                          >
                            <HiOutlineExternalLink className="w-5 h-5" />
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
