'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-8 h-full flex flex-col font-sans bg-[#0A0A0A] text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Calendar
          </h1>
          <p className="text-gray-400 mt-1">Manage your deadlines and team schedules.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <button className="p-2 hover:bg-white/10 transition-colors border-r border-white/10">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-medium">October 2026</span>
            <button className="p-2 hover:bg-white/10 transition-colors border-l border-white/10">
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm flex items-center gap-2">
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-7 border-b border-white/10">
          {days.map(day => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 h-full overflow-y-auto">
          {monthDays.map(day => (
            <motion.div 
              key={day}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              className="p-4 border-r border-b border-white/5 min-h-[120px] relative group"
            >
              <span className={`text-sm font-medium ${day === 12 ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
                {day}
              </span>
              
              {day === 12 && (
                <div className="mt-2 space-y-1">
                  <div className="text-[10px] p-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg">
                    Sprint Review
                  </div>
                </div>
              )}
              {day === 15 && (
                <div className="mt-2 space-y-1">
                  <div className="text-[10px] p-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg">
                    Client Meeting
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
