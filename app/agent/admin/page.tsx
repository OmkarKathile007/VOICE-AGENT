'use client';

import React from 'react';
import { GlassCard } from '@/components/GlassCard';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white">Farm Insights</h1>
        <p className="text-slate-400">Real-time analytics for your business.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value="₹ 1.2L" 
          trend="+12%" 
          color="text-agri-400" 
        />
        <StatCard 
          icon={Users} 
          label="Active Buyers" 
          value="14" 
          trend="+2" 
          color="text-cyan-400" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Market Rate" 
          value="₹ 2,400" 
          sub="Avg. Wheat" 
          color="text-purple-400" 
        />
        <StatCard 
          icon={Activity} 
          label="Voice Sessions" 
          value="28" 
          sub="This Month" 
          color="text-pink-400" 
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Chart Area (Mock Visual) */}
        <GlassCard className="lg:col-span-2 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Price Trends (Last 7 Days)</h3>
          
          {/* CSS-Only Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
            {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-agri-500/20 border-t border-agri-500/50 rounded-t-sm transition-all duration-500 hover:bg-agri-500/40 relative"
                  style={{ height: `${h}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    ₹ {2000 + (h * 10)}
                  </div>
                </div>
                <span className="text-xs text-slate-500">Day {i+1}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
               <span className="text-slate-400">Database Status</span>
               <span className="text-agri-400 font-mono">ONLINE</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
               <span className="text-slate-400">Voice API Latency</span>
               <span className="text-cyan-400 font-mono">120ms</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
               <span className="text-slate-400">Last Backup</span>
               <span className="text-slate-200">2 hours ago</span>
             </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// Simple internal component for the stats
function StatCard({ icon: Icon, label, value, trend, sub, color }: any) {
  return (
    <GlassCard hoverEffect>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 bg-white/5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-agri-400">
          <TrendingUp className="w-3 h-3" />
          {trend} vs last month
        </div>
      )}
    </GlassCard>
  );
}