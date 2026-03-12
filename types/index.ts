// types/index.ts

export interface KpiCardProps {
  title: string;
  value: string;
  color: "blue" | "green" | "red" | "purple" | "orange";
}

export interface BarChartBlockProps {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  endpoint: string;
  dataKey: string;
  categoryKey: string;
}

export interface LineChartBlockProps {
  title: string;
  showLegend: "true" | "false";
  endpoint: string;
  lines: string;
  categoryKey: string;
}

export interface PieChartBlockProps {
  title: string;
  showLabels: "true" | "false";
  endpoint: string;
  valueKey: string;
  nameKey: string;
}

export interface GridLayoutProps {
  columns: 2 | 3 | 4;
}

export interface TextBlockProps {
  text: string;
  variant: "heading" | "subheading" | "body" | "label";
  align: "left" | "center" | "right";
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  caption: string;
  fit: "contain" | "cover" | "fill";
  rounded: "true" | "false";
  height: number;
}

export type EditorMode = "edit" | "preview";

export interface BarChartDataPoint {
  [key: string]: string | number;
}

export interface LineChartDataPoint {
  [key: string]: string | number;
}

export interface PieChartDataPoint {
  [key: string]: string | number;
}
