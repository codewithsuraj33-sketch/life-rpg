'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DIFFICULTY_XP, DIFFICULTY_COINS, getStreakMultiplier } from '@/app/_lib/constants'
import { checkLevelUp, calculateLevel } from '@/app/_lib/xp'
import { getTitleForLevel } from '@/app/_lib/constants'
import { checkAndAwardAchievements } from '@/app/_lib/achievements'

export async function createQuest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const type = formData.get('type') as string || 'todo'
  const difficulty = formData.get('difficulty') as string || 'medium'
  const statId = formData.get('stat_id') as string | null
  const isNegative = formData.get('is_negative') === 'true'

  const trimmedTitle = title ? title.trim() : ''
  if (!trimmedTitle || trimmedTitle.length === 0) {
    return { error: 'Quest title is required' }
  }
  if (trimmedTitle.length > 80) {
    return { error: 'Quest title must be under 80 characters' }
  }

  const safeDifficulty = ['easy', 'medium', 'hard', 'legendary'].includes(difficulty)
    ? difficulty
    : 'medium'

  const xpReward = DIFFICULTY_XP[safeDifficulty] || 30
  const coinReward = DIFFICULTY_COINS[safeDifficulty] || 10

  const { error } = await supabase.from('quests').insert({
    user_id: user.id,
    title: trimmedTitle,
    description: description.trim().slice(0, 300),
    type: ['daily', 'habit', 'todo', 'challenge'].includes(type) ? type : 'todo',
    difficulty: safeDifficulty,
    xp_reward: xpReward,
    coin_reward: coinReward,
    stat_id: statId || null,
    is_negative: isNegative,
  })

  if (error) return { error: error.message }

  revalidatePath('/quests')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function completeQuest(questId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get the quest
  const { data: quest, error: questError } = await supabase
    .from('quests')
    .select('*')
    .eq('id', questId)
    .eq('user_id', user.id)
    .single()

  if (questError || !quest) return { error: 'Quest not found' }
  if (quest.completed) return { error: 'Quest already completed' }

  // Calculate streak bonus
  const newStreak = quest.streak + 1
  const bestStreak = Math.max(quest.best_streak, newStreak)
  const multiplier = getStreakMultiplier(newStreak)
  let xpEarned = Math.round(quest.xp_reward * multiplier)
  const coinsEarned = Math.round(quest.coin_reward * multiplier)

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  // Handle Negative Quests (Bad Habits)
  if (quest.is_negative) {
    // Take damage instead of gaining XP
    const damageMap: Record<string, number> = { easy: 10, medium: 20, hard: 30, legendary: 50 }
    const damage = damageMap[quest.difficulty] || 20
    
    let newHp = Math.max(0, (profile.current_hp || 100) - damage)
    let coinsLost = 0
    let actionLog = `Gave in to bad habit: ${quest.title} (Took ${damage} DMG)`
    
    if (newHp === 0) {
      // Penalty: Reset to 100 HP, lose 100 coins
      newHp = profile.max_hp || 100
      coinsLost = 100
      actionLog = `HP reached 0! Respawned but lost ${coinsLost} coins.`
    }

    await supabase.from('profiles').update({
      current_hp: newHp,
      coins: Math.max(0, profile.coins - coinsLost)
    }).eq('id', user.id)
    
    // Log activity
    await supabase.from('activity_log').insert({
      user_id: user.id,
      action: actionLog,
      xp_gained: 0,
      coins_gained: -coinsLost,
    })

    // Reset quest state (bad habits are repeatable)
    await supabase.from('quests').update({
      completed: false,
      streak: 0
    }).eq('id', questId)

    revalidatePath('/quests')
    revalidatePath('/dashboard')
    
    return { success: true, isNegative: true, damageTaken: damage, coinsLost }
  }

  // Fetch stat to apply class multipliers
  let fetchedStat = null
  if (quest.stat_id) {
    const { data: stat } = await supabase
      .from('stats')
      .select('*')
      .eq('id', quest.stat_id)
      .single()
    fetchedStat = stat
  }

  // Class Multipliers
  if (profile.class_type && fetchedStat) {
    const statName = fetchedStat.name.toLowerCase()
    if (profile.class_type === 'Warrior' && (statName.includes('health') || statName.includes('fitness') || statName.includes('strength'))) {
      xpEarned = Math.round(xpEarned * 1.5)
    } else if (profile.class_type === 'Mage' && (statName.includes('intellect') || statName.includes('career') || statName.includes('study'))) {
      xpEarned = Math.round(xpEarned * 1.5)
    } else if (profile.class_type === 'Rogue' && (statName.includes('social') || statName.includes('fun') || statName.includes('charisma'))) {
      xpEarned = Math.round(xpEarned * 1.5)
    }
  }

  const newXP = profile.xp + xpEarned
  const newCoins = profile.coins + coinsEarned

  // Check for level up
  const levelUpResult = checkLevelUp(profile.xp, xpEarned, profile.level)
  const newLevel = levelUpResult ? levelUpResult.newLevel : profile.level
  const newTitle = levelUpResult ? levelUpResult.newTitle : profile.title

  // Update quest
  const isRepeatable = quest.type === 'daily' || quest.type === 'habit'
  await supabase
    .from('quests')
    .update({
      completed: !isRepeatable, // dailies/habits reset
      completed_at: new Date().toISOString(),
      streak: newStreak,
      best_streak: bestStreak,
    })
    .eq('id', questId)

  // Update profile
  await supabase
    .from('profiles')
    .update({
      xp: newXP,
      coins: newCoins,
      level: newLevel,
      title: newTitle,
      xp_to_next: getXPToNext(newLevel),
    })
    .eq('id', user.id)

  // Update stat XP if linked
  if (fetchedStat) {
    const newStatXP = fetchedStat.xp + xpEarned
    const newStatLevel = calculateLevel(newStatXP)
    await supabase
      .from('stats')
      .update({ xp: newStatXP, level: newStatLevel })
      .eq('id', quest.stat_id)
  }

  // Damage the active Boss
  const { data: boss } = await supabase
    .from('bosses')
    .select('*')
    .eq('is_active', true)
    .single()

  if (boss && boss.current_hp > 0) {
    const newBossHp = Math.max(0, boss.current_hp - 1)
    await supabase
      .from('bosses')
      .update({ current_hp: newBossHp })
      .eq('id', boss.id)
  }

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    action: `Completed quest: ${quest.title}`,
    xp_gained: xpEarned,
    coins_gained: coinsEarned,
  })

  // Check and award any unlocked achievements
  const unlockedAchievements = await checkAndAwardAchievements(supabase, user.id)

  revalidatePath('/quests')
  revalidatePath('/dashboard')
  revalidatePath('/character')
  revalidatePath('/achievements')

  return {
    success: true,
    xpEarned,
    coinsEarned,
    leveledUp: !!levelUpResult,
    newLevel,
    newTitle,
    streak: newStreak,
    unlockedAchievements,
  }
}

