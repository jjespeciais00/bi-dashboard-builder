// lib/fetch-data.ts
"use client";

import { useState, useEffect } from "react";
import { parseCsv, type CsvRow } from "./csv-parser";

type FetchStatus<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function fetchAndParse<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);

  const contentType = res.headers.get("content-type") ?? "";

  if (
    contentType.includes("text/csv") ||
    contentType.includes("text/plain") ||
    url.toLowerCase().includes(".csv")
  ) {
    const text = await res.text();
    return parseCsv(text) as T;
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Formato inválido — esperado array JSON ou CSV");
  }
  return data as T;
}

export function useFetchData<T>(
  endpoint: string,
  fallback: T
): { state: FetchStatus<T>; data: T } {
  const [state, setState] = useState<FetchStatus<T>>({ status: "idle" });

  useEffect(() => {
    if (!endpoint || endpoint.trim() === "") {
      setState({ status: "idle" });
      return;
    }

    if (!isValidUrl(endpoint)) {
      setState({ status: "error", message: "URL inválida" });
      return;
    }

    let cancelled = false;

    const timer = setTimeout(() => {
      setState({ status: "loading" });

      fetchAndParse<T>(endpoint)
        .then((data) => {
          if (!cancelled) setState({ status: "success", data });
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            const message =
              err instanceof Error ? err.message : "Erro desconhecido";
            setState({ status: "error", message });
          }
        });
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [endpoint]);

  const data = state.status === "success" ? state.data : fallback;
  return { state, data };
}

export function useCsvData(
  csvContent: string | null,
  fallback: CsvRow[]
): CsvRow[] {
  const [data, setData] = useState<CsvRow[]>(fallback);

  useEffect(() => {
    if (!csvContent) {
      setData(fallback);
      return;
    }
    try {
      const parsed = parseCsv(csvContent);
      setData(parsed.length > 0 ? parsed : fallback);
    } catch {
      setData(fallback);
    }
  }, [csvContent, fallback]);

  return data;
}
