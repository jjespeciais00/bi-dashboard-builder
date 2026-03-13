// components/GridEditor.tsx
"use client";

import { useCallback, useState, useRef } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import type { DashboardData, GridBlock, BlockProps } from "@/types";
import { BlockRenderer } from "@/components/BlockRenderer";
import { X, Copy } from "lucide-react";

interface GridEditorProps {
  data: DashboardData;
  onChange: (data: DashboardData) => void;
  onCommit: (prev: DashboardData) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onPropsChange: (id: string, patch: Partial<BlockProps>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (block: GridBlock) => void;
}

const COLS = 12;
const ROW_HEIGHT = 60;

export function GridEditor({
  data, onChange, onCommit, selectedId, onSelect,
  onPropsChange, onDelete, onDuplicate,
}: GridEditorProps) {
  const [containerWidth, setContainerWidth] = useState(1200);
  const snapshotRef = useRef<DashboardData>(data);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(node);
  }, []);

  const toLayouts = (blocks: GridBlock[]): Layout[] =>
    blocks.map((b) => ({
      i: b.id,
      x: b.layout.x,
      y: b.layout.y,
      w: b.layout.w,
      h: b.layout.h,
      minW: b.layout.minW ?? 2,
      minH: b.layout.minH ?? 2,
    }));

  const applyLayouts = useCallback((newLayouts: Layout[]): DashboardData => {
    return {
      blocks: data.blocks.map((block) => {
        const l = newLayouts.find((x) => x.i === block.id);
        if (!l) return block;
        return { ...block, layout: { ...block.layout, x: l.x, y: l.y, w: l.w, h: l.h } };
      }),
    };
  }, [data.blocks]);

  const handleLayoutChange = useCallback((newLayouts: Layout[]) => {
    onChange(applyLayouts(newLayouts));
  }, [applyLayouts, onChange]);

  const handleDragStart = useCallback(() => {
    snapshotRef.current = data;
  }, [data]);

  const handleResizeStart = useCallback(() => {
    snapshotRef.current = data;
  }, [data]);

  // ItemCallback: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => void
  const handleDragStop = useCallback(
    (_l: Layout[], _o: Layout, _n: Layout, _p: Layout) => {
      onCommit(snapshotRef.current);
    },
    [onCommit]
  );

  const handleResizeStop = useCallback(
    (_l: Layout[], _o: Layout, _n: Layout, _p: Layout) => {
      onCommit(snapshotRef.current);
    },
    [onCommit]
  );

  if (data.blocks.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center gap-3 select-none"
        style={{ backgroundColor: "var(--theme-background, #f9fafb)" }}
        onClick={() => onSelect(null)}
      >
        <div className="text-5xl opacity-20">＋</div>
        <p className="text-sm font-medium text-gray-400">Canvas vazio</p>
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Clique em um bloco no painel esquerdo para adicionar,<br />
          ou use um template para começar rápido
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto p-6"
      style={{ backgroundColor: "var(--theme-background, #f9fafb)" }}
      onClick={() => onSelect(null)}
    >
      <GridLayout
        layout={toLayouts(data.blocks)}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={containerWidth - 48}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        draggableHandle=".drag-handle"
        margin={[12, 12]}
        containerPadding={[0, 0]}
        resizeHandles={["se", "sw", "ne", "nw", "e", "w", "s", "n"]}
        useCSSTransforms
      >
        {data.blocks.map((block) => {
          const isSelected = block.id === selectedId;
          return (
            <div
              key={block.id}
              onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
              className={`group relative rounded-xl overflow-hidden bg-white transition-all ${
                isSelected
                  ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20"
                  : "ring-1 ring-gray-200 hover:ring-gray-300 shadow-sm"
              }`}
            >
              <div className="drag-handle absolute top-0 left-0 right-0 h-6 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-0.5 h-2.5 bg-gray-400 rounded-full" />
                ))}
              </div>

              <div className="absolute top-1.5 right-1.5 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onMouseDown={(e) => { e.stopPropagation(); onDuplicate(block); }}
                  className="bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-blue-500 hover:border-blue-300 shadow-sm transition-all"
                  title="Duplicar"
                >
                  <Copy size={10} />
                </button>
                <button
                  onMouseDown={(e) => { e.stopPropagation(); onDelete(block.id); }}
                  className="bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-red-500 hover:border-red-300 shadow-sm transition-all"
                  title="Remover"
                >
                  <X size={10} />
                </button>
              </div>

              <div className="w-full h-full overflow-hidden">
                <BlockRenderer
                  props={block.props}
                  onPropsChange={isSelected ? (patch) => onPropsChange(block.id, patch) : undefined}
                />
              </div>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
