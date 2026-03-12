// components/TemplatesModal.tsx
"use client";

import { X, LayoutTemplate } from "lucide-react";
import { TEMPLATES, type Template } from "@/lib/templates";

interface TemplatesModalProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export function TemplatesModal({ onSelect, onClose }: TemplatesModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/15 rounded-lg p-2">
              <LayoutTemplate size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Templates</h2>
              <p className="text-gray-400 text-xs mt-0.5">Comece com um layout pronto</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Templates grid */}
        <div className="p-6 grid grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="flex flex-col gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50 rounded-xl p-4 text-left transition-all group"
            >
              <span className="text-3xl">{t.icon}</span>
              <div>
                <p className="text-white text-sm font-semibold group-hover:text-blue-400 transition-colors">
                  {t.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{t.description}</p>
              </div>

              {/* Mini preview */}
              <div className="w-full h-16 bg-gray-900 rounded-lg p-2 grid grid-cols-4 grid-rows-2 gap-1">
                {t.data.blocks.slice(0, 6).map((b, i) => (
                  <div
                    key={i}
                    className="bg-gray-700 rounded"
                    style={{
                      gridColumn: `span ${Math.min(b.layout.w > 6 ? 4 : b.layout.w > 3 ? 2 : 1, 4)}`,
                    }}
                  />
                ))}
              </div>
            </button>
          ))}

          {/* Blank option */}
          <button
            onClick={() => onSelect({ id: "blank", name: "Em branco", description: "", icon: "", data: { blocks: [] } })}
            className="flex flex-col items-center justify-center gap-2 bg-gray-800/50 border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-xl p-4 text-center transition-all group"
          >
            <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity">＋</span>
            <p className="text-gray-500 text-xs font-medium group-hover:text-gray-300 transition-colors">
              Em branco
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
