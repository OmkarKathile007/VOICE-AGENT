'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, ShoppingBag, History, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Mic, label: 'Assistant', path: '/agent/voice' }, // Matches your folder structure
    { icon: ShoppingBag, label: 'Products', path: '/products' },
    { icon: History, label: 'History', path: '/agent/history' },
    { icon: ShoppingBag, label: 'My Listings', path: '/agent/listings' },
    // Outbound AI agent calls moved to the SHG dashboard (/shg/calls).
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col">
      <div className="p-6 flex items-center gap-3 text-agri-400">
        <div className="p-2 bg-agri-500/20 rounded-lg">
          <Leaf className="w-6 h-6" />
        </div>
        <span className="hidden md:block font-bold text-xl tracking-wider text-white">Krishi<span className="text-agri-400">AI</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === item.path
                ? "bg-agri-500/20 text-agri-400 border border-agri-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            {/* <span className="hidden md:block font-medium">{item.label}</span> */}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};