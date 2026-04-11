// 'use client';

// import React from 'react';
// import { GlassCard } from '@/components/GlassCard';
// import { Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react';

// export default function HistoryPage() {
//   // MOCK DATA: Past conversations
//   const history = [
//     {
//       id: 1,
//       date: 'Today, 10:30 AM',
//       duration: '2m 15s',
//       summary: 'Market price inquiry for Wheat and Rice in Pune district.',
//       actions: ['Check prices again tomorrow', 'Call wholesaler Ravi']
//     },
//     {
//       id: 2,
//       date: 'Yesterday, 4:45 PM',
//       duration: '45s',
//       summary: 'Logged 2 tons of Onions into inventory.',
//       actions: ['Listing created successfully']
//     },
//     {
//       id: 3,
//       date: 'Feb 1, 9:00 AM',
//       duration: '1m 20s',
//       summary: 'Asked about fertilizer schedule for Cotton.',
//       actions: ['Buy Urea', 'Schedule watering']
//     }
//   ];

//   return (
//     <div className="space-y-8 animate-in fade-in duration-700">
//       <div>
//         <h1 className="text-3xl font-bold text-white">Call History</h1>
//         <p className="text-slate-400">Review your past conversations and action items.</p>
//       </div>

//       <div className="space-y-6">
//         {history.map((session) => (
//           <GlassCard key={session.id} className="border-l-4 border-l-agri-500">
//             <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              
//               {/* Meta Data */}
//               <div className="min-w-[150px] space-y-2">
//                 <div className="flex items-center gap-2 text-agri-400 font-medium">
//                   <Calendar className="w-4 h-4" />
//                   {session.date}
//                 </div>
//                 <div className="flex items-center gap-2 text-slate-500 text-sm">
//                   <Clock className="w-4 h-4" />
//                   {session.duration}
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="flex-1 space-y-4">
//                 <div>
//                   <h4 className="flex items-center gap-2 text-white font-semibold mb-1">
//                     <FileText className="w-4 h-4 text-cyan-400" />
//                     Summary
//                   </h4>
//                   <p className="text-slate-300 text-sm leading-relaxed">
//                     {session.summary}
//                   </p>
//                 </div>

//                 {/* Action Items */}
//                 <div className="bg-white/5 rounded-lg p-3">
//                   <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
//                     Action Items
//                   </h4>
//                   <ul className="space-y-2">
//                     {session.actions.map((action, idx) => (
//                       <li key={idx} className="flex items-center gap-2 text-sm text-agri-100">
//                         <CheckCircle2 className="w-4 h-4 text-agri-500" />
//                         {action}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//             </div>
//           </GlassCard>
//         ))}
//       </div>
//     </div>
//   );
// }


'use client';

import React from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Calendar, Clock, FileText, CheckCircle2, Activity, Terminal } from 'lucide-react';

export default function HistoryPage() {
  // MOCK DATA: Past conversations
  const history = [
    {
      id: 1,
      date: 'Today, 10:30 AM',
      duration: '2m 15s',
      summary: 'Market price inquiry for Wheat and Rice in Pune district.',
      actions: ['Check prices again tomorrow', 'Call wholesaler Ravi']
    },
    {
      id: 2,
      date: 'Yesterday, 4:45 PM',
      duration: '45s',
      summary: 'Logged 2 tons of Onions into inventory.',
      actions: ['Listing created successfully']
    },
    {
      id: 3,
      date: 'Feb 1, 9:00 AM',
      duration: '1m 20s',
      summary: 'Asked about fertilizer schedule for Cotton.',
      actions: ['Buy Urea', 'Schedule watering']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      
      {/* ========================================
        HEADER SECTION (HUD STYLE)
        ======================================== */}
      <div className="relative border-b border-cyan-900/40 pb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_15px_rgba(8,145,178,0.2)]">
            <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/20" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              System Logs
            </h1>
            <div className="flex items-center gap-2 text-cyan-500/80 font-mono text-sm uppercase tracking-widest mt-1">
              <Terminal className="w-4 h-4" />
              Session History Archive
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
        TIMELINE LIST
        ======================================== */}
      <div className="relative pl-4 md:pl-10 space-y-8">
        
        {/* Glowing Timeline Axis */}
        <div className="absolute top-8 left-[23px] md:left-[47px] bottom-10 w-[2px] bg-gradient-to-b from-cyan-400/60 via-blue-900/40 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.6)]" />

        {history.map((session, index) => (
          <div key={session.id} className="relative group">
            
            {/* Timeline Node */}
            <div className="absolute -left-[18px] md:-left-3 top-6 w-5 h-5 rounded-full bg-[#030712] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:scale-125 group-hover:border-white transition-all duration-300 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 group-hover:bg-white animate-pulse" />
            </div>

            {/* Card Wrapper for gradient border effect */}
            <div className="ml-6 md:ml-10 relative rounded-2xl bg-gradient-to-br from-cyan-900/30 via-slate-900/20 to-blue-900/20 p-[1px] transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(8,145,178,0.3)] hover:from-cyan-500/50">
              
              {/* Glass Card Body */}
              <GlassCard className="relative h-full w-full bg-[#030712]/80 backdrop-blur-xl border-none rounded-2xl overflow-hidden p-6 md:p-8">
                
                {/* Decorative HUD Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/20 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row gap-8 justify-between items-start relative z-10">
                  
                  {/* Meta Data Panel */}
                  <div className="min-w-[180px] flex flex-row md:flex-col gap-4 md:gap-3 py-2 px-4 md:px-0 md:py-0 bg-cyan-950/20 md:bg-transparent rounded-lg border border-cyan-900/30 md:border-none w-full md:w-auto">
                    <div className="flex items-center gap-3 text-cyan-300 font-mono text-sm tracking-wide">
                      <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      {session.date}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-sm tracking-wide">
                      <div className="p-1.5 rounded-md bg-slate-800/50 text-slate-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      {session.duration}
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 space-y-6">
                    {/* Summary */}
                    <div>
                      <h4 className="flex items-center gap-2 text-white/90 font-semibold mb-2 text-lg">
                        <FileText className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                        Query Summary
                      </h4>
                      <p className="text-slate-300 text-base leading-relaxed pl-7">
                        {session.summary}
                      </p>
                    </div>

                    {/* Action Items */}
                    <div className="pl-7">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-t-lg bg-cyan-950/40 border-t border-l border-r border-cyan-900/50">
                        <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
                          Executed Directives
                        </span>
                      </div>
                      <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-b-lg rounded-tr-lg p-4 shadow-[inset_0_0_20px_rgba(8,145,178,0.05)]">
                        <ul className="space-y-3">
                          {session.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-cyan-100/80 group/item">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] group-hover/item:text-cyan-300 transition-colors" />
                              <span className="group-hover/item:text-white transition-colors">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </GlassCard>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}