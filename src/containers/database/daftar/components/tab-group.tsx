"use client";

import React, { useMemo, useState } from "react";
import {
  Network,
  Building2,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Users,
  Factory,
  GitBranch,
  Crown,
} from "lucide-react";
import SearchInput from "@/components/base/search-input";
import TableButton from "@/components/base/table-button";
import Notification from "@/components/base/notifications";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type StatusPerusahaan =
  | "INDUK"
  | "CABANG"
  | "PABRIK"
  | "ANAK_PERUSAHAAN"
  | "SATU_GROUP"
  | "AFILIASI";

interface Company {
  id: string;
  nama: string;
  alamat: string;
  noTelp: string;
  groupId: string | null;
  status: StatusPerusahaan | null;
}

interface Group {
  id: string;
  nama: string;
  deskripsi: string;
  createdAt: string;
}

interface Notif {
  message: string;
  type: "success" | "error";
}

// ─────────────────────────────────────────────
// CONSTANTS (dummy data & lookups)
// ─────────────────────────────────────────────

const STATUS_LABELS: Record<StatusPerusahaan, string> = {
  INDUK: "Induk Perusahaan",
  CABANG: "Cabang",
  PABRIK: "Pabrik",
  ANAK_PERUSAHAAN: "Anak Perusahaan",
  SATU_GROUP: "Satu Group",
  AFILIASI: "Afiliasi",
};

const STATUS_BADGE: Record<StatusPerusahaan, string> = {
  INDUK: "bg-purple-100 text-purple-700",
  CABANG: "bg-blue-100 text-blue-600",
  PABRIK: "bg-orange-100 text-orange-600",
  ANAK_PERUSAHAAN: "bg-emerald-100 text-emerald-600",
  SATU_GROUP: "bg-zinc-100 text-zinc-600",
  AFILIASI: "bg-amber-100 text-amber-700",
};

const STATUS_OPTIONS: { value: StatusPerusahaan; label: string }[] =
  Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value: value as StatusPerusahaan,
    label,
  }));

let idCounter = 1;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function initialGroups(): Group[] {
  return [
    {
      id: "grp-1",
      nama: "Grup Astra",
      deskripsi: "Kumpulan perusahaan di bawah naungan Grup Astra.",
      createdAt: "2025-11-02",
    },
    {
      id: "grp-2",
      nama: "Grup Sinarmas",
      deskripsi: "Kumpulan perusahaan di bawah naungan Grup Sinarmas.",
      createdAt: "2025-12-10",
    },
    {
      id: "grp-3",
      nama: "Grup Salim",
      deskripsi: "Kumpulan perusahaan di bawah naungan Grup Salim.",
      createdAt: "2026-01-15",
    },
  ];
}

