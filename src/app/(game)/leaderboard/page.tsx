import { createClient } from '@/app/_lib/supabase/server'
import { Card } from '@/app/_components/ui/Card'
import { Badge } from '@/app/_components/ui/Badge'
import { Crown, Sparkles, Trophy, Flame } from 'lucide-react'
import Link from 'next/link'
import { getLeaderboard } from '@/app/_actions/leaderboard'

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Await searchParams before reading properties (Next.js 15+ best practice)
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const tab = (resolvedSearchParams.tab || 'all') as 'all' | 'weekly' | 'monthly' | 'yearly'
  
  const topPlayers = await getLeaderboard(tab)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <span>👑</span> Realm Leaderboard
          </h1>
          <p className="text-sm text-muted mt-1">
            Top adventurers ranked by level, battle experience, and glory.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-xs font-semibold bg-amber-950/30 text-amber-400 border border-amber-500/20 px-2 py-1 rounded">
              Weekly Champ: <span className="font-bold">100 Gold</span>
            </span>
            <span className="text-xs font-semibold bg-amber-950/30 text-amber-400 border border-amber-500/20 px-2 py-1 rounded">
              Monthly Champ: <span className="font-bold">500 Gold</span>
            </span>
            <span className="text-xs font-semibold bg-amber-950/30 text-amber-400 border border-amber-500/20 px-2 py-1 rounded">
              Yearly Champ: <span className="font-bold">2000 Gold</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        <Link
          href="?tab=all"
          className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
            tab === 'all'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-amber-500/50'
          }`}
        >
          All Time
        </Link>
        <Link
          href="?tab=weekly"
          className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
            tab === 'weekly'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-amber-500/50'
          }`}
        >
          This Week
        </Link>
        <Link
          href="?tab=monthly"
          className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
            tab === 'monthly'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-amber-500/50'
          }`}
        >
          This Month
        </Link>
        <Link
          href="?tab=yearly"
          className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
            tab === 'yearly'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-amber-500/50'
          }`}
        >
          This Year
        </Link>
      </div>
      
      {/* Dynamic Subtext */}
      {tab !== 'all' && (
        <p className="text-xs font-semibold text-amber-400 bg-amber-950/30 inline-block px-3 py-1.5 rounded border border-amber-500/20">
          The champion at the end of the {tab.replace('ly','')} is automatically awarded {tab === 'weekly' ? '100' : tab === 'monthly' ? '500' : '2000'} Gold points!
        </p>
      )}

      {/* Top 3 Podium (if at least 3 players exist) */}
      {topPlayers && topPlayers.length >= 3 && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-6 pt-4 sm:pt-6 pb-2 items-end">
          {/* Rank 2 (Silver) */}
          <div className="rpg-sheen flex flex-col items-center p-3 sm:p-5 rounded-2xl border border-slate-400/30 bg-[#0d0d28] text-center relative order-1 shadow-[0_0_15px_rgba(203,213,225,0.1)]">
            <span className="text-2xl sm:text-3xl mb-1">🥈</span>
            <div className="text-3xl sm:text-4xl p-2 sm:p-2.5 rounded-2xl bg-[var(--bg-primary)] border-2 border-slate-400/40 mb-2 shadow-inner">
              {topPlayers[1].avatar_url || '🧙'}
            </div>
            <p className="font-extrabold text-xs sm:text-sm text-white truncate max-w-full">{topPlayers[1].username}</p>
            <p className="text-xs text-slate-300 font-mono font-bold mt-0.5">Lv.{topPlayers[1].level}</p>
            <p className="text-[10px] sm:text-xs text-purple-300 font-mono">{topPlayers[1].xp.toLocaleString()} XP</p>
          </div>

          {/* Rank 1 (Gold Champion / Tallest) */}
          <div className="rpg-sheen flex flex-col items-center p-4 sm:p-6 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/20 via-[#161208] to-[#0d0d28] text-center relative order-2 shadow-[0_0_30px_rgba(245,166,35,0.3)] -translate-y-2 sm:-translate-y-4 hover:-translate-y-5 transition-transform">
            <Crown className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 mb-1 animate-bounce" />
            <div className="text-4xl sm:text-5xl p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-primary)] border-2 border-amber-400 mb-2 shadow-lg shadow-amber-500/20">
              {topPlayers[0].avatar_url || '🧙'}
            </div>
            <Badge variant="gold" className="mb-1 text-[10px] sm:text-xs px-2.5 py-0.5 font-black uppercase tracking-widest shadow-sm">Realm Champion</Badge>
            <p className="font-black text-sm sm:text-lg text-white truncate max-w-full">{topPlayers[0].username}</p>
            <p className="text-xs sm:text-sm text-amber-300 font-mono font-black">Lv.{topPlayers[0].level}</p>
            <p className="text-[11px] sm:text-xs text-amber-400/90 font-mono font-bold">{topPlayers[0].xp.toLocaleString()} XP</p>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="rpg-sheen flex flex-col items-center p-3 sm:p-5 rounded-2xl border border-amber-700/40 bg-[#0d0d28] text-center relative order-3 shadow-[0_0_15px_rgba(180,83,9,0.1)]">
            <span className="text-2xl sm:text-3xl mb-1">🥉</span>
            <div className="text-3xl sm:text-4xl p-2 sm:p-2.5 rounded-2xl bg-[var(--bg-primary)] border-2 border-amber-700/40 mb-2 shadow-inner">
              {topPlayers[2].avatar_url || '🧙'}
            </div>
            <p className="font-extrabold text-xs sm:text-sm text-white truncate max-w-full">{topPlayers[2].username}</p>
            <p className="text-xs text-amber-500 font-mono font-bold mt-0.5">Lv.{topPlayers[2].level}</p>
            <p className="text-[10px] sm:text-xs text-purple-300 font-mono">{topPlayers[2].xp.toLocaleString()} XP</p>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <Card className="border-purple-500/30 bg-[#0d0d26]/95 shadow-xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {topPlayers && topPlayers.length > 0 ? (
            topPlayers.map((player, index) => {
              const isCurrentUser = player.id === user.id
              const rank = index + 1

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3.5 sm:p-4.5 transition-colors ${
                    isCurrentUser ? 'bg-amber-500/15 border-l-4 border-amber-400 shadow-inner' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="w-7 text-center font-black text-sm sm:text-base font-mono text-slate-300">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </span>

                    <div className="text-2xl sm:text-3xl p-1.5 bg-[var(--bg-primary)] rounded-xl border border-purple-500/30 shadow-sm flex-shrink-0">
                      {player.avatar_url || '🧙'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm sm:text-base truncate text-white">
                          {player.username}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black uppercase tracking-wider shadow-sm">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        Lv.{player.level} • {player.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm sm:text-base font-black text-amber-300 block" style={{ textShadow: '0 0 8px rgba(245,166,35,0.4)' }}>
                      {player.xp.toLocaleString()} XP
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-semibold">
                      🪙 {player.coins.toLocaleString()} Gold
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center py-8 text-sm text-slate-400">No players ranked yet. Be the first to claim glory!</p>
          )}
        </div>
      </Card>
    </div>
  )
}
