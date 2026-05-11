// components/base/form-input.tsx

import React from "react";

interface FormInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  className?: string;
  type?: "text" | "number" | "email" | "tel";
}

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  error,
  className = "",
  type = "text",
}: FormInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`
          w-full px-3 py-2 text-xs text-zinc-700 bg-white
          border rounded-lg outline-none transition-all
          placeholder:text-zinc-300
          ${readOnly ? "bg-zinc-50 cursor-default" : ""}
          ${disabled ? "bg-white cursor-not-allowed text-zinc-400" : ""}
          ${
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-400"
              : "border-zinc-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
          }
        `}
      />
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
