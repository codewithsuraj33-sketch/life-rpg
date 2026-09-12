import { SupabaseClient } from '@supabase/supabase-js'

export interface UnlockedAchievement {
  name: string
  icon: string
  description: string
  xpReward: number
}

/**
 * Checks all achievement rules for the user and awards any newly earned badges
 */
export async function checkAndAwardAchievements(
  supabase: SupabaseClient,
  userId: string
): Promise<UnlockedAchievement[]> {
  try {
    // 1. Fetch user stats, profile, quest counts, and existing achievements
    const [
      { data: profile },
      { count: completedQuestsCount },
      { data: quests },
      { data: existingAchievements },
      { data: allAchievements },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase
        .from('quests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true),
      supabase
        .from('quests')
        .select('difficulty, streak, best_streak')
        .eq('user_id', userId),
      supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId),
      supabase.from('achievements').select('*'),
    ])

    if (!profile || !allAchievements) return []

    const earnedIds = new Set((existingAchievements || []).map((ea) => ea.achievement_id))
    const newlyUnlocked: UnlockedAchievement[] = []

    const maxStreak = Math.max(
      0,
      ...(quests || []).map((q) => Math.max(q.streak || 0, q.best_streak || 0))
    )
    const legendaryDone = (quests || []).some(
      (q) => q.difficulty === 'legendary' && (q.streak > 0 || q.best_streak > 0)
    )

    // Evaluate each achievement against current user progression
    for (const ach of allAchievements) {
      if (earnedIds.has(ach.id)) continue

      let isConditionMet = false

      switch (ach.requirement_type) {
        case 'quests_completed':
          isConditionMet = (completedQuestsCount || 0) >= ach.requirement_value
          break
        case 'streak':
          isConditionMet = maxStreak >= ach.requirement_value
          break
        case 'level':
          isConditionMet = profile.level >= ach.requirement_value
          break
        case 'coins':
          isConditionMet = profile.coins >= ach.requirement_value
          break
        case 'legendary_completed':
          isConditionMet = legendaryDone
          break
      }

      if (isConditionMet) {
        // Award achievement in DB
        await supabase.from('user_achievements').insert({
          user_id: userId,
          achievement_id: ach.id,
        })

        // Also add reward XP to user profile
        if (ach.xp_reward > 0) {
          await supabase
            .from('profiles')
            .update({ xp: profile.xp + ach.xp_reward })
            .eq('id', userId)
        }

        newlyUnlocked.push({
          name: ach.name,
          icon: ach.icon,
          description: ach.description,
          xpReward: ach.xp_reward,
        })
      }
    }

    return newlyUnlocked
  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}
