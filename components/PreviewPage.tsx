// components/PreviewPage.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { DashboardData } from "@/types";
import { loadPublishedDashboard } from "@/lib/storage";
import { exportDashboardAsPDF } from "@/lib/export-pdf";
import { BlockRenderer } from "@/components/BlockRenderer";
import { LayoutDashboard, AlertTriangle, Download, Loader2 } from "lucide-react";

const ELEMENT_ID = "preview-page-canvas";

// Breakpoints: mobile (<640px) = 1 col, tablet (<1024px) = 2 cols, desktop = grid livre por w
function getColSpan(w: number, isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return "col-span-1";
  if (isTablet) return w >= 8 ? "col-span-2" : "col-span-1";
  // desktop: mapeamos w/12 para span em grid de 12
  return `col-span-${Math.min(w, 12)}`;
}

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DashboardData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1280);

  useEffect(() => {
    if (!id) return;
    const d = loadPublishedDashboard(id);
    if (!d) setNotFound(true);
    else setData(d);
  }, [id]);

  useEffect(() => {
    const update = () => setScreenWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try { await exportDashboardAsPDF(ELEMENT_ID, `dashboard-${id}`); }
    finally { setIsExporting(false); }
  }, [id]);

  const isMobile = screenWidth < 640;
  const isTablet = screenWidth < 1024 && !isMobile;

  if (!data && !notFound) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <span className="text-sm text-gray-500 animate-pulse">Carregando...</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-950 px-4">
        <AlertTriangle size={36} className="text-yellow-500 opacity-70" />
        <p className="text-base font-medium text-white text-center">Dashboard não encontrado</p>
        <p className="text-xs text-gray-500 text-center">
          O link pode ter expirado ou o dashboard foi removido.
        </p>
        <a href="/" className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
          Criar meu dashboard →
        </a>
      </div>
    );
  }

  // Sort blocks by y then x for reading order on mobile
  const sortedBlocks = [...data!.blocks].sort((a, b) =>
    a.layout.y !== b.layout.y ? a.layout.y - b.layout.y : a.layout.x - b.layout.x
  );

  const gridCols = isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-12";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--theme-background, #f9fafb)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 h-12 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 sm:px-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 rounded-md p-1.5">
            <LayoutDashboard size={13} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm">BI Builder</span>
          <span className="ml-1 hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/15 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Somente leitura
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isExporting
              ? <><Loader2 size={12} className="animate-spin" /><span className="hidden sm:block ml-1">Exportando...</span></>
              : <><Download size={12} /><span className="hidden sm:block ml-1">PDF</span></>
            }
          </button>
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden sm:block">
            Criar meu dashboard →
          </a>
        </div>
      </header>

      {/* Canvas */}
      <main
        id={ELEMENT_ID}
        className={`flex-1 p-4 sm:p-6 grid gap-3 sm:gap-4 ${gridCols}`}
      >
        {sortedBlocks.map((block) => (
          <div
            key={block.id}
            className={`${getColSpan(block.layout.w, isMobile, isTablet)} rounded-xl overflow-hidden bg-white shadow-sm`}
            style={
              // On desktop, use exact pixel height based on layout
              !isMobile && !isTablet
                ? { minHeight: `${block.layout.h * 60}px` }
                : { minHeight: block.layout.h >= 4 ? "280px" : "120px" }
            }
          >
            <BlockRenderer props={block.props} />
          </div>
        ))}
      </main>

      {/* Mobile footer */}
      {isMobile && (
        <footer className="bg-gray-950 border-t border-gray-800 px-4 py-3 text-center">
          <a href="/" className="text-xs text-blue-400 hover:text-blue-300">
            Criar meu dashboard no BI Builder →
          </a>
        </footer>
      )}
    </div>
  );
}
