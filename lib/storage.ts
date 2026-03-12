// lib/storage.ts
import type { Data } from "@measured/puck";

const DEFAULT_KEY = "bi_dashboard_data";
const INDEX_KEY = "bi_dashboard_index";

// ── Dashboard padrão (editor ativo) ─────────────────────────────────────────

export function saveDashboard(data: Data): void {
  try {
    localStorage.setItem(DEFAULT_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("[BI] Falha ao salvar dashboard:", err);
  }
}

export function loadDashboard(): Data | null {
  try {
    const raw = localStorage.getItem(DEFAULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

export function clearDashboard(): void {
  localStorage.removeItem(DEFAULT_KEY);
}

// ── Dashboards publicados (por ID) ───────────────────────────────────────────

export interface DashboardMeta {
  id: string;
  title: string;
  savedAt: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function publishDashboard(data: Data, title: string): string {
  const id = generateId();
  const meta: DashboardMeta = { id, title, savedAt: new Date().toISOString() };

  try {
    localStorage.setItem(`bi_dashboard_${id}`, JSON.stringify(data));
    const index = listPublishedDashboards();
    index.push(meta);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error("[BI] Falha ao publicar dashboard:", err);
  }

  return id;
}

export function loadPublishedDashboard(id: string): Data | null {
  try {
    const raw = localStorage.getItem(`bi_dashboard_${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

export function listPublishedDashboards(): DashboardMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DashboardMeta[];
  } catch {
    return [];
  }
}

export function deletePublishedDashboard(id: string): void {
  try {
    localStorage.removeItem(`bi_dashboard_${id}`);
    const index = listPublishedDashboards().filter((d) => d.id !== id);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error("[BI] Falha ao deletar dashboard:", err);
  }
}
