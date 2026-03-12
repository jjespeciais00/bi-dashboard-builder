// components/blocks/ImageBlock.tsx
"use client";

import { useRef, useCallback } from "react";
import { ImageIcon, Upload } from "lucide-react";
import type { ImageBlockProps } from "@/types";

interface Props extends ImageBlockProps {
  /** Presente apenas no editor — permite persistir o src nas props do bloco */
  onPropsChange?: (patch: Partial<ImageBlockProps>) => void;
}

export function ImageBlock({ src, alt, caption, fit, rounded, onPropsChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onPropsChange?.({ src: result });
    };
    reader.readAsDataURL(file);
  }, [onPropsChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const borderRadius = rounded === "true" ? "rounded-xl" : "rounded-none";

  if (!src) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-100 border-2 border-dashed border-gray-300 ${borderRadius} cursor-pointer hover:bg-gray-50 transition-colors`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => onPropsChange && inputRef.current?.click()}
      >
        <ImageIcon size={28} className="text-gray-400 opacity-60" />
        {onPropsChange ? (
          <>
            <p className="text-xs text-gray-400">Arraste uma imagem ou clique</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            />
          </>
        ) : (
          <p className="text-xs text-gray-400">Nenhuma imagem</p>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden ${borderRadius}`}>
      <div className="flex-1 relative min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full"
          style={{ objectFit: fit }}
        />
        {/* Re-upload overlay no editor */}
        {onPropsChange && (
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity"
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex items-center gap-2 bg-white/90 rounded-lg px-3 py-1.5">
              <Upload size={12} className="text-gray-700" />
              <span className="text-xs text-gray-700 font-medium">Trocar imagem</span>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            />
          </div>
        )}
      </div>
      {caption && (
        <p className="text-xs text-gray-500 text-center px-2 py-1.5 bg-white shrink-0">{caption}</p>
      )}
    </div>
  );
}
