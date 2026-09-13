import React from "react";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export default function FloatingParticles({
  count = 20,
  className = "",
}: FloatingParticlesProps) {
  // Pre-determined static positions to avoid hydration mismatch
  const particles = [
    { top: "12%", left: "8%", size: 4, type: "particle-1", delay: "0s" },
    { top: "25%", left: "88%", size: 6, type: "particle-2", delay: "1.5s" },
    { top: "45%", left: "15%", size: 3, type: "particle-3", delay: "3s" },
    { top: "60%", left: "92%", size: 5, type: "particle-1", delay: "2s" },
    { top: "80%", left: "22%", size: 4, type: "particle-2", delay: "4s" },
    { top: "35%", left: "75%", size: 7, type: "particle-3", delay: "0.5s" },
    { top: "18%", left: "45%", size: 3, type: "particle-4", delay: "2.5s" },
    { top: "70%", left: "60%", size: 5, type: "particle-1", delay: "1s" },
    { top: "85%", left: "80%", size: 4, type: "particle-2", delay: "3.5s" },
    { top: "50%", left: "40%", size: 6, type: "particle-3", delay: "1.2s" },
    { top: "15%", left: "65%", size: 3, type: "particle-4", delay: "2.8s" },
    { top: "90%", left: "35%", size: 5, type: "particle-1", delay: "0.8s" },
    { top: "28%", left: "28%", size: 4, type: "particle-2", delay: "4.2s" },
    { top: "65%", left: "10%", size: 6, type: "particle-3", delay: "1.7s" },
    { top: "40%", left: "85%", size: 3, type: "particle-4", delay: "3.1s" },
    { top: "75%", left: "50%", size: 5, type: "particle-1", delay: "2.2s" },
  ].slice(0, count);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Ambient background glow orbs */}
      <div
        className="ambient-orb ambient-orb-purple"
        style={{
          top: "10%",
          left: "15%",
          width: "450px",
          height: "450px",
          opacity: 0.6,
        }}
      />
      <div
        className="ambient-orb ambient-orb-cyan"
        style={{
          top: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          opacity: 0.5,
        }}
      />
      <div
        className="ambient-orb ambient-orb-gold"
        style={{
          top: "55%",
          left: "40%",
          width: "350px",
          height: "350px",
          opacity: 0.35,
        }}
      />

      {/* Floating starry particles */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          className={`particle ${p.type}`}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
