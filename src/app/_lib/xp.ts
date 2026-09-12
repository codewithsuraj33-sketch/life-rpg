import { XP_TABLE, MAX_LEVEL, getTitleForLevel } from './constants'

/**
 * Calculate the level for a given total XP amount
 */
export function calculateLevel(totalXP: number): number {
  let level = 1
  for (let i = 2; i <= MAX_LEVEL; i++) {
    if (totalXP >= XP_TABLE[i]) {
      level = i
    } else {
      break
    }
  }
  return level
}

/**
 * Calculate XP progress within current level
 * Returns { currentXP, xpForNextLevel, progress (0-1) }
 */
export function calculateProgress(totalXP: number, level: number): {
  currentXP: number
  xpForNextLevel: number
  progress: number
} {
  if (level >= MAX_LEVEL) {
    return { currentXP: totalXP, xpForNextLevel: 0, progress: 1 }
  }

  const currentLevelXP = XP_TABLE[level] || 0
  const nextLevelXP = XP_TABLE[level + 1] || currentLevelXP + 100
  const xpInLevel = totalXP - currentLevelXP
  const xpNeeded = nextLevelXP - currentLevelXP

  return {
    currentXP: xpInLevel,
    xpForNextLevel: xpNeeded,
    progress: Math.min(xpInLevel / xpNeeded, 1),
  }
}

/**
 * Check if adding XP causes a level up
 * Returns new level info if leveled up, null otherwise
 */
export function checkLevelUp(
  currentXP: number,
  xpToAdd: number,
  currentLevel: number
): { newLevel: number; newTitle: string } | null {
  const newTotalXP = currentXP + xpToAdd
  const newLevel = calculateLevel(newTotalXP)

  if (newLevel > currentLevel) {
    return {
      newLevel,
      newTitle: getTitleForLevel(newLevel),
    }
  }

  return null
}