function initialCompanies(): Company[] {
  return [
    // Grup Astra
    {
      id: "co-1",
      nama: "PT Astra International Tbk",
      alamat: "Jl. Gaya Motor Raya, Jakarta Utara",
      noTelp: "021-6519999",
      groupId: "grp-1",
      status: "INDUK",
    },
    {
      id: "co-2",
      nama: "PT Astra Otoparts Tbk",
      alamat: "Jl. Raya Pegangsaan Dua, Jakarta Utara",
      noTelp: "021-4603550",
      groupId: "grp-1",
      status: "ANAK_PERUSAHAAN",
    },
    {
      id: "co-3",
      nama: "PT Toyota Astra Motor",
      alamat: "Jl. Yos Sudarso, Jakarta Utara",
      noTelp: "021-6510500",
      groupId: "grp-1",
      status: "ANAK_PERUSAHAAN",
    },
    {
      id: "co-4",
      nama: "PT Astra Honda Motor",
      alamat: "Jl. Laksda Yos Sudarso, Sunter",
      noTelp: "021-6512271",
      groupId: "grp-1",
      status: "CABANG",
    },
    {
      id: "co-5",
      nama: "PT Astra Agro Lestari Tbk",
      alamat: "Jl. Pulo Ayang, Jakarta Timur",
      noTelp: "021-46829999",
      groupId: "grp-1",
      status: "PABRIK",
    },

    // Grup Sinarmas
    {
      id: "co-6",
      nama: "PT Sinar Mas Multiartha Tbk",
      alamat: "Sinar Mas Land Plaza, Jakarta Pusat",
      noTelp: "021-50338899",
      groupId: "grp-2",
      status: "INDUK",
    },
    {
      id: "co-7",
      nama: "PT Sinarmas Land Tbk",
      alamat: "BSD Green Office Park, Tangerang",
      noTelp: "021-50384188",
      groupId: "grp-2",
      status: "ANAK_PERUSAHAAN",
    },
    {
      id: "co-8",
      nama: "PT Bank Sinarmas Tbk",
      alamat: "Sinar Mas MSIG Tower, Jakarta Selatan",
      noTelp: "021-29820000",
      groupId: "grp-2",
      status: "CABANG",
    },
    {
      id: "co-9",
      nama: "Pabrik Kertas Tjiwi Kimia",
      alamat: "Jl. Raya Surabaya - Mojokerto, Sidoarjo",
      noTelp: "031-8971085",
      groupId: "grp-2",
      status: "PABRIK",
    },

    // Grup Salim
    {
      id: "co-10",
      nama: "PT Indofood Sukses Makmur Tbk",
      alamat: "Sudirman Plaza, Jakarta Selatan",
      noTelp: "021-57958822",
      groupId: "grp-3",
      status: "INDUK",
    },
    {
      id: "co-11",
      nama: "PT Indofood CBP Sukses Makmur Tbk",
      alamat: "Sudirman Plaza, Jakarta Selatan",
      noTelp: "021-57958822",
      groupId: "grp-3",
      status: "ANAK_PERUSAHAAN",
    },
    {
      id: "co-12",
      nama: "PT Bogasari Flour Mills",
      alamat: "Jl. Raya Cilincing, Jakarta Utara",
      noTelp: "021-4390252",
      groupId: "grp-3",
      status: "PABRIK",
    },
    {
      id: "co-13",
      nama: "PT Indomarco Prismatama",
      alamat: "Jl. Ancol I, Jakarta Utara",
      noTelp: "021-6906920",
      groupId: "grp-3",
      status: "SATU_GROUP",
    },

    // Belum tergabung group manapun
    {
      id: "co-14",
      nama: "PT Maju Jaya Sentosa",
      alamat: "Jl. Sudirman Kav. 25, Jakarta Selatan",
      noTelp: "021-2500123",
      groupId: null,
      status: null,
    },
    {
      id: "co-15",
      nama: "PT Sejahtera Abadi Makmur",
      alamat: "Jl. Diponegoro, Bandung",
      noTelp: "022-4200456",
      groupId: null,
      status: null,
    },
    {
      id: "co-16",
      nama: "PT Karya Mandiri Bersama",
      alamat: "Jl. Pemuda, Surabaya",
      noTelp: "031-5300789",
      groupId: null,
      status: null,
    },
    {
      id: "co-17",
      nama: "CV Bangun Persada",
      alamat: "Jl. Gatot Subroto, Semarang",
      noTelp: "024-8500321",
      groupId: null,
      status: null,
    },
  ];
}

function getStats(companies: Company[], groupId: string) {
  const members = companies.filter((c) => c.groupId === groupId);
  return {
    total: members.length,
    induk: members.filter((c) => c.status === "INDUK").length,
    cabang: members.filter((c) => c.status === "CABANG").length,
    pabrik: members.filter((c) => c.status === "PABRIK").length,
    anak: members.filter((c) => c.status === "ANAK_PERUSAHAAN").length,
    lainnya: members.filter(
      (c) => c.status === "SATU_GROUP" || c.status === "AFILIASI",
    ).length,
  };
}

