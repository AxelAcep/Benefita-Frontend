# Benefita Frontend — panduan untuk agen

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + react-hook-form + zod.
Backend terpisah di `../Benefita-Backend`, dipanggil lewat `NEXT_PUBLIC_API_URL`.

Repositori ini sedang direfaktur bertahap, satu halaman per langkah. Baca
bagian **Kontrak lapisan** sebelum menulis kode: halaman yang sudah
dirapikan mengikuti pola itu, dan halaman berikutnya harus menyusul.

```bash
npm run dev                 # server pengembangan
npx tsc --noEmit            # wajib 0 error sebelum commit
npx next build              # wajib lolos sebelum commit
```

`npm run lint` saat ini gagal: tidak ada `eslint.config.js`. Itu masalah
lama, bukan akibat refaktur. Jangan jadikan penghalang; typecheck dan
build adalah gerbang yang berlaku.

---

## Kontrak lapisan

Lima lapis, dari luar ke dalam. Tiap lapis hanya boleh tahu lapis di
bawahnya.

```
src/app/<rute>/page.tsx        rute saja, 5 baris, tanpa props
src/containers/<modul>/<hal>/  isi halaman
  index.tsx                    tata letak + definisi kolom + wiring
  manage.ts                    keadaan UI: modal, baris terpilih, simpan, notif
  form.tsx                     skema zod + field
  components/                  komponen yang HANYA dipakai halaman ini
src/hooks/                     pengambilan data
src/lib/services/              endpoint + bentuk permintaan
src/lib/types/                 tipe dan pemetaan bentuk data
src/lib/api/client.ts          satu-satunya tempat fetch dirakit
src/components/base/           komponen yang dipakai lebih dari satu halaman
```

### `app/` murni routing

`page.tsx` **tidak boleh punya props**. Next 16 selalu mengoper `PageProps`
ke default export sebuah route; komponen ber-props di situ menghasilkan
type error di `.next/types`. Bentuknya selalu:

```tsx
import TUKContainer from "@/containers/training/tuk";

export default function Page() {
  return <TUKContainer />;
}
```

Mode tambah atau ubah **diturunkan dari parameter rute**, bukan dari prop:

```tsx
const params = useParams<{ id?: string }>();
const isEdit = Boolean(params?.id);
```

Satu container dipakai dua rute (`tambah` dan `edit/[id]`). Lihat
`containers/training/berita/form` dan `containers/training/jadwal/form`.
Jangan membuat dua berkas formulir yang saling menyalin — itu persis yang
sedang dibersihkan di sini.

### `lib/api/client.ts`

Semua panggilan API lewat sini. Jangan memanggil `fetch` atau merakit
`NEXT_PUBLIC_API_URL` di tempat lain.

```ts
apiList<T>(path, params)     // daftar; hasilnya ListResult<T> yang seragam
apiGet<T>(path, params?)     // membuka pembungkus `data` kalau ada
apiPost / apiPut / apiPatch / apiDelete
apiPostForm / apiPutForm + keFormData   // multipart, untuk unggahan berkas
```

`apiList` menyeragamkan bentuk paginasi backend yang belum konsisten:
`pagination`, `meta`, bahkan `totalPage` tanpa "s". Hook tidak perlu tahu
bedanya. `keFormData` mengirim array sebagai field berulang, bentuk yang
diharapkan backend untuk `trainerKodes`.

Autentikasi tetap ditangani `fetchWithAuth` di `lib/services/login.service.ts`
(token + silent refresh); `client.ts` hanya membungkusnya.

### `hooks/use-resource.ts`

Daftar + paginasi + pencarian + filter + CRUD, ditulis sekali. Hook per
entitas tinggal menyerahkan service-nya:

```ts
export function useTUK(limit = 10) {
  return useResource<TUK, number, CreateTUKRequest, UpdateTUKRequest>(
    tukService,
    { limit, pesanGagal: "Gagal mengambil data TUK" },
  );
}
```

