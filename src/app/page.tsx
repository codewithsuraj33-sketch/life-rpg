import Link from "next/link";
import {
  Sword,
  Shield,
  Trophy,
  Zap,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-cyan-500/30">
      {/* ===== Navbar ===== */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2 group">
          <div className="relative">
            <Sword className="w-6 h-6 text-cyan transform group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-40 group-hover:opacity-80 transition-opacity"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Life<span className="text-cyan">RPG</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-muted hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="btn-primary text-sm py-2 px-5 hidden sm:inline-flex">
            Start Quest
          </Link>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 relative overflow-hidden">
        
        {/* Abstract Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Floating badge */}
        <div className="badge badge-cyan mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
          <Sparkles className="w-3.5 h-3.5" />
          Gamify Your Reality
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl leading-[1.1] animate-fade-in opacity-0" style={{ animationDelay: "0.2s" }}>
          Your Life Is The
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            Greatest Adventure
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl max-w-2xl leading-relaxed text-muted animate-fade-in opacity-0" style={{ animationDelay: "0.3s" }}>
          Transform everyday chores, habits, and goals into epic RPG quests. Earn XP, build streaks, unlock legendary avatars, and dominate the global leaderboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 mt-12 animate-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
          <Link
            href="/signup"
            className="btn-primary text-lg py-3.5 px-8 flex items-center justify-center gap-2"
          >
            Create Character
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="btn-secondary text-lg py-3.5 px-8 flex items-center justify-center"
          >
            Continue Journey
          </Link>
        </div>

        {/* ===== Feature Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl w-full">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-gold drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
            title="Earn XP & Level Up"
            description="Complete real-life tasks to gain experience points. Watch your character grow stronger with every achievement."
            delay="0.5s"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />}
            title="Master 6 Attributes"
            description="Track Health, Career, Social, Knowledge, Fitness, and Creativity. Build a well-rounded and powerful character."
            delay="0.6s"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8 text-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
            title="Compete & Achieve"
            description="Unlock badges, maintain streaks, and climb the global leaderboard. Show the realm who is boss."
            delay="0.7s"
          />
        </div>

        {/* ===== Stats Preview ===== */}
        <div className="mt-24 card p-8 md:p-10 max-w-3xl w-full animate-fade-in opacity-0 relative" style={{ animationDelay: "0.8s" }}>
          <div className="absolute -top-4 -right-4 badge badge-gold shadow-lg rotate-12">Level Up!</div>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-white/10 pb-8">
            <div className="text-6xl animate-float bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl">🥷</div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-bold text-2xl text-white">Shadow_Assassin</h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <span className="badge badge-cyan text-xs">Lv. 24 Rogue</span>
                <span className="text-muted text-sm font-mono">14,200 XP</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 font-mono font-bold text-xl">
              <span>🪙</span> 1,250
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <StatPreview label="❤️ Health" value={85} color="#ef4444" />
            <StatPreview label="💼 Career" value={92} color="#06b6d4" />
            <StatPreview label="🤝 Social" value={65} color="#10b981" />
            <StatPreview label="📚 Knowledge" value={88} color="#a855f7" />
            <StatPreview label="💪 Fitness" value={70} color="#f59e0b" />
            <StatPreview label="🎨 Creativity" value={50} color="#ec4899" />
          </div>
        </div>

        {/* ===== Bottom CTA ===== */}
        <div className="mt-32 text-center animate-fade-in opacity-0" style={{ animationDelay: "0.9s" }}>
          <div className="flex items-center justify-center gap-2 text-muted mb-6">
            <Users className="w-5 h-5 text-cyan" />
            <span className="text-sm font-medium">Join 10,000+ adventurers leveling up their lives</span>
          </div>
          <Link
            href="/signup"
            className="btn-primary text-xl py-4 px-12 inline-flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
          >
            Start Your Journey Now
            <Sword className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="text-center py-10 text-muted text-sm border-t border-white/5 bg-black/20">
        <p>
          Built for <span className="text-cyan font-bold">Life RPG</span> •{" "}
          <span className="opacity-70">Make reality your favorite game.</span>
        </p>
      </footer>
    </div>
  );
}

/* ===== Sub-components ===== */

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="card p-8 text-left animate-fade-in opacity-0 flex flex-col items-start hover:-translate-y-2 transition-transform duration-300"
      style={{ animationDelay: delay }}
    >
      <div className="mb-5 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">{icon}</div>
      <h3 className="font-bold text-xl mb-3 text-white">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StatPreview({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-sm font-semibold w-28 text-left text-muted group-hover:text-white transition-colors">{label}</span>
      <div className="flex-1 stat-bar bg-white/5 border border-white/5">
        <div
          className="stat-bar-fill shadow-[0_0_10px_currentColor] transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: color, color: color }}
        />
      </div>
      <span className="text-xs font-mono text-muted w-10 text-right group-hover:text-white transition-colors">
        {value}%
      </span>
    </div>
  );
}
