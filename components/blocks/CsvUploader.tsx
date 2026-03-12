// components/blocks/CsvUploader.tsx
"use client";

import { useRef, useCallback } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";

interface CsvUploaderProps {
  /** CSV já carregado (vindo das props persistidas) */
  value: string;
  /** Chamado com o conteúdo bruto do CSV ao fazer upload */
  onChange: (csvText: string) => void;
  onClear: () => void;
}

export function CsvUploader({ value, onChange, onClear }: CsvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) onChange(text);
    };
    reader.readAsText(file, "UTF-8");
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = "";
  }, [readFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }, [readFile]);

  if (value) {
    const lines = value.trim().split("\n").length - 1;
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
        <span className="text-xs text-emerald-300 flex-1 truncate">
          CSV carregado — {lines} linha{lines !== 1 ? "s" : ""}
        </span>
        <button onClick={onClear} className="text-emerald-500 hover:text-red-400 transition-colors">
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="flex items-center gap-2 border-2 border-dashed border-gray-600 rounded-lg px-3 py-2.5 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
    >
      <Upload size={13} className="text-gray-500 shrink-0" />
      <span className="text-xs text-gray-500">
        Arraste um <span className="text-blue-400">.csv</span> ou clique para buscar
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
