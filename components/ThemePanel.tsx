// components/ThemePanel.tsx
"use client";

import { X, RotateCcw } from "lucide-react";
import type { Theme } from "@/lib/theme";

interface ThemePanelProps {
  theme: Theme;
  onUpdate: (updater: Partial<Theme>) => void;
  onReset: () => void;
  onClose: () => void;
}

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ColorRow({ label, value, onChange }: ColorRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-400 flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-500 w-[68px] text-right">
          {value}
        </span>
        <label className="relative cursor-pointer">
          <span
            className="block w-7 h-7 rounded-md border-2 border-gray-700 shadow-sm transition-transform hover:scale-110"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  );
}

export function ThemePanel({ theme, onUpdate, onReset, onClose }: ThemePanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[998]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-14 bottom-0 z-[999] w-72 bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <p className="text-white text-sm font-semibold">Tema</p>
            <p className="text-gray-500 text-xs mt-0.5">Personalize as cores do dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Colors */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">

          {/* Layout */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Layout
            </p>
            <ColorRow
              label="Fundo do dashboard"
              value={theme.background}
              onChange={(v) => onUpdate({ background: v })}
            />
            <ColorRow
              label="Header / menu"
              value={theme.header}
              onChange={(v) => onUpdate({ header: v })}
            />
          </section>

          {/* Charts */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Gráficos
            </p>
            <ColorRow
              label="Cor principal"
              value={theme.chartPrimary}
              onChange={(v) => onUpdate({ chartPrimary: v })}
            />
            <ColorRow
              label="Cor secundária"
              value={theme.chartSecondary}
              onChange={(v) => onUpdate({ chartSecondary: v })}
            />
            <ColorRow
              label="Cor terciária"
              value={theme.chartTertiary}
              onChange={(v) => onUpdate({ chartTertiary: v })}
            />
          </section>

          {/* KPI Cards */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              KPI Cards
            </p>
            <ColorRow
              label="Azul"
              value={theme.kpiBlue}
              onChange={(v) => onUpdate({ kpiBlue: v })}
            />
            <ColorRow
              label="Verde"
              value={theme.kpiGreen}
              onChange={(v) => onUpdate({ kpiGreen: v })}
            />
            <ColorRow
              label="Vermelho"
              value={theme.kpiRed}
              onChange={(v) => onUpdate({ kpiRed: v })}
            />
            <ColorRow
              label="Roxo"
              value={theme.kpiPurple}
              onChange={(v) => onUpdate({ kpiPurple: v })}
            />
            <ColorRow
              label="Laranja"
              value={theme.kpiOrange}
              onChange={(v) => onUpdate({ kpiOrange: v })}
            />
          </section>
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
