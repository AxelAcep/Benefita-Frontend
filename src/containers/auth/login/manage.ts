"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { generateDeviceHash, generateDeviceLabel, loginUser, verifyOtp } from "@/lib/services/login.service";

export function useLoginManage() {
  const router = useRouter();
  const { setAuthenticated } = useAuth();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpMeta, setOtpMeta] = useState<{
    deviceHash: string;
    deviceLabel: string;
  } | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoginValid = Boolean(email.trim() && password);
  const isOtpValid = otpCode.length === 6;

  async function handleLogin() {
    if (!isLoginValid || loading) return;
    setLoading(true);
    setError("");
    try {
      const deviceHash = generateDeviceHash();
      const deviceLabel = generateDeviceLabel();

      const res = await loginUser({ email: email.trim(), password, deviceHash, deviceLabel });

      if (res.requireOtp) {
        setOtpMeta({ deviceHash, deviceLabel });
        setIsOtpStep(true);
      } else if (res.user) {
        // token & user sudah disimpan di memory oleh loginUser()
        // Sinkronkan AuthContext supaya status langsung "authenticated" —
        // tanpa ini, route guard di AuthContext akan salah mem-bounce
        // navigasi client-side berikutnya (lihat AuthContext.tsx).
        setAuthenticated(res.user);
        router.push("/dashboard");
      } else {
        setError("Server tidak mengembalikan sesi pengguna.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otpMeta || !isOtpValid || loading) return;
    setLoading(true);
    setError("");
    try {
      const data = await verifyOtp({
        email: email.trim(),
        deviceHash: otpMeta.deviceHash,
        deviceLabel: otpMeta.deviceLabel,
        code: otpCode,
      });
      // token & user sudah disimpan di memory oleh verifyOtp()
      setAuthenticated(data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verifikasi OTP gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function kembaliKeLogin() {
    setIsOtpStep(false);
    setOtpMeta(null);
    setError("");
    setOtpCode("");
  }

  return {
    email, setEmail, password, setPassword, showPassword, setShowPassword,
    isOtpStep, otpCode, setOtpCode, loading, error, isLoginValid, isOtpValid,
    handleLogin, handleVerifyOtp, kembaliKeLogin,
  };
}
