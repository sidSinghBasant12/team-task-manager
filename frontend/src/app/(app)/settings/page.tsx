'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, Loader2, Check } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/lib/axios';
import { setCredentials } from '@/store/slices/authSlice';

export default function SettingsPage() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Profile States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.put('/users/profile', { name, email });
      dispatch(setCredentials({ user: response.data, token: token as string }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full bg-[#0A0A0A] text-white overflow-y-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Settings
        </h1>
        <p className="text-gray-400 mt-1">Manage your account and application preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="max-w-2xl">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
                <Check size={16} /> Update successful!
              </div>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                  </div>
                </section>
                <div className="pt-8 border-t border-white/10 flex justify-end">
                  <button 
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-bold flex items-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleUpdatePassword} className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                  </div>
                </section>
                <div className="pt-8 border-t border-white/10 flex justify-end">
                  <button 
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-bold flex items-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {(activeTab === 'notifications' || activeTab === 'appearance') && (
              <div className="py-12 text-center">
                <p className="text-gray-500 italic">This setting tab is coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
