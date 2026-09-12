'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SHOP_ITEMS } from '@/app/_lib/shop'
import { checkLevelUp } from '@/app/_lib/xp'

export async function getInventory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function useItem(inventoryId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Get the inventory item
  const { data: invItem, error: invError } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', inventoryId)
    .eq('user_id', user.id)
    .single()

  if (invError || !invItem) return { error: 'Item not found in your bag' }

  const itemDef = SHOP_ITEMS.find((i) => i.id === invItem.item_id)
  if (!itemDef) return { error: 'Unknown item type' }

  // 2. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const updates: Record<string, any> = {}
  let xpGained = 0
  let leveledUp = false
  let newLevel = profile.level
  let newTitle = profile.title

  // 3. Apply Effect
  if (itemDef.category === 'potion') {
    if (invItem.quantity < 1) return { error: 'Not enough quantity' }
    
    // Potions give XP
    xpGained = itemDef.effectValue || 0
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
  } else if (itemDef.category === 'avatar') {
    updates.avatar_url = itemDef.unlockedAvatar
  } else if (itemDef.category === 'title') {
    updates.title = itemDef.unlockedTitle
  }

  // 4. Update Profile
  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    
    if (updateError) return { error: updateError.message }
  }

  // 5. Reduce quantity or delete row (only for consumables like potions)
  if (itemDef.category === 'potion') {
    if (invItem.quantity > 1) {
      await supabase
        .from('inventory')
        .update({ quantity: invItem.quantity - 1 })
        .eq('id', inventoryId)
    } else {
      await supabase
        .from('inventory')
        .delete()
        .eq('id', inventoryId)
    }
  }

  revalidatePath('/character')
  revalidatePath('/dashboard')
  revalidatePath('/shop')
  revalidatePath('/leaderboard')

  return {
    success: true,
    message: itemDef.category === 'potion' ? `Drank ${itemDef.name} (+${xpGained} XP)` : `Equipped ${itemDef.name}!`,
    leveledUp,
    newLevel,
    newTitle
  }
}
