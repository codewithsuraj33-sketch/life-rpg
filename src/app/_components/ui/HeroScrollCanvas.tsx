"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Database,
  Zap,
  Flame,
  Crown,
  Dumbbell,
  Brain,
  Shield,
  Heart,
  ChevronDown,
} from "lucide-react";

const TOTAL_FRAMES = 240;

const padNumber = (num: number): string => {
  return String(num).padStart(3, "0");
};

export default function HeroScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const animationFrameIdRef = useRef<number | null>(null);

  // Progressive scroll phase (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Preload frames progressively
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES + 1).fill(null);

    // Load first frame immediately
    const firstImg = new window.Image();
    firstImg.src = `/frames/ezgif-frame-001.jpg`;
    firstImg.onload = () => {
      imagesRef.current[1] = firstImg;
      setIsLoaded(true);
      renderFrame(1);
    };

    // Progressive loading in priority batches:
    // Batch 1: Every 4th frame for quick responsive scrubbing
    // Batch 2: The remaining frames
    const loadRemainingFrames = () => {
      // Keyframes first
      for (let i = 2; i <= TOTAL_FRAMES; i += 3) {
        if (!imagesRef.current[i]) {
          const img = new window.Image();
          img.src = `/frames/ezgif-frame-${padNumber(i)}.jpg`;
          img.onload = () => {
            imagesRef.current[i] = img;
          };
        }
      }

      // Fill in all other frames shortly after
      const timeoutId = setTimeout(() => {
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          if (!imagesRef.current[i]) {
            const img = new window.Image();
            img.src = `/frames/ezgif-frame-${padNumber(i)}.jpg`;
            img.onload = () => {
              imagesRef.current[i] = img;
            };
          }
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    };

    const cleanupTimeout = loadRemainingFrames();

    return () => {
      if (cleanupTimeout) cleanupTimeout();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // 2. Render helper with "cover" aspect ratio calculation
  const renderFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Find closest loaded image if current frame hasn't finished loading yet
    let imgToDraw = imagesRef.current[frameNum];
    if (!imgToDraw || !imgToDraw.complete) {
      for (let offset = 1; offset < 30; offset++) {
        const prev = imagesRef.current[Math.max(1, frameNum - offset)];
        if (prev && prev.complete) {
          imgToDraw = prev;
          break;
        }
        const next = imagesRef.current[Math.min(TOTAL_FRAMES, frameNum + offset)];
        if (next && next.complete) {
          imgToDraw = next;
          break;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = imgToDraw.naturalWidth || 2560;
    const imgHeight = imgToDraw.naturalHeight || 1440;

    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(imgToDraw, offsetX, offsetY, drawWidth, drawHeight);
  };

  // 3. Handle window resize to scale canvas with device pixel ratio
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 4. Scroll tracking and Lerp Loop — buttery smooth 60fps interpolation
  useEffect(() => {
    let isRunning = true;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
      setScrollProgress(progress);

      const target = Math.min(
        Math.max(Math.round(progress * (TOTAL_FRAMES - 1)) + 1, 1),
        TOTAL_FRAMES
      );
      targetFrameRef.current = target;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Fluid lerp loop
    const loop = () => {
      if (!isRunning) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.02) {
        currentFrameRef.current = current + diff * 0.20;
        renderFrame(Math.round(currentFrameRef.current));
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Helper to compute smooth stage opacity with generous overlap
  const stageOpacity = (
    progress: number,
    fadeInStart: number,
    peakStart: number,
    peakEnd: number,
    fadeOutEnd: number
  ) => {
    if (progress < fadeInStart || progress > fadeOutEnd) return 0;
    if (progress < peakStart)
      return (progress - fadeInStart) / (peakStart - fadeInStart);
    if (progress > peakEnd)
      return 1 - (progress - peakEnd) / (fadeOutEnd - peakEnd);
    return 1;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500vh] bg-[#06061a]"
      id="hero-story"
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* The Scrollytelling Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-700"
          style={{ opacity: isLoaded ? 1 : 0 }}
        />

        {/* Cinematic Vignette and Ambient Color Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06061a]/90 via-[#06061a]/30 to-[#06061a] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(6,6,26,0.35) 45%, rgba(6,6,26,0.92) 100%)",
          }}
        />

        {/* Seamless blend gradient to subsequent section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#06061a] to-transparent pointer-events-none z-20" />

        {/* Neon ambient light effects */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[40%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(139, 92, 246, 0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[30%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(34, 211, 238, 0.08) 0%, transparent 60%)",
          }}
        />

        {/* =========================================================================
            STAGE 1: 0% → 22% SCROLL (HERO HEADLINE & MAIN CTA)
            ========================================================================= */}
        <div
          className="absolute inset-0 max-w-7xl mx-auto px-5 sm:px-10 flex flex-col justify-center transition-all duration-500 pointer-events-none"
          style={{
            opacity: stageOpacity(scrollProgress, 0, 0, 0.14, 0.24),
            transform: `translateY(${scrollProgress * -50}px)`,
            pointerEvents: scrollProgress < 0.18 ? "auto" : "none",
          }}
        >
          <div className="max-w-3xl space-y-5 sm:space-y-7 p-6 sm:p-8 rounded-3xl bg-[#06061a]/65 backdrop-blur-md border border-purple-500/25 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-[var(--purple-light)] text-[11px] sm:text-sm font-semibold tracking-wide backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--cyan)] animate-pulse" />
              <span>Cinematic RPG Progression Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white text-glow">
              Your Life Is The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--purple-light)] via-[var(--cyan)] to-indigo-300 block mt-1 neon-cyan">
                Greatest Adventure
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-100/90 leading-relaxed max-w-xl text-glow">
              Turn your daily habits, chores, and ambitious goals into epic RPG quests.
              Earn XP, unlock rare gear, build unstoppable streaks, and level up the real you.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/signup"
                className="btn-primary text-sm sm:text-base md:text-lg py-3 sm:py-3.5 px-6 sm:px-8 rounded-full inline-flex items-center justify-center gap-2 shadow-xl shadow-purple-600/40 hover:scale-105 transition-all"
              >
                Start Your Journey <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <Link
                href="/login"
                className="btn-secondary text-sm sm:text-base py-3 sm:py-3.5 px-5 sm:px-7 rounded-full inline-flex items-center justify-center gap-2 backdrop-blur-xl hover:bg-white/10 transition-all border border-white/20 text-white"
              >
                <span>Resume Quest</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Core Feature Badges */}
            <div className="pt-5 sm:pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-lg">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-[var(--purple-light)] flex-shrink-0">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-white">Cloud Synced</div>
                  <div className="text-[10px] text-slate-300">Real PostgreSQL</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-[var(--cyan)] flex-shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-white">Non-Linear XP</div>
                  <div className="text-[10px] text-slate-300">Curve Scaling</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-[var(--gold)] flex-shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-white">Daily Streaks</div>
                  <div className="text-[10px] text-slate-300">Shield Protection</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 2: 18% → 46% SCROLL (FLYTHROUGH & 4 CORE ATTRIBUTES)
            ========================================================================= */}
        <div
          className="absolute inset-0 max-w-5xl mx-auto px-5 sm:px-10 flex flex-col justify-center items-center text-center transition-all duration-500 pointer-events-none"
          style={{
            opacity: stageOpacity(scrollProgress, 0.18, 0.24, 0.36, 0.46),
            transform: `scale(${0.94 + scrollProgress * 0.1}) translateY(${
              (scrollProgress - 0.32) * -30
            }px)`,
          }}
        >
          {/* Backdrop scrim for text readability */}
          <div className="absolute inset-0 hero-text-scrim rounded-3xl" />

          <div className="relative z-10">
            <span className="section-label mb-4 backdrop-blur-xl bg-purple-900/50 border-purple-500/40 text-purple-200 inline-flex">
              <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" /> Realm of Growth
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight text-glow mt-4">
              Explore The Kingdom of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyan)] via-purple-300 to-amber-300 neon-cyan">
                Self-Mastery
              </span>
            </h2>
            <p className="text-xs sm:text-base md:text-lg text-slate-100/90 max-w-xl mx-auto mt-3 sm:mt-4 leading-relaxed text-glow">
              As you fly across your daily routine, every habit targets specific character attributes.
              Grow strength, intellect, discipline, and charisma simultaneously.
            </p>

            {/* 4 Floating Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 w-full max-w-2xl mx-auto">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-rose-500/30 text-left space-y-1 shadow-xl hover:border-rose-400/50 transition-colors">
                <div className="flex items-center gap-1.5 sm:gap-2 text-rose-400 font-bold text-[11px] sm:text-xs">
                  <Dumbbell className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Strength
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300">Fitness, Gym & Vigor</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-cyan-500/30 text-left space-y-1 shadow-xl hover:border-cyan-400/50 transition-colors">
                <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-300 font-bold text-[11px] sm:text-xs">
                  <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Intellect
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300">Coding, Reading & Logic</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-amber-500/30 text-left space-y-1 shadow-xl hover:border-amber-400/50 transition-colors">
                <div className="flex items-center gap-1.5 sm:gap-2 text-amber-300 font-bold text-[11px] sm:text-xs">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Discipline
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300">Routines & Focus</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-pink-500/30 text-left space-y-1 shadow-xl hover:border-pink-400/50 transition-colors">
                <div className="flex items-center gap-1.5 sm:gap-2 text-pink-300 font-bold text-[11px] sm:text-xs">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Charisma
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300">Social & Communication</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 3: 42% → 72% SCROLL (FLOATING CHARACTER HUD PREVIEW)
            ========================================================================= */}
        <div
          className="absolute inset-0 max-w-6xl mx-auto px-5 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 transition-all duration-500 pointer-events-none"
          style={{
            opacity: stageOpacity(scrollProgress, 0.42, 0.48, 0.62, 0.72),
            transform: `translateY(${(scrollProgress - 0.55) * -25}px)`,
          }}
        >
          <div className="max-w-lg space-y-3 sm:space-y-4 text-left">
            <span className="section-label backdrop-blur-xl bg-purple-900/50 border-purple-500/40 text-purple-200">
              <Crown className="w-3.5 h-3.5 text-[var(--gold)]" /> Live Character HUD
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight text-glow">
              Small Steps. <br />
              <span className="text-[var(--cyan)] neon-cyan">Epic Evolution.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-100/90 leading-relaxed text-glow">
              Watch your avatar level up in real time with non-linear milestones. As your level
              rises, unlock rare titles, bazaar privileges, and global recognition.
            </p>
          </div>

          {/* Floating Character HUD Card with neon border */}
          <div className="w-full max-w-sm rounded-3xl border border-purple-500/40 bg-black/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 neon-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                  🧙‍♂️
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    Kaelen Shadowbane
                    <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--gold)]" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--cyan)] font-medium neon-cyan">
                    Lv. 12 Grand Archmage
                  </div>
                </div>
              </div>
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-amber-500/20 text-[var(--gold)] text-[10px] sm:text-xs font-bold font-mono">
                Rank III
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] sm:text-xs font-semibold">
                <span className="text-slate-300">Experience Points</span>
                <span className="text-[var(--gold)] font-mono neon-gold">720 / 1,000 XP</span>
              </div>
              <div className="xp-bar h-2 bg-black/50">
                <div className="xp-bar-fill" style={{ width: "72%" }} />
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 text-white font-medium">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--gold)]" /> 14-Day Habit Streak
              </div>
              <span className="text-purple-300 font-bold font-mono neon-purple">+30% Bonus XP</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 4: 68% → 100% SCROLL (WRITE A GREATER STORY & PROCEED CTA)
            ========================================================================= */}
        <div
          className="absolute inset-0 max-w-4xl mx-auto px-5 sm:px-10 flex flex-col justify-center items-center text-center transition-all duration-500 pointer-events-none"
          style={{
            opacity: stageOpacity(scrollProgress, 0.68, 0.76, 0.92, 1.0),
            transform: `scale(${0.95 + (scrollProgress - 0.68) * 0.15})`,
            pointerEvents: scrollProgress >= 0.76 ? "auto" : "none",
          }}
        >
          {/* Backdrop scrim */}
          <div className="absolute inset-0 hero-text-scrim rounded-3xl" />

          <div className="relative z-10">
            <span className="text-base sm:text-lg md:text-2xl font-serif italic text-purple-200 tracking-wider text-glow">
              Write a Greater Story
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mt-2 text-glow">
              A Better You. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyan)] via-purple-300 to-indigo-200 neon-cyan">
                A Greater Story.
              </span>
            </h2>
            <p className="text-xs sm:text-base md:text-lg text-slate-100/90 max-w-lg mx-auto mt-3 leading-relaxed text-glow">
              Your real-world adventure is waiting. Step forward, accept your daily quests, and forge
              your own legendary destiny.
            </p>
            <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="btn-primary text-sm sm:text-base md:text-lg py-3.5 sm:py-4 px-8 sm:px-10 rounded-full inline-flex items-center gap-2 shadow-2xl shadow-purple-600/50 hover:scale-105 transition-all w-full sm:w-auto justify-center"
              >
                Start Your Adventure <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a
                href="#features"
                className="btn-secondary text-xs sm:text-sm py-3 sm:py-3.5 px-5 sm:px-6 rounded-full inline-flex items-center gap-1.5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 w-full sm:w-auto justify-center"
              >
                <span>Explore All Features</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Scroll Hint Indicator */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-xs text-slate-300/80 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: scrollProgress > 0.85 ? 0 : 1 }}
        >
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-purple-300 neon-purple">
            Scroll To Explore
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-purple-400/40 flex items-start justify-center p-1 bg-black/30 backdrop-blur-sm">
            <div className="w-1.5 h-2 rounded-full bg-[var(--cyan)] animate-bounce" style={{ boxShadow: "0 0 8px rgba(34, 211, 238, 0.6)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
