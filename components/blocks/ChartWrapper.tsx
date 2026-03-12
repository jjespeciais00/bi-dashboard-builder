// components/blocks/ChartWrapper.tsx
"use client";

import { Loader2, AlertTriangle, Wifi } from "lucide-react";

interface ChartWrapperProps {
  title: string;
  isLoading: boolean;
  error: string | null;
  hasEndpoint: boolean;
  children: React.ReactNode;
}

export function ChartWrapper({
  title,
  isLoading,
  error,
  hasEndpoint,
  children,
}: ChartWrapperProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-800 truncate">{title}</h3>
        {hasEndpoint ? (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <Wifi size={10} />
            API
          </span>
        ) : (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-100 border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
            Mock
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[240px] gap-2 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Carregando dados...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[240px] gap-2">
          <AlertTriangle size={20} className="text-amber-400" />
          <p className="text-sm font-medium text-gray-700">Falha ao carregar API</p>
          <p className="text-xs text-gray-400 font-mono">{error}</p>
          <p className="text-xs text-gray-400">Exibindo dados mock como fallback</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
