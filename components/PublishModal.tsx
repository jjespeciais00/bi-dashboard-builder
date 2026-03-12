// components/PublishModal.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Link, Check, Share2 } from "lucide-react";

interface PublishModalProps {
  onConfirm: (title: string) => void;
  onClose: () => void;
  publishedId: string | null;
}

export function PublishModal({ onConfirm, onClose, publishedId }: PublishModalProps) {
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = publishedId && origin ? `${origin}/preview/${publishedId}` : null;

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {!publishedId ? (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-500/15 rounded-lg p-2">
                <Share2 size={18} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">Publicar Dashboard</h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Gera um link de visualização somente-leitura
                </p>
              </div>
            </div>

            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Nome do dashboard
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && title.trim() && onConfirm(title.trim())}
              placeholder="Ex: Vendas Q1 2025"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              autoFocus
            />

            <div className="flex gap-2 mt-5">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => title.trim() && onConfirm(title.trim())}
                disabled={!title.trim()}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Gerar link
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-emerald-500/15 rounded-lg p-2">
                <Check size={18} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">Dashboard publicado!</h2>
                <p className="text-gray-400 text-xs mt-0.5">Compartilhe o link abaixo</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5">
              <Link size={13} className="text-gray-500 shrink-0" />
              <span className="text-xs text-gray-300 truncate flex-1 font-mono">{shareUrl}</span>
              <button
                onClick={handleCopy}
                className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
