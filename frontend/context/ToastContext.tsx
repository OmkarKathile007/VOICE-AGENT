'use client';

import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const STYLES: Record<ToastType, { bar: string; icon: ReactNode; ring: string }> = {
  success: { bar: 'bg-emerald-500', ring: 'border-emerald-200', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> },
  error: { bar: 'bg-rose-500', ring: 'border-rose-200', icon: <XCircle className="w-5 h-5 text-rose-600" /> },
  info: { bar: 'bg-sky-500', ring: 'border-sky-200', icon: <Info className="w-5 h-5 text-sky-600" /> },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const value: ToastContextType = {
    toast,
    success: (m) => toast(m, 'success'),
    error: (m) => toast(m, 'error'),
    info: (m) => toast(m, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 w-[min(92vw,360px)]">
        {toasts.map((t) => {
          const s = STYLES[t.type];
          return (
            <div
              key={t.id}
              role="status"
              className={`relative flex items-start gap-3 overflow-hidden rounded-xl border ${s.ring} bg-white p-4 pr-9 shadow-lg shadow-slate-900/5 animate-in slide-in-from-right-6 fade-in duration-300`}
            >
              <span className={`absolute left-0 top-0 h-full w-1 ${s.bar}`} />
              <span className="mt-0.5 shrink-0">{s.icon}</span>
              <p className="text-sm font-medium leading-snug text-slate-700">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="absolute right-2 top-2 rounded-md p-1 text-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-500"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
