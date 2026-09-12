import { createClient } from '@/app/_lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/Card'
import { BossHealthBar } from '@/app/_components/game/BossHealthBar'
import { DailyRewardModal } from '@/app/_components/game/DailyRewardModal'
import { ClassSelectionModal } from '@/app/_components/game/ClassSelectionModal'
import { ProgressBar } from '@/app/_components/ui/ProgressBar'
import { Badge } from '@/app/_components/ui/Badge'
import { ActivityHeatmap } from '@/app/_components/game/ActivityHeatmap'
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
    { data: fullActivityHistory },
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
      .from('activity_log')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('action', 'QUEST_COMPLETED')
      .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()),
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
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-default)] bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="text-5xl sm:text-6xl p-3 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] shadow-[var(--shadow-cyan)] animate-float">
              {profile.avatar_url || '🧙'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.username}</h1>
                <Badge variant="gold">Lv.{profile.level} {profile.title}</Badge>
              </div>
              <p className="text-sm text-muted mt-1">Ready for today's adventures? Keep your streak alive!</p>
              
              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-[var(--gold)] font-bold">
                  <Coins className="w-4 h-4" /> {profile.coins} Gold
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> {totalCompletedCount || 0} Quests Done
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64 bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-default)]">
            <div className="flex justify-between text-xs mb-1.5 font-bold">
              <span className="text-muted">Level Progress</span>
              <span className="text-[var(--purple)]">{currentXP} / {xpForNextLevel} XP</span>
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
                <TrendingUp className="w-5 h-5 text-[var(--purple)]" />
                Character Attributes
              </CardTitle>
              <Link href="/character" className="text-xs font-bold text-[var(--purple)] hover:underline flex items-center gap-1">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats && stats.length > 0 ? (
                stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="box-hover p-3.5 border border-[var(--border-default)] bg-[var(--bg-primary)] flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl glow-cyan">{stat.icon}</span>
                      <span className="text-xs font-bold text-[var(--cyan)]">Lv.{stat.level}</span>
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
                <Scroll className="w-5 h-5 text-[var(--purple)]" />
                Active Quests
              </CardTitle>
              <Link href="/quests" className="text-xs font-bold text-[var(--purple)] hover:underline flex items-center gap-1">
                All Quests <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <div className="space-y-3">
              {recentQuests && recentQuests.length > 0 ? (
                recentQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="box-hover flex items-center justify-between p-3 border border-[var(--border-default)] bg-[var(--bg-primary)] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[var(--purple)]" />
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{quest.title}</p>
                        <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
                          <span className="capitalize">{quest.type}</span> •
                          <span className="text-[var(--purple)] font-bold">+{quest.xp_reward} XP</span>
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
                      className="px-4 py-2 rounded-full text-xs font-bold bg-[var(--purple-bg)] text-[var(--purple)] border border-transparent hover:border-[var(--border-default)] transition-all"
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
                    className="inline-block mt-2 text-xs font-bold text-[var(--purple)] hover:underline"
                  >
                    + Create your first quest
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Actions, AI & Activity Feed */}
        <div className="space-y-6">
          
          {/* Quick Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Award className="w-5 h-5 text-[var(--purple)]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/quests"
                className="box-hover flex items-center justify-between p-3.5 border border-transparent bg-[var(--bg-primary)] hover:border-[var(--border-default)] text-sm font-semibold rounded-xl"
              >
                <span>⚔️ Go to Quest Board</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
              <Link
                href="/leaderboard"
                className="box-hover flex items-center justify-between p-3.5 border border-transparent bg-[var(--bg-primary)] hover:border-[var(--border-default)] text-sm font-semibold rounded-xl"
              >
                <span>👑 View Leaderboard</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
              <Link
                href="/shop"
                className="box-hover flex items-center justify-between p-3.5 border border-transparent bg-[var(--bg-primary)] hover:border-[var(--border-default)] text-sm font-semibold rounded-xl"
              >
                <span>🛒 Visit Rewards Market</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
              <Link
                href="/achievements"
                className="box-hover flex items-center justify-between p-3.5 border border-transparent bg-[var(--bg-primary)] hover:border-[var(--border-default)] text-sm font-semibold rounded-xl"
              >
                <span>🏆 Check Achievements</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </Link>
            </div>
          </Card>

          {/* Activity Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>
                <TrendingUp className="w-5 h-5 text-[var(--purple)]" />
                Consistency Map
              </CardTitle>
            </CardHeader>
            <ActivityHeatmap activities={fullActivityHistory || []} />
          </Card>

          {/* Recent Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>
                <History className="w-5 h-5 text-[var(--purple)]" />
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
