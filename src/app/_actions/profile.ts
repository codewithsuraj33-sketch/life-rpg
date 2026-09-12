'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setClassType(classType: 'Warrior' | 'Mage' | 'Rogue') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ class_type: classType })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/character')
  return { success: true }
}
