'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Utility to get current period keys
function getPeriodKeys(date: Date) {
  // Weekly: YYYY-Www (ISO 8601 week)
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  const currentWeek = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`

  // Last week
  const lastWeekDate = new Date(d)
  lastWeekDate.setUTCDate(lastWeekDate.getUTCDate() - 7)
  const lastWeekYearStart = new Date(Date.UTC(lastWeekDate.getUTCFullYear(), 0, 1))
  const lastWeekNo = Math.ceil((((lastWeekDate.getTime() - lastWeekYearStart.getTime()) / 86400000) + 1) / 7)
  const lastWeek = `${lastWeekDate.getUTCFullYear()}-W${lastWeekNo.toString().padStart(2, '0')}`

  // Monthly: YYYY-MM
  const currentMonth = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`
  const lastMonthDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1))
  const lastMonth = `${lastMonthDate.getUTCFullYear()}-${(lastMonthDate.getUTCMonth() + 1).toString().padStart(2, '0')}`

  // Yearly: YYYY
  const currentYear = `${date.getUTCFullYear()}`
  const lastYear = `${date.getUTCFullYear() - 1}`

  return {
    currentWeek, lastWeek,
    currentMonth, lastMonth,
    currentYear, lastYear
  }
}

export async function getLeaderboard(timeframe: 'all' | 'weekly' | 'monthly' | 'yearly') {
  const supabase = await createClient()

  if (timeframe === 'all') {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, level, xp, title, coins')
      .order('level', { ascending: false })
      .order('xp', { ascending: false })
      .limit(50)
    return data || []
  }

  // Time-based (Calculate from activity_log)
  const now = new Date()
  let startDate = new Date()

  if (timeframe === 'weekly') {
    const day = startDate.getDay() || 7
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - day + 1) // Monday
  } else if (timeframe === 'monthly') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  } else if (timeframe === 'yearly') {
    startDate = new Date(now.getFullYear(), 0, 1)
  }

  const { data: logs } = await supabase
    .from('activity_log')
    .select('user_id, xp_gained, profiles(username, avatar_url, level, title, coins)')
    .gte('created_at', startDate.toISOString())

  if (!logs) return []

  const xpMap: Record<string, any> = {}
  
  for (const log of logs) {
    if (!log.profiles) continue
    if (!xpMap[log.user_id]) {
      xpMap[log.user_id] = {
        id: log.user_id,
        username: (log.profiles as any).username,
        avatar_url: (log.profiles as any).avatar_url,
        level: (log.profiles as any).level,
        title: (log.profiles as any).title,
        coins: (log.profiles as any).coins,
        xp: 0
      }
    }
    xpMap[log.user_id].xp += log.xp_gained
  }

  return Object.values(xpMap)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 50)
}

export async function checkAndDistributeRewards() {
  const supabase = await createClient()
  const now = new Date()
  const keys = getPeriodKeys(now)

  const periodsToCheck = [
    { type: 'weekly', key: keys.lastWeek, reward: 100 },
    { type: 'monthly', key: keys.lastMonth, reward: 500 },
    { type: 'yearly', key: keys.lastYear, reward: 2000 }
  ]

  for (const period of periodsToCheck) {
    // Check if reward was already given
    const { data: existingLog } = await supabase
      .from('system_rewards_log')
      .select('id')
      .eq('period_key', period.key)
      .maybeSingle()

    if (existingLog) continue

    // Determine start/end date of the past period to calculate winner
    let startDate = new Date()
    let endDate = new Date()

    if (period.type === 'weekly') {
      const parts = period.key.split('-W')
      const year = parseInt(parts[0])
      const week = parseInt(parts[1])
      startDate = new Date(year, 0, 1 + (week - 1) * 7)
      const day = startDate.getDay() || 7
      startDate.setDate(startDate.getDate() - day + 1)
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 7)
    } else if (period.type === 'monthly') {
      const parts = period.key.split('-')
      const year = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1
      startDate = new Date(year, month, 1)
      endDate = new Date(year, month + 1, 1)
    } else if (period.type === 'yearly') {
      const year = parseInt(period.key)
      startDate = new Date(year, 0, 1)
      endDate = new Date(year + 1, 0, 1)
    }

    const { data: logs } = await supabase
      .from('activity_log')
      .select('user_id, xp_gained')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString())

    if (!logs || logs.length === 0) {
      // No activity, just mark as checked
      await supabase.from('system_rewards_log').insert({
        period_type: period.type,
        period_key: period.key,
        winner_id: null,
        reward_amount: 0
      })
      continue
    }

    const xpMap: Record<string, number> = {}
    for (const log of logs) {
      xpMap[log.user_id] = (xpMap[log.user_id] || 0) + log.xp_gained
    }

    let winnerId = null
    let maxXP = -1
    for (const [userId, xp] of Object.entries(xpMap)) {
      if (xp > maxXP) {
        maxXP = xp
        winnerId = userId
      }
    }

    if (winnerId) {
      // Give reward
      const { data: profile } = await supabase.from('profiles').select('coins').eq('id', winnerId).single()
      if (profile) {
        await supabase.from('profiles').update({ coins: profile.coins + period.reward }).eq('id', winnerId)
        await supabase.from('activity_log').insert({
          user_id: winnerId,
          action: `Champion of ${period.key}! Won ${period.type} leaderboard.`,
          xp_gained: 0,
          coins_gained: period.reward
        })
      }
    }

    // Mark as checked
    await supabase.from('system_rewards_log').insert({
      period_type: period.type,
      period_key: period.key,
      winner_id: winnerId,
      reward_amount: period.reward
    })
  }
}
