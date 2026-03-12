// components/EditorHeader.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import {
  LayoutDashboard, Eye, Pencil, Trash2, Save, Share2,
  BookOpen, Palette, Brush, LayoutTemplate, Undo2, Redo2,
} from "lucide-react";
import type { EditorMode } from "@/types";
import type { WhiteLabel } from "@/lib/whitelabel";

interface EditorHeaderProps {
  mode: EditorMode;
  onToggleMode: () => void;
  onSave: () => void;
  onClear: () => void;
  onPublish: () => void;
  onToggleTheme: () => void;
  onToggleWhiteLabel: () => void;
  onOpenTemplates: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaved: boolean;
  themeOpen: boolean;
  whiteLabelOpen: boolean;
  wl: WhiteLabel;
  dashboardName: string;
  onNameChange: (name: string) => void;
}

function InlineName({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = useCallback(() => {
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }, [value]);

  const confirm = useCallback(() => {
    const trimmed = draft.trim() || "Sem título";
    onChange(trimmed);
    setEditing(false);
  }, [draft, onChange]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirm();
    if (e.key === "Escape") setEditing(false);
  }, [confirm]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={confirm}
        onKeyDown={handleKey}
        className="bg-gray-800 border border-blue-500 rounded-md px-2 py-0.5 text-sm text-white outline-none w-44"
        maxLength={60}
      />
    );
  }

  return (
    <button
      onClick={startEdit}
      title="Clique para renomear"
      className="flex items-center gap-1.5 group max-w-44"
    >
      <span className="text-gray-300 text-sm truncate group-hover:text-white transition-colors">
        {value}
      </span>
      <Pencil size={11} className="text-gray-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

export function EditorHeader({
  mode, onToggleMode, onSave, onClear, onPublish,
  onToggleTheme, onToggleWhiteLabel, onOpenTemplates,
  onUndo, onRedo, canUndo, canRedo,
  isSaved, themeOpen, whiteLabelOpen, wl,
  dashboardName, onNameChange,
}: EditorHeaderProps) {
  const isPreview = mode === "preview";

  return (
    <header
      className="h-14 border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-50 gap-2"
      style={{ backgroundColor: "var(--theme-header, #030712)" }}
    >
      {/* Left — logo + name */}
      <div className="flex items-center gap-3 shrink-0 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          {wl.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wl.logoSrc} alt="logo" className="h-7 w-7 object-contain rounded shrink-0" />
          ) : (
            <div className="bg-blue-500 rounded-md p-1.5 shrink-0">
              <LayoutDashboard size={16} className="text-white" />
            </div>
          )}
          <span className="text-white font-semibold text-sm tracking-tight hidden sm:block">
            {wl.appName || "BI Builder"}
          </span>
        </div>

        <span className="text-gray-800 hidden md:block">|</span>

        {/* Dashboard name — editable inline */}
        {!isPreview && (
          <InlineName value={dashboardName} onChange={onNameChange} />
        )}

        {/* Saved indicator */}
        {isSaved && !isPreview && (
          <span className="hidden lg:flex items-center gap-1 text-xs text-emerald-500">
            ✓ Salvo
          </span>
        )}
      </div>

      {/* Center — undo/redo + gallery */}
      <div className="flex items-center gap-1 shrink-0">
        {!isPreview && (
          <>
            <button onClick={onUndo} disabled={!canUndo} title="Desfazer (Ctrl+Z)"
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <Undo2 size={14} />
            </button>
            <button onClick={onRedo} disabled={!canRedo} title="Refazer (Ctrl+Y)"
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <Redo2 size={14} />
            </button>
          </>
        )}
        <a href="/dashboards" className="hidden lg:flex items-center gap-1.5 p-2 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
          <BookOpen size={13} />
        </a>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!isPreview && (
          <button onClick={onOpenTemplates}
            className="hidden sm:flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <LayoutTemplate size={13} />
            <span className="hidden md:block">Templates</span>
          </button>
        )}

        {!isPreview && (
          <button onClick={onClear}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 size={13} />
            <span className="hidden md:block">Limpar</span>
          </button>
        )}

        {!isPreview && (
          <button onClick={onSave}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <Save size={13} />
            <span className="hidden md:block">Salvar</span>
          </button>
        )}

        {!isPreview && (
          <button onClick={onPublish}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <Share2 size={13} />
            <span className="hidden md:block">Publicar</span>
          </button>
        )}

        <button onClick={onToggleTheme}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${themeOpen ? "bg-purple-500/20 text-purple-400" : "text-gray-300 hover:text-white hover:bg-gray-800"}`}>
          <Palette size={13} />
          <span className="hidden md:block">Tema</span>
        </button>

        <button onClick={onToggleWhiteLabel}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${whiteLabelOpen ? "bg-pink-500/20 text-pink-400" : "text-gray-300 hover:text-white hover:bg-gray-800"}`}>
          <Brush size={13} />
          <span className="hidden md:block">Marca</span>
        </button>

        <button onClick={onToggleMode}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${isPreview ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-blue-600 text-white hover:bg-blue-500"}`}>
          {isPreview
            ? <><Pencil size={13} /><span className="hidden sm:block ml-1">Editar</span></>
            : <><Eye size={13} /><span className="hidden sm:block ml-1">Preview</span></>
          }
        </button>
      </div>
    </header>
  );
}
