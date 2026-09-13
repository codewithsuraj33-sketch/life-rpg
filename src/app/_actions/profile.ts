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

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const username = formData.get('username') as string
  const avatar_url = formData.get('avatar_url') as string

  if (!username || username.length < 3) {
    return { error: 'Username must be at least 3 characters' }
  }

  if (username.length > 20) {
    return { error: 'Username cannot exceed 20 characters' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      username,
      avatar_url: avatar_url || '🧙‍♂️',
    })
    .eq('id', user.id)

  if (error) {
    if (error.message.includes('unique') || error.message.includes('duplicate')) {
      return { error: 'This username is already taken' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Profile updated successfully!' }
}
