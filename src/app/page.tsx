"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/client";
import {
  Shield,
  Trophy,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  X,
  Flame,
  Coins,
  Users,
  Gift,
  Heart,
  Brain,
  Dumbbell,
  Menu,
  ArrowRight,
  Send,
} from "lucide-react";
import ScrollReveal from "@/app/_components/ui/ScrollReveal";
import HeroScrollCanvas from "@/app/_components/ui/HeroScrollCanvas";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<"stats" | "quests">("stats");

  // Auto-redirect to dashboard if user arrives from OAuth callback or already has an active session
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          window.location.replace("/dashboard");
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
          window.location.replace("/dashboard");
        }
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-purple-500/30 selection:text-white">
      {/* ===== Sticky Top Navbar ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border-default)]">
        <nav className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--purple)] to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Life<span className="text-[var(--cyan)]">RPG</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#hero-story" className="hover:text-white transition-colors">
              Story
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#journey" className="hover:text-white transition-colors">
              Journey
            </a>
            <a href="#rewards" className="hover:text-white transition-colors">
              Rewards
            </a>
            <a href="#community" className="hover:text-white transition-colors">
              Community
            </a>
            <Link href="/leaderboard" className="hover:text-[var(--cyan)] transition-colors">
              Leaderboard
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[var(--text-secondary)] hover:text-white px-3 py-2 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-sm py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 shadow-md shadow-purple-500/25"
            >
              Start Quest <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border-default)] bg-[var(--bg-secondary)] px-6 py-6 space-y-4 animate-fade-in">
            <div className="flex flex-col gap-3 font-medium text-[var(--text-secondary)]">
              <a
                href="#hero-story"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                Story
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                Features
              </a>
              <a
                href="#journey"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                Journey
              </a>
              <a
                href="#rewards"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                Rewards
              </a>
              <a
                href="#community"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                Community
              </a>
              <Link
                href="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[var(--cyan)]"
              >
                Leaderboard
              </Link>
            </div>
            <div className="pt-4 border-t border-[var(--border-default)] flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary text-center py-2.5 rounded-xl font-medium"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary text-center py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5"
              >
                Start Quest <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          SECTION 01: 240-FRAME SCROLL-DRIVEN CANVAS ANIMATION (APPLE-GRADE LERP)
          ========================================================================= */}
      <HeroScrollCanvas />

      {/* =========================================================================
          SECTION 02: "SMALL STEPS, BIG PROGRESS" (Feature Grid)
          ========================================================================= */}
      <section id="features" className="py-16 sm:py-28 relative border-t border-[var(--border-default)]/50 bg-[#06061a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <ScrollReveal animation="up">
              <span className="section-label">
                <Zap className="w-3.5 h-3.5 text-[var(--gold)]" /> Small Steps
              </span>
            </ScrollReveal>
            <ScrollReveal animation="up" delay={100}>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white neon-purple">
                Big Progress
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="up" delay={200}>
              <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                Every task you complete gives you real XP, boosts your real-life stats, and brings
                you closer to the ultimate version of yourself.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ScrollReveal animation="up" delay={100}>
              <div className="glass-card glass-card-neon p-5 sm:p-6 rounded-2xl h-full flex flex-col justify-between hover-lift group border border-purple-500/15 hover:border-cyan-500/40">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--cyan)]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[var(--cyan)] transition-colors">
                    Daily Quests
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Turn mundane routines and obligations into rewarding mission objectives. Clear
                    your board every day to build unstoppable momentum.
                  </p>
                </div>
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 text-xs font-semibold text-[var(--cyan)] flex items-center gap-1 neon-cyan">
                  Meaningful Habits <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="up" delay={200}>
              <div className="glass-card glass-card-neon p-5 sm:p-6 rounded-2xl h-full flex flex-col justify-between hover-lift group border border-purple-500/15 hover:border-purple-500/40">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--purple-light)]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[var(--purple-light)] transition-colors">
                    XP & Levels
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Experience non-linear progression. As you tackle harder challenges, unlock
                    higher titles, prestige status, and legendary badges.
                  </p>
                </div>
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 text-xs font-semibold text-[var(--purple-light)] flex items-center gap-1 neon-purple">
                  Real Growth Daily <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="up" delay={300}>
              <div className="glass-card glass-card-neon p-5 sm:p-6 rounded-2xl h-full flex flex-col justify-between hover-lift group border border-purple-500/15 hover:border-amber-500/40">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--gold)]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[var(--gold)] transition-colors">
                    Streaks & Shields
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Maintain active streaks for bonus XP multipliers. Protect your habit streak with
                    streak shield items during busy or rest days.
                  </p>
                </div>
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 text-xs font-semibold text-[var(--gold)] flex items-center gap-1 neon-gold">
                  Compound Consistency <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="up" delay={400}>
              <div className="glass-card glass-card-neon p-5 sm:p-6 rounded-2xl h-full flex flex-col justify-between hover-lift group border border-purple-500/15 hover:border-emerald-500/40">
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    Shop & Rewards
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Earn gold currency and spend it in the Bazaar on real rewards (e.g. guilt-free
                    gaming sessions) or avatar customization items.
                  </p>
                </div>
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 text-xs font-semibold text-emerald-400 flex items-center gap-1" style={{ textShadow: '0 0 7px rgba(52, 211, 153, 0.6), 0 0 20px rgba(52, 211, 153, 0.3)' }}>
                  Real Motivation <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: "TRACK. GROW. EVOLVE." (Character Progression Deep Dive)
          ========================================================================= */}
      <section id="journey" className="py-16 sm:py-28 relative border-t border-[var(--border-default)]/50 bg-gradient-to-b from-[#06061a] via-purple-950/20 to-[#06061a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <ScrollReveal animation="left">
                <span className="section-label">
                  <Shield className="w-3.5 h-3.5 text-[var(--cyan)]" /> Your Character
                </span>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={100}>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Track. Grow. <br />
                  <span className="text-[var(--cyan)] neon-cyan">Evolve.</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={200}>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  You are not just crossing tasks off a list; you are shaping an RPG character with
                  real attributes. Strength increases when you hit the gym, Intellect levels up when
                  you study, Discipline grows from hard routines, and Charisma blooms through
                  social connections.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={300}>
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-[var(--purple-light)] mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Dynamic Stat Allocation</h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Tag tasks by attribute so XP flows directly into the skills you want to foster.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-[var(--cyan)] mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Visual Milestones & Trophies</h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Unlock tiers of custom achievements as your lifetime stats expand.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={400}>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/signup"
                    className="btn-primary py-3 px-7 rounded-full text-sm font-bold inline-flex items-center gap-2"
                  >
                    Create Account <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/quests"
                    className="btn-secondary py-3 px-6 rounded-full text-sm font-semibold hover:text-white"
                  >
                    See Quests Demo
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Character Evolution Card */}
            <div className="lg:col-span-6">
              <ScrollReveal animation="right" delay={200}>
                <div className="glass-card glass-card-neon p-5 sm:p-8 rounded-3xl border border-purple-500/25 relative overflow-hidden shadow-2xl neon-border">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
                        ⚡
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">Aria Dawnseeker</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          Level 18 Vanguard • 7-Day Streak 🔥
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-[var(--gold)] font-bold">3,450 Gold</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Lifetime Total</div>
                    </div>
                  </div>

                  {/* Toggle tabs */}
                  <div className="flex items-center gap-2 my-5 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab("stats")}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        activeTab === "stats"
                          ? "bg-purple-600 text-white shadow"
                          : "text-[var(--text-muted)] hover:text-white"
                      }`}
                    >
                      Core Attributes
                    </button>
                    <button
                      onClick={() => setActiveTab("quests")}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        activeTab === "quests"
                          ? "bg-purple-600 text-white shadow"
                          : "text-[var(--text-muted)] hover:text-white"
                      }`}
                    >
                      Recent Achievements
                    </button>
                  </div>

                  {/* Tab 1: Stats */}
                  {activeTab === "stats" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-white flex items-center gap-1.5">
                            <Dumbbell className="w-3.5 h-3.5 text-rose-400" /> Strength (Gym & Vigor)
                          </span>
                          <span className="font-mono text-rose-300 font-bold">Level 28</span>
                        </div>
                        <div className="stat-bar h-2">
                          <div className="stat-bar-fill bg-rose-500" style={{ width: "78%" }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-white flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5 text-cyan-400" /> Intellect (Coding & Reading)
                          </span>
                          <span className="font-mono text-cyan-300 font-bold">Level 35</span>
                        </div>
                        <div className="stat-bar h-2">
                          <div className="stat-bar-fill bg-cyan-400" style={{ width: "88%" }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-white flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-amber-400" /> Discipline (Focus & Deep Work)
                          </span>
                          <span className="font-mono text-amber-300 font-bold">Level 42</span>
                        </div>
                        <div className="stat-bar h-2">
                          <div className="stat-bar-fill bg-amber-400" style={{ width: "94%" }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-white flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-pink-400" /> Charisma (Community & Networking)
                          </span>
                          <span className="font-mono text-pink-300 font-bold">Level 21</span>
                        </div>
                        <div className="stat-bar h-2">
                          <div className="stat-bar-fill bg-pink-400" style={{ width: "60%" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Achievements */}
                  {activeTab === "quests" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                        <div className="text-2xl">🔥</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-white">7-Day Consistency Master</div>
                          <div className="text-[10px] text-[var(--text-secondary)]">
                            Completed daily quests consecutively
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[var(--gold)] font-bold">+200 XP</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                        <div className="text-2xl">⚔️</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-white">50 Quests Cleared</div>
                          <div className="text-[10px] text-[var(--text-secondary)]">
                            Reached Adventurer Guild Tier 2
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[var(--gold)] font-bold">+500 XP</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                        <div className="text-2xl">💎</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-white">Bazaar Patron</div>
                          <div className="text-[10px] text-[var(--text-secondary)]">
                            Purchased first reward item from the shop
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[var(--gold)] font-bold">+100 XP</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" /> Next Level Unlock:
                    </span>
                    <span className="text-white font-semibold">Title: &quot;Iron Will Warden&quot;</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: "REWARDS FOR YOUR JOURNEY" (Bazaar Item Showcase)
          ========================================================================= */}
      <section id="rewards" className="py-16 sm:py-28 relative border-t border-[var(--border-default)]/50 bg-[#06061a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <ScrollReveal animation="up">
              <span className="section-label">
                <Coins className="w-3.5 h-3.5 text-[var(--gold)]" /> Unlock Exclusive Items
              </span>
            </ScrollReveal>
            <ScrollReveal animation="up" delay={100}>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white neon-gold">
                Rewards for Your Journey
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="up" delay={200}>
              <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                Spend your hard-earned gold coins on real treats, rare virtual badges, custom profile
                auras, and guild perks. Make the journey truly your own.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {/* Item 1: Epic Cloak */}
            <ScrollReveal animation="up" delay={100}>
              <div className="glass-card glass-card-neon rounded-2xl p-5 sm:p-6 border border-purple-500/30 hover:border-purple-400 transition-all hover-lift relative group flex flex-col justify-between">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-b from-purple-900/30 to-purple-950/70 border border-purple-500/20 flex flex-col items-center justify-center relative overflow-hidden group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      🧥
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold tracking-wider uppercase border border-purple-500/40">
                      Epic
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      Shadow Cloak
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Woven from nocturnal twilight threads. Grants the bearer +15% stealth focus
                      during deep work sessions.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-[var(--gold)]">
                    <Coins className="w-4 h-4" /> 1,200 Gold
                  </div>
                  <Link
                    href="/shop"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Item 2: Rare Blade */}
            <ScrollReveal animation="up" delay={200}>
              <div className="glass-card glass-card-neon rounded-2xl p-5 sm:p-6 border border-cyan-500/30 hover:border-cyan-400 transition-all hover-lift relative group flex flex-col justify-between">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-b from-cyan-900/30 to-cyan-950/70 border border-cyan-500/20 flex flex-col items-center justify-center relative overflow-hidden group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      🗡️
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 text-[10px] font-bold tracking-wider uppercase border border-cyan-500/40">
                      Rare
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Neon Blade
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      A radiant plasma rapier that slices through procrastination. Provides +10%
                      streak protection shield on critical deadlines.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-[var(--gold)]">
                    <Coins className="w-4 h-4" /> 850 Gold
                  </div>
                  <Link
                    href="/shop"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Item 3: Legendary Wings */}
            <ScrollReveal animation="up" delay={300}>
              <div className="glass-card glass-card-neon rounded-2xl p-5 sm:p-6 border border-amber-500/30 hover:border-amber-400 transition-all hover-lift relative group flex flex-col justify-between">
                <div>
                  <div className="h-44 rounded-xl bg-gradient-to-b from-amber-900/20 to-purple-950/70 border border-amber-500/20 flex flex-col items-center justify-center relative overflow-hidden group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      🪽
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-500/40">
                      Legendary
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      Sky Wings
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Feathers of celestial aurora. Grants permanent +25% bonus experience to all
                      physical and fitness quest completions.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-[var(--gold)]">
                    <Coins className="w-4 h-4" /> 2,250 Gold
                  </div>
                  <Link
                    href="/shop"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="btn-secondary py-3 px-8 rounded-full text-sm font-bold inline-flex items-center gap-2 hover:border-purple-500"
            >
              Explore Full Bazaar Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: "GROW TOGETHER" (Community Leaderboard Preview)
          ========================================================================= */}
      <section id="community" className="py-16 sm:py-28 relative border-t border-[var(--border-default)]/50 bg-gradient-to-b from-[#06061a] via-cyan-950/15 to-[#06061a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <ScrollReveal animation="left">
                <span className="section-label">
                  <Users className="w-3.5 h-3.5 text-[var(--purple-light)]" /> Global Realm
                </span>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={100}>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight neon-purple">
                  Grow Together.
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={200}>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Be part of a thriving guild of builders, students, dreamers, and athletes.
                  Compete on weekly leaderboards, share milestone accomplishments, and hold each
                  other accountable.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={300}>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Trophy className="w-4 h-4 text-[var(--gold)]" /> Weekly Seasons
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Leaderboards track top adventurers. Compete with players worldwide to earn high
                    prestige ranks and recognition.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="left" delay={400}>
                <Link
                  href="/leaderboard"
                  className="btn-primary py-3 px-8 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  View Full Leaderboard <ChevronRight className="w-4 h-4" />
                </Link>
              </ScrollReveal>
            </div>

            {/* Right Top Adventurers Table */}
            <div className="lg:col-span-7">
              <ScrollReveal animation="right" delay={200}>
                <div className="glass-card glass-card-neon rounded-3xl p-5 sm:p-8 border border-purple-500/20 shadow-2xl space-y-4 neon-border">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[var(--gold)]" />
                      <h3 className="font-bold text-white text-base">Top Adventurers — Realm Standings</h3>
                    </div>
                    <span className="text-xs text-[var(--cyan)] font-mono font-semibold">Live Standings</span>
                  </div>

                  {/* Leaderboard Rows */}
                  <div className="space-y-2.5">
                    {/* Rank 1 */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between hover:bg-amber-500/15 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center text-xs shadow-md">
                          1
                        </div>
                        <div className="text-2xl">👑</div>
                        <div>
                          <div className="text-sm font-bold text-white">Nova_Architect</div>
                          <div className="text-xs text-amber-300/80">Mythic Vanguard • 14-day streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[var(--gold)]">Lv. 99</div>
                        <div className="text-[10px] text-[var(--text-muted)]">4,800 XP</div>
                      </div>
                    </div>

                    {/* Rank 2 */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between hover:bg-white/[0.06] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-300 text-black font-black flex items-center justify-center text-xs">
                          2
                        </div>
                        <div className="text-2xl">⚔️</div>
                        <div>
                          <div className="text-sm font-bold text-white">Zephyr_Knight</div>
                          <div className="text-xs text-[var(--text-secondary)]">Master Paladin • 9-day streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">Lv. 96</div>
                        <div className="text-[10px] text-[var(--text-muted)]">3,920 XP</div>
                      </div>
                    </div>

                    {/* Rank 3 */}
                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-between hover:bg-cyan-500/15 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-700 text-white font-black flex items-center justify-center text-xs">
                          3
                        </div>
                        <div className="text-2xl">🏹</div>
                        <div>
                          <div className="text-sm font-bold text-[var(--cyan)]">You (Future Legend)</div>
                          <div className="text-xs text-cyan-300/80">Claim this mantle!</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-[var(--cyan)]">Lv. 88</div>
                        <div className="text-[10px] text-[var(--text-muted)]">3,150 XP</div>
                      </div>
                    </div>

                    {/* Rank 4 */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center text-xs">
                          4
                        </div>
                        <div className="text-2xl">🥷</div>
                        <div>
                          <div className="text-sm font-bold text-white">Kairo_Shadow</div>
                          <div className="text-xs text-[var(--text-secondary)]">Elite Assassin • 5-day streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">Lv. 85</div>
                        <div className="text-[10px] text-[var(--text-muted)]">2,810 XP</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: FOOTER
          ========================================================================= */}
      <footer id="about" className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)]/90 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--purple)] to-indigo-600 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black text-white">
                  Life<span className="text-[var(--cyan)]">RPG</span>
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
                The full-stack gamified productivity engine that turns your everyday life into an
                engaging, rewarding role-playing game. Built with Next.js, Supabase, and Tailwind CSS.
              </p>
              <div className="text-xs text-[var(--text-muted)]">
                Live on Vercel:{" "}
                <a
                  href="https://life-rpg-sooty.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--cyan)] hover:underline"
                >
                  https://life-rpg-sooty.vercel.app/
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">Navigation</div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li>
                  <a href="#hero-story" className="hover:text-white transition-colors">
                    Story
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#journey" className="hover:text-white transition-colors">
                    Journey
                  </a>
                </li>
                <li>
                  <a href="#rewards" className="hover:text-white transition-colors">
                    Bazaar Shop
                  </a>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-white transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* App Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">The Realm</div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Adventurer Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors">
                    Begin Journey (Sign Up)
                  </Link>
                </li>
                <li>
                  <Link href="/quests" className="hover:text-white transition-colors">
                    Quest Board
                  </Link>
                </li>
                <li>
                  <Link href="/character" className="hover:text-white transition-colors">
                    Hero Sheet
                  </Link>
                </li>
                <li>
                  <Link href="/achievements" className="hover:text-white transition-colors">
                    Achievements
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Subscribe to Updates
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Get notified of new realm seasons, quest archetypes, and community events.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hero@realm.com"
                    required
                    className="input text-xs py-2 pr-10 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[var(--purple)] text-white hover:bg-purple-600 transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {subscribed && (
                  <p className="text-[11px] text-emerald-400 font-semibold animate-fade-in">
                    ✓ Welcome to the Adventurer Guild!
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
            <p>© {new Date().getFullYear()} LifeRPG. Make Your Life Legendary. ⚔️</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
