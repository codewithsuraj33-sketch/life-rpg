'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!username || username.length < 3) {
    return { error: 'Username must be at least 3 characters' }
  }

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) {
    const msg = error.message
    if (msg.toLowerCase().includes('rate limit')) {
      return {
        error: 'Supabase email rate limit exceeded. Free tier allows max 3-4 emails/hour.',
        isRateLimit: true,
      }
    }
    return { error: msg }
  }

  // If Supabase has email confirmation enabled and no session is returned yet
  if (data?.user && !data.session) {
    return {
      message: 'Signup successful! Please check your email inbox to confirm your account, or disable email confirmations in Supabase dashboard.',
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
