// components/blocks/GridLayout.tsx
"use client";

import type { GridLayoutProps } from "@/types";

interface GridLayoutRenderProps extends GridLayoutProps {
  puck: {
    renderDropZone: (props: { zone: string }) => React.ReactNode;
  };
}

const colsMap: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export function GridLayout({
  columns,
  puck: { renderDropZone },
}: GridLayoutRenderProps) {
  return (
    <div className={`grid gap-4 ${colsMap[columns]}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="min-h-[120px]">
          {renderDropZone({ zone: `col-${i}` })}
        </div>
      ))}
    </div>
  );
}
