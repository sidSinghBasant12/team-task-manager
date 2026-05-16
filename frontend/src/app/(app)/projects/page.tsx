'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Clock, MoreVertical, Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/lib/axios';

export default function ProjectsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/projects', { projectName, description, deadline });
      setProjects([...projects, response.data]);
      setIsModalOpen(false);
      setProjectName('');
      setDescription('');
      setDeadline('');
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure? This will delete all tasks in this project.')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p: any) => p.id !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Projects
          </h1>
          <p className="text-gray-400 mt-1">
            {user?.role === 'ADMIN' ? 'Manage and track all active projects.' : 'Projects assigned to you.'}
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm flex items-center gap-2"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {loading ? (
           <div className="col-span-full py-20 text-center text-gray-500 italic">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 italic">No projects found.</div>
        ) : projects.map((project: any, i: number) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Folder size={24} />
              </div>
              {user?.role === 'ADMIN' && (
                <div className="flex gap-2">
                  <button onClick={() => deleteProject(project.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-1 text-white">{project.projectName}</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
            
            <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-full mb-6 ${
              project.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              project.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {project.status}
            </span>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 uppercase font-bold tracking-wider">Progress</span>
                <span className="text-white font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-gray-400 text-xs">
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>{project.assignedUsers?.length || 0} assigned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Description</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Deadline</label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
