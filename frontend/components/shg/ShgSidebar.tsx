'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, ClipboardCheck, PackageCheck, PackageX, Users,
  Building2, FileBarChart, LineChart, UserCircle, Leaf, LogOut, PhoneCall,
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/shg' },
  { icon: ClipboardCheck, label: 'Pending Verification', path: '/shg/pending' },
  { icon: PackageCheck, label: 'Approved Products', path: '/shg/approved' },
  { icon: PackageX, label: 'Rejected Products', path: '/shg/rejected' },
  { icon: Users, label: 'Farmers', path: '/shg/farmers' },
  { icon: PhoneCall, label: 'Voice Outreach', path: '/shg/calls' },
  { icon: Building2, label: 'FPOs', path: '/shg/fpos' },
  { icon: FileBarChart, label: 'Reports', path: '/shg/reports' },
  { icon: LineChart, label: 'Analytics', path: '/shg/analytics' },
  { icon: UserCircle, label: 'Profile', path: '/shg/profile' },
];

export function ShgSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path: string) => (path === '/shg' ? pathname === '/shg' : pathname.startsWith(path));

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-20 flex-col border-r border-slate-200 bg-white md:w-64">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <Leaf className="h-5 w-5" />
        </div>
        <div className="hidden md:block">
          <p className="text-base font-extrabold leading-tight tracking-tight text-slate-900">Krishi<span className="text-emerald-600">Shetra</span></p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">SHG Verification</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              title={item.label}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                active
                  ? 'bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.18)]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600')} />
              <span className="hidden truncate md:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {(user?.name ?? 'S').charAt(0).toUpperCase()}
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <p className="truncate text-sm font-bold text-slate-800">{user?.name ?? 'SHG'}</p>
            <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            title="Logout"
            className="hidden rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 md:block"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
