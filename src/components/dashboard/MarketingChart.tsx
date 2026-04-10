"use client";
import FIXvsTENChart from "./FIXvsTENChart";
import TrenAktivitasChart from "./TrenAktivitasChart";
import IndividuKaryawanCard from "./IndividuKaryawanCard";

const karyawanData = [
  { initial: "E", name: "Eni",    jabatan: "Sales Executive",  updateHariIni: 0,  target: 45,  env: 600,  csr: 532, tsm: 341, epm: 598, harian: [15,45,85,35,60], bulanan: { ten: [2,1,0], fix: [0,5,6] } },
  { initial: "S", name: "Sylva",  jabatan: "Senior Marketing", updateHariIni: 10, target: 90,  env: 563,  csr: 498, tsm: 370, epm: 582, harian: [95,60,40,75,55], bulanan: { ten: [6,8,5], fix: [0,10,2] } },
  { initial: "R", name: "Rifqi",  jabatan: "Sales Executive",  updateHariIni: 0,  target: 100, env: 463,  csr: 122, tsm: 121, epm: 212, harian: [25,90,20,25,15], bulanan: { ten: [4,0,3], fix: [0,0,0] } },
  { initial: "D", name: "Dimas",  jabatan: "Junior Sales",     updateHariIni: 2,  target: 25,  env: 100,  csr: 120, tsm: 90,  epm: 150, harian: [50,60,45,55,30], bulanan: { ten: [3,1,2], fix: [0,4,1] } },
  { initial: "W", name: "Wulan",  jabatan: "Sales Executive",  updateHariIni: 5,  target: 70,  env: 597,  csr: 583, tsm: 313, epm: 346, harian: [30,20,55,40,25], bulanan: { ten: [1,3,2], fix: [2,6,1] } },
  { initial: "A", name: "Arista", jabatan: "Marketing Staff",  updateHariIni: 1,  target: 60,  env: 464,  csr: 145, tsm: 63,  epm: 173, harian: [40,15,60,20,35], bulanan: { ten: [2,0,1], fix: [1,3,0] } },
  { initial: "B", name: "Biyan",  jabatan: "Marketing Staff",  updateHariIni: 0,  target: 80,  env: 210,  csr: 115, tsm: 90,  epm: 302, harian: [20,50,30,45,10], bulanan: { ten: [0,2,1], fix: [0,4,2] } },
  { initial: "J", name: "Jeane",  jabatan: "Sales Executive",  updateHariIni: 3,  target: 55,  env: 563,  csr: 156, tsm: 85,  epm: 269, harian: [35,25,70,30,50], bulanan: { ten: [1,0,2], fix: [0,2,1] } },
];

export default function MarketingChart() {
  return (
    <div className="px-4 py-4 space-y-4">

      {/* Row 1: 2 chart — stack di mobile, berdampingan di sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FIXvsTENChart />
        <TrenAktivitasChart />
      </div>

      {/* Row 2: Card individu scrollable horizontal */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
          Detail Aktivitas Individu Karyawan
        </p>
        <div className="overflow-x-auto pb-3 -mx-4 px-4 scrollbar-custom">
          <div className="flex gap-4 w-max">
            {karyawanData.map((k) => (
              <IndividuKaryawanCard key={k.name} data={k} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}