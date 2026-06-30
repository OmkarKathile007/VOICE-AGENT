import React from 'react';
import { Listing } from '@/types';
import { GlassCard } from './GlassCard';
import { Leaf, MapPin, IndianRupee, Package } from 'lucide-react';

export const ListingCard = ({ data }: { data: Listing }) => {
  return (
    <GlassCard hoverEffect className="relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-agri-500/10 rounded-full blur-2xl group-hover:bg-agri-500/20 transition-all" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-agri-500/20 rounded-lg text-agri-400">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">{data.crop}</h3>
              <span className="text-xs text-slate-400 uppercase tracking-wider">{data.source} entry</span>
            </div>
          </div>
          <div className="text-right">
             <p className="text-2xl font-bold text-cyan-400 flex items-center justify-end">
               <IndianRupee className="w-5 h-5" />
               {data.price}
             </p>
             <p className="text-xs text-slate-500">per unit</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-slate-300">
            <Package className="w-4 h-4 text-purple-400" />
            <span className="text-sm">{data.quantity}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="text-sm truncate">{data.location}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};