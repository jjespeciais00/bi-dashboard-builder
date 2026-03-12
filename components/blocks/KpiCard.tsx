// components/blocks/KpiCard.tsx
"use client";

import type { KpiCardProps } from "@/types";

const varMap: Record<KpiCardProps["color"], string> = {
  blue:   "--theme-kpi-blue",
  green:  "--theme-kpi-green",
  red:    "--theme-kpi-red",
  purple: "--theme-kpi-purple",
  orange: "--theme-kpi-orange",
};

export function KpiCard({ title, value, color }: KpiCardProps) {
  const cssVar = varMap[color];

  return (
    <div
      className="rounded-xl border-2 p-6 flex flex-col gap-2 transition-colors"
      style={{
        backgroundColor: `color-mix(in srgb, var(${cssVar}, #3b82f6) 10%, white)`,
        borderColor: `color-mix(in srgb, var(${cssVar}, #3b82f6) 30%, white)`,
      }}
    >
      <span
        className="text-sm font-medium uppercase tracking-widest opacity-70"
        style={{ color: `var(${cssVar}, #3b82f6)` }}
      >
        {title}
      </span>
      <span
        className="text-4xl font-bold tabular-nums"
        style={{ color: `color-mix(in srgb, var(${cssVar}, #3b82f6) 80%, black)` }}
      >
        {value}
      </span>
    </div>
  );
}
