// components/blocks/ImageBlock.tsx
"use client";

import { useRef, useCallback, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import type { ImageBlockProps } from "@/types";

export function ImageBlock({ alt, caption, fit, rounded, height }: ImageBlockProps) {
  const [preview, setPreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isRounded = rounded === "true";

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) setPreview(result);
    };
    reader.readAsDataURL(file);
  }, []);

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

  if (!preview) {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        style={{ height: `${height}px` }}
      >
        <div className="bg-gray-100 rounded-full p-3">
          <ImageIcon size={20} className="text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Arraste uma imagem</p>
          <p className="text-xs text-gray-400 mt-0.5">
            ou{" "}
            <span className="text-blue-500 underline">clique para selecionar</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">PNG, JPG, SVG, WEBP</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <figure className="flex flex-col gap-2">
      <div
        className="relative group overflow-hidden bg-gray-100"
        style={{ height: `${height}px`, borderRadius: isRounded ? "12px" : "4px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt={alt || "Imagem do dashboard"}
          className="w-full h-full transition-transform duration-200 group-hover:scale-[1.01]"
          style={{ objectFit: fit }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => setPreview("")}
            className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
            title="Remover imagem"
          >
            <X size={13} className="text-gray-700" />
          </button>
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-gray-400 text-center px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
