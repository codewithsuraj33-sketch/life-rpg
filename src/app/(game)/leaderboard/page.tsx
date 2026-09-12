import { createClient } from '@/app/_lib/supabase/server'
import { Card } from '@/app/_components/ui/Card'
import { Badge } from '@/app/_components/ui/Badge'
import { Crown, Sparkles, Trophy, Flame } from 'lucide-react'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch top 50 players by level and xp
  const { data: topPlayers } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, level, xp, title, coins')
    .order('level', { ascending: false })
    .order('xp', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
          <span>👑</span> Realm Leaderboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Top adventurers ranked by level, battle experience, and glory.
        </p>
      </div>

      {/* Top 3 Podium (if at least 3 players exist) */}
      {topPlayers && topPlayers.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-6 pb-2 items-end">
          {/* Rank 2 */}
          <div className="flex flex-col items-center p-2.5 sm:p-4 rounded-xl border border-slate-400/20 bg-[var(--bg-card)] text-center relative order-1">
            <span className="text-xl sm:text-2xl mb-1">🥈</span>
            <div className="text-2xl sm:text-4xl p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-[var(--bg-primary)] border border-slate-400/30 mb-1.5 sm:mb-2">
              {topPlayers[1].avatar_url || '🧙'}
            </div>
            <p className="font-bold text-xs sm:text-sm truncate max-w-full">{topPlayers[1].username}</p>
            <p className="text-[11px] sm:text-xs text-slate-300 font-mono">Lv.{topPlayers[1].level}</p>
            <p className="text-[10px] sm:text-[11px] text-muted">{topPlayers[1].xp} XP</p>
          </div>

          {/* Rank 1 (Tallest / Gold Glow) */}
          <div className="flex flex-col items-center p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-[var(--bg-card)] text-center relative order-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] -translate-y-2">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mb-1" />
            <div className="text-3xl sm:text-5xl p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[var(--bg-primary)] border-2 border-amber-400 mb-1.5 sm:mb-2">
              {topPlayers[0].avatar_url || '🧙'}
            </div>
            <Badge variant="gold" className="mb-1 text-[10px] sm:text-xs px-2 py-0">Champion</Badge>
            <p className="font-black text-xs sm:text-base truncate max-w-full">{topPlayers[0].username}</p>
            <p className="text-xs sm:text-sm text-amber-400 font-mono font-bold">Lv.{topPlayers[0].level}</p>
            <p className="text-[10px] sm:text-xs text-muted">{topPlayers[0].xp} XP</p>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center p-2.5 sm:p-4 rounded-xl border border-amber-700/20 bg-[var(--bg-card)] text-center relative order-3">
            <span className="text-xl sm:text-2xl mb-1">🥉</span>
            <div className="text-2xl sm:text-4xl p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-[var(--bg-primary)] border border-amber-700/30 mb-1.5 sm:mb-2">
              {topPlayers[2].avatar_url || '🧙'}
            </div>
            <p className="font-bold text-xs sm:text-sm truncate max-w-full">{topPlayers[2].username}</p>
            <p className="text-[11px] sm:text-xs text-amber-600 font-mono">Lv.{topPlayers[2].level}</p>
            <p className="text-[10px] sm:text-[11px] text-muted">{topPlayers[2].xp} XP</p>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <Card>
        <div className="divide-y divide-[var(--border-default)]/60">
          {topPlayers && topPlayers.length > 0 ? (
            topPlayers.map((player, index) => {
              const isCurrentUser = player.id === user.id
              const rank = index + 1

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3.5 sm:p-4 transition-colors ${
                    isCurrentUser ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-[var(--bg-secondary)]/40'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="w-6 text-center font-bold text-sm font-mono text-muted">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </span>

                    <div className="text-2xl sm:text-3xl p-1 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-default)]">
                      {player.avatar_url || '🧙'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate text-[var(--text-primary)]">
                          {player.username}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted">
                        Lv.{player.level} • {player.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-amber-400 block">
                      {player.xp.toLocaleString()} XP
                    </span>
                    <span className="text-[11px] text-muted font-mono">
                      🪙 {player.coins} Gold
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center py-8 text-sm text-muted">No heroes have joined the realm yet.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
