'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ShgSidebar } from '@/components/shg/ShgSidebar';
import { Loader2 } from 'lucide-react';

export default function ShgLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (user.role !== 'SHG') router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'SHG') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <ShgSidebar />
        <main className="ml-20 min-h-screen md:ml-64">
          <div className="mx-auto max-w-[1400px] px-5 py-7 md:px-8 md:py-9">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
