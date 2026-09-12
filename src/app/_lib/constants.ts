// ============================================
// Life RPG — Game Constants
// ============================================

// XP required per level (index = level, value = total XP needed)
// Formula: 100 * level^1.5 (rounded)
export const XP_TABLE: Record<number, number> = {
  1: 0,
  2: 100,
  3: 260,
  4: 490,
  5: 800,
  6: 1200,
  7: 1700,
  8: 2300,
  9: 3000,
  10: 3800,
  11: 4750,
  12: 5800,
  13: 7000,
  14: 8350,
  15: 9850,
  16: 11500,
  17: 13300,
  18: 15300,
  19: 17500,
  20: 20000,
}

// Max level
export const MAX_LEVEL = 20

// XP rewards by difficulty
export const DIFFICULTY_XP: Record<string, number> = {
  easy: 15,
  medium: 30,
  hard: 60,
  legendary: 120,
}

// Coin rewards by difficulty
export const DIFFICULTY_COINS: Record<string, number> = {
  easy: 5,
  medium: 10,
  hard: 25,
  legendary: 50,
}

// Streak bonus multiplier (streak count → multiplier)
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0
  if (streak >= 14) return 1.5
  if (streak >= 7) return 1.3
  if (streak >= 3) return 1.1
  return 1.0
}

// Default stat categories
export const DEFAULT_STATS = [
  { name: 'Health', icon: '❤️', color: '#ef4444' },
  { name: 'Career', icon: '💼', color: '#3b82f6' },
  { name: 'Social', icon: '🤝', color: '#10b981' },
  { name: 'Knowledge', icon: '📚', color: '#f59e0b' },
  { name: 'Fitness', icon: '💪', color: '#8b5cf6' },
  { name: 'Creativity', icon: '🎨', color: '#f97316' },
] as const

// Character titles by level
export const TITLES: Record<number, string> = {
  1: 'Novice',
  3: 'Apprentice',
  5: 'Adventurer',
  7: 'Warrior',
  9: 'Champion',
  11: 'Hero',
  13: 'Legend',
  15: 'Mythic',
  17: 'Immortal',
  20: 'Godlike',
}

// Get title for a given level
export function getTitleForLevel(level: number): string {
  let title = 'Novice'
  for (const [lvl, t] of Object.entries(TITLES)) {
    if (level >= Number(lvl)) title = t
  }
  return title
}

// Quest types
export const QUEST_TYPES = ['daily', 'habit', 'todo', 'challenge'] as const
export type QuestType = typeof QUEST_TYPES[number]

// Difficulty levels
export const DIFFICULTIES = ['easy', 'medium', 'hard', 'legendary'] as const
export type Difficulty = typeof DIFFICULTIES[number]

// Difficulty display info
export const DIFFICULTY_INFO: Record<string, { label: string; color: string; emoji: string }> = {
  easy: { label: 'Easy', color: '#10b981', emoji: '🟢' },
  medium: { label: 'Medium', color: '#f59e0b', emoji: '🟡' },
  hard: { label: 'Hard', color: '#ef4444', emoji: '🔴' },
  legendary: { label: 'Legendary', color: '#8b5cf6', emoji: '🟣' },
}
