import { useEffect, useState } from "react";
import {
  getMarketingActivity,
  getKehadiran,
} from "@/lib/services/dashboard.service";
import type {
  AERow,
  AttendanceItem,
  PieItem,
  KehadiranData,
} from "@/lib/services/dashboard.service";
import { getJadwalFix } from "@/lib/services/dashboard.service";
import type { MonthRow } from "@/lib/services/dashboard.service";

export function useMarketingActivity() {
  const [data, setData] = useState<AERow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMarketingActivity()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useKehadiran() {
  const [kehadiran, setKehadiran] = useState<KehadiranData>({
    attendanceData: [],
    pieData: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getKehadiran()
      .then(setKehadiran)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { ...kehadiran, loading, error };
}

export function useJadwalFix(quarter: string) {
  const [data, setData] = useState<MonthRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getJadwalFix(quarter)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [quarter]);

  return { data, loading, error };
}
