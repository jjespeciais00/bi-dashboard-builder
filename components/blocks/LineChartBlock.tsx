// components/blocks/LineChartBlock.tsx
"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { LineChartBlockProps, LineChartDataPoint } from "@/types";
import { ChartWrapper } from "@/components/blocks/ChartWrapper";
import { useFetchData } from "@/lib/fetch-data";
import { parseCsv } from "@/lib/csv-parser";
import { lineChartData } from "@/lib/mock-data";

const LINE_COLORS = [
  "var(--theme-chart-1, #3b82f6)",
  "var(--theme-chart-2, #10b981)",
  "var(--theme-chart-3, #f59e0b)",
];

export function LineChartBlock({
  title, endpoint, lines, categoryKey, showLegend, csvData,
}: LineChartBlockProps) {
  const { state, data: fetched } = useFetchData<LineChartDataPoint[]>(endpoint, []);

  const data = useMemo<LineChartDataPoint[]>(() => {
    if (csvData) return parseCsv(csvData) as LineChartDataPoint[];
    if (fetched && fetched.length > 0) return fetched;
    return lineChartData;
  }, [csvData, fetched]);

  const loading = state.status === "loading";
  const error = state.status === "error" ? state.message : null;
  const isMock = !csvData && (!fetched || fetched.length === 0);
  const lineKeys = lines.split(",").map((l) => l.trim()).filter(Boolean);

  return (
    <ChartWrapper title={title} loading={loading} error={error} isMock={isMock}>
      <div className="flex-1 min-h-0 px-2 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            {showLegend === "true" && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {lineKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
