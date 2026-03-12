// components/blocks/TextBlock.tsx
"use client";

import type { TextBlockProps } from "@/types";

const variantStyles: Record<TextBlockProps["variant"], string> = {
  heading:    "text-2xl font-bold text-gray-900 leading-tight",
  subheading: "text-lg font-semibold text-gray-700",
  body:       "text-sm text-gray-600 leading-relaxed",
  label:      "text-xs font-semibold uppercase tracking-widest text-gray-400",
};

const alignStyles: Record<TextBlockProps["align"], string> = {
  left:   "text-left",
  center: "text-center",
  right:  "text-right",
};

export function TextBlock({ text, variant, align }: TextBlockProps) {
  return (
    <div className={`py-1 px-1 ${alignStyles[align]}`}>
      <p className={variantStyles[variant]}>{text}</p>
    </div>
  );
}
