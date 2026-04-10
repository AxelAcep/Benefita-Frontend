export interface Trainer {
  id: number;
  kode: string;
  nama: string;
  hp: string;
  email: string;
  kantor: string;
  alamat: string;
  alamatKantor: string;
  noTelpKantor: string;
  referensi: string[];
  subyekKhusus: string | null;
  keterangan: string | null;
  tugas: string | null;
  jumlahHari: number;
}

export const dummyTrainers: Trainer[] = [
  {
    id: 1,
    kode: "HH",
    nama: "Husni Husnayan",
    hp: "081234567890",
    email: "husni@example.com",
    kantor: "Jakarta",
    alamat: "Jl. Taman Margasatwa Raya, RW.11, Jati Padang, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12540",
    alamatKantor: "Ragunan, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta",
    noTelpKantor: "(021) 123456",
    referensi: ["FI-10","FI-11","FI-12","PR-08","PR-09","OP-03","LG-05","LG-06","AD-10","EP-19","WM-05","WM-09","HR-01","HR-02","IT-05","IT-06","IT-07","MK-01","MK-02","OP-04","SA-15","SA-16","CS-01","CS-02","AD-11","AD-12","RD-01"],
    subyekKhusus: "Manajemen",
    keterangan: null,
    tugas: "24 Mar 2025",
    jumlahHari: 196,
  },
  {
    id: 2,
    kode: "AS",
    nama: "Ahmad Syafiq",
    hp: "085678901234",
    email: "ahmad@example.com",
    kantor: "Jakarta",
    alamat: "Jl. Kemanggisan Ilir III No. 45, Palmerah, Jakarta Barat 11480",
    alamatKantor: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
    noTelpKantor: "(021) 987654",
    referensi: ["FI-10"],
    subyekKhusus: null,
    keterangan: null,
    tugas: null,
    jumlahHari: 0,
  },
  {
    id: 3,
    kode: "HH",
    nama: "Hana Hussain",
    hp: "081234567890",
    email: "husni@example.com",
    kantor: "Jakarta",
    alamat: "Jl. Ampera Raya No. 9, Cilandak, Jakarta Selatan 12560",
    alamatKantor: "Jl. TB Simatupang No.10, Cilandak, Jakarta Selatan",
    noTelpKantor: "(021) 765432",
    referensi: ["FI-10","FI-11","FI-12","PR-08"],
    subyekKhusus: "Manajemen",
    keterangan: "Trainer senior bidang manajemen",
    tugas: "15 Jan 2025",
    jumlahHari: 30,
  },
  {
    id: 4,
    kode: "RN",
    nama: "Rina Novita",
    hp: "081234567890",
    email: "husni@example.com",
    kantor: "Jakarta",
    alamat: "Jl. Pasar Minggu Raya No. 17, Jakarta Selatan 12740",
    alamatKantor: "Jl. HR Rasuna Said Kav. C-22, Kuningan, Jakarta Selatan",
    noTelpKantor: "(021) 543210",
    referensi: ["FI-10","FI-11","FI-12","PR-08"],
    subyekKhusus: "Manajemen",
    keterangan: null,
    tugas: "10 Feb 2025",
    jumlahHari: 24,
  },
  {
    id: 5,
    kode: "BW",
    nama: "Budi Wijaya",
    hp: "087711223344",
    email: "budi@example.com",
    kantor: "Surabaya",
    alamat: "Jl. Raya Darmo No. 35, Wonokromo, Surabaya 60241",
    alamatKantor: "Jl. Embong Malang No. 1, Surabaya",
    noTelpKantor: "(031) 112233",
    referensi: ["K3-01","K3-02","EP-10","EP-11"],
    subyekKhusus: "K3",
    keterangan: "Spesialis K3 industri",
    tugas: "20 Feb 2025",
    jumlahHari: 45,
  },
  {
    id: 6,
    kode: "SR",
    nama: "Sari Rahayu",
    hp: "082233445566",
    email: "sari@example.com",
    kantor: "Bandung",
    alamat: "Jl. Dipatiukur No. 112, Coblong, Bandung 40132",
    alamatKantor: "Jl. Asia Afrika No. 8, Bandung",
    noTelpKantor: "(022) 334455",
    referensi: ["ISO-01","ISO-02","ISO-03"],
    subyekKhusus: "ISO",
    keterangan: null,
    tugas: "05 Mar 2025",
    jumlahHari: 18,
  },
  {
    id: 7,
    kode: "DK",
    nama: "Doni Kusuma",
    hp: "089966778899",
    email: "doni@example.com",
    kantor: "Yogyakarta",
    alamat: "Jl. Laksda Adisucipto No. 55, Depok, Sleman 55281",
    alamatKantor: "Jl. Malioboro No. 60, Yogyakarta",
    noTelpKantor: "(0274) 556677",
    referensi: ["ENV-01","ENV-02","AMDAL-01"],
    subyekKhusus: "Lingkungan",
    keterangan: "Ahli AMDAL bersertifikat",
    tugas: "12 Mar 2025",
    jumlahHari: 62,
  },
];