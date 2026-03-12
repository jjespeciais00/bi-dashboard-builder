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
  csvData?: string; // base64 CSV — persiste no localStorage com o dashboard
}

export interface LineChartBlockProps {
  title: string;
  showLegend: "true" | "false";
  endpoint: string;
  lines: string;
  categoryKey: string;
  csvData?: string;
}

export interface PieChartBlockProps {
  title: string;
  showLabels: "true" | "false";
  endpoint: string;
  valueKey: string;
  nameKey: string;
  csvData?: string;
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
}

// ── Grid ──────────────────────────────────────────────────────────────────────

export type BlockType =
  | "KpiCard"
  | "BarChartBlock"
  | "LineChartBlock"
  | "PieChartBlock"
  | "TextBlock"
  | "ImageBlock";

export type BlockProps =
  | ({ type: "KpiCard" } & KpiCardProps)
  | ({ type: "BarChartBlock" } & BarChartBlockProps)
  | ({ type: "LineChartBlock" } & LineChartBlockProps)
  | ({ type: "PieChartBlock" } & PieChartBlockProps)
  | ({ type: "TextBlock" } & TextBlockProps)
  | ({ type: "ImageBlock" } & ImageBlockProps);

export interface GridBlock {
  id: string;
  props: BlockProps;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  };
}

export interface DashboardData {
  blocks: GridBlock[];
}

export type EditorMode = "edit" | "preview";

export interface BarChartDataPoint   { [key: string]: string | number; }
export interface LineChartDataPoint  { [key: string]: string | number; }
export interface PieChartDataPoint   { [key: string]: string | number; }
