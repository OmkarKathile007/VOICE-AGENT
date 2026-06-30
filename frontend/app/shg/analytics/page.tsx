'use client';

import React, { useEffect, useState } from 'react';
import { shgApi, type ShgAnalytics } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { PageHeader, Loading } from '@/components/shg/primitives';
import { TrendBars, Donut, RankedBars } from '@/components/shg/charts';
import { LineChart, TrendingUp, PieChart, Users, Building2, MapPin } from 'lucide-react';

function Card({ title, icon: Icon, children }: { title: string; icon: typeof LineChart; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
        <Icon className="h-4 w-4 text-emerald-500" /> {title}
      </h2>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const toast = useToast();
  const [data, setData] = useState<ShgAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setData(await shgApi.analytics()); }
      catch (e) { toast.error(e instanceof Error ? e.message : 'Failed to load analytics'); }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading label="Crunching analytics…" />;
  if (!data) return null;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader icon={LineChart} title="Analytics" subtitle="Verification trends and activity across your SHG." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Verification Trends — last 7 days" icon={TrendingUp}>
            <TrendBars data={data.verificationTrends} />
          </Card>
        </div>
        <Card title="Status Breakdown" icon={PieChart}>
          <Donut
            segments={[
              { label: 'Pending', value: data.totalPending, color: '#f59e0b' },
              { label: 'Approved', value: data.totalApproved, color: '#10b981' },
              { label: 'Rejected', value: data.totalRejected, color: '#f43f5e' },
            ]}
          />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Most Active Farmers" icon={Users}>
          <RankedBars items={data.mostActiveFarmers} color="#0ea5e9" />
        </Card>
        <Card title="Most Active FPOs" icon={Building2}>
          <RankedBars items={data.mostActiveFPOs} color="#8b5cf6" />
        </Card>
        <Card title="Top Villages" icon={MapPin}>
          <RankedBars items={data.topVillages} color="#10b981" />
        </Card>
      </div>
    </div>
  );
}
