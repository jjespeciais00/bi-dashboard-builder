// lib/use-history.ts
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { DashboardData } from "@/types";

interface HistoryState {
  past: DashboardData[];
  present: DashboardData;
  future: DashboardData[];
}

/**
 * Histórico de undo/redo para DashboardData.
 *
 * Estratégia de performance:
 * - `set` (onChange contínuo do grid): atualiza `present` SEM push para o histórico.
 *   Usado durante drag/resize para não travar.
 * - `commit` (onDragStop / onResizeStop): faz o push para o histórico.
 *   Chamado apenas quando o usuário solta o mouse.
 * - Mudanças de props (addBlock, deleteBlock, updateProps): usa `setAndCommit`,
 *   que atualiza + commita em uma única operação.
 */
export function useHistory(initial: DashboardData) {
  const [state, setState] = useState<HistoryState>({
    past: [],
    present: initial,
    future: [],
  });

  // Ref do present para commit sem stale closure
  const presentRef = useRef(initial);
  presentRef.current = state.present;

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  /** Atualiza present sem historiar — use durante drag/resize contínuo */
  const set = useCallback((value: DashboardData | ((prev: DashboardData) => DashboardData)) => {
    setState((s) => {
      const next = typeof value === "function" ? value(s.present) : value;
      return { ...s, present: next };
    });
  }, []);

  /** Empurra o estado atual para o histórico — chame no onDragStop/onResizeStop */
  const commit = useCallback((prev: DashboardData) => {
    setState((s) => {
      if (s.past.length > 0 && s.past[s.past.length - 1] === prev) return s;
      return {
        past: [...s.past.slice(-49), prev],
        present: s.present,
        future: [],
      };
    });
  }, []);

  /** Para mudanças discretas (add, delete, updateProps): atualiza + commita junto */
  const setAndCommit = useCallback((value: DashboardData | ((prev: DashboardData) => DashboardData)) => {
    setState((s) => {
      const next = typeof value === "function" ? value(s.present) : value;
      return {
        past: [...s.past.slice(-49), s.present],
        present: next,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      if (s.past.length === 0) return s;
      const previous = s.past[s.past.length - 1];
      return {
        past: s.past.slice(0, -1),
        present: previous,
        future: [s.present, ...s.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      return {
        past: [...s.past, s.present],
        present: next,
        future: s.future.slice(1),
      };
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (!modifier) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return { data: state.present, set, commit, setAndCommit, undo, redo, canUndo, canRedo };
}
