// components/blocks/BarChartBlock.tsx
"use client";

import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { barChartData } from "@/lib/mock-data";
import { useFetchData, useCsvData } from "@/lib/fetch-data";
import { ChartWrapper } from "./ChartWrapper";
import { CsvUploader } from "./CsvUploader";
import type { BarChartBlockProps } from "@/types";

export function BarChartBlock({
  title, xAxisLabel, yAxisLabel, endpoint, dataKey, categoryKey,
}: BarChartBlockProps) {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [csvFilename, setCsvFilename] = useState<string | null>(null);

  const localData = useCsvData(csvContent, []);
  const { state, data: remoteData } = useFetchData(endpoint, barChartData);

  const data = csvContent ? localData : remoteData;
  const isLoading = !csvContent && state.status === "loading";
  const error = !csvContent && state.status === "error" ? state.message : null;
  const hasData = csvContent ? localData.length > 0 : !!endpoint;

  const activeCategory = categoryKey || "mes";
  const activeDataKey = dataKey || "vendas";

  const handleCsvData = useCallback((content: string, filename: string) => {
    setCsvContent(content);
    setCsvFilename(filename);
  }, []);

  const handleCsvClear = useCallback(() => {
    setCsvContent(null);
    setCsvFilename(null);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <CsvUploader onData={handleCsvData} onClear={handleCsvClear} filename={csvFilename} />
      <ChartWrapper title={title} isLoading={isLoading} error={error} hasEndpoint={hasData}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data as Record<string, string | number>[]}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={activeCategory}
              label={{ value: xAxisLabel, position: "insideBottom", offset: -2 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", offset: 8 }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
            <Bar dataKey={activeDataKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
