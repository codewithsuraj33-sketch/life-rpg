import Link from "next/link";
import {
  Sword,
  Shield,
  Trophy,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Crown,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      {/* ===== Navbar ===== */}
      <nav className="flex items-center justify-between px-6 sm:px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Sword className="w-6 h-6 text-[var(--cyan)]" />
          <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">
            LIFE<span className="text-[var(--cyan)]">RPG</span>
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/leaderboard" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:block">
            Leaderboard
          </Link>
          <Link href="/login" className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--cyan)] transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="btn-primary text-sm py-2.5 px-6 inline-flex items-center gap-1.5">
            Start Quest <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 sm:py-12">
        <div className="rounded-3xl border border-[var(--border-default)] bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)] p-6 sm:p-8 md:p-12 shadow-[var(--shadow-card)] relative overflow-hidden">
          
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--purple)] opacity-[0.04] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[var(--cyan)] opacity-[0.04] rounded-full blur-3xl"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--purple-bg)] border border-[var(--border-default)] text-[var(--purple)] text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Level Up Your Reality</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-[var(--text-primary)]">
                Define Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] block mt-2">ADVENTURE</span>
              </h1>
              
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
                Turn your everyday habits, chores, and goals into epic RPG quests. Elevate your daily routine with stats, XP, and rewards.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="btn-primary text-base sm:text-lg py-3.5 sm:py-4 px-7 sm:px-8 inline-flex items-center justify-center gap-2"
                >
                  Explore Now
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-default)] px-5 py-3 rounded-xl">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm border-2 border-[var(--bg-primary)]">🔥</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm border-2 border-[var(--bg-primary)]">⚡</div>
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-sm border-2 border-[var(--bg-primary)]">💧</div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Join the<br/>Adventure</span>
                </div>
              </div>
            </div>

            {/* Right Content - Neon Purple Block */}
            <div className="bg-gradient-to-br from-[var(--purple)] via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[420px] sm:min-h-[500px] shadow-[var(--shadow-purple)]">
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--cyan)] opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight">
                  Own Your <br/>WORLD
                </h2>
                <div className="text-3xl sm:text-4xl animate-float">✨</div>
              </div>

              <div className="relative z-10 mt-8 sm:mt-12">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 text-center text-xs sm:text-sm font-medium">
                  <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2 opacity-90" />
                    Gain XP
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2 opacity-90" />
                    Build Stats
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2 opacity-90" />
                    Rank Up
                  </div>
                </div>

                {/* Mini Profile Card */}
                <div className="bg-[var(--bg-card)] backdrop-blur-md text-[var(--text-primary)] p-4 rounded-xl sm:rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-card)] flex items-center gap-3 sm:gap-4 max-w-sm mx-auto transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--purple-bg)] border border-[var(--border-default)] flex items-center justify-center text-xl sm:text-2xl">
                    🥷
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm">Shadow_Assassin</h4>
                    <p className="text-xs text-[var(--text-secondary)] mb-1.5 sm:mb-2">Lv. 24 Rogue</p>
                    <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-amber-500 text-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold shadow-md flex-shrink-0">
                    14k XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Features Section ===== */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <FeatureCard
            icon={<CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--cyan)]" />}
            title="Gamified Tasks"
            description="Turn your to-do list into a quest board. Check off tasks to gain gold and experience."
          />
          <FeatureCard
            icon={<Shield className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--purple)]" />}
            title="6 Core Attributes"
            description="Improve your Health, Career, Social, Knowledge, Fitness, and Creativity in real life."
          />
          <FeatureCard
            icon={<Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--gold)]" />}
            title="Global Leaderboard"
            description="Compete with friends and strangers. Climb the ranks and become a legendary adventurer."
          />
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[var(--border-default)] py-6 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4 text-[var(--cyan)]" />
            <span className="text-sm font-bold text-[var(--text-secondary)]">
              LIFE<span className="text-[var(--cyan)]">RPG</span>
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Life RPG. Every day is a new quest. ⚔️
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-6 sm:p-8 hover:border-[var(--border-hover)]">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-default)] flex items-center justify-center mb-4 sm:mb-6">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[var(--text-primary)]">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
