'use client'; // Client component for interactivity

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const NeonButton = ({ 
  children, 
  className, 
  variant = 'primary', 
  isLoading, 
  ...props 
}: NeonButtonProps) => {
  const variants = {
    primary: "bg-agri-500/20 text-agri-400 border-agri-500/50 hover:bg-agri-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    secondary: "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white",
    danger: "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
  };

  return (
    <button
      className={cn(
        "relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 border backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};