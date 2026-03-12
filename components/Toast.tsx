// components/Toast.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ICONS = {
  success: <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />,
  warning: <AlertTriangle size={15} className="text-yellow-400 shrink-0" />,
  error:   <XCircle size={15} className="text-red-400 shrink-0" />,
};

const BG = {
  success: "bg-gray-900 border-emerald-500/30",
  warning: "bg-gray-900 border-yellow-500/30",
  error:   "bg-gray-900 border-red-500/30",
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), toast.type === "error" ? 6000 : 3000);
    return () => clearTimeout(t);
  }, [toast.id, toast.type, onDismiss]);

  return (
    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-2xl min-w-64 max-w-sm ${BG[toast.type]} animate-in slide-in-from-bottom-2 duration-200`}>
      {ICONS[toast.type]}
      <p className="text-xs text-gray-200 flex-1 leading-relaxed">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-gray-600 hover:text-gray-400 transition-colors">
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Hook
let _addToast: ((type: ToastType, message: string) => void) | null = null;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast_${Date.now()}_${counterRef.current++}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Register globally so it can be called from outside React tree if needed
  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  return { toasts, addToast, dismiss };
}
