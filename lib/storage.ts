// lib/storage.ts
import type { DashboardData } from "@/types";

const ACTIVE_KEY = "bi_dashboard_data";
const ACTIVE_META_KEY = "bi_dashboard_meta";
const INDEX_KEY = "bi_dashboard_index";

export const EMPTY_DASHBOARD: DashboardData = { blocks: [] };

// ── Meta do dashboard ativo (nome) ───────────────────────────────────────────

export interface ActiveMeta {
  name: string;
  updatedAt: string;
}

export function saveActiveMeta(meta: ActiveMeta): void {
  try { localStorage.setItem(ACTIVE_META_KEY, JSON.stringify(meta)); } catch {}
}

export function loadActiveMeta(): ActiveMeta | null {
  try {
    const raw = localStorage.getItem(ACTIVE_META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── Dashboard ativo ───────────────────────────────────────────────────────────

export type SaveResult = "ok" | "quota_exceeded" | "error";

export function saveDashboard(data: DashboardData, name?: string): SaveResult {
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(data));
    saveActiveMeta({ name: name ?? loadActiveMeta()?.name ?? "Sem título", updatedAt: new Date().toISOString() });
    return "ok";
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") return "quota_exceeded";
    console.error("[BI] Falha ao salvar:", err);
    return "error";
  }
}

export function loadDashboard(): DashboardData | null {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Descarta formato antigo do Puck que usava "content" em vez de "blocks"
    if (!parsed || !Array.isArray(parsed.blocks)) return null;
    return parsed as DashboardData;
  } catch { return null; }
}

export function clearDashboard(): void {
  localStorage.removeItem(ACTIVE_KEY);
  localStorage.removeItem(ACTIVE_META_KEY);
}

// ── Dashboards publicados ─────────────────────────────────────────────────────

export interface DashboardMeta {
  id: string;
  title: string;
  savedAt: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function publishDashboard(data: DashboardData, title: string): { id: string; result: SaveResult } {
  const id = generateId();
  const meta: DashboardMeta = { id, title, savedAt: new Date().toISOString() };
  try {
    localStorage.setItem(`bi_dashboard_${id}`, JSON.stringify(data));
    const index = listPublishedDashboards();
    index.push(meta);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    return { id, result: "ok" };
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") return { id, result: "quota_exceeded" };
    return { id, result: "error" };
  }
}

export function loadPublishedDashboard(id: string): DashboardData | null {
  try {
    const raw = localStorage.getItem(`bi_dashboard_${id}`);
    return raw ? JSON.parse(raw) as DashboardData : null;
  } catch { return null; }
}

export function listPublishedDashboards(): DashboardMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? JSON.parse(raw) as DashboardMeta[] : [];
  } catch { return []; }
}

export function deletePublishedDashboard(id: string): void {
  try {
    localStorage.removeItem(`bi_dashboard_${id}`);
    const index = listPublishedDashboards().filter((d) => d.id !== id);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch (err) { console.error("[BI] Falha ao deletar:", err); }
}
