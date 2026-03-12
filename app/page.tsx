// app/page.tsx
"use client";

import dynamic from "next/dynamic";

const DashboardEditor = dynamic(
  () => import("@/components/DashboardEditor").then((m) => m.DashboardEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <span className="text-sm text-gray-500 animate-pulse">
          Inicializando editor...
        </span>
      </div>
    ),
  }
);

export default function HomePage() {
  return <DashboardEditor />;
}
