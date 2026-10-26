import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const borders = {
    success: 'border-l-4 border-emerald-500 bg-white',
    error: 'border-l-4 border-rose-500 bg-white',
    warning: 'border-l-4 border-amber-500 bg-white',
    info: 'border-l-4 border-blue-500 bg-white'
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border border-slate-200 ${borders[toast.type] || borders.info} min-w-[300px] max-w-md transition-all duration-300 transform translate-y-0`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 text-sm font-medium text-slate-800">
        {toast.message}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
