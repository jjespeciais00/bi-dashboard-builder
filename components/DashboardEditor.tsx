// components/DashboardEditor.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/config/puck.config";
import {
  saveDashboard, loadDashboard, clearDashboard, publishDashboard,
} from "@/lib/storage";
import { EditorHeader } from "@/components/EditorHeader";
import { DashboardPreview } from "@/components/DashboardPreview";
import { PublishModal } from "@/components/PublishModal";
import type { EditorMode } from "@/types";

const EMPTY_DATA: Data = { content: [], root: { props: {} } };

export function DashboardEditor() {
  const [initialData, setInitialData] = useState<Data | null>(null);
  const [currentData, setCurrentData] = useState<Data>(EMPTY_DATA);
  const [mode, setMode] = useState<EditorMode>("edit");
  const [isSaved, setIsSaved] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadDashboard();
    const data = saved ?? EMPTY_DATA;
    setInitialData(data);
    setCurrentData(data);
  }, []);

  const showSavedFeedback = useCallback(() => {
    setIsSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setIsSaved(false), 2500);
  }, []);

  const handleSave = useCallback(() => {
    saveDashboard(currentData);
    showSavedFeedback();
  }, [currentData, showSavedFeedback]);

  const handlePuckPublish = useCallback(
    (data: Data) => {
      saveDashboard(data);
      setCurrentData(data);
      showSavedFeedback();
    },
    [showSavedFeedback]
  );

  const handleClear = useCallback(() => {
    if (!confirm("Limpar todo o dashboard? Esta ação não pode ser desfeita.")) return;
    clearDashboard();
    setInitialData(EMPTY_DATA);
    setCurrentData(EMPTY_DATA);
    setMode("edit");
  }, []);

  const handleOpenPublishModal = useCallback(() => {
    setPublishedId(null);
    setShowPublishModal(true);
  }, []);

  const handleConfirmPublish = useCallback(
    (title: string) => {
      const id = publishDashboard(currentData, title);
      setPublishedId(id);
    },
    [currentData]
  );

  if (!initialData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <span className="text-sm text-gray-500 animate-pulse">
          Carregando editor...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950">
      <EditorHeader
        mode={mode}
        onToggleMode={() => setMode((p) => (p === "edit" ? "preview" : "edit"))}
        onSave={handleSave}
        onClear={handleClear}
        onPublish={handleOpenPublishModal}
        isSaved={isSaved}
      />

      <main className="flex-1 overflow-hidden">
        {mode === "preview" ? (
          <DashboardPreview data={currentData} />
        ) : (
          <Puck
            key={JSON.stringify(initialData)}
            config={puckConfig}
            data={initialData}
            onPublish={handlePuckPublish}
            onChange={setCurrentData}
          />
        )}
      </main>

      {showPublishModal && (
        <PublishModal
          onConfirm={handleConfirmPublish}
          onClose={() => setShowPublishModal(false)}
          publishedId={publishedId}
        />
      )}
    </div>
  );
}
