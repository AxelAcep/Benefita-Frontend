"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Save,
  UserCircle2,
  Upload,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import {
  CreatePegawaiRequest,
  UpdatePegawaiRequest,
  Pegawai,
  RoleStatus,
} from "@/lib/services/pegawai.service";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const ROLE_OPTIONS: { value: RoleStatus; label: string }[] = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "FINANCE", label: "Finance" },
  { value: "DAILY_ADMIN", label: "Daily Admin" },
  { value: "MARKETING_STAFF", label: "Marketing Staff" },
  { value: "MARKETING_SEMENTARA", label: "Marketing Sementara" },
  { value: "TEKNIS", label: "Teknis" },
  { value: "ADMIN", label: "Admin" },
];

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ModalPegawaiProps {
  isOpen: boolean;
  isSaving?: boolean;
  initialData?: Pegawai | null;
  onClose: () => void;
  onSubmit: (data: CreatePegawaiRequest | UpdatePegawaiRequest) => void;
  onResetPassword?: (id: string, newPassword: string) => Promise<void>;
  onDeleteDokumen?: (dokumenId: string) => Promise<void>;
}

type Tab = "data" | "akun" | "password";

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function ModalPegawai({
  isOpen,
  isSaving = false,
  initialData,
  onClose,
  onSubmit,
  onResetPassword,
  onDeleteDokumen,
}: ModalPegawaiProps) {
  const isEdit = !!initialData;
  const [activeTab, setActiveTab] = useState<Tab>("data");

  // ── Data fields ──
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [prefix, setPrefix] = useState("");
  const [kode, setKode] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [departemen, setDepartemen] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [dokumen, setDokumen] = useState<File[]>([]);
  const [deletingDokumenId, setDeletingDokumenId] = useState<string | null>(
    null,
  );
  const [existingDokumen, setExistingDokumen] = useState<Pegawai["dokumen"]>(
    [],
  );

  // ── Akun fields ──
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<RoleStatus>("DAILY_ADMIN");

  // ── Reset password ──
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fotoRef = useRef<HTMLInputElement>(null);
  const dokumenRef = useRef<HTMLInputElement>(null);

  function toFullUrl(path: string) {
    return `${API_URL}/${path.replace(/^\/+/, "")}`;
  }

  // ── Populate ──
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("data");
    setNewPassword("");
    setShowNewPassword(false);
    if (initialData) {
      setNama(initialData.nama ?? "");
      setNip(initialData.nip ?? "");
      setPrefix(initialData.prefix ?? "");
      setKode(initialData.kode ?? "");
      setJabatan(initialData.jabatan ?? "");
      setDepartemen(initialData.departemen ?? "");
      setFotoPreview(
        initialData.fotoUrl ? toFullUrl(initialData.fotoUrl) : null,
      );
      setExistingDokumen(initialData.dokumen ?? []);
      setEmail(initialData.user?.email ?? "");
      setPhone(initialData.user?.phone ?? "");
      setRole((initialData.user?.role as RoleStatus) ?? "DAILY_ADMIN");
    } else {
      setNama("");
      setNip("");
      setPrefix("");
      setKode("");
      setJabatan("");
      setDepartemen("");
      setFotoPreview(null);
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("DAILY_ADMIN");
      setExistingDokumen([]);
    }
    setFoto(null);
    setDokumen([]);
  }, [isOpen, initialData]);

  // ── Handlers ──
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleDokumenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setDokumen((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleDeleteDokumen = async (dokumenId: string) => {
    if (!onDeleteDokumen) return;
    setDeletingDokumenId(dokumenId);
    try {
      await onDeleteDokumen(dokumenId);
      setExistingDokumen((prev) => prev.filter((d) => d.id !== dokumenId));
    } finally {
      setDeletingDokumenId(null);
    }
  };

  const handleSubmit = () => {
    if (!nama.trim()) return;
    const base = {
      nama,
      nip: nip || undefined,
      prefix: prefix || undefined,
      kode: kode || undefined,
      jabatan: jabatan || undefined,
      departemen: departemen || undefined,
      email,
      phone,
      role,
      ...(foto ? { foto } : {}),
      ...(dokumen.length > 0 ? { dokumen } : {}),
    };
    const payload = isEdit ? base : { ...base, password };
    onSubmit(payload as CreatePegawaiRequest | UpdatePegawaiRequest);
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !initialData || !onResetPassword) return;
    setIsResetting(true);
    try {
      await onResetPassword(initialData.id, newPassword);
      setNewPassword("");
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "data", label: "Data Diri" },
    { key: "akun", label: "Akun" },
    ...(isEdit ? [{ key: "password" as Tab, label: "Reset Password" }] : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">
              {isEdit ? "Edit Data Pegawai" : "Tambah Pegawai"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEdit
                ? `Mengedit data ${initialData?.nama}`
                : "Lengkapi data pegawai baru"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-zinc-400 hover:text-zinc-600 transition-colors mt-0.5 disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-t-lg transition-colors border-b-2 ${
                activeTab === t.key
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="border-t border-zinc-100 mx-6 shrink-0" />

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* ── TAB: DATA DIRI ── */}
          {activeTab === "data" && (
            <>
              {/* Foto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">
                  Foto
                </label>
                <div className="flex items-center gap-4">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="preview"
                      className="w-14 h-16 object-cover rounded-lg border border-zinc-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-16 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0">
                      <UserCircle2 className="w-7 h-7 text-zinc-300" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => fotoRef.current?.click()}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {fotoPreview ? "Ganti Foto" : "Upload Foto"}
                    </button>
                    {fotoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setFoto(null);
                          setFotoPreview(null);
                        }}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-100 rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus Foto
                      </button>
                    )}
                    <p className="text-[10px] text-zinc-400">
                      JPG, PNG, WEBP · Maks 5MB
                    </p>
                  </div>
                  <input
                    ref={fotoRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleFotoChange}
                  />
                </div>
              </div>

              {/* Nama */}
              <Field label="Nama" required>
                <Input
                  value={nama}
                  onChange={setNama}
                  disabled={isSaving}
                  placeholder="Nama lengkap"
                />
              </Field>

              {/* NIP */}
              <Field label="NIP" optional>
                <Input
                  value={nip}
                  onChange={setNip}
                  disabled={isSaving}
                  placeholder="Contoh: 19901215 202001 1 001"
                />
              </Field>

              {/* Prefix + Kode */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prefix" optional>
                  <Input
                    value={prefix}
                    onChange={setPrefix}
                    disabled={isSaving}
                    placeholder="Dr., Ir., dst."
                  />
                </Field>
                <Field label="Kode" optional>
                  <Input
                    value={kode}
                    onChange={setKode}
                    disabled={isSaving}
                    placeholder="Kode pegawai"
                  />
                </Field>
              </div>

              {/* Jabatan + Departemen */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Jabatan" optional>
                  <Input
                    value={jabatan}
                    onChange={setJabatan}
                    disabled={isSaving}
                    placeholder="Jabatan"
                  />
                </Field>
                <Field label="Departemen" optional>
                  <Input
                    value={departemen}
                    onChange={setDepartemen}
                    disabled={isSaving}
                    placeholder="Departemen"
                  />
                </Field>
              </div>

              {/* Dokumen existing */}
              {isEdit && existingDokumen.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-600">
                    Dokumen Tersimpan
                  </label>
                  <div className="space-y-1">
                    {existingDokumen.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-100 bg-zinc-50"
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <a
                          href={`${API_URL}/${doc.url.replace(/^\/+/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-600 hover:underline flex-1 truncate"
                        >
                          {doc.nama}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteDokumen(doc.id)}
                          disabled={deletingDokumenId === doc.id || isSaving}
                          className="text-red-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload dokumen baru */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600">
                  {isEdit ? "Tambah Dokumen Baru" : "Dokumen"}
                  <span className="ml-1 font-normal text-zinc-400">
                    (opsional)
                  </span>
                </label>
                {dokumen.length > 0 && (
                  <div className="space-y-1 mb-1">
                    {dokumen.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-100 bg-emerald-50"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-[11px] text-zinc-600 flex-1 truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setDokumen((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          disabled={isSaving}
                          className="text-red-400 hover:text-red-500 disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => dokumenRef.current?.click()}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors w-fit"
                >
                  <Upload className="w-3.5 h-3.5" /> Pilih File
                </button>
                <p className="text-[10px] text-zinc-400">
                  PDF, DOC, DOCX, XLS, XLSX · Maks 10MB per file
                </p>
                <input
                  ref={dokumenRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  className="hidden"
                  onChange={handleDokumenChange}
                />
              </div>
            </>
          )}

          {/* ── TAB: AKUN ── */}
          {activeTab === "akun" && (
            <>
              <Field label="Email" required>
                <Input
                  value={email}
                  onChange={setEmail}
                  disabled={isSaving}
                  placeholder="email@contoh.com"
                  type="email"
                />
              </Field>
              <Field label="No. HP" required>
                <Input
                  value={phone}
                  onChange={setPhone}
                  disabled={isSaving}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                />
              </Field>
              {!isEdit && (
                <Field label="Password" required>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSaving}
                      placeholder="Password"
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 pr-9 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </Field>
              )}
              <Field label="Role" required>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleStatus)}
                  disabled={isSaving}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white disabled:opacity-50"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {/* ── TAB: RESET PASSWORD ── */}
          {activeTab === "password" && isEdit && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-700">
                  Password baru akan langsung diterapkan ke akun pegawai ini.
                </p>
              </div>
              <Field label="Password Baru" required>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isResetting}
                    placeholder="Masukkan password baru"
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 pr-9 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </Field>
              <button
                onClick={handleResetPassword}
                disabled={isResetting || !newPassword.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg disabled:opacity-40 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {isResetting ? "Menyimpan..." : "Reset Password"}
              </button>
            </div>
          )}
        </div>

        {/* Footer — sembunyikan di tab password */}
        {activeTab !== "password" && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100 shrink-0">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || !nama.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg disabled:opacity-40 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Pegawai"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MINI HELPERS
// ─────────────────────────────────────────────

function Field({
  label,
  children,
  required,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-600">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-zinc-400">(opsional)</span>
        )}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white disabled:opacity-50 disabled:bg-zinc-50"
    />
  );
}
