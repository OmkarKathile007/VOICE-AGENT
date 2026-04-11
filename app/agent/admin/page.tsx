// 'use client';

// import React from 'react';
// import { GlassCard } from '@/components/GlassCard';
// import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

// export default function AdminPage() {
//   return (
//     <div className="space-y-8 animate-in fade-in duration-700">
//       <div>
//         <h1 className="text-3xl font-bold text-white">Farm Insights</h1>
//         <p className="text-slate-400">Real-time analytics for your business.</p>
//       </div>

//       {/* Top Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard 
//           icon={DollarSign} 
//           label="Total Revenue" 
//           value="₹ 1.2L" 
//           trend="+12%" 
//           color="text-agri-400" 
//         />
//         <StatCard 
//           icon={Users} 
//           label="Active Buyers" 
//           value="14" 
//           trend="+2" 
//           color="text-cyan-400" 
//         />
//         <StatCard 
//           icon={TrendingUp} 
//           label="Market Rate" 
//           value="₹ 2,400" 
//           sub="Avg. Wheat" 
//           color="text-purple-400" 
//         />
//         <StatCard 
//           icon={Activity} 
//           label="Voice Sessions" 
//           value="28" 
//           sub="This Month" 
//           color="text-pink-400" 
//         />
//       </div>

//       {/* Main Content Split */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Large Chart Area (Mock Visual) */}
//         <GlassCard className="lg:col-span-2 min-h-[300px] flex flex-col">
//           <h3 className="text-lg font-semibold text-white mb-6">Price Trends (Last 7 Days)</h3>
          
//           {/* CSS-Only Bar Chart */}
//           <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
//             {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
//               <div key={i} className="w-full flex flex-col items-center gap-2 group">
//                 <div 
//                   className="w-full bg-agri-500/20 border-t border-agri-500/50 rounded-t-sm transition-all duration-500 hover:bg-agri-500/40 relative"
//                   style={{ height: `${h}%` }}
//                 >
//                   {/* Tooltip */}
//                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
//                     ₹ {2000 + (h * 10)}
//                   </div>
//                 </div>
//                 <span className="text-xs text-slate-500">Day {i+1}</span>
//               </div>
//             ))}
//           </div>
//         </GlassCard>

//         {/* Recent Activity */}
//         <GlassCard>
//           <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
//           <div className="space-y-4">
//              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
//                <span className="text-slate-400">Database Status</span>
//                <span className="text-agri-400 font-mono">ONLINE</span>
//              </div>
//              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
//                <span className="text-slate-400">Voice API Latency</span>
//                <span className="text-cyan-400 font-mono">120ms</span>
//              </div>
//              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
//                <span className="text-slate-400">Last Backup</span>
//                <span className="text-slate-200">2 hours ago</span>
//              </div>
//           </div>
//         </GlassCard>
//       </div>
//     </div>
//   );
// }

// // Simple internal component for the stats
// function StatCard({ icon: Icon, label, value, trend, sub, color }: any) {
//   return (
//     <GlassCard hoverEffect>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-slate-400 mb-1">{label}</p>
//           <h3 className="text-2xl font-bold text-white">{value}</h3>
//           {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
//         </div>
//         <div className={`p-2 bg-white/5 rounded-lg ${color}`}>
//           <Icon className="w-5 h-5" />
//         </div>
//       </div>
//       {trend && (
//         <div className="mt-4 flex items-center gap-1 text-xs font-medium text-agri-400">
//           <TrendingUp className="w-3 h-3" />
//           {trend} vs last month
//         </div>
//       )}
//     </GlassCard>
//   );
// }


'use client';

import React from 'react';
import { GlassCard } from '@/components/GlassCard';
import { TrendingUp, Users, DollarSign, Activity, BarChart3, Server, Wifi } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      
      {/* ========================================
        HEADER SECTION (HUD STYLE)
        ======================================== */}
      <div className="relative border-b border-cyan-900/40 pb-6">
        <div className="absolute top-0 left-[10%] w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_20px_rgba(8,145,178,0.2)]">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/20" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              Command Center
            </h1>
            <p className="text-cyan-500/80 font-mono text-sm uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className="text-cyan-700">{'>'}</span> Real-time telemetry & analytics
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
        TOP STATS ROW
        ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value="₹ 1.2L" 
          trend="+12%" 
          theme="emerald"
        />
        <StatCard 
          icon={Users} 
          label="Active Buyers" 
          value="14" 
          trend="+2" 
          theme="cyan"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Market Rate" 
          value="₹ 2,400" 
          sub="Avg. Wheat" 
          theme="blue"
        />
        <StatCard 
          icon={Activity} 
          label="Voice Sessions" 
          value="28" 
          sub="This Month" 
          theme="indigo"
        />
      </div>

      {/* ========================================
        MAIN CONTENT SPLIT
        ======================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Chart Area (Holographic Visualizer) */}
        <div className="lg:col-span-2 relative rounded-2xl bg-gradient-to-br from-cyan-900/40 via-slate-900/20 to-blue-900/20 p-[1px] group">
          <GlassCard className="h-full w-full bg-[#030712]/90 backdrop-blur-xl border-none rounded-2xl overflow-hidden p-6 md:p-8 min-h-[350px] flex flex-col relative">
            
            {/* Holographic Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0891b210_1px,transparent_1px)] bg-[size:100%_20%] pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start mb-8">
              <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Price Trends Grid
              </h3>
              <div className="px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-mono tracking-wider">
                LAST 7 DAYS
              </div>
            </div>
            
            {/* CSS-Only Holographic Bar Chart */}
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 pb-4 relative z-10">
              {/* Y-Axis mock line */}
              <div className="absolute left-0 top-0 bottom-4 w-px bg-gradient-to-b from-transparent via-cyan-900/50 to-cyan-500/50" />
              {/* X-Axis mock line */}
              <div className="absolute left-0 right-0 bottom-4 h-px bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

              {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-3 group/bar h-full justify-end relative z-10 mt-10">
                  <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-cyan-900/20 to-cyan-400/30 border-t-2 border-cyan-300 rounded-t-sm transition-all duration-500 group-hover/bar:from-cyan-800/40 group-hover/bar:to-cyan-400/60 group-hover/bar:shadow-[0_0_20px_rgba(34,211,238,0.6)] relative"
                    style={{ height: `${h}%` }}
                  >
                    {/* Tooltip (HUD Style) */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950/90 text-cyan-300 font-mono text-xs px-3 py-1.5 rounded border border-cyan-500/50 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform group-hover/bar:-translate-y-2 whitespace-nowrap shadow-[0_0_15px_rgba(8,145,178,0.4)] backdrop-blur-md pointer-events-none z-20">
                      ₹ {2000 + (h * 10)}
                      {/* Tooltip caret */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-b border-r border-cyan-500/50 rotate-45" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-600 uppercase group-hover/bar:text-cyan-400 transition-colors">D-0{i+1}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* System Health (Server Diagnostics Terminal) */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-800/40 via-slate-900/20 to-slate-800/40 p-[1px]">
          <GlassCard className="h-full w-full bg-[#030712]/90 backdrop-blur-xl border-none rounded-2xl p-6 md:p-8 relative overflow-hidden">
            
            {/* Terminal Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white/90 mb-6 flex items-center gap-2">
                <Server className="w-5 h-5 text-slate-400" />
                System Diagnostics
              </h3>
              
              <div className="space-y-5">
                 {/* Item 1: Database Status */}
                 <div className="flex justify-between items-center text-sm border-b border-cyan-900/30 pb-3 group">
                   <span className="text-slate-500 font-mono uppercase tracking-wider text-xs">Node_DB_Status</span>
                   <span className="flex items-center gap-2 text-emerald-400 font-mono font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                     ONLINE
                   </span>
                 </div>
                 
                 {/* Item 2: Voice API Latency */}
                 <div className="flex justify-between items-center text-sm border-b border-cyan-900/30 pb-3 group">
                   <span className="text-slate-500 font-mono uppercase tracking-wider text-xs">Voice_Latency</span>
                   <span className="flex items-center gap-2 text-cyan-400 font-mono font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                     <Wifi className="w-3.5 h-3.5 text-cyan-500" />
                     120ms
                   </span>
                 </div>
                 
                 {/* Item 3: Last Backup */}
                 <div className="flex justify-between items-center text-sm border-b border-cyan-900/30 pb-3 group">
                   <span className="text-slate-500 font-mono uppercase tracking-wider text-xs">Snapshot_Sync</span>
                   <span className="text-slate-300 font-mono">
                     T-minus 2h
                   </span>
                 </div>

                 {/* System Log Mock */}
                 <div className="pt-2">
                   <div className="w-full bg-black/50 rounded-lg p-3 border border-white/5 font-mono text-[10px] text-cyan-600/60 leading-relaxed h-20 overflow-hidden relative">
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 z-10" />
                     {'>'} INIT DIAGNOSTIC_CHECK...<br/>
                     {'>'} PING NODE_ALPHA: OK (12ms)<br/>
                     {'>'} MEMORY_POOL: 42% ALLOCATED<br/>
                     {'>'} WAITING FOR INCOMING TCP...
                   </div>
                 </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}

// ========================================
// INTERNAL STAT CARD COMPONENT
// ========================================
interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  trend?: string;
  sub?: string;
  theme: 'emerald' | 'cyan' | 'blue' | 'indigo';
}

function StatCard({ icon: Icon, label, value, trend, sub, theme }: StatCardProps) {
  // Theme dictionaries to avoid broken Tailwind string concatenation
  const themes = {
    emerald: {
      wrapper: "from-emerald-500/40 via-slate-900/20 to-slate-900/20",
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-400",
      iconShadow: "shadow-[0_0_15px_rgba(52,211,153,0.2)]",
      trendText: "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]",
    },
    cyan: {
      wrapper: "from-cyan-500/40 via-slate-900/20 to-slate-900/20",
      iconBg: "bg-cyan-500/10",
      iconText: "text-cyan-400",
      iconShadow: "shadow-[0_0_15px_rgba(34,211,238,0.2)]",
      trendText: "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]",
    },
    blue: {
      wrapper: "from-blue-500/40 via-slate-900/20 to-slate-900/20",
      iconBg: "bg-blue-500/10",
      iconText: "text-blue-400",
      iconShadow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
      trendText: "text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]",
    },
    indigo: {
      wrapper: "from-indigo-500/40 via-slate-900/20 to-slate-900/20",
      iconBg: "bg-indigo-500/10",
      iconText: "text-indigo-400",
      iconShadow: "shadow-[0_0_15px_rgba(99,102,241,0.2)]",
      trendText: "text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]",
    }
  };

  const t = themes[theme];

  return (
    <div className={`relative rounded-2xl bg-gradient-to-br ${t.wrapper} p-[1px] group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(8,145,178,0.3)]`}>
      <GlassCard className="h-full w-full bg-[#030712]/90 backdrop-blur-xl border-none rounded-2xl overflow-hidden p-5 relative">
        
        {/* Subtle corner glow effect on hover */}
        <div className={`absolute top-0 right-0 w-24 h-24 ${t.iconBg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">{label}</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">{value}</h3>
            {sub && <p className="text-xs font-mono text-slate-500 mt-1 uppercase">{sub}</p>}
          </div>
          
          <div className={`p-2.5 rounded-xl ${t.iconBg} border border-white/5 ${t.iconShadow} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-5 h-5 ${t.iconText}`} />
          </div>
        </div>
        
        {trend && (
          <div className={`mt-5 flex items-center gap-1.5 text-xs font-mono font-bold tracking-wide uppercase ${t.trendText}`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {trend} <span className="text-slate-600 font-normal ml-1">vs T-30</span>
          </div>
        )}
      </GlassCard>
    </div>
  );
}