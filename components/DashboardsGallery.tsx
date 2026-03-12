// components/DashboardsGallery.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  listPublishedDashboards, deletePublishedDashboard, type DashboardMeta,
} from "@/lib/storage";
import {
  LayoutDashboard, ExternalLink, Trash2, Link, Clock, BarChart2, Loader2,
} from "lucide-react";

export function DashboardsGallery() {
  const [dashboards, setDashboards] = useState<DashboardMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboards(listPublishedDashboards().reverse());
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("Remover este dashboard publicado?")) return;
    deletePublishedDashboard(id);
    setDashboards((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleCopy = useCallback(async (id: string) => {
    const url = `${window.location.origin}/preview/${id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500 rounded-md p-1.5">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">BI Builder</span>
          <span className="text-gray-600 text-sm mx-1">/</span>
          <span className="text-gray-400 text-sm">Dashboards publicados</span>
        </div>
        <a href="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          <BarChart2 size={13} />
          Abrir editor
        </a>
      </header>

      <main className="flex-1 px-6 py-8 max-w-5xl w-full mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 mt-24 text-gray-600">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Carregando...</span>
          </div>
        ) : dashboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 mt-24 text-gray-600">
            <BarChart2 size={40} className="opacity-30" />
            <p className="text-base font-medium text-gray-400">Nenhum dashboard publicado ainda</p>
            <p className="text-sm text-gray-600">
              No editor, clique em{" "}
              <span className="text-gray-400 font-medium">Publicar</span> para gerar um link.
            </p>
            <a href="/" className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Ir para o editor →
            </a>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-white font-semibold text-lg">
                {dashboards.length}{" "}
                {dashboards.length === 1 ? "dashboard publicado" : "dashboards publicados"}
              </h1>
            </div>

            <div className="grid gap-3">
              {dashboards.map((d) => (
                <div
                  key={d.id}
                  className="group flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-5 py-4 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-blue-500/10 rounded-lg p-2.5 shrink-0">
                      <BarChart2 size={16} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{d.title}</p>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {formatDate(d.savedAt)}
                        <span className="text-gray-700 mx-1">·</span>
                        <span className="text-gray-600 font-mono">{d.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <button
                      onClick={() => handleCopy(d.id)}
                      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <Link size={12} />
                      {copiedId === d.id ? "Copiado!" : "Copiar link"}
                    </button>
                    <a
                      href={`/preview/${d.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <ExternalLink size={12} />
                      Abrir
                    </a>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
