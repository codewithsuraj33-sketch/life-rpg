'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SHOP_ITEMS } from '@/app/_lib/shop'
import { checkLevelUp } from '@/app/_lib/xp'
import { getTitleForLevel } from '@/app/_lib/constants'

export async function buyItem(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const item = SHOP_ITEMS.find((i) => i.id === itemId)
  if (!item) return { error: 'Item not found in shop' }

  // Fetch current user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return { error: 'Profile not found' }

  // Check coins
  if (profile.coins < item.price) {
    return { error: `Not enough gold! You need ${item.price} coins.` }
  }

  const newCoins = profile.coins - item.price
  const updates: Record<string, any> = {
    coins: newCoins,
  }

  let xpGained = 0
  let leveledUp = false
  let newLevel = profile.level
  let newTitle = profile.title

  // Handle item effects
  if (item.category === 'potion' && item.effectValue) {
    xpGained = item.effectValue
    const newXP = profile.xp + xpGained
    const levelUpResult = checkLevelUp(profile.xp, xpGained, profile.level)

    updates.xp = newXP
    if (levelUpResult) {
      leveledUp = true
      newLevel = levelUpResult.newLevel
      newTitle = levelUpResult.newTitle
      updates.level = newLevel
      updates.title = newTitle
    }
  } else if (item.category === 'avatar' && item.unlockedAvatar) {
    updates.avatar_url = item.unlockedAvatar
  } else if (item.category === 'title' && item.unlockedTitle) {
    updates.title = item.unlockedTitle
  }

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    action: `Purchased from Shop: ${item.name}`,
    xp_gained: xpGained,
    coins_gained: -item.price,
  })

  revalidatePath('/shop')
  revalidatePath('/dashboard')
  revalidatePath('/character')
  revalidatePath('/leaderboard')

  return {
    success: true,
    message: `Successfully purchased ${item.name}!`,
    leveledUp,
    newLevel,
    newTitle,
  }
}
