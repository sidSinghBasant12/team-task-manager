'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const barData = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 7 },
  { name: 'Wed', tasks: 5 },
  { name: 'Thu', tasks: 8 },
  { name: 'Fri', tasks: 6 },
];

const pieData = [
  { name: 'Completed', value: 400 },
  { name: 'Pending', value: 300 },
  { name: 'Overdue', value: 100 },
];

const COLORS = ['#818cf8', '#fbbf24', '#f87171'];

export default function AnalyticsPage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const stats = [
    { title: 'Completion Rate', value: '84%', icon: CheckCircle, color: 'text-emerald-400' },
    { title: 'Avg. Cycle Time', value: '3.2 Days', icon: Clock, color: 'text-indigo-400' },
    { title: 'Active Contributors', value: '12', icon: Users, color: 'text-purple-400' },
    { title: 'Velocity Index', value: '+14%', icon: TrendingUp, color: 'text-blue-400' },
  ];

  return (
    <div className="p-8 h-full bg-[#0A0A0A] text-white overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Analytics & Insights
        </h1>
        <p className="text-gray-400 mt-1">Deep dive into team performance and productivity trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <h3 className="text-lg font-semibold mb-6">Task Velocity</h3>
          <div className="h-64">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1A1A1A', borderColor: '#333'}} />
                  <Bar dataKey="tasks" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <h3 className="text-lg font-semibold mb-6">Task Distribution</h3>
          <div className="h-64">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#1A1A1A', borderColor: '#333'}} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