`create`, `update`, dan `remove` opsional: sebagian halaman hanya membaca,
sebagian endpoint hapusnya belum ada. Parameter tipe kelima (`R`) untuk
endpoint yang hasil create/update-nya berbentuk detail, bukan baris daftar.

Jangan paksakan `useResource` kalau halaman butuh akses langsung ke state
datanya — contohnya `usePesertaUji`, yang menerapkan centang secara
optimistik lalu mengembalikannya kalau gagal. Hook seperti itu ditulis
tangan, dengan alasannya ditulis di komentar.

Hook lama yang belum dimigrasi **tidak dibuang**. Dimigrasi ikut giliran
halamannya.

### `components/base/`

Komponen yang dipakai lebih dari satu halaman. Yang khusus satu halaman
tinggal di `containers/<modul>/<halaman>/components/`.

| Berkas | Guna |
|---|---|
| `data-table.tsx` | Tabel + pencarian + slot filter dan aksi |
| `table-pagination.tsx` | Paginasi berjendela; jangan merender semua nomor halaman |
| `base-modal.tsx` | Kerangka modal: overlay, header, footer, Esc, kunci scroll |
| `form-modal.tsx` | `base-modal` + react-hook-form + zod + tombol simpan |
| `form-field.tsx` | `TextInput`, `TextArea`, `SelectInput`, `Field` — meneruskan ref |
| `confirm-modal.tsx` | Dialog konfirmasi hapus |
| `notifications.tsx` | Notifikasi; beri `key` baru tiap pesan agar ter-mount ulang |

**Penting soal field.** `form-field.tsx` meneruskan ref, jadi cocok dengan
`{...register("nama")}`. `form-input.tsx` yang lama hanya menerima
`value` + `onChange` dan **tidak** bisa dipakai dengan react-hook-form —
itulah sebab dulu `FieldLabel` ditulis ulang di 11 berkas dan `inputCls`
disalin di 18. Untuk formulir baru pakai `form-field`. `form-input` lama
tidak diubah karena masih dipakai puluhan berkas yang belum dirapikan.

---

## Resep satu halaman

Kerjakan **satu halaman sampai tuntas**, jangan menyebar. Urutannya:

1. Baca halaman, hook, service, dan modalnya. Telusuri juga siapa saja
   yang mengimpornya — sering ada pemakai lintas modul.
2. Tipe keluar ke `lib/types/<entitas>.ts`. Service **tetap mengekspor
   ulang** tipe itu supaya berkas lama tidak rusak.
3. Service ditipiskan lewat `lib/api/client.ts`.
4. Hook disederhanakan, biasanya lewat `useResource`.
5. `manage.ts` menyerap keadaan UI dari halaman.
6. `form.tsx` memakai `FormModal` + `form-field`.
7. `index.tsx` tinggal tata letak, kolom, dan wiring.
8. `page.tsx` jadi pembungkus 5 baris.
9. Hapus modal lama **hanya setelah** dipastikan tidak ada yang
   mengimpornya lagi (`grep -rn`).
10. `npx tsc --noEmit` 0 error dan `npx next build` lolos. Baru commit.

Satu halaman satu commit. Pesan commit menyebut temuan dan alasannya,
bukan cuma "refactor".

---

## Jebakan yang sudah ditemukan

Pola berikut berulang di seluruh repositori. Saat merapikan halaman baru,
periksa semuanya.

**Daftar pilihan yang dipaku.** Dropdown diisi array literal yang tidak
cocok dengan isi database. Contoh nyata: filter kota Hotel diturunkan dari
berkas data dummy; dua dropdown tipe di halaman Judul berbeda isi dan
dua-duanya salah; status Jadwal menawarkan `TENTATIVE` dan `SELESAI`
padahal yang tersimpan `TENTATIF`, `TERKONFIRMASI`, `BATAL`. Perbaikannya
selalu sama: endpoint distinct di backend, lalu satu hook untuk mengisinya.

