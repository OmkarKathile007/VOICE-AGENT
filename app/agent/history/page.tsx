'use client';

import React from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white">Call History</h1>
        <p className="text-slate-400">Review your past conversations and action items.</p>
      </div>

      <div className="space-y-6">
        {history.map((session) => (
          <GlassCard key={session.id} className="border-l-4 border-l-agri-500">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              
              {/* Meta Data */}
              <div className="min-w-[150px] space-y-2">
                <div className="flex items-center gap-2 text-agri-400 font-medium">
                  <Calendar className="w-4 h-4" />
                  {session.date}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {session.duration}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="flex items-center gap-2 text-white font-semibold mb-1">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Summary
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {session.summary}
                  </p>
                </div>

                {/* Action Items */}
                <div className="bg-white/5 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Action Items
                  </h4>
                  <ul className="space-y-2">
                    {session.actions.map((action, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-agri-100">
                        <CheckCircle2 className="w-4 h-4 text-agri-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}