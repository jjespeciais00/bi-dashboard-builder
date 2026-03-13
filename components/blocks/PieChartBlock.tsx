// components/blocks/PieChartBlock.tsx
"use client";

import { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { PieChartBlockProps, PieChartDataPoint } from "@/types";
import { ChartWrapper } from "@/components/blocks/ChartWrapper";
import { useFetchData } from "@/lib/fetch-data";
import { parseCsv } from "@/lib/csv-parser";
import { pieChartData } from "@/lib/mock-data";

const COLORS = [
  "var(--theme-chart-1, #3b82f6)",
  "var(--theme-chart-2, #10b981)",
  "var(--theme-chart-3, #f59e0b)",
  "#8b5cf6", "#ef4444", "#06b6d4",
];

export function PieChartBlock({
  title, endpoint, nameKey, valueKey, showLabels, csvData,
}: PieChartBlockProps) {
  const { state, data: fetched } = useFetchData<PieChartDataPoint[]>(endpoint, []);

  const data = useMemo<PieChartDataPoint[]>(() => {
    if (csvData) return parseCsv(csvData) as PieChartDataPoint[];
    if (fetched && fetched.length > 0) return fetched;
    return pieChartData;
  }, [csvData, fetched]);

  const loading = state.status === "loading";
  const error = state.status === "error" ? state.message : null;
  const isMock = !csvData && (!fetched || fetched.length === 0);

  const renderLabel = showLabels === "true"
    ? ({ name, percent }: { name: string; percent: number }) =>
        `${name} ${(percent * 100).toFixed(0)}%`
    : undefined;

  return (
    <ChartWrapper title={title} loading={loading} error={error} isMock={isMock}>
      <div className="flex-1 min-h-0 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey={valueKey} nameKey={nameKey}
              cx="50%" cy="50%" outerRadius="70%" innerRadius="35%"
              label={renderLabel} labelLine={showLabels === "true"}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
