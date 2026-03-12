// lib/theme.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface Theme {
  background: string;
  header: string;
  chartPrimary: string;
  chartSecondary: string;
  chartTertiary: string;
  kpiBlue: string;
  kpiGreen: string;
  kpiRed: string;
  kpiPurple: string;
  kpiOrange: string;
}

export const DEFAULT_THEME: Theme = {
  background: "#f9fafb",
  header: "#030712",
  chartPrimary: "#3b82f6",
  chartSecondary: "#10b981",
  chartTertiary: "#f59e0b",
  kpiBlue: "#3b82f6",
  kpiGreen: "#22c55e",
  kpiRed: "#ef4444",
  kpiPurple: "#a855f7",
  kpiOrange: "#f97316",
};

const STORAGE_KEY = "bi_dashboard_theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--theme-background", theme.background);
  root.style.setProperty("--theme-header", theme.header);
  root.style.setProperty("--theme-chart-1", theme.chartPrimary);
  root.style.setProperty("--theme-chart-2", theme.chartSecondary);
  root.style.setProperty("--theme-chart-3", theme.chartTertiary);
  root.style.setProperty("--theme-kpi-blue", theme.kpiBlue);
  root.style.setProperty("--theme-kpi-green", theme.kpiGreen);
  root.style.setProperty("--theme-kpi-red", theme.kpiRed);
  root.style.setProperty("--theme-kpi-purple", theme.kpiPurple);
  root.style.setProperty("--theme-kpi-orange", theme.kpiOrange);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const loaded = saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
      setThemeState(loaded);
      applyTheme(loaded);
    } catch {
      applyTheme(DEFAULT_THEME);
    }
  }, []);

  const setTheme = useCallback((updater: Partial<Theme>) => {
    setThemeState((prev) => {
      const next = { ...prev, ...updater };
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetTheme = useCallback(() => {
    setThemeState(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { theme, setTheme, resetTheme };
}
