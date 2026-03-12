// app/not-found.tsx
import { LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-950">
      <div className="bg-blue-500 rounded-md p-3 mb-2">
        <LayoutDashboard size={24} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-white">404</p>
      <p className="text-sm text-gray-500">Página não encontrada</p>
      <a href="/" className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4">
        Voltar ao editor
      </a>
    </div>
  );
}
