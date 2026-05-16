'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Columns3, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: FolderKanban, path: '/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Kanban Board', icon: Columns3, path: '/board' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    ...(user?.role === 'ADMIN' ? [{ name: 'Members', icon: Users, path: '/members' }] : []),
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-[#0A0A0A] border-r border-white/10 flex flex-col relative transition-all duration-300"
    >
      <div className="p-6 flex items-center justify-between">
        <motion.div 
          animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'flex' }}
          className="items-center gap-2"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            TF
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            TaskForge <span className="text-indigo-400">AI</span>
          </span>
        </motion.div>
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] mx-auto">
            TF
          </div>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-[#1A1A1A] border border-white/10 rounded-full p-1 hover:bg-white/10 transition-colors z-10 text-gray-400 hover:text-white"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div 
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"
                  />
                )}
                <item.icon size={22} className={`shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-white transition-colors'}`} />
                <motion.span 
                  animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div 
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          <motion.div 
            animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
            className="flex-1"
          >
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 group-hover:text-red-400 transition-colors">Logout</p>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}
