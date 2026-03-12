// app/preview/[id]/page.tsx
"use client";

import dynamic from "next/dynamic";

const PreviewPage = dynamic(
  () => import("@/components/PreviewPage").then((m) => m.PreviewPage),
  { ssr: false }
);

export default function Page() {
  return <PreviewPage />;
}
