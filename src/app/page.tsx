import Link from "next/link";
import {
  Sword,
  Shield,
  Trophy,
  Zap,
  Users,
  ChevronRight,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== Navbar ===== */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <Sword className="w-6 h-6 text-gold" />
          <span className="text-xl font-bold tracking-tight">
            Life<span className="text-gold">RPG</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm py-2 px-4">
            Log In
          </Link>
          <Link href="/signup" className="btn-primary text-sm py-2 px-4">
            Start Quest
          </Link>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32">
        {/* Floating badge */}
        <div className="badge badge-gold mb-6 animate-fade-in">
          <Star className="w-3 h-3" />
          Level Up Your Real Life
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-tight animate-fade-in">
          Your Life Is The
          <br />
          <span className="text-gold glow-gold">Greatest RPG</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl leading-relaxed text-muted animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Transform everyday tasks into epic quests. Earn XP, level up your
          character stats, unlock achievements, and compete with friends on the
          leaderboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/signup"
            className="btn-primary text-base py-3 px-8 flex items-center gap-2"
          >
            Begin Your Adventure
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="btn-secondary text-base py-3 px-8"
          >
            Continue Quest
          </Link>
        </div>

        {/* ===== Feature Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-gold" />}
            title="Earn XP & Level Up"
            description="Complete real-life tasks to gain experience points. Watch your character grow stronger with every achievement."
            delay="0.1s"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-purple" />}
            title="6 Life Stats"
            description="Track Health, Career, Social, Knowledge, Fitness, and Creativity. Build a well-rounded character."
            delay="0.2s"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8 text-emerald" />}
            title="Compete & Achieve"
            description="Unlock badges, maintain streaks, and climb the global leaderboard. Your daily grind matters."
            delay="0.3s"
          />
        </div>

        {/* ===== Stats Preview ===== */}
        <div className="mt-20 card p-8 max-w-2xl w-full animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl animate-float">🧙</div>
            <div className="text-left">
              <h3 className="font-bold text-lg">Adventurer_Demo</h3>
              <div className="flex items-center gap-2">
                <span className="badge badge-gold text-xs">Lv. 7 Warrior</span>
                <span className="text-muted text-sm">1,700 XP</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1 text-gold font-mono font-bold">
              <span>🪙</span> 350
            </div>
          </div>
          <div className="space-y-3">
            <StatPreview label="❤️ Health" value={65} color="#ef4444" />
            <StatPreview label="💼 Career" value={80} color="#3b82f6" />
            <StatPreview label="🤝 Social" value={45} color="#10b981" />
            <StatPreview label="📚 Knowledge" value={72} color="#f59e0b" />
            <StatPreview label="💪 Fitness" value={55} color="#8b5cf6" />
            <StatPreview label="🎨 Creativity" value={38} color="#f97316" />
          </div>
        </div>

        {/* ===== Bottom CTA ===== */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-center gap-2 text-muted mb-3">
            <Users className="w-4 h-4" />
            <span className="text-sm">Join other adventurers leveling up their lives</span>
          </div>
          <Link
            href="/signup"
            className="btn-primary text-base py-3 px-10 inline-flex items-center gap-2"
          >
            Create Your Character
            <Sword className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="text-center py-8 text-dim text-sm border-t border-[var(--border-default)]">
        <p>
          Built with ⚔️ by Life RPG •{" "}
          <span className="text-gold">Every day is a new quest</span>
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
      className="card p-6 text-left animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
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
    <div className="flex items-center gap-3">
      <span className="text-sm w-28 text-left">{label}</span>
      <div className="flex-1 stat-bar">
        <div
          className="stat-bar-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono text-muted w-8 text-right">
        {value}%
      </span>
    </div>
  );
}
