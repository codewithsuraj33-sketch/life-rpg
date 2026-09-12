import { createClient } from '@/app/_lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/Card'
import { BossHealthBar } from '@/app/_components/game/BossHealthBar'
import { DailyRewardModal } from '@/app/_components/game/DailyRewardModal'
import { ClassSelectionModal } from '@/app/_components/game/ClassSelectionModal'
import { ProgressBar } from '@/app/_components/ui/ProgressBar'
import { Badge } from '@/app/_components/ui/Badge'
import { calculateProgress } from '@/app/_lib/xp'
import Link from 'next/link'
import {
  Flame,
  CheckCircle2,
  Coins,
  ArrowRight,
  TrendingUp,
  Award,
  Scroll,
  History
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Parallel fetch dashboard data
  const [
    { data: profile },
    { data: stats },
    { data: recentQuests },
    { data: activityLog },
    { count: totalCompletedCount },
    { data: bossData }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('stats').select('*').eq('user_id', user.id).order('name'),
    supabase
      .from('quests')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('quests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true),
    supabase
      .from('bosses')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()
  ])

  if (!profile) return null

  const { currentXP, xpForNextLevel, progress } = calculateProgress(profile.xp, profile.level)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <DailyRewardModal lastLoginDate={profile.last_login_date} />
      <ClassSelectionModal currentClass={profile.class_type} />
      <BossHealthBar boss={bossData} />

      {/* Top Banner: Hero Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-[var(--bg-secondary)] via-amber-950/10 to-[var(--bg-secondary)] p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="text-5xl sm:text-6xl p-3 bg-[var(--bg-primary)]/80 rounded-2xl border border-[var(--border-default)] shadow-inner">
              {profile.avatar_url || '🧙'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.username}</h1>
                <Badge variant="gold">Lv.{profile.level} {profile.title}</Badge>
              </div>
              <p className="text-sm text-muted mt-1">Ready for today's adventures? Keep your streak alive!</p>
              
              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <Coins className="w-4 h-4" /> {profile.coins} Gold
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> {totalCompletedCount || 0} Quests Done
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64 bg-[var(--bg-card)]/80 p-4 rounded-xl border border-[var(--border-default)]">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-muted">Level Progress</span>
              <span className="text-amber-400">{currentXP} / {xpForNextLevel} XP</span>
            </div>
            <ProgressBar progress={progress} />
            <p className="text-[11px] text-muted/80 text-right mt-1.5">
              {Math.max(xpForNextLevel - currentXP, 0)} XP until Level {profile.level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout: Stats Radar / Cards + Active Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Stats & Active Quests */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attributes / Stats Overview */}
          <Card glow>
            <CardHeader>
              <CardTitle>
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Character Attributes
              </CardTitle>
              <Link href="/character" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats && stats.length > 0 ? (
                stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="p-3.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)]/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{stat.icon}</span>
                      <span className="text-xs font-bold text-amber-400">Lv.{stat.level}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{stat.name}</p>
                      <p className="text-[10px] text-muted">{stat.xp} XP</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted col-span-3">No stats created yet.</p>
              )}
            </div>
          </Card>

          {/* Active Quests Quick-Board */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Scroll className="w-5 h-5 text-amber-400" />
                Active Quests
              </CardTitle>
              <Link href="/quests" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                All Quests <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <div className="space-y-3">
              {recentQuests && recentQuests.length > 0 ? (
                recentQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div>
                        <p className="text-sm font-medium">{quest.title}</p>
                        <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
                          <span className="capitalize">{quest.type}</span> •
                          <span className="text-amber-400 font-mono">+{quest.xp_reward} XP</span>
                          {quest.streak > 0 && (
                            <span className="flex items-center text-orange-400 font-semibold text-[11px]">
                              <Flame className="w-3 h-3 mr-0.5" /> {quest.streak}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/quests"
                      className="px-3 py-1.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                    >
                      Complete
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted">
                  <p className="text-sm">No active quests right now!</p>
                  <Link
                    href="/quests"
                    className="inline-block mt-2 text-xs font-semibold text-amber-400 hover:underline"
                  >
                    + Create your first quest
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Actions & Activity Feed */}
        <div className="space-y-6">
          
          {/* Quick Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Award className="w-5 h-5 text-amber-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/quests"
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-sm font-medium"
              >
                <span>⚔️ Go to Quest Board</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-sm font-medium"
              >
                <span>👑 View Leaderboard</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-sm font-medium"
              >
                <span>🛒 Visit Rewards Market</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
              <Link
                href="/achievements"
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-sm font-medium"
              >
                <span>🏆 Check Achievements</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
            </div>
          </Card>

          {/* Recent Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>
                <History className="w-5 h-5 text-amber-400" />
                Recent History
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {activityLog && activityLog.length > 0 ? (
                activityLog.map((log) => (
                  <div key={log.id} className="text-xs border-b border-[var(--border-default)]/40 pb-2.5 last:border-0 last:pb-0">
                    <p className="font-medium text-[var(--text-primary)]">{log.action}</p>
                    <div className="flex items-center justify-between text-muted mt-1 text-[11px]">
                      <span className="text-emerald-400 font-mono">+{log.xp_gained} XP</span>
                      <span>{new Date(log.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted text-center py-4">No recent activities logged yet.</p>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