export async function updateQuest(questId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const type = formData.get('type') as string || 'todo'
  const difficulty = formData.get('difficulty') as string || 'medium'
  const statId = formData.get('stat_id') as string | null

  const trimmedTitle = title ? title.trim() : ''
  if (!trimmedTitle || trimmedTitle.length === 0) {
    return { error: 'Quest title is required' }
  }
  if (trimmedTitle.length > 80) {
    return { error: 'Quest title must be under 80 characters' }
  }

  const safeDifficulty = ['easy', 'medium', 'hard', 'legendary'].includes(difficulty)
    ? difficulty
    : 'medium'

  const xpReward = DIFFICULTY_XP[safeDifficulty] || 30
  const coinReward = DIFFICULTY_COINS[safeDifficulty] || 10

  const { error } = await supabase
    .from('quests')
    .update({
      title: trimmedTitle,
      description: description.trim().slice(0, 300),
      type: ['daily', 'habit', 'todo', 'challenge'].includes(type) ? type : 'todo',
      difficulty: safeDifficulty,
      xp_reward: xpReward,
      coin_reward: coinReward,
      stat_id: statId || null,
    })
    .eq('id', questId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/quests')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteQuest(questId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('quests')
    .delete()
    .eq('id', questId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/quests')
  revalidatePath('/dashboard')
  return { success: true }
}


function getXPToNext(level: number): number {
  const table: Record<number, number> = {
    1: 100, 2: 160, 3: 230, 4: 310, 5: 400,
    6: 500, 7: 600, 8: 700, 9: 800, 10: 950,
    11: 1050, 12: 1200, 13: 1350, 14: 1500, 15: 1650,
    16: 1800, 17: 2000, 18: 2200, 19: 2500, 20: 0,
  }
  return table[level] || 100
}
