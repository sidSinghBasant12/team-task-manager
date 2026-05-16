'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area 
} from 'recharts';

const data = [
  { name: 'Mon', completed: 12 },
  { name: 'Tue', completed: 19 },
  { name: 'Wed', completed: 15 },
  { name: 'Thu', completed: 22 },
  { name: 'Fri', completed: 28 },
  { name: 'Sat', completed: 14 },
  { name: 'Sun', completed: 9 },
];

export default function Dashboard() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { title: 'Total Tasks', value: '124', icon: LayoutDashboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Completed', value: '82', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'In Progress', value: '35', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Overdue', value: '7', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Welcome back, Alex
            </h1>
            <p className="text-gray-400 mt-1">Here is what is happening with your projects today.</p>
          </div>
          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm flex items-center gap-2">
            + Quick Create
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-2 text-white">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Activity/Graph Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Productivity Trend</h2>
              <select className="bg-transparent border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500 text-gray-300">
                <option className="bg-[#1A1A1A]">This Week</option>
                <option className="bg-[#1A1A1A]">This Month</option>
              </select>
            </div>
            <div className="h-64 w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="completed" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* AI Insights Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-indigo-400">✨</span> AI Insights
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="text-sm text-gray-300">
                  <span className="text-red-400 font-medium">Alert:</span> Backend team may miss the sprint deadline based on current velocity.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="text-sm text-gray-300">
                  <span className="text-amber-400 font-medium">Suggestion:</span> Aman is overloaded (12 active tasks). Recommend reassigning Task-42 to Rahul.
                </p>
                <button className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                  View Workload Balancer &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
