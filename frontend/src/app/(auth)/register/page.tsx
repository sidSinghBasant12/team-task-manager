'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      });
      
      dispatch(setCredentials({
        user: response.data,
        token: response.data.token
      }));
      
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative font-sans w-full h-full">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10 mx-4"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 shadow-lg shadow-purple-500/30 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">TF</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-gray-400">Join TaskForge AI and boost your team</p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="relative">
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all appearance-none"
              >
                <option value="ADMIN" className="bg-[#1A1A1A]">Admin</option>
                <option value="PROJECT_MANAGER" className="bg-[#1A1A1A]">Project Manager</option>
                <option value="TEAM_LEAD" className="bg-[#1A1A1A]">Team Lead</option>
                <option value="DEVELOPER" className="bg-[#1A1A1A]">Developer</option>
                <option value="VIEWER" className="bg-[#1A1A1A]">Viewer</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ArrowRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-70 disabled:hover:bg-purple-600 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-purple-400 transition-colors font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
