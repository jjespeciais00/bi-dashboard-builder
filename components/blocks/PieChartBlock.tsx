// components/blocks/PieChartBlock.tsx
"use client";

import { useState, useCallback } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { pieChartData } from "@/lib/mock-data";
import { useFetchData, useCsvData } from "@/lib/fetch-data";
import { ChartWrapper } from "./ChartWrapper";
import { CsvUploader } from "./CsvUploader";
import type { PieChartBlockProps } from "@/types";

const FALLBACK_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export function PieChartBlock({
  title, showLabels, endpoint, valueKey, nameKey,
}: PieChartBlockProps) {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [csvFilename, setCsvFilename] = useState<string | null>(null);

  const localData = useCsvData(csvContent, []);
  const { state, data: remoteData } = useFetchData(endpoint, pieChartData);

  const data = csvContent ? localData : remoteData;
  const isLoading = !csvContent && state.status === "loading";
  const error = !csvContent && state.status === "error" ? state.message : null;
  const hasData = csvContent ? localData.length > 0 : !!endpoint;

  const labelsVisible = showLabels === "true";
  const activeValue = valueKey || "value";
  const activeName = nameKey || "name";

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
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data as Record<string, string | number>[]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey={activeValue}
              nameKey={activeName}
              label={labelsVisible ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
              labelLine={labelsVisible}
            >
              {(data as Record<string, string | number>[]).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={(entry.fill as string) ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              formatter={(value: number) => [value.toLocaleString("pt-BR"), "Valor"]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
