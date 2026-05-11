"use client";

import React from "react";

type Variant = "primary" | "secondary" | "danger";

interface TableButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  icon?: "plus" | "filter" | "download" | "upload" | "send";
  disabled?: boolean;
  isReverse?: boolean; // optional prop added
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-emerald-500 text-white hover:bg-emerald-600",
  secondary: "border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const REVERSE_CLASS: Record<Variant, string> = {
  primary: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  secondary:
    "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200",
  danger: "bg-red-100 text-red-700 hover:bg-red-200",
};

const ICONS: Record<string, React.ReactNode> = {
  plus: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  filter: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  ),
  download: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  upload: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  send: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
};

export default function TableButton({
  onClick,
  children,
  variant = "primary",
  icon,
  disabled = false,
  isReverse = false,
}: TableButtonProps) {
  const baseClass = isReverse ? REVERSE_CLASS[variant] : VARIANT_CLASS[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${baseClass}`}
    >
      {icon && ICONS[icon]}
      {children}
    </button>
  );
}
