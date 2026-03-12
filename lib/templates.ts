// lib/templates.ts
import type { DashboardData } from "@/types";

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: DashboardData;
}

export const TEMPLATES: Template[] = [
  {
    id: "executivo",
    name: "Executivo",
    description: "KPIs no topo + barras + linha de tendência",
    icon: "📊",
    data: {
      blocks: [
        {
          id: "t1_title",
          props: { type: "TextBlock", text: "Dashboard Executivo", variant: "heading", align: "left" },
          layout: { x: 0, y: 0, w: 12, h: 2, minW: 2, minH: 1 },
        },
        {
          id: "t1_kpi1",
          props: { type: "KpiCard", title: "Receita Total", value: "R$ 128.400", color: "blue" },
          layout: { x: 0, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t1_kpi2",
          props: { type: "KpiCard", title: "Novos Clientes", value: "348", color: "green" },
          layout: { x: 3, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t1_kpi3",
          props: { type: "KpiCard", title: "Ticket Médio", value: "R$ 369", color: "purple" },
          layout: { x: 6, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t1_kpi4",
          props: { type: "KpiCard", title: "Churn", value: "2,4%", color: "red" },
          layout: { x: 9, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t1_bar",
          props: {
            type: "BarChartBlock",
            title: "Vendas por Mês",
            xAxisLabel: "Mês",
            yAxisLabel: "Vendas",
            categoryKey: "mes",
            dataKey: "vendas",
            endpoint: "",
          },
          layout: { x: 0, y: 5, w: 6, h: 6, minW: 3, minH: 4 },
        },
        {
          id: "t1_line",
          props: {
            type: "LineChartBlock",
            title: "Tendência de Crescimento",
            categoryKey: "mes",
            lines: "receita,meta",
            showLegend: "true",
            endpoint: "",
          },
          layout: { x: 6, y: 5, w: 6, h: 6, minW: 3, minH: 4 },
        },
      ],
    },
  },
  {
    id: "vendas",
    name: "Vendas",
    description: "Pizza por região + barras mensais + 3 KPIs",
    icon: "💰",
    data: {
      blocks: [
        {
          id: "t2_title",
          props: { type: "TextBlock", text: "Painel de Vendas", variant: "heading", align: "left" },
          layout: { x: 0, y: 0, w: 12, h: 2, minW: 2, minH: 1 },
        },
        {
          id: "t2_kpi1",
          props: { type: "KpiCard", title: "Total de Vendas", value: "R$ 284.900", color: "blue" },
          layout: { x: 0, y: 2, w: 4, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t2_kpi2",
          props: { type: "KpiCard", title: "Meta do Mês", value: "R$ 300.000", color: "orange" },
          layout: { x: 4, y: 2, w: 4, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t2_kpi3",
          props: { type: "KpiCard", title: "Atingimento", value: "94,9%", color: "green" },
          layout: { x: 8, y: 2, w: 4, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t2_pie",
          props: {
            type: "PieChartBlock",
            title: "Vendas por Região",
            nameKey: "name",
            valueKey: "value",
            showLabels: "true",
            endpoint: "",
          },
          layout: { x: 0, y: 5, w: 5, h: 7, minW: 3, minH: 4 },
        },
        {
          id: "t2_bar",
          props: {
            type: "BarChartBlock",
            title: "Vendas Mensais",
            xAxisLabel: "Mês",
            yAxisLabel: "R$",
            categoryKey: "mes",
            dataKey: "vendas",
            endpoint: "",
          },
          layout: { x: 5, y: 5, w: 7, h: 7, minW: 3, minH: 4 },
        },
      ],
    },
  },
  {
    id: "financeiro",
    name: "Financeiro",
    description: "Receita vs meta + KPIs de margem",
    icon: "📈",
    data: {
      blocks: [
        {
          id: "t3_title",
          props: { type: "TextBlock", text: "Relatório Financeiro", variant: "heading", align: "left" },
          layout: { x: 0, y: 0, w: 9, h: 2, minW: 2, minH: 1 },
        },
        {
          id: "t3_subtitle",
          props: { type: "TextBlock", text: "Acumulado do ano", variant: "label", align: "right" },
          layout: { x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
        },
        {
          id: "t3_kpi1",
          props: { type: "KpiCard", title: "Receita Bruta", value: "R$ 1.284.000", color: "blue" },
          layout: { x: 0, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t3_kpi2",
          props: { type: "KpiCard", title: "Margem Bruta", value: "42,3%", color: "green" },
          layout: { x: 3, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t3_kpi3",
          props: { type: "KpiCard", title: "EBITDA", value: "R$ 312.000", color: "purple" },
          layout: { x: 6, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t3_kpi4",
          props: { type: "KpiCard", title: "Inadimplência", value: "1,8%", color: "red" },
          layout: { x: 9, y: 2, w: 3, h: 3, minW: 2, minH: 2 },
        },
        {
          id: "t3_line",
          props: {
            type: "LineChartBlock",
            title: "Receita vs Meta",
            categoryKey: "mes",
            lines: "receita,meta",
            showLegend: "true",
            endpoint: "",
          },
          layout: { x: 0, y: 5, w: 8, h: 6, minW: 3, minH: 4 },
        },
        {
          id: "t3_pie",
          props: {
            type: "PieChartBlock",
            title: "Composição da Receita",
            nameKey: "name",
            valueKey: "value",
            showLabels: "false",
            endpoint: "",
          },
          layout: { x: 8, y: 5, w: 4, h: 6, minW: 3, minH: 4 },
        },
      ],
    },
  },
];
