// components/blocks/CsvUploader.tsx
"use client";

import { useRef, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";

interface CsvUploaderProps {
  onData: (content: string, filename: string) => void;
  onClear: () => void;
  filename: string | null;
}

export function CsvUploader({ onData, onClear, filename }: CsvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) onData(content, file.name);
      };
      reader.readAsText(file, "UTF-8");
    },
    [onData]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (filename) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
        <FileText size={13} className="text-emerald-600 shrink-0" />
        <span className="text-xs text-emerald-700 truncate flex-1 font-medium">
          {filename}
        </span>
        <button
          onClick={onClear}
          className="shrink-0 text-emerald-500 hover:text-red-500 transition-colors"
          title="Remover arquivo"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
    >
      <Upload size={16} className="text-gray-400" />
      <p className="text-xs text-gray-500 text-center">
        Arraste um <span className="font-medium text-gray-700">.csv</span> ou{" "}
        <span className="text-blue-500 underline">clique para selecionar</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
