import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto max-w-sm w-full p-4 rounded-xl shadow-lg border flex items-start space-x-3 transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/50'
              : toast.type === 'error'
              ? 'bg-slate-900 text-white border-rose-500/50'
              : 'bg-slate-900 text-white border-indigo-500/50'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100">{toast.title}</p>
            {toast.description && (
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
