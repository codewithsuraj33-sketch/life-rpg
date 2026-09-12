'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkLevelUp } from '@/app/_lib/xp'
import { checkAndDistributeRewards } from './leaderboard'

export async function claimDailyReward() {
  // Run leaderboard checks in background non-blocking
  checkAndDistributeRewards().catch(console.error)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  
  if (profile.last_login_date === today) {
    return { alreadyClaimed: true }
  }

  // Grant Reward
  const xpReward = 50
  const coinReward = 20

  const newXP = profile.xp + xpReward
  const newCoins = profile.coins + coinReward
  
  const levelUpResult = checkLevelUp(profile.xp, xpReward, profile.level)
  const newLevel = levelUpResult ? levelUpResult.newLevel : profile.level
  const newTitle = levelUpResult ? levelUpResult.newTitle : profile.title

  await supabase
    .from('profiles')
    .update({
      last_login_date: today,
      xp: newXP,
      coins: newCoins,
      level: newLevel,
      title: newTitle,
    })
    .eq('id', user.id)
    
  await supabase.from('activity_log').insert({
    user_id: user.id,
    action: `Claimed Daily Reward`,
    xp_gained: xpReward,
    coins_gained: coinReward,
  })

  revalidatePath('/dashboard')
  
  return {
    success: true,
    xpReward,
    coinReward,
    leveledUp: !!levelUpResult,
    newLevel,
    newTitle
  }
}
