// components/BlocksPanel.tsx
"use client";

import { useCallback } from "react";
import {
  BarChart2, TrendingUp, PieChart, CreditCard, Type, Image,
} from "lucide-react";
import type { DashboardData, GridBlock, BlockProps } from "@/types";

interface BlocksPanelProps {
  onAdd: (block: GridBlock) => void;
  data: DashboardData;
}

interface BlockDef {
  type: BlockProps["type"];
  label: string;
  icon: React.ReactNode;
  description: string;
  defaultProps: BlockProps;
  defaultLayout: GridBlock["layout"];
}

const BLOCK_CATALOG: BlockDef[] = [
  {
    type: "KpiCard",
    label: "KPI Card",
    icon: <CreditCard size={16} />,
    description: "Métrica em destaque",
    defaultProps: {
      type: "KpiCard",
      title: "Receita Total",
      value: "R$ 128.400",
      color: "blue",
    },
    defaultLayout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
  },
  {
    type: "BarChartBlock",
    label: "Gráfico de Barras",
    icon: <BarChart2 size={16} />,
    description: "Comparação entre categorias",
    defaultProps: {
      type: "BarChartBlock",
      title: "Vendas Mensais",
      xAxisLabel: "Mês",
      yAxisLabel: "Vendas",
      categoryKey: "mes",
      dataKey: "vendas",
      endpoint: "",
    },
    defaultLayout: { x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 4 },
  },
  {
    type: "LineChartBlock",
    label: "Gráfico de Linha",
    icon: <TrendingUp size={16} />,
    description: "Tendências ao longo do tempo",
    defaultProps: {
      type: "LineChartBlock",
      title: "Receita vs Meta",
      categoryKey: "mes",
      lines: "receita,meta",
      showLegend: "true",
      endpoint: "",
    },
    defaultLayout: { x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 4 },
  },
  {
    type: "PieChartBlock",
    label: "Gráfico de Pizza",
    icon: <PieChart size={16} />,
    description: "Distribuição proporcional",
    defaultProps: {
      type: "PieChartBlock",
      title: "Vendas por Região",
      nameKey: "name",
      valueKey: "value",
      showLabels: "false",
      endpoint: "",
    },
    defaultLayout: { x: 0, y: 0, w: 4, h: 6, minW: 3, minH: 4 },
  },
  {
    type: "TextBlock",
    label: "Texto",
    icon: <Type size={16} />,
    description: "Títulos e anotações",
    defaultProps: {
      type: "TextBlock",
      text: "Título do Dashboard",
      variant: "heading",
      align: "left",
    },
    defaultLayout: { x: 0, y: 0, w: 6, h: 2, minW: 2, minH: 1 },
  },
  {
    type: "ImageBlock",
    label: "Imagem",
    icon: <Image size={16} />,
    description: "Logo ou screenshot",
    defaultProps: {
      type: "ImageBlock",
      src: "",
      alt: "Imagem",
      caption: "",
      fit: "contain",
      rounded: "true",
    },
    defaultLayout: { x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
  },
];

function generateId(): string {
  return `block_${Math.random().toString(36).slice(2, 9)}`;
}

function findFreeY(data: DashboardData): number {
  if (data.blocks.length === 0) return 0;
  return Math.max(...data.blocks.map((b) => b.layout.y + b.layout.h));
}

export function BlocksPanel({ onAdd, data }: BlocksPanelProps) {
  const handleAdd = useCallback((def: BlockDef) => {
    const freeY = findFreeY(data);
    const block: GridBlock = {
      id: generateId(),
      props: def.defaultProps,
      layout: { ...def.defaultLayout, y: freeY },
    };
    onAdd(block);
  }, [data, onAdd]);

  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Blocos
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5">
        {BLOCK_CATALOG.map((def) => (
          <button
            key={def.type}
            onClick={() => handleAdd(def)}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-gray-800 active:bg-gray-700 transition-colors group"
          >
            <span className="text-gray-500 group-hover:text-blue-400 transition-colors shrink-0">
              {def.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                {def.label}
              </p>
              <p className="text-xs text-gray-600 truncate">{def.description}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
