// components/DashboardEditor.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { DashboardData, GridBlock, BlockProps } from "@/types";
import {
  saveDashboard, loadDashboard, clearDashboard, loadActiveMeta,
  saveActiveMeta, publishDashboard, EMPTY_DASHBOARD,
} from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { useWhiteLabel } from "@/lib/whitelabel";
import { useHistory } from "@/lib/use-history";
import { useToast, ToastContainer } from "@/components/Toast";
import { EditorHeader } from "@/components/EditorHeader";
import { BlocksPanel } from "@/components/BlocksPanel";
import { GridEditor } from "@/components/GridEditor";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { DashboardPreview } from "@/components/DashboardPreview";
import { PublishModal } from "@/components/PublishModal";
import { ThemePanel } from "@/components/ThemePanel";
import { WhiteLabelPanel } from "@/components/WhiteLabelPanel";
import { TemplatesModal } from "@/components/TemplatesModal";
import type { EditorMode } from "@/types";
import type { Template } from "@/lib/templates";

function generateId(): string {
  return `block_${Math.random().toString(36).slice(2, 9)}`;
}

export function DashboardEditor() {
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<EditorMode>("edit");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dashboardName, setDashboardName] = useState("Sem título");
  const [isSaved, setIsSaved] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const [whiteLabelOpen, setWhiteLabelOpen] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { theme, setTheme, resetTheme } = useTheme();
  const { wl, setWl, resetWl } = useWhiteLabel();
  const { data, set, commit, setAndCommit, undo, redo, canUndo, canRedo } = useHistory(EMPTY_DASHBOARD);
  const { toasts, addToast, dismiss } = useToast();

  useEffect(() => {
    const saved = loadDashboard();
    const meta = loadActiveMeta();
    if (saved) set(saved);
    if (meta?.name) setDashboardName(meta.name);
    setLoaded(true);
    if (!saved || saved.blocks.length === 0) setShowTemplates(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSavedFeedback = useCallback(() => {
    setIsSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setIsSaved(false), 2500);
  }, []);

  const handleSave = useCallback(() => {
    const result = saveDashboard(data, dashboardName);
    if (result === "ok") {
      showSavedFeedback();
    } else if (result === "quota_exceeded") {
      addToast("error", "Armazenamento cheio. Remova dashboards antigos ou use CSVs menores.");
    } else {
      addToast("error", "Erro ao salvar. Tente novamente.");
    }
  }, [data, dashboardName, showSavedFeedback, addToast]);

  const handleClear = useCallback(() => {
    if (!confirm("Limpar todo o dashboard? Esta ação não pode ser desfeita.")) return;
    clearDashboard();
    setAndCommit(EMPTY_DASHBOARD);
    setSelectedId(null);
    setDashboardName("Sem título");
    setMode("edit");
  }, [setAndCommit]);

  const handleAddBlock = useCallback((block: GridBlock) => {
    setAndCommit((prev) => ({ blocks: [...prev.blocks, block] }));
    setSelectedId(block.id);
  }, [setAndCommit]);

  const handleUpdateProps = useCallback((id: string, props: BlockProps) => {
    setAndCommit((prev) => ({
      blocks: prev.blocks.map((b) => b.id === id ? { ...b, props } : b),
    }));
  }, [setAndCommit]);

  const handlePropsChange = useCallback((id: string, patch: Partial<BlockProps>) => {
    setAndCommit((prev) => ({
      blocks: prev.blocks.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...patch } as BlockProps } : b
      ),
    }));
  }, [setAndCommit]);

  const handleDelete = useCallback((id: string) => {
    setAndCommit((prev) => ({ blocks: prev.blocks.filter((b) => b.id !== id) }));
    setSelectedId((sel) => sel === id ? null : sel);
  }, [setAndCommit]);

  const handleDuplicate = useCallback((block: GridBlock) => {
    const newBlock: GridBlock = {
      ...block,
      id: generateId(),
      layout: { ...block.layout, y: block.layout.y + block.layout.h },
    };
    setAndCommit((prev) => ({ blocks: [...prev.blocks, newBlock] }));
    setSelectedId(newBlock.id);
  }, [setAndCommit]);

  const handleSelectTemplate = useCallback((template: Template) => {
    if (data.blocks.length > 0) {
      if (!confirm("Substituir o dashboard atual pelo template?")) return;
    }
    setAndCommit(template.data);
    setSelectedId(null);
    setShowTemplates(false);
  }, [data.blocks.length, setAndCommit]);

  const handlePublishConfirm = useCallback((title: string) => {
    // Warn if there are unsaved changes
    const { id, result } = publishDashboard(data, title);
    setPublishedId(id);
    if (result === "quota_exceeded") {
      addToast("warning", "Publicado, mas o armazenamento está quase cheio. Considere remover dashboards antigos.");
    } else if (result === "error") {
      addToast("error", "Erro ao publicar. Tente novamente.");
    }
  }, [data, addToast]);

  const selectedBlock = data.blocks.find((b) => b.id === selectedId) ?? null;

  const handleToggleTheme = useCallback(() => {
    setThemeOpen((p) => !p); setWhiteLabelOpen(false);
  }, []);

  const handleToggleWhiteLabel = useCallback(() => {
    setWhiteLabelOpen((p) => !p); setThemeOpen(false);
  }, []);

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <span className="text-sm text-gray-500 animate-pulse">Carregando editor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950">
      <EditorHeader
        mode={mode}
        onToggleMode={() => { setMode((p) => p === "edit" ? "preview" : "edit"); setSelectedId(null); }}
        onSave={handleSave}
        onClear={handleClear}
        onPublish={() => { setPublishedId(null); setShowPublishModal(true); }}
        onToggleTheme={handleToggleTheme}
        onToggleWhiteLabel={handleToggleWhiteLabel}
        onOpenTemplates={() => setShowTemplates(true)}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaved={isSaved}
        themeOpen={themeOpen}
        whiteLabelOpen={whiteLabelOpen}
        wl={wl}
        dashboardName={dashboardName}
        onNameChange={(name) => { setDashboardName(name); saveActiveMeta({ name, updatedAt: new Date().toISOString() }); }}
      />

      <div className="flex flex-1 overflow-hidden">
        {mode === "edit" ? (
          <>
            <BlocksPanel onAdd={handleAddBlock} data={data} />
            <GridEditor
              data={data}
              onChange={set}
              onCommit={commit}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onPropsChange={handlePropsChange}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
            <PropertiesPanel block={selectedBlock} onUpdate={handleUpdateProps} />
          </>
        ) : (
          <DashboardPreview data={data} wl={wl} />
        )}
      </div>

      {themeOpen && <ThemePanel theme={theme} onUpdate={setTheme} onReset={resetTheme} onClose={() => setThemeOpen(false)} />}
      {whiteLabelOpen && <WhiteLabelPanel wl={wl} onUpdate={setWl} onReset={resetWl} onClose={() => setWhiteLabelOpen(false)} />}
      {showTemplates && <TemplatesModal onSelect={handleSelectTemplate} onClose={() => setShowTemplates(false)} />}
      {showPublishModal && (
        <PublishModal
          onConfirm={handlePublishConfirm}
          onClose={() => setShowPublishModal(false)}
          publishedId={publishedId}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
