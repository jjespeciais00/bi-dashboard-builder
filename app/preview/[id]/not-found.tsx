// app/preview/[id]/not-found.tsx
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-950">
      <AlertTriangle size={36} className="text-yellow-500 opacity-70" />
      <p className="text-base font-medium text-white">Dashboard não encontrado</p>
      <p className="text-sm text-gray-500">O link pode ter expirado ou o dashboard foi removido.</p>
      <a href="/" className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
        Voltar ao editor
      </a>
    </div>
  );
}
