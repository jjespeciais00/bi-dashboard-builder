// components/blocks/BarChartBlock.tsx
"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { BarChartBlockProps, BarChartDataPoint } from "@/types";
import { ChartWrapper } from "@/components/blocks/ChartWrapper";
import { useFetchData } from "@/lib/fetch-data";
import { parseCsv } from "@/lib/csv-parser";
import { barChartData } from "@/lib/mock-data";

export function BarChartBlock({
  title, xAxisLabel, yAxisLabel, endpoint, dataKey, categoryKey, csvData,
}: BarChartBlockProps) {
  const { data: fetched, loading, error } = useFetchData<BarChartDataPoint>(endpoint);

  const data = useMemo<BarChartDataPoint[]>(() => {
    if (csvData) return parseCsv(csvData) as BarChartDataPoint[];
    if (fetched && fetched.length > 0) return fetched;
    return barChartData;
  }, [csvData, fetched]);

  const isMock = !csvData && (!fetched || fetched.length === 0);

  return (
    <ChartWrapper title={title} loading={loading} error={error} isMock={isMock}>
      <div className="flex-1 min-h-0 px-2 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 11 }}
              label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -2, fontSize: 11 } : undefined} />
            <YAxis tick={{ fontSize: 11 }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", fontSize: 11 } : undefined} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey={dataKey} fill="var(--theme-chart-1, #3b82f6)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
