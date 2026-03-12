// components/DashboardPreview.tsx
"use client";

import { useCallback, useState } from "react";
import { Render } from "@measured/puck";
import type { Data } from "@measured/puck";
import { puckConfig } from "@/config/puck.config";
import { exportDashboardAsPDF } from "@/lib/export-pdf";
import { LayoutDashboard, Download, Loader2 } from "lucide-react";

interface DashboardPreviewProps {
  data: Data;
}

const PREVIEW_ELEMENT_ID = "editor-preview-canvas";

export function DashboardPreview({ data }: DashboardPreviewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const isEmpty = data.content.length === 0;

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportDashboardAsPDF(PREVIEW_ELEMENT_ID, "meu-dashboard");
    } finally {
      setIsExporting(false);
    }
  }, []);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
        <LayoutDashboard size={40} className="opacity-30" />
        <p className="text-sm">Nenhum bloco adicionado ainda.</p>
        <p className="text-xs text-gray-500">
          Volte ao editor e adicione gráficos ou KPIs.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      <div className="shrink-0 flex items-center justify-end px-5 py-2 border-b border-gray-200 bg-white">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <><Loader2 size={12} className="animate-spin" /> Exportando...</>
          ) : (
            <><Download size={12} /> Exportar PDF</>
          )}
        </button>
      </div>

      <div id={PREVIEW_ELEMENT_ID} className="flex-1 overflow-y-auto p-6">
        <Render config={puckConfig} data={data} />
      </div>
    </div>
  );
}
