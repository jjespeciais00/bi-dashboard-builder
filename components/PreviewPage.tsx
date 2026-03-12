// components/PreviewPage.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Render, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { loadPublishedDashboard } from "@/lib/storage";
import { exportDashboardAsPDF } from "@/lib/export-pdf";
import { puckConfig } from "@/config/puck.config";
import { LayoutDashboard, AlertTriangle, Download, Loader2 } from "lucide-react";

const DASHBOARD_ELEMENT_ID = "dashboard-preview-canvas";

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Data | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const dashboard = loadPublishedDashboard(id);
    if (!dashboard) setNotFound(true);
    else setData(dashboard);
  }, [id]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await exportDashboardAsPDF(DASHBOARD_ELEMENT_ID, `dashboard-${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao exportar";
      setExportError(message);
      setTimeout(() => setExportError(null), 4000);
    } finally {
      setIsExporting(false);
    }
  }, [id]);

  if (!data && !notFound) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <span className="text-sm text-gray-500 animate-pulse">Carregando...</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-950">
        <AlertTriangle size={36} className="text-yellow-500 opacity-70" />
        <p className="text-base font-medium text-white">Dashboard não encontrado</p>
        <p className="text-sm text-gray-500">O link pode ter expirado ou o dashboard foi removido.</p>
        <a href="/" className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
          Voltar ao editor
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-12 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500 rounded-md p-1.5">
            <LayoutDashboard size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">BI Builder</span>
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/15 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Somente leitura
          </span>
        </div>

        <div className="flex items-center gap-3">
          {exportError && <span className="text-xs text-red-400">{exportError}</span>}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <><Loader2 size={12} className="animate-spin" /> Exportando...</>
            ) : (
              <><Download size={12} /> Exportar PDF</>
            )}
          </button>
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Criar meu dashboard →
          </a>
        </div>
      </header>

      <main id={DASHBOARD_ELEMENT_ID} className="flex-1 p-6">
        <Render config={puckConfig} data={data!} />
      </main>
    </div>
  );
}
