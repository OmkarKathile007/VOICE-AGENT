import React from 'react';
import { cn } from '@/lib/utils'; // Note the @ alias for Next.js

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const GlassCard = ({ children, className, hoverEffect = false, ...props }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "bg-glass-100 backdrop-blur-md border border-white/10 rounded-xl p-6",
        "shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
        hoverEffect && "transition-all duration-300 hover:bg-glass-200 hover:border-agri-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};