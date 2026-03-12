// app/dashboards/page.tsx
"use client";

import dynamic from "next/dynamic";

const DashboardsGallery = dynamic(
  () => import("@/components/DashboardsGallery").then((m) => m.DashboardsGallery),
  { ssr: false }
);

export default function Page() {
  return <DashboardsGallery />;
}
