export interface ShopItem {
  id: string
  name: string
  description: string
  category: 'potion' | 'title' | 'avatar' | 'badge'
  price: number
  icon: string
  effectValue?: number
  unlockedTitle?: string
  unlockedAvatar?: string
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'elixir_small',
    name: 'Minor XP Elixir',
    description: 'A magical draught that grants +50 instant bonus XP.',
    category: 'potion',
    price: 30,
    icon: '🧪',
    effectValue: 50,
  },
  {
    id: 'elixir_large',
    name: 'Greater XP Elixir',
    description: 'Distilled celestial essence granting +150 instant bonus XP.',
    category: 'potion',
    price: 80,
    icon: '⚗️',
    effectValue: 150,
  },
  {
    id: 'avatar_dragon',
    name: 'Dragon Knight Avatar',
    description: 'Unlocks the legendary Dragon Knight emoji for your character avatar.',
    category: 'avatar',
    price: 100,
    icon: '🐲',
    unlockedAvatar: '🐲',
  },
  {
    id: 'avatar_ninja',
    name: 'Shadow Assassin Avatar',
    description: 'Unlocks the stealthy Shadow Assassin emoji avatar.',
    category: 'avatar',
    price: 60,
    icon: '🥷',
    unlockedAvatar: '🥷',
  },
  {
    id: 'avatar_wizard',
    name: 'Grand Archmage Avatar',
    description: 'Unlocks the mystical Archmage emoji avatar.',
    category: 'avatar',
    price: 75,
    icon: '🧙‍♂️',
    unlockedAvatar: '🧙‍♂️',
  },
  {
    id: 'title_slayer',
    name: 'Title: "Procrastination Slayer"',
    description: 'Equip an exclusive custom prestige title on your profile.',
    category: 'title',
    price: 120,
    icon: '📜',
    unlockedTitle: 'Procrastination Slayer',
  },
  {
    id: 'title_discipline',
    name: 'Title: "Master of Discipline"',
    description: 'Honor your steadfast focus with this grand badge title.',
    category: 'title',
    price: 200,
    icon: '🎖️',
    unlockedTitle: 'Master of Discipline',
  },
]
