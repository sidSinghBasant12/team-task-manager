'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Plus, FolderKanban, CheckSquare, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickActions = [
    { name: 'New Project', icon: FolderKanban, path: '/projects', role: 'ADMIN', color: 'text-blue-400' },
    { name: 'New Task', icon: CheckSquare, path: '/tasks', role: 'ADMIN', color: 'text-emerald-400' },
    { name: 'Invite Member', icon: UserPlus, path: '/members', role: 'ADMIN', color: 'text-purple-400' },
  ];

  const filteredActions = quickActions.filter(action => 
    !action.role || action.role === user?.role
  );

  return (
    <header className="h-20 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between px-8 text-white sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
      
      {/* Global Search */}
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search tasks, projects, users..." 
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white/5 transition-all shadow-inner placeholder:text-gray-600"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-[#2A2A2A] px-1.5 py-0.5 rounded text-[10px] text-gray-400 font-mono">
              Ctrl
            </kbd>
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-[#2A2A2A] px-1.5 py-0.5 rounded text-[10px] text-gray-400 font-mono">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#0A0A0A]"></span>
        </button>

        <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
          <Moon size={20} />
        </button>

        <div className="h-8 w-px bg-white/10 mx-1"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-2.5 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center ${showDropdown ? 'rotate-45' : ''}`}
          >
            <Plus size={22} />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-[#1A1A1A] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl"
              >
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quick Actions</p>
                </div>
                {filteredActions.length > 0 ? filteredActions.map((action) => (
                  <Link 
                    key={action.name} 
                    href={action.path}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${action.color}`}>
                      <action.icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{action.name}</span>
                  </Link>
                )) : (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs text-gray-500 italic">No quick actions available.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
