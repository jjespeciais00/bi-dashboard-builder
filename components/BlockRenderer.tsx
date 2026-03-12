// components/BlockRenderer.tsx
"use client";

import type { BlockProps, ImageBlockProps } from "@/types";
import { KpiCard } from "@/components/blocks/KpiCard";
import { BarChartBlock } from "@/components/blocks/BarChartBlock";
import { LineChartBlock } from "@/components/blocks/LineChartBlock";
import { PieChartBlock } from "@/components/blocks/PieChartBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";

interface BlockRendererProps {
  props: BlockProps;
  /** Fornecido no editor para permitir upload de imagem direto no canvas */
  onPropsChange?: (patch: Partial<BlockProps>) => void;
}

export function BlockRenderer({ props, onPropsChange }: BlockRendererProps) {
  switch (props.type) {
    case "KpiCard":        return <KpiCard {...props} />;
    case "BarChartBlock":  return <BarChartBlock {...props} />;
    case "LineChartBlock": return <LineChartBlock {...props} />;
    case "PieChartBlock":  return <PieChartBlock {...props} />;
    case "TextBlock":      return <TextBlock {...props} />;
    case "ImageBlock":
      return (
        <ImageBlock
          {...props}
          onPropsChange={onPropsChange as ((p: Partial<ImageBlockProps>) => void) | undefined}
        />
      );
    default: return null;
  }
}
