'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MoreVertical, Plus, UserPlus, Mail } from 'lucide-react';

const teams = [
  { id: 1, name: 'Engineering', members: 12, description: 'Core product development team' },
  { id: 2, name: 'Design', members: 4, description: 'UI/UX and brand design' },
  { id: 3, name: 'Marketing', members: 6, description: 'Growth and content creation' },
];

export default function TeamsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Teams
          </h1>
          <p className="text-gray-400 mt-1">Manage your team members and roles.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm flex items-center gap-2">
          <Plus size={18} /> Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, i) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <Users size={24} />
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-white">{team.name}</h3>
            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{team.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-[#1A1A1A] flex items-center justify-center text-xs font-medium text-white">
                    U{j}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#1A1A1A] flex items-center justify-center text-xs font-medium text-gray-300">
                  +{team.members - 3}
                </div>
              </div>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
                View &rarr;
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
