"use client";

import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose?: () => void;
}

export default function Notification({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: NotificationProps) {
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter");
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Enter phase → idle after 400ms
    const enterTimer = setTimeout(() => setPhase("idle"), 400);

    // Start exit phase before duration ends
    const exitTimer = setTimeout(() => setPhase("exit"), duration - 500);

    // Unmount after exit animation
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, onClose]);

  if (!mounted) return null;

  const isSuccess = type === "success";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes notif-slide-in {
          0% {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.88);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.03);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes notif-slide-out {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -42%) scale(0.92);
            filter: blur(4px);
          }
        }

        @keyframes notif-idle {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -51%) scale(1); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes icon-pop {
          0% { transform: scale(0) rotate(-20deg); }
          60% { transform: scale(1.25) rotate(6deg); }
          80% { transform: scale(0.92) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes progress-shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px 0px var(--glow-color), 0 20px 60px -10px rgba(0,0,0,0.25); }
          50% { box-shadow: 0 0 35px 5px var(--glow-color), 0 20px 60px -10px rgba(0,0,0,0.25); }
        }

        @keyframes particle-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0); }
        }

        .notif-enter { animation: notif-slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .notif-idle  { animation: glow-pulse 2.5s ease-in-out infinite; }
        .notif-exit  { animation: notif-slide-out 0.45s cubic-bezier(0.4, 0, 1, 1) forwards; }

        .icon-animate { animation: icon-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }

        .shimmer-text {
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .progress-bar {
          transform-origin: left;
          animation: progress-shrink linear forwards;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particle-float 0.8s ease-out forwards;
        }
      `}</style>

      {/* Full-page dim overlay — page tetap keliatan, cuma agak gelap */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: phase === "exit" ? 0 : 1,
          transition: "opacity 0.45s ease",
          pointerEvents: "none",
        }}
      />

      {/* Notification card */}
      <div
        className={`notif-${phase}`}
        role="alert"
        aria-live="assertive"
        style={
          {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            width: "min(380px, calc(100vw - 32px))",
            fontFamily: "'DM Sans', sans-serif",

            // Lebih terang — opacity dinaikkan, tambah putih
            background: isSuccess
              ? "linear-gradient(135deg, rgba(20,150,100,0.80) 0%, rgba(10,110,75,0.85) 100%)"
              : "linear-gradient(135deg, rgba(159,40,40,0.75) 0%, rgba(127,29,29,0.80) 100%)",
            backdropFilter: "blur(28px) saturate(200%) brightness(1.3)",
            WebkitBackdropFilter: "blur(28px) saturate(200%) brightness(1.3)",
            border: isSuccess
              ? "1px solid rgba(52,211,153,0.65)"
              : "1px solid rgba(248,113,113,0.45)",
            borderRadius: "20px",
            overflow: "hidden",

            ["--glow-color" as string]: isSuccess
              ? "rgba(52,211,153,0.40)"
              : "rgba(248,113,113,0.25)",
          } as React.CSSProperties
        }
      >
        {/* Inner content */}
        <div style={{ padding: "22px 24px 20px" }}>
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}
          >
            {/* Animated icon */}
            <div
              className="icon-animate"
              style={{
                flexShrink: 0,
                width: 44,
                height: 44,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isSuccess
                  ? "linear-gradient(135deg, rgba(52,211,153,0.45), rgba(16,185,129,0.25))"
                  : "linear-gradient(135deg, rgba(248,113,113,0.3), rgba(239,68,68,0.15))",
                border: isSuccess
                  ? "1px solid rgba(52,211,153,0.65)"
                  : "1px solid rgba(248,113,113,0.4)",
                fontSize: 22,
                color: isSuccess
                  ? "rgba(110,231,183,1)"
                  : "rgba(248,113,113,1)",
                fontWeight: 700,
              }}
            >
              {isSuccess ? "✓" : "✕"}
            </div>

            {/* Text */}
            <div style={{ flex: 1, paddingTop: 2 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isSuccess
                    ? "rgba(110,231,183,1)"
                    : "rgba(248,113,113,0.8)",
                  marginBottom: 4,
                }}
              >
                {isSuccess ? "Berhasil" : "Terjadi Kesalahan"}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {message}
              </p>
            </div>

            {/* Close dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                marginTop: 6,
                background: isSuccess
                  ? "rgba(110,231,183,0.8)"
                  : "rgba(248,113,113,0.5)",
                flexShrink: 0,
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "2px",
            background: "rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="progress-bar"
            style={{
              position: "absolute",
              inset: 0,
              background: isSuccess
                ? "linear-gradient(90deg, rgba(52,211,153,0.9), rgba(16,185,129,0.6))"
                : "linear-gradient(90deg, rgba(248,113,113,0.9), rgba(239,68,68,0.6))",
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </>
  );
}
