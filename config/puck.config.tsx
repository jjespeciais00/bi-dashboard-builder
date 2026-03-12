// config/puck.config.tsx
import type { Config } from "@measured/puck";
import { KpiCard } from "@/components/blocks/KpiCard";
import { BarChartBlock } from "@/components/blocks/BarChartBlock";
import { LineChartBlock } from "@/components/blocks/LineChartBlock";
import { PieChartBlock } from "@/components/blocks/PieChartBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { GridLayout } from "@/components/blocks/GridLayout";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import type {
  KpiCardProps,
  BarChartBlockProps,
  LineChartBlockProps,
  PieChartBlockProps,
  TextBlockProps,
  GridLayoutProps,
  ImageBlockProps,
} from "@/types";

type BlockMap = {
  KpiCard: KpiCardProps;
  BarChartBlock: BarChartBlockProps;
  LineChartBlock: LineChartBlockProps;
  PieChartBlock: PieChartBlockProps;
  TextBlock: TextBlockProps;
  GridLayout: GridLayoutProps;
  ImageBlock: ImageBlockProps;
};

export const puckConfig: Config<BlockMap> = {
  root: {
    render: ({ children }) => (
      <div className="min-h-screen bg-gray-50 p-6">{children}</div>
    ),
  },

  components: {
    TextBlock: {
      label: "Texto",
      fields: {
        text:    { type: "textarea", label: "Conteúdo" },
        variant: {
          type: "select",
          label: "Estilo",
          options: [
            { label: "Título",    value: "heading"    },
            { label: "Subtítulo", value: "subheading" },
            { label: "Corpo",     value: "body"       },
            { label: "Label",     value: "label"      },
          ],
        },
        align: {
          type: "select",
          label: "Alinhamento",
          options: [
            { label: "Esquerda", value: "left"   },
            { label: "Centro",   value: "center" },
            { label: "Direita",  value: "right"  },
          ],
        },
      },
      defaultProps: { text: "Meu Dashboard", variant: "heading", align: "left" },
      render: (props) => <TextBlock {...props} />,
    },

    ImageBlock: {
      label: "Imagem",
      fields: {
        alt:     { type: "text",   label: "Texto alternativo"     },
        caption: { type: "text",   label: "Legenda (opcional)"    },
        height:  { type: "number", label: "Altura (px)"           },
        fit: {
          type: "select",
          label: "Ajuste da imagem",
          options: [
            { label: "Conter",    value: "contain" },
            { label: "Cobrir",    value: "cover"   },
            { label: "Preencher", value: "fill"    },
          ],
        },
        rounded: {
          type: "select",
          label: "Bordas arredondadas",
          options: [
            { label: "Sim", value: "true"  },
            { label: "Não", value: "false" },
          ],
        },
      },
      defaultProps: {
        src: "", alt: "Imagem", caption: "", fit: "contain", rounded: "true", height: 300,
      },
      render: (props) => <ImageBlock {...props} />,
    },

    KpiCard: {
      label: "KPI Card",
      fields: {
        title: { type: "text", label: "Título" },
        value: { type: "text", label: "Valor"  },
        color: {
          type: "select",
          label: "Cor",
          options: [
            { label: "Azul",     value: "blue"   },
            { label: "Verde",    value: "green"  },
            { label: "Vermelho", value: "red"    },
            { label: "Roxo",     value: "purple" },
            { label: "Laranja",  value: "orange" },
          ],
        },
      },
      defaultProps: { title: "Receita Total", value: "R$ 128.400", color: "blue" },
      render: (props) => <KpiCard {...props} />,
    },

    BarChartBlock: {
      label: "Gráfico de Barras",
      fields: {
        title:       { type: "text", label: "Título"                         },
        xAxisLabel:  { type: "text", label: "Label Eixo X"                   },
        yAxisLabel:  { type: "text", label: "Label Eixo Y"                   },
        categoryKey: { type: "text", label: "Coluna da categoria (ex: mes)"  },
        dataKey:     { type: "text", label: "Coluna do valor (ex: vendas)"   },
        endpoint:    { type: "text", label: "URL da API (opcional)"          },
      },
      defaultProps: {
        title: "Vendas Mensais", xAxisLabel: "Mês", yAxisLabel: "Vendas",
        categoryKey: "mes", dataKey: "vendas", endpoint: "",
      },
      render: (props) => <BarChartBlock {...props} />,
    },

    LineChartBlock: {
      label: "Gráfico de Linha",
      fields: {
        title:       { type: "text", label: "Título"                               },
        categoryKey: { type: "text", label: "Coluna da categoria (ex: mes)"        },
        lines:       { type: "text", label: "Colunas das linhas (ex: receita,meta)" },
        showLegend: {
          type: "select",
          label: "Exibir Legenda",
          options: [
            { label: "Sim", value: "true"  },
            { label: "Não", value: "false" },
          ],
        },
        endpoint: { type: "text", label: "URL da API (opcional)" },
      },
      defaultProps: {
        title: "Receita vs Meta", categoryKey: "mes",
        lines: "receita,meta", showLegend: "true", endpoint: "",
      },
      render: (props) => <LineChartBlock {...props} />,
    },

    PieChartBlock: {
      label: "Gráfico de Pizza",
      fields: {
        title:    { type: "text", label: "Título"                            },
        nameKey:  { type: "text", label: "Coluna dos nomes (ex: regiao)"    },
        valueKey: { type: "text", label: "Coluna dos valores (ex: vendas)"  },
        showLabels: {
          type: "select",
          label: "Exibir Labels",
          options: [
            { label: "Sim", value: "true"  },
            { label: "Não", value: "false" },
          ],
        },
        endpoint: { type: "text", label: "URL da API (opcional)" },
      },
      defaultProps: {
        title: "Vendas por Região", nameKey: "name",
        valueKey: "value", showLabels: "false", endpoint: "",
      },
      render: (props) => <PieChartBlock {...props} />,
    },

    GridLayout: {
      label: "Grid Layout",
      fields: {
        columns: {
          type: "select",
          label: "Colunas",
          options: [
            { label: "2 colunas", value: 2 },
            { label: "3 colunas", value: 3 },
            { label: "4 colunas", value: 4 },
          ],
        },
      },
      defaultProps: { columns: 2 },
      render: (props) => <GridLayout {...props} />,
    },
  },
};