// ─────────────────────────────────────────────
// SMALL UI HELPERS
// ─────────────────────────────────────────────

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white transition-all"
    >
      <option value="ALL">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ status }: { status: StatusPerusahaan | null }) {
  if (!status) {
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-400">
        -
      </span>
    );
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function TabGroup() {
  const [groups, setGroups] = useState<Group[]>(initialGroups());
  const [companies, setCompanies] = useState<Company[]>(initialCompanies());
  const [notification, setNotification] = useState<Notif | null>(null);

  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // list view filters
  const [searchGroup, setSearchGroup] = useState("");
  const [searchPerusahaan, setSearchPerusahaan] = useState("");
  const [filterGroupId, setFilterGroupId] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // group form modal (create/edit)
  const [groupModal, setGroupModal] = useState<{
    mode: "create" | "edit";
    id?: string;
    nama: string;
    deskripsi: string;
  } | null>(null);

  const [deleteGroupTarget, setDeleteGroupTarget] = useState<Group | null>(
    null,
  );

  const notify = (message: string, type: Notif["type"] = "success") =>
    setNotification({ message, type });

  // ── derived: groups filtered by search ──
  const filteredGroups = useMemo(
    () =>
      groups.filter((g) =>
        g.nama.toLowerCase().includes(searchGroup.trim().toLowerCase()),
      ),
    [groups, searchGroup],
  );

  // ── derived: flat company table with 1 search + 2 dropdown filters ──
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => c.groupId !== null)
      .filter((c) =>
        c.nama.toLowerCase().includes(searchPerusahaan.trim().toLowerCase()),
      )
      .filter((c) => filterGroupId === "ALL" || c.groupId === filterGroupId)
      .filter((c) => filterStatus === "ALL" || c.status === filterStatus);
  }, [companies, searchPerusahaan, filterGroupId, filterStatus]);

  const belumTergabung = companies.filter((c) => c.groupId === null);
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  // ── group CRUD ──
  const openCreateGroup = () =>
    setGroupModal({ mode: "create", nama: "", deskripsi: "" });

  const openEditGroup = (g: Group) =>
    setGroupModal({
      mode: "edit",
      id: g.id,
      nama: g.nama,
      deskripsi: g.deskripsi,
    });

  const submitGroupModal = () => {
    if (!groupModal || !groupModal.nama.trim()) {
      notify("Nama group wajib diisi.", "error");
      return;
    }
    if (groupModal.mode === "create") {
      const newGroup: Group = {
        id: nextId("grp"),
        nama: groupModal.nama.trim(),
        deskripsi: groupModal.deskripsi.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setGroups((prev) => [newGroup, ...prev]);
      notify("Group berhasil ditambahkan.");
    } else if (groupModal.id) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupModal.id
            ? { ...g, nama: groupModal.nama.trim(), deskripsi: groupModal.deskripsi.trim() }
            : g,
        ),
      );
      notify("Group berhasil diperbarui.");
    }
    setGroupModal(null);
  };

  const confirmDeleteGroup = () => {
    if (!deleteGroupTarget) return;
    setGroups((prev) => prev.filter((g) => g.id !== deleteGroupTarget.id));
    setCompanies((prev) =>
      prev.map((c) =>
        c.groupId === deleteGroupTarget.id
          ? { ...c, groupId: null, status: null }
          : c,
      ),
    );
    notify(`Group "${deleteGroupTarget.nama}" berhasil dihapus.`);
    setDeleteGroupTarget(null);
    if (selectedGroupId === deleteGroupTarget.id) {
      setView("list");
      setSelectedGroupId(null);
    }
  };

  // ── membership actions ──
  const handleAddCompany = (companyId: string, status: StatusPerusahaan) => {
    if (!selectedGroupId) return;
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, groupId: selectedGroupId, status } : c,
      ),
    );
    notify("Perusahaan berhasil ditambahkan ke group.");
  };

  const handleRemoveCompany = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, groupId: null, status: null } : c,
      ),
    );
    notify("Perusahaan berhasil dikeluarkan dari group.");
  };

  const handleChangeStatus = (companyId: string, status: StatusPerusahaan) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, status } : c)),
    );
  };

  const openDetail = (groupId: string) => {
    setSelectedGroupId(groupId);
    setView("detail");
  };

  return (
    <div className="space-y-4">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {view === "list" ? (
        <ListView
          groups={filteredGroups}
          allGroups={groups}
          companies={companies}
          belumTergabung={belumTergabung.length}
          searchGroup={searchGroup}
          onSearchGroup={setSearchGroup}
          onCreateGroup={openCreateGroup}
          onEditGroup={openEditGroup}
          onDeleteGroup={setDeleteGroupTarget}
          onOpenDetail={openDetail}
          filteredCompanies={filteredCompanies}
          searchPerusahaan={searchPerusahaan}
          onSearchPerusahaan={setSearchPerusahaan}
          filterGroupId={filterGroupId}
          onFilterGroupId={setFilterGroupId}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
        />
      ) : (
        selectedGroup && (
          <DetailView
            group={selectedGroup}
            companies={companies}
            belumTergabung={belumTergabung}
            onBack={() => {
              setView("list");
              setSelectedGroupId(null);
            }}
            onEditGroup={() => openEditGroup(selectedGroup)}
            onDeleteGroup={() => setDeleteGroupTarget(selectedGroup)}
            onAddCompany={handleAddCompany}
            onRemoveCompany={handleRemoveCompany}
            onChangeStatus={handleChangeStatus}
          />
        )
      )}

      {/* Modal Tambah/Edit Group */}
      {groupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setGroupModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-500" />
                {groupModal.mode === "create" ? "Tambah Group" : "Edit Group"}
              </span>
              <button
                onClick={() => setGroupModal(null)}
                className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                  Nama Group
                </label>
                <input
                  autoFocus
                  type="text"
                  value={groupModal.nama}
                  onChange={(e) =>
                    setGroupModal((prev) =>
                      prev ? { ...prev, nama: e.target.value } : prev,
                    )
                  }
                  placeholder="Contoh: Grup Astra"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                  Deskripsi (opsional)
                </label>
                <textarea
                  value={groupModal.deskripsi}
                  onChange={(e) =>
                    setGroupModal((prev) =>
                      prev ? { ...prev, deskripsi: e.target.value } : prev,
                    )
                  }
                  rows={3}
                  placeholder="Keterangan singkat mengenai group ini..."
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                />
              </div>
            </div>
            <div className="px-5 py-4 bg-zinc-50/60 border-t border-zinc-100 flex justify-end gap-2">
              <button
                onClick={() => setGroupModal(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={submitGroupModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Group */}
      {deleteGroupTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteGroupTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-sm font-bold text-zinc-800 mb-2">
              Hapus Group
            </h3>
            <p className="text-xs text-zinc-500 mb-5">
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-semibold text-zinc-700">
                {deleteGroupTarget.nama}
              </span>
              ? Semua perusahaan anggota akan dikeluarkan dari group ini.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteGroupTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteGroup}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LIST VIEW
// ─────────────────────────────────────────────

function ListView({
  groups,
  allGroups,
  companies,
  belumTergabung,
  searchGroup,
  onSearchGroup,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onOpenDetail,
  filteredCompanies,
  searchPerusahaan,
  onSearchPerusahaan,
  filterGroupId,
  onFilterGroupId,
  filterStatus,
  onFilterStatus,
}: {
  groups: Group[];
  allGroups: Group[];
  companies: Company[];
  belumTergabung: number;
  searchGroup: string;
  onSearchGroup: (v: string) => void;
  onCreateGroup: () => void;
  onEditGroup: (g: Group) => void;
  onDeleteGroup: (g: Group) => void;
  onOpenDetail: (id: string) => void;
  filteredCompanies: Company[];
  searchPerusahaan: string;
  onSearchPerusahaan: (v: string) => void;
  filterGroupId: string;
  onFilterGroupId: (v: string) => void;
  filterStatus: string;
  onFilterStatus: (v: string) => void;
}) {
  const totalTergabung = companies.filter((c) => c.groupId !== null).length;

  return (
    <>
      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Network className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-800 leading-none">
              {allGroups.length}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">Total Group</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Building2 className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-800 leading-none">
              {totalTergabung}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Perusahaan Tergabung
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5 text-zinc-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-800 leading-none">
              {belumTergabung}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">Belum Tergabung</p>
          </div>
        </div>
      </div>

      {/* List Group */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-500" />
            List Group
          </span>
          <div className="flex items-center gap-2">
            <SearchInput
              value={searchGroup}
              onChange={onSearchGroup}
              placeholder="Cari nama group..."
            />
            <TableButton icon="plus" onClick={onCreateGroup}>
              Tambah Group
            </TableButton>
          </div>
        </div>

        <div className="p-5">
          {groups.length === 0 ? (
            <p className="text-center text-xs text-zinc-400 py-8">
              Tidak ada group ditemukan.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {groups.map((g) => {
                const stats = getStats(companies, g.id);
                return (
                  <div
                    key={g.id}
                    className="border border-zinc-200 rounded-2xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-zinc-800 truncate">
                          {g.nama}
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">
                          {g.deskripsi || "Tidak ada deskripsi."}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditGroup(g)}
                          title="Edit group"
                          className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteGroup(g)}
                          title="Hapus group"
                          className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-100 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-zinc-800">
                        {stats.total}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        perusahaan
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">
                        <Crown className="w-2.5 h-2.5" /> Induk {stats.induk}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-600">
                        <GitBranch className="w-2.5 h-2.5" /> Cabang{" "}
                        {stats.cabang}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-600">
                        <Factory className="w-2.5 h-2.5" /> Pabrik{" "}
                        {stats.pabrik}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-600">
                        Anak Usaha {stats.anak}
                      </span>
                      {stats.lainnya > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600">
                          Lainnya {stats.lainnya}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenDetail(g.id)}
                      className="mt-4 w-full px-3 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      Lihat Detail
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Semua Perusahaan dalam Group (search by group, by status) */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            Semua Perusahaan dalam Group
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={searchPerusahaan}
              onChange={onSearchPerusahaan}
              placeholder="Cari perusahaan..."
            />
            <FilterSelect
              value={filterGroupId}
              onChange={onFilterGroupId}
              placeholder="Semua Group"
              options={allGroups.map((g) => ({ value: g.id, label: g.nama }))}
            />
            <FilterSelect
              value={filterStatus}
              onChange={onFilterStatus}
              placeholder="Semua Status"
              options={STATUS_OPTIONS}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Perusahaan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Group
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Status
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs text-zinc-400">
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c, index) => {
                  const group = allGroups.find((g) => g.id === c.groupId);
                  return (
                    <tr key={c.id} className="border-b border-zinc-50">
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                        {c.nama}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {group?.nama ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {group && (
                          <button
                            onClick={() => onOpenDetail(group.id)}
                            className="text-emerald-700 underline cursor-pointer hover:text-emerald-800"
                          >
                            Lihat Group
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// DETAIL VIEW
// ─────────────────────────────────────────────

function DetailView({
  group,
  companies,
  belumTergabung,
  onBack,
  onEditGroup,
  onDeleteGroup,
  onAddCompany,
  onRemoveCompany,
  onChangeStatus,
}: {
  group: Group;
  companies: Company[];
  belumTergabung: Company[];
  onBack: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onAddCompany: (companyId: string, status: StatusPerusahaan) => void;
  onRemoveCompany: (companyId: string) => void;
  onChangeStatus: (companyId: string, status: StatusPerusahaan) => void;
}) {
  const [searchDetail, setSearchDetail] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [searchAdd, setSearchAdd] = useState("");
  const [pickedStatus, setPickedStatus] = useState<
    Record<string, StatusPerusahaan>
  >({});
  const [removeTarget, setRemoveTarget] = useState<Company | null>(null);

  const members = companies
    .filter((c) => c.groupId === group.id)
    .filter((c) =>
      c.nama.toLowerCase().includes(searchDetail.trim().toLowerCase()),
    );

  const stats = getStats(companies, group.id);

  const availableToAdd = belumTergabung.filter((c) =>
    c.nama.toLowerCase().includes(searchAdd.trim().toLowerCase()),
  );

  const confirmRemove = () => {
    if (!removeTarget) return;
    onRemoveCompany(removeTarget.id);
    setRemoveTarget(null);
  };

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke List Group
      </button>

      {/* Header group */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-800">{group.nama}</h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-xl">
              {group.deskripsi || "Tidak ada deskripsi."}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Dibuat: {group.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEditGroup}
              className="px-3 py-1.5 text-xs font-medium rounded-sm border border-zinc-200 text-zinc-600 hover:bg-zinc-50 flex items-center gap-1.5"
            >
              <Pencil className="w-3 h-3" /> Edit Group
            </button>
            <button
              onClick={onDeleteGroup}
              className="px-3 py-1.5 text-xs font-medium rounded-sm bg-red-500 text-white hover:bg-red-600 flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" /> Hapus Group
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-100 text-zinc-700">
            Total {stats.total}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-100 text-purple-700">
            <Crown className="w-3 h-3" /> Induk {stats.induk}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-100 text-blue-600">
            <GitBranch className="w-3 h-3" /> Cabang {stats.cabang}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-orange-100 text-orange-600">
            <Factory className="w-3 h-3" /> Pabrik {stats.pabrik}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-100 text-emerald-600">
            Anak Usaha {stats.anak}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-100 text-amber-700">
            Lainnya {stats.lainnya}
          </span>
        </div>
      </div>

      {/* Anggota group */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            Perusahaan dalam Group
          </span>
          <div className="flex items-center gap-2">
            <SearchInput
              value={searchDetail}
              onChange={setSearchDetail}
              placeholder="Cari perusahaan..."
            />
            <TableButton icon="plus" onClick={() => setAddModalOpen(true)}>
              Tambahkan Perusahaan
            </TableButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Nama Perusahaan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  No. Telp
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-48">
                  Status
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs text-zinc-400">
                    Belum ada perusahaan dalam group ini.
                  </td>
                </tr>
              ) : (
                members.map((c, index) => (
                  <tr key={c.id} className="border-b border-zinc-50">
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                      {c.nama}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {c.noTelp || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <select
                        value={c.status ?? ""}
                        onChange={(e) =>
                          onChangeStatus(
                            c.id,
                            e.target.value as StatusPerusahaan,
                          )
                        }
                        className={`text-[11px] font-semibold border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 ${
                          c.status ? STATUS_BADGE[c.status] : ""
                        }`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <button
                        onClick={() => setRemoveTarget(c)}
                        className="text-red-400 hover:text-red-500 hover:underline transition-colors"
                      >
                        Keluarkan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambahkan Perusahaan */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <span className="font-bold text-zinc-800 text-sm">
                Tambahkan Perusahaan ke {group.nama}
              </span>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-zinc-100">
              <SearchInput
                value={searchAdd}
                onChange={setSearchAdd}
                placeholder="Cari perusahaan belum tergabung..."
              />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {availableToAdd.length === 0 ? (
                <p className="text-center text-xs text-zinc-400 py-8">
                  Tidak ada perusahaan tersedia untuk ditambahkan.
                </p>
              ) : (
                availableToAdd.map((c) => {
                  const status = pickedStatus[c.id] ?? "SATU_GROUP";
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3 border border-zinc-200 rounded-xl px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-700 truncate">
                          {c.nama}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {c.alamat}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={status}
                          onChange={(e) =>
                            setPickedStatus((prev) => ({
                              ...prev,
                              [c.id]: e.target.value as StatusPerusahaan,
                            }))
                          }
                          className="text-[11px] border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-300"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onAddCompany(c.id, status)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors whitespace-nowrap"
                        >
                          Tambahkan
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Remove */}
      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setRemoveTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-sm font-bold text-zinc-800 mb-2">
              Keluarkan Perusahaan
            </h3>
            <p className="text-xs text-zinc-500 mb-5">
              Apakah kamu yakin ingin mengeluarkan{" "}
              <span className="font-semibold text-zinc-700">
                {removeTarget.nama}
              </span>{" "}
              dari group ini?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRemoveTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Ya, Keluarkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
