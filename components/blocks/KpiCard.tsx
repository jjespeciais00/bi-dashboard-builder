// components/blocks/KpiCard.tsx
"use client";

import type { KpiCardProps } from "@/types";

const colorMap: Record<KpiCardProps["color"], string> = {
  blue:   "bg-blue-50   border-blue-200   text-blue-700",
  green:  "bg-green-50  border-green-200  text-green-700",
  red:    "bg-red-50    border-red-200    text-red-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
};

const valueColorMap: Record<KpiCardProps["color"], string> = {
  blue:   "text-blue-900",
  green:  "text-green-900",
  red:    "text-red-900",
  purple: "text-purple-900",
  orange: "text-orange-900",
};

export function KpiCard({ title, value, color }: KpiCardProps) {
  return (
    <div className={`rounded-xl border-2 p-6 flex flex-col gap-2 ${colorMap[color]}`}>
      <span className="text-sm font-medium uppercase tracking-widest opacity-70">
        {title}
      </span>
      <span className={`text-4xl font-bold tabular-nums ${valueColorMap[color]}`}>
        {value}
      </span>
    </div>
  );
}
