// components/DashboardsGallery.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  listPublishedDashboards, deletePublishedDashboard,
  loadPublishedDashboard, saveDashboard,
  type DashboardMeta,
} from "@/lib/storage";
import {
  LayoutDashboard, Trash2, ExternalLink, Copy, ArrowLeft,
  Clock, BarChart2, CheckCircle2,
} from "lucide-react";

export function DashboardsGallery() {
  const [list, setList] = useState<DashboardMeta[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setList(listPublishedDashboards().reverse()); // newest first
    setOrigin(window.location.origin);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("Remover este dashboard publicado?")) return;
    deletePublishedDashboard(id);
    setList((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleCopyLink = useCallback((id: string) => {
    const link = `${origin}/preview/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, [origin]);

  const handleOpenInEditor = useCallback((id: string) => {
    const data = loadPublishedDashboard(id);
    if (!data) return;
    saveDashboard(data);
    window.location.href = "/";
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-md p-1.5">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm">BI Builder</span>
          <span className="text-gray-700 text-sm">|</span>
          <span className="text-gray-400 text-sm">Meus Dashboards</span>
        </div>
        <a
          href="/"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={12} />
          Voltar ao editor
        </a>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-600">
            <BarChart2 size={40} className="opacity-30" />
            <p className="text-sm font-medium text-gray-400">Nenhum dashboard publicado ainda</p>
            <a
              href="/"
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4"
            >
              Criar meu primeiro dashboard →
            </a>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-white">
                {list.length} dashboard{list.length !== 1 ? "s" : ""} publicado{list.length !== 1 ? "s" : ""}
              </h1>
              <a href="/" className="text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 transition-colors font-medium">
                + Novo dashboard
              </a>
            </div>

            <div className="flex flex-col gap-3">
              {list.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-5 py-4 transition-colors"
                >
                  {/* Icon */}
                  <div className="bg-blue-500/15 rounded-lg p-2.5 shrink-0">
                    <BarChart2 size={18} className="text-blue-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{d.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={11} className="text-gray-600" />
                      <span className="text-xs text-gray-500">{formatDate(d.savedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenInEditor(d.id)}
                      className="text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Editar
                    </button>

                    <a
                      href={`/preview/${d.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      <ExternalLink size={11} />
                      Abrir
                    </a>

                    <button
                      onClick={() => handleCopyLink(d.id)}
                      className={`flex items-center gap-1 text-xs rounded-lg px-3 py-1.5 transition-colors ${
                        copiedId === d.id
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {copiedId === d.id
                        ? <><CheckCircle2 size={11} /> Copiado!</>
                        : <><Copy size={11} /> Copiar link</>
                      }
                    </button>

                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-gray-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
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
