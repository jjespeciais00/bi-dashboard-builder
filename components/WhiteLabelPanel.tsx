// components/WhiteLabelPanel.tsx
"use client";

import { useRef, useCallback } from "react";
import { X, RotateCcw, Upload, ImageIcon } from "lucide-react";
import type { WhiteLabel } from "@/lib/whitelabel";

interface WhiteLabelPanelProps {
  wl: WhiteLabel;
  onUpdate: (updater: Partial<WhiteLabel>) => void;
  onReset: () => void;
  onClose: () => void;
}

interface ImageUploaderProps {
  label: string;
  hint: string;
  value: string;
  accept: string;
  onChange: (base64: string) => void;
  onClear: () => void;
}

function ImageUploader({ label, hint, value, accept, onChange, onClear }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-gray-400">{label}</span>
      {value ? (
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-6 w-6 object-contain rounded" />
          <span className="text-xs text-gray-400 flex-1 truncate">{hint} carregado</span>
          <button
            onClick={onClear}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 border-2 border-dashed border-gray-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors"
        >
          <ImageIcon size={14} className="text-gray-600 shrink-0" />
          <span className="text-xs text-gray-500">
            Arraste ou <span className="text-purple-400 underline">clique</span> — {hint}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

export function WhiteLabelPanel({ wl, onUpdate, onReset, onClose }: WhiteLabelPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-[998]" onClick={onClose} />
      <div className="fixed right-0 top-14 bottom-0 z-[999] w-72 bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <p className="text-white text-sm font-semibold">White-label</p>
            <p className="text-gray-500 text-xs mt-0.5">Identidade visual do app</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

          {/* App name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Nome da aplicação</label>
            <input
              type="text"
              value={wl.appName}
              onChange={(e) => onUpdate({ appName: e.target.value })}
              placeholder="BI Builder"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
            />
            <p className="text-xs text-gray-600">Aparece no header e na aba do browser</p>
          </div>

          {/* Logo */}
          <ImageUploader
            label="Logo"
            hint="PNG, SVG recomendado"
            value={wl.logoSrc}
            accept="image/*"
            onChange={(v) => onUpdate({ logoSrc: v })}
            onClear={() => onUpdate({ logoSrc: "" })}
          />

          {/* Favicon */}
          <ImageUploader
            label="Favicon"
            hint="ICO, PNG 32×32"
            value={wl.faviconSrc}
            accept="image/*,.ico"
            onChange={(v) => onUpdate({ faviconSrc: v })}
            onClear={() => onUpdate({ faviconSrc: "" })}
          />

          {/* Preview */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Preview</p>
            <div className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 flex items-center gap-2">
              {wl.logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={wl.logoSrc} alt="logo" className="h-5 w-5 object-contain rounded" />
              ) : (
                <div className="bg-blue-500 rounded p-1">
                  <Upload size={10} className="text-white" />
                </div>
              )}
              <span className="text-white text-xs font-semibold">
                {wl.appName || "BI Builder"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-800">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <RotateCcw size={12} />
            Restaurar padrões
          </button>
        </div>
      </div>
    </>
  );
}
