// components/blocks/LineChartBlock.tsx
"use client";

import { useState, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { lineChartData } from "@/lib/mock-data";
import { useFetchData, useCsvData } from "@/lib/fetch-data";
import { ChartWrapper } from "./ChartWrapper";
import { CsvUploader } from "./CsvUploader";
import type { LineChartBlockProps } from "@/types";

const LINE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export function LineChartBlock({
  title, showLegend, endpoint, lines, categoryKey,
}: LineChartBlockProps) {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [csvFilename, setCsvFilename] = useState<string | null>(null);

  const localData = useCsvData(csvContent, []);
  const { state, data: remoteData } = useFetchData(endpoint, lineChartData);

  const data = csvContent ? localData : remoteData;
  const isLoading = !csvContent && state.status === "loading";
  const error = !csvContent && state.status === "error" ? state.message : null;
  const hasData = csvContent ? localData.length > 0 : !!endpoint;

  const legendVisible = showLegend === "true";
  const activeCategory = categoryKey || "mes";
  const lineKeys = lines
    ? lines.split(",").map((k) => k.trim()).filter(Boolean)
    : ["receita", "meta"];

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
          <LineChart
            data={data as Record<string, string | number>[]}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={activeCategory} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
            {legendVisible && <Legend />}
            {lineKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
