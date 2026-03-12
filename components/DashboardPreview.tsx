// components/DashboardPreview.tsx
"use client";

import { useCallback, useState } from "react";
import type { DashboardData } from "@/types";
import type { WhiteLabel } from "@/lib/whitelabel";
import { BlockRenderer } from "@/components/BlockRenderer";
import { exportDashboardAsPDF } from "@/lib/export-pdf";
import { LayoutDashboard, Download, Loader2 } from "lucide-react";

interface DashboardPreviewProps {
  data: DashboardData;
  wl: WhiteLabel;
}

const PREVIEW_ELEMENT_ID = "dashboard-preview-canvas";

export function DashboardPreview({ data, wl }: DashboardPreviewProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportDashboardAsPDF(PREVIEW_ELEMENT_ID, "meu-dashboard");
    } finally {
      setIsExporting(false);
    }
  }, []);

  if (data.blocks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
        <LayoutDashboard size={40} className="opacity-30" />
        <p className="text-sm">Nenhum bloco adicionado ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "var(--theme-background, #f9fafb)" }}>
      <div className="shrink-0 flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {wl.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wl.logoSrc} alt="logo" className="h-6 w-6 object-contain rounded" />
          ) : (
            <div className="bg-blue-500 rounded p-1">
              <LayoutDashboard size={12} className="text-white" />
            </div>
          )}
          <span className="text-sm font-semibold text-gray-700">{wl.appName || "BI Builder"}</span>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          {isExporting ? <><Loader2 size={12} className="animate-spin" /> Exportando...</> : <><Download size={12} /> Exportar PDF</>}
        </button>
      </div>

      <div id={PREVIEW_ELEMENT_ID} className="flex-1 overflow-y-auto p-6 grid gap-4" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
        {data.blocks.map((block) => (
          <div
            key={block.id}
            style={{
              gridColumn: `span ${block.layout.w}`,
            }}
          >
            <BlockRenderer props={block.props} />
          </div>
        ))}
      </div>
    </div>
  );
}
