// app/dashboards/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Carregando dashboards...</span>
      </div>
    </div>
  );
}
