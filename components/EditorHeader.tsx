// components/EditorHeader.tsx
"use client";

import {
  LayoutDashboard, Eye, Pencil, Trash2, Save, Share2, BookOpen,
} from "lucide-react";
import type { EditorMode } from "@/types";

interface EditorHeaderProps {
  mode: EditorMode;
  onToggleMode: () => void;
  onSave: () => void;
  onClear: () => void;
  onPublish: () => void;
  isSaved: boolean;
}

export function EditorHeader({
  mode, onToggleMode, onSave, onClear, onPublish, isSaved,
}: EditorHeaderProps) {
  const isPreview = mode === "preview";

  return (
    <header className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-5 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500 rounded-md p-1.5">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            BI Builder
          </span>
        </div>

        <span className="text-gray-800 text-sm">|</span>

        <a
          href="/dashboards"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <BookOpen size={12} />
          Meus dashboards
        </a>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            isPreview
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-blue-500/15 text-blue-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPreview ? "bg-emerald-400" : "bg-blue-400"
            }`}
          />
          {isPreview ? "Preview" : "Editor"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isSaved && !isPreview && (
          <span className="text-xs text-gray-500 mr-1 select-none">✓ Salvo</span>
        )}

        {!isPreview && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={13} />
            Limpar
          </button>
        )}

        {!isPreview && (
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Save size={13} />
            Salvar
          </button>
        )}

        {!isPreview && (
          <button
            onClick={onPublish}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Share2 size={13} />
            Publicar
          </button>
        )}

        <button
          onClick={onToggleMode}
          className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
            isPreview
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {isPreview ? (
            <><Pencil size={13} /> Editar</>
          ) : (
            <><Eye size={13} /> Preview</>
          )}
        </button>
      </div>
    </header>
  );
}
