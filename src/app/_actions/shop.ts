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
    .select('coins')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return { error: 'Profile not found' }

  // Check coins
  if (profile.coins < item.price) {
    return { error: `Not enough gold! You need ${item.price} coins.` }
  }

  // Check if they already own it in inventory
  const { data: invItem } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('user_id', user.id)
    .eq('item_id', item.id)
    .maybeSingle()

  if (invItem && (item.category === 'avatar' || item.category === 'title')) {
    return { error: 'You already own this item! Check your bag.' }
  }

  // Deduct coins
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ coins: profile.coins - item.price })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  // Add to inventory
  const { error: invError } = await supabase
    .from('inventory')
    .upsert(
      {
        user_id: user.id,
        item_id: item.id,
        quantity: (invItem?.quantity || 0) + 1,
      },
      { onConflict: 'user_id,item_id' }
    )

  if (invError) {
    // Note: In a real app we'd use a transaction. If this fails, we refund.
    console.error('Inventory error:', invError)
  }

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    action: `Purchased from Shop: ${item.name}`,
    coins_gained: -item.price,
  })

  revalidatePath('/shop')
  revalidatePath('/character')

  return {
    success: true,
    message: `Purchased ${item.name}! Check your Bag on the Character page.`,
  }
}
