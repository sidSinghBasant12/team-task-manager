'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreHorizontal, ArrowUpDown, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/lib/axios';

export default function TasksPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'ADMIN') {
      fetchProjectsAndMembers();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsAndMembers = async () => {
    try {
      const [projRes, memRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users')
      ]);
      setProjects(projRes.data);
      setMembers(memRes.data);
    } catch (err: any) {
      console.error('Failed to fetch data', err);
      setError(err.response?.data?.error || 'Failed to load projects/members');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/tasks', { title, description, priority, status, assignedTo, projectId, dueDate });
      setTasks([response.data, ...tasks]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setStatus('TODO');
    setProjectId('');
    setAssignedTo('');
    setDueDate('');
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t: any) => t.id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status: newStatus });
      setTasks(tasks.map((t: any) => t.id === id ? { ...t, status: response.data.status } : t));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredTasks = tasks.filter((t: any) => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Tasks
          </h1>
          <p className="text-gray-400 mt-1">
            {user?.role === 'ADMIN' ? 'Manage and assign tasks to members.' : 'Tasks assigned to you.'}
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm flex items-center gap-2"
          >
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden flex flex-col mb-20">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 bg-white/[0.02] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-gray-500">Loading tasks...</td></tr>
              ) : filteredTasks.map((task: any, i: number) => (
                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{task.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{task.id.split('-')[0]}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs uppercase font-bold">{task.project?.projectName || 'No Project'}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md bg-white/5 border border-white/10 focus:outline-none ${
                        task.status === 'COMPLETED' ? 'text-emerald-400' :
                        task.status === 'IN_PROGRESS' ? 'text-blue-400' :
                        'text-gray-400'
                      }`}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="TESTING">TESTING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                      task.priority === 'HIGH' || task.priority === 'URGENT' ? 'text-red-400' :
                      task.priority === 'MEDIUM' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                         {task.assignee?.name[0] || 'U'}
                       </div>
                       <span className="text-gray-300">{task.assignee?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user?.role === 'ADMIN' && (
                      <button onClick={() => deleteTask(task.id)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Task</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold">Task Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">Project</label>
                    <select required value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-all appearance-none">
                      <option value="">Select Project</option>
                      {projects.map((p: any) => <option key={p.id} value={p.id} className="bg-[#1A1A1A]">{p.projectName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">Assign To</label>
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-all appearance-none">
                      <option value="">Select Member</option>
                      {members.map((m: any) => <option key={m.id} value={m.id} className="bg-[#1A1A1A]">{m.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-all appearance-none">
                      <option value="LOW" className="bg-[#1A1A1A]">Low</option>
                      <option value="MEDIUM" className="bg-[#1A1A1A]">Medium</option>
                      <option value="HIGH" className="bg-[#1A1A1A]">High</option>
                      <option value="URGENT" className="bg-[#1A1A1A]">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">Due Date</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold">Description</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-all resize-none" />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">Create Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
