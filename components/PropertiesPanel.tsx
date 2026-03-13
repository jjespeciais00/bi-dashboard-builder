// components/PropertiesPanel.tsx
"use client";

import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { GridBlock, BlockProps } from "@/types";
import { CsvUploader } from "@/components/blocks/CsvUploader";

interface PropertiesPanelProps {
  block: GridBlock | null;
  onUpdate: (id: string, props: BlockProps) => void;
}

const inputCls = "bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition w-full";
const selectCls = `${inputCls} cursor-pointer`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="h-px flex-1 bg-gray-800" />
      <span className="text-xs text-gray-600 uppercase tracking-widest font-semibold">{label}</span>
      <div className="h-px flex-1 bg-gray-800" />
    </div>
  );
}

export function PropertiesPanel({ block, onUpdate }: PropertiesPanelProps) {
  // ⚠️ Hooks SEMPRE antes de qualquer return condicional
  const update = useCallback(<K extends string>(key: K, value: unknown) => {
    if (!block) return;
    onUpdate(block.id, { ...block.props, [key]: value } as BlockProps);
  }, [block, onUpdate]);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!block) {
    return (
      <aside className="w-64 shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col items-center justify-center gap-3 select-none">
        <SlidersHorizontal size={24} className="opacity-40 text-gray-700" />
        <p className="text-xs text-center px-6 text-gray-600">
          Clique em um bloco no canvas para editar suas propriedades
        </p>
      </aside>
    );
  }

  const { props } = block;

  return (
    <aside
      className="w-64 shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden"
      onClick={stopPropagation}
    >
      <div className="px-4 py-3 border-b border-gray-800 shrink-0">
        <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Propriedades</p>
        <p className="text-xs text-gray-600 mt-0.5">{props.type}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Layout info */}
        <div className="grid grid-cols-2 gap-2">
          <Field label="Largura">
            <div className={`${inputCls} text-gray-500 cursor-default`}>{block.layout.w} / 12</div>
          </Field>
          <Field label="Altura">
            <div className={`${inputCls} text-gray-500 cursor-default`}>{block.layout.h} linhas</div>
          </Field>
        </div>

        <SectionDivider label="Conteúdo" />

        {props.type === "KpiCard" && (
          <>
            <Field label="Título">
              <input className={inputCls} value={props.title} onChange={(e) => update("title", e.target.value)} />
            </Field>
            <Field label="Valor">
              <input className={inputCls} value={props.value} onChange={(e) => update("value", e.target.value)} />
            </Field>
            <Field label="Cor">
              <select className={selectCls} value={props.color} onChange={(e) => update("color", e.target.value)}>
                <option value="blue">Azul</option>
                <option value="green">Verde</option>
                <option value="red">Vermelho</option>
                <option value="purple">Roxo</option>
                <option value="orange">Laranja</option>
              </select>
            </Field>
          </>
        )}

        {props.type === "BarChartBlock" && (
          <>
            <Field label="Título">
              <input className={inputCls} value={props.title} onChange={(e) => update("title", e.target.value)} />
            </Field>
            <Field label="Coluna categoria">
              <input className={inputCls} value={props.categoryKey} placeholder="ex: mes" onChange={(e) => update("categoryKey", e.target.value)} />
            </Field>
            <Field label="Coluna valor">
              <input className={inputCls} value={props.dataKey} placeholder="ex: vendas" onChange={(e) => update("dataKey", e.target.value)} />
            </Field>
            <Field label="Label Eixo X">
              <input className={inputCls} value={props.xAxisLabel} onChange={(e) => update("xAxisLabel", e.target.value)} />
            </Field>
            <Field label="Label Eixo Y">
              <input className={inputCls} value={props.yAxisLabel} onChange={(e) => update("yAxisLabel", e.target.value)} />
            </Field>
            <SectionDivider label="Dados" />
            <Field label="CSV local">
              <CsvUploader value={props.csvData ?? ""} onChange={(t) => update("csvData", t)} onClear={() => update("csvData", "")} />
            </Field>
            <Field label="ou URL da API">
              <input className={inputCls} value={props.endpoint} placeholder="https://..." disabled={!!props.csvData} onChange={(e) => update("endpoint", e.target.value)} />
            </Field>
            {props.csvData && <p className="text-xs text-gray-600 -mt-2">URL desabilitada — CSV tem prioridade</p>}
          </>
        )}

        {props.type === "LineChartBlock" && (
          <>
            <Field label="Título">
              <input className={inputCls} value={props.title} onChange={(e) => update("title", e.target.value)} />
            </Field>
            <Field label="Coluna categoria">
              <input className={inputCls} value={props.categoryKey} placeholder="ex: mes" onChange={(e) => update("categoryKey", e.target.value)} />
            </Field>
            <Field label="Colunas de linhas">
              <input className={inputCls} value={props.lines} placeholder="ex: receita,meta" onChange={(e) => update("lines", e.target.value)} />
              <p className="text-xs text-gray-600">Separe por vírgula</p>
            </Field>
            <Field label="Exibir legenda">
              <select className={selectCls} value={props.showLegend} onChange={(e) => update("showLegend", e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </Field>
            <SectionDivider label="Dados" />
            <Field label="CSV local">
              <CsvUploader value={props.csvData ?? ""} onChange={(t) => update("csvData", t)} onClear={() => update("csvData", "")} />
            </Field>
            <Field label="ou URL da API">
              <input className={inputCls} value={props.endpoint} placeholder="https://..." disabled={!!props.csvData} onChange={(e) => update("endpoint", e.target.value)} />
            </Field>
          </>
        )}

        {props.type === "PieChartBlock" && (
          <>
            <Field label="Título">
              <input className={inputCls} value={props.title} onChange={(e) => update("title", e.target.value)} />
            </Field>
            <Field label="Coluna nomes">
              <input className={inputCls} value={props.nameKey} placeholder="ex: regiao" onChange={(e) => update("nameKey", e.target.value)} />
            </Field>
            <Field label="Coluna valores">
              <input className={inputCls} value={props.valueKey} placeholder="ex: vendas" onChange={(e) => update("valueKey", e.target.value)} />
            </Field>
            <Field label="Exibir labels">
              <select className={selectCls} value={props.showLabels} onChange={(e) => update("showLabels", e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </Field>
            <SectionDivider label="Dados" />
            <Field label="CSV local">
              <CsvUploader value={props.csvData ?? ""} onChange={(t) => update("csvData", t)} onClear={() => update("csvData", "")} />
            </Field>
            <Field label="ou URL da API">
              <input className={inputCls} value={props.endpoint} placeholder="https://..." disabled={!!props.csvData} onChange={(e) => update("endpoint", e.target.value)} />
            </Field>
          </>
        )}

        {props.type === "TextBlock" && (
          <>
            <Field label="Conteúdo">
              <textarea className={`${inputCls} resize-none h-24`} value={props.text} onChange={(e) => update("text", e.target.value)} />
            </Field>
            <Field label="Estilo">
              <select className={selectCls} value={props.variant} onChange={(e) => update("variant", e.target.value)}>
                <option value="heading">Título</option>
                <option value="subheading">Subtítulo</option>
                <option value="body">Corpo</option>
                <option value="label">Label</option>
              </select>
            </Field>
            <Field label="Alinhamento">
              <select className={selectCls} value={props.align} onChange={(e) => update("align", e.target.value)}>
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </Field>
          </>
        )}

        {props.type === "ImageBlock" && (
          <>
            <Field label="Texto alternativo">
              <input className={inputCls} value={props.alt} onChange={(e) => update("alt", e.target.value)} />
            </Field>
            <Field label="Legenda">
              <input className={inputCls} value={props.caption} onChange={(e) => update("caption", e.target.value)} />
            </Field>
            <Field label="Ajuste">
              <select className={selectCls} value={props.fit} onChange={(e) => update("fit", e.target.value)}>
                <option value="contain">Conter</option>
                <option value="cover">Cobrir</option>
                <option value="fill">Preencher</option>
              </select>
            </Field>
            <Field label="Bordas arredondadas">
              <select className={selectCls} value={props.rounded} onChange={(e) => update("rounded", e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </Field>
            <p className="text-xs text-gray-600">Para trocar a imagem, clique sobre ela no canvas.</p>
          </>
        )}
      </div>
    </aside>
  );
}
