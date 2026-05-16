'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, MoreVertical, Edit2, Trash2, Mail, Shield } from 'lucide-react';
import api from '@/lib/axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/users');
      setMembers(response.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await api.delete(`/users/${id}`);
      setMembers(members.filter((m: any) => m.id !== id));
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  const filteredMembers = members.filter((m: any) => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 h-full bg-[#0A0A0A] text-white overflow-y-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Team Members
          </h1>
          <p className="text-gray-400 mt-1">Manage your team roles and permissions.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm flex items-center gap-2">
          <Plus size={18} /> Invite Member
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Member</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Joined Date</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center text-gray-500">Loading members...</td></tr>
            ) : filteredMembers.map((member: any) => (
              <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    member.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    member.role === 'PROJECT_MANAGER' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {member.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteMember(member.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