**Data dummy menyamar jadi fitur.** Beberapa halaman tidak pernah
memanggil API sama sekali. Periksa dengan `grep -c "fetch\|service" pada
berkasnya sebelum percaya halaman itu hidup.

**Galat ditelan jadi daftar kosong.** `.catch(() => setData([]))` membuat
gangguan jaringan terlihat persis seperti "tidak ada data". Selalu simpan
dan tampilkan pesan galatnya.

**Permintaan lama menimpa yang baru.** `useEffect` yang mengambil detail
tanpa pembatalan: klik cepat antar baris membuat hasil lama mendarat
belakangan. Pakai pola `let batal = false` dengan pembersihan.

**Prop yang tidak pernah dioper.** `userName="Nanang"` dan `subtitle`
berisi tanggal dipaku masih tersisa di beberapa halaman. `AppLayout`
menimpanya dengan data user yang sedang login, jadi tidak berefek — tapi
menyesatkan. Buang saat halaman itu kebagian giliran.

**Kunci baris bukan selalu `id`.** Hotel memakai `kodeHotel`, Jadwal
Training memakai `noJadwal`. Backend mencarinya dengan kunci itu, jadi
saat mengubah data pakai **nilai asli** baris tersebut, bukan isian
formulir yang mungkin sudah diedit. Field kuncinya dibuat read-only saat
mode ubah.

**Paginasi merender semua nomor halaman.** Sudah diperbaiki di
`base/table-pagination.tsx`. Jangan menulis blok paginasi sendiri lagi.

---

## Keadaan saat ini

Sudah mengikuti pola container:

- `training/` — 14 halaman, seluruhnya
- `input/invoice`, `input/kwitansi` — baru dipindah, isinya belum dirapikan

Belum disentuh, menurut besarnya:

```
dokumen       1.265 baris     3 berkas
bdo           3.144           8
(pages)       3.379          11   ← karyawan ada di sini
perusahaan    4.009          12
peserta       5.993          12
accounting   11.887          37
database     ~40.000        162
```

**Urutan yang disepakati pemilik repositori: `database/` dikerjakan
paling akhir, bukan pertama.** Modul itu yang paling rumit, terutama
`database/perusahaan`. Jangan mengambilnya lebih dulu hanya karena
duplikasinya paling kasat mata.

Urutan yang dianjurkan: `dokumen` → `bdo` → `(pages)` → `perusahaan` →
`peserta` → `accounting` → `database`. Naik perlahan dari yang kecil,
supaya pola yang dipakai sudah matang sebelum menyentuh yang besar.

Catatan tentang `database/` untuk nanti: lima entitas (`perusahaan`,
`pemda`, `sekolah`, `rumah-sakit`, `instansi-daerah`) punya belasan berkas
yang **identik byte demi byte** — `tab-daily.tsx`, `tab-contact-person.tsx`,
`modal-akses.tsx`, `modal-pos.tsx`, dan beberapa `card-*`. Ubah satu,
empat lainnya ketinggalan. Pola `containers/training/laporan-peserta-uji`
adalah contoh cara menyatukannya: satu kerangka bersama, tiap halaman
menyerahkan bagian yang berbeda saja. Karena salah pola sekali berarti
salah lima kali, modul ini dikerjakan setelah pola terbukti di modul lain.

### Menyusul

Halaman pengaturan hak akses: `PermissionProvider` + `useCan` + `<Can>` +
grid role × modul × 4 kolom centang, plus kelola role. Backendnya sudah
jadi dan teruji; lihat `../Benefita-Backend/AGENTS.md`.

`RoleStatus` di `lib/services/pegawai.service.ts` masih tipe literal
berisi 8 nilai. Role sekarang tabel di backend, jadi tipe itu harus
diganti dengan pembacaan `GET /api/role` — kalau tidak, role baru tidak
akan muncul di dropdown karyawan. Perhatikan juga nilai `USER` di situ
tidak pernah ada di backend.
