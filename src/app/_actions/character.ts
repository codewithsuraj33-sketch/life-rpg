'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const username = formData.get('username') as string
  const avatarUrl = formData.get('avatar_url') as string

  const updates: Record<string, string> = {}
  if (username && username.trim().length >= 3) {
    updates.username = username.trim()
  }
  if (avatarUrl) {
    updates.avatar_url = avatarUrl
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'No fields to update' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/character')
  revalidatePath('/dashboard')
  return { success: true }
}
