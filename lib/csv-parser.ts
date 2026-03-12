// lib/csv-parser.ts

export interface CsvRow {
  [key: string]: string | number;
}

function inferValue(raw: string): string | number {
  const trimmed = raw.trim();
  const cleaned = trimmed.replace(/\./g, "").replace(",", ".");
  const num = Number(cleaned);
  if (!isNaN(num) && trimmed !== "") return num;
  return trimmed;
}

export function parseCsv(raw: string): CsvRow[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const separator = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(separator).map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(separator);
    return headers.reduce<CsvRow>((acc, header, i) => {
      acc[header] = inferValue(values[i] ?? "");
      return acc;
    }, {});
  });
}

export function getCsvColumns(raw: string): string[] {
  const firstLine = raw.split(/\r?\n/)[0] ?? "";
  const separator = firstLine.includes(";") ? ";" : ",";
  return firstLine.split(separator).map((h) => h.trim());
}
