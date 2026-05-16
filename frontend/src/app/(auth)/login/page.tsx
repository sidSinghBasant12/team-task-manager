'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import api from '@/lib/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      dispatch(setCredentials({
        user: response.data,
        token: response.data.token
      }));

      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative font-sans w-full h-full">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

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
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-6 shadow-lg shadow-indigo-500/30 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">TF</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to TaskForge AI</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center"
            >
              {error}
            </motion.div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-gray-600 bg-black/50 text-indigo-500 focus:ring-indigo-500" />
              <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:hover:bg-indigo-600 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-white hover:text-indigo-400 transition-colors font-medium">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
