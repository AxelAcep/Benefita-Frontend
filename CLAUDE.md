Lihat [AGENTS.md](./AGENTS.md). Satu dokumen untuk semua agen, supaya tidak ada dua panduan yang melenceng.


## Handoff terbaru — 27 November 2026

Dua dokumen, dibaca berurutan:

1. [HANDOFF-CLAUDE-2026-11-27.md](../HANDOFF-CLAUDE-2026-11-27.md) — arahan
   lingkungan, branch, cara menjalankan tes, dan larangan `prisma migrate dev`.
   Masih berlaku.
2. [HANDOFF-2026-11-27-CLAUDE-KE-CODEX.md](../HANDOFF-2026-11-27-CLAUDE-KE-CODEX.md)
   — pekerjaan setelahnya: migrasi hak akses ENV/CSR/TSM/EPM, Pos, Penawaran,
   ASAP dan Tugas, plus daftar yang masih terbuka. Angka pada dokumen lama
   sudah usang; yang ini menggantikannya.

Jangan mengulang seluruh pipeline migrasi. Skrip di `migration-script/`
idempoten lewat `sumberId`, jalankan satu per satu sesuai kebutuhan.
