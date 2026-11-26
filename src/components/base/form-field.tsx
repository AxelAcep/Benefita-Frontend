"use client";

/**
 * Field form yang cocok dengan react-hook-form.
 *
 * Akar masalahnya: @/components/base/form-input hanya menerima
 * value + onChange (controlled), jadi tidak bisa dipakai dengan
 * {...register("nama")}. Akibatnya tiap modal RHF membuat field-nya
 * sendiri — FieldLabel ditulis ulang di 11 file, inputCls disalin di 18.
 *
 * Komponen di sini meneruskan ref, jadi register() bisa langsung di-spread:
 *   <TextInput label="Nama" {...register("nama")} error={errors.nama?.message} />
 *
 * form-input lama tidak diubah dan tetap dipakai 60 file.
 */
import React from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full px-3 py-2 border rounded-xl text-xs text-zinc-700 outline-none transition-all placeholder:text-zinc-300 disabled:bg-zinc-50 disabled:cursor-not-allowed";

const warnaNormal =
  "border-zinc-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100";
const warnaError =
  "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100";

export interface FieldProps {
  label?: React.ReactNode;
  /** Tampilkan penanda "(opsional)" di samping label. */
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/** Pembungkus label + error. Pakai langsung kalau kontrolnya custom. */
export function Field({ label, optional, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
          {label}
          {optional && (
            <span className="ml-1 font-normal text-zinc-400">(opsional)</span>
          )}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

type PropsBersama = Pick<FieldProps, "label" | "optional" | "error"> & {
  /** Kelas untuk pembungkus field, bukan untuk elemen input. */
  wrapperClassName?: string;
};

export type TextInputProps = PropsBersama &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
    className?: string;
  };

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, optional, error, wrapperClassName, className, ...props },
    ref,
  ) {
    return (
      <Field label={label} optional={optional} error={error} className={wrapperClassName}>
        <input
          ref={ref}
          {...props}
          className={cn(inputClass, error ? warnaError : warnaNormal, className)}
        />
      </Field>
    );
  },
);

export type TextAreaProps = PropsBersama &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    className?: string;
  };

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { label, optional, error, wrapperClassName, className, rows = 3, ...props },
    ref,
  ) {
    return (
      <Field label={label} optional={optional} error={error} className={wrapperClassName}>
        <textarea
          ref={ref}
          rows={rows}
          {...props}
          className={cn(
            inputClass,
            "resize-none",
            error ? warnaError : warnaNormal,
            className,
          )}
        />
      </Field>
    );
  },
);

export interface OpsiSelect {
  value: string;
  label: string;
}

export type SelectInputProps = PropsBersama &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className" | "children"> & {
    opsi: OpsiSelect[];
    /** Teks pilihan kosong di paling atas. Kosong = tidak dirender. */
    placeholder?: string;
    className?: string;
  };

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  function SelectInput(
    { label, optional, error, wrapperClassName, className, opsi, placeholder, ...props },
    ref,
  ) {
    return (
      <Field label={label} optional={optional} error={error} className={wrapperClassName}>
        <select
          ref={ref}
          {...props}
          className={cn(
            inputClass,
            "bg-white",
            error ? warnaError : warnaNormal,
            className,
          )}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {opsi.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
    );
  },
);
