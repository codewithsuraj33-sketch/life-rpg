'use server'

import { createClient } from '@/app/_lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

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

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Please enter your email address' }
  }

  let origin = process.env.NEXT_PUBLIC_SITE_URL
  if (!origin) {
    try {
      const headersList = await headers()
      const host = headersList.get('host')
      const proto = headersList.get('x-forwarded-proto') || 'http'
      if (host) {
        origin = `${proto}://${host}`
      }
    } catch {
      origin = 'http://localhost:3000'
    }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin || 'http://localhost:3000'}/api/auth/callback?next=/settings`,
  })

  if (error) {
    if (error.message.toLowerCase().includes('rate limit')) {
      return { error: 'Too many reset attempts. Please wait a few minutes and try again.' }
    }
    return { error: error.message }
  }

  return { success: true, message: 'Password reset link sent! Check your email inbox.' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password updated successfully!' }
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const newEmail = formData.get('newEmail') as string

  if (!newEmail || !newEmail.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  if (newEmail === user.email) {
    return { error: 'New email is the same as your current email' }
  }

  const { error } = await supabase.auth.updateUser({ email: newEmail })

  if (error) {
    if (error.message.toLowerCase().includes('rate limit')) {
      return { error: 'Too many email change attempts. Please wait and try again.' }
    }
    return { error: error.message }
  }

  return { success: true, message: 'Confirmation email sent to your new address. Please check your inbox.' }
}

export async function sendPhoneOtp(phone: string) {
  const supabase = await createClient()

  const cleanPhone = phone.replace(/\s+/g, '')
  if (!cleanPhone || cleanPhone.length < 8) {
    return { error: 'Please enter a valid phone number with country code (e.g. +91 98765 43210)' }
  }

  const { error } = await supabase.auth.signInWithOtp({
    phone: cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`,
  })

  if (error) {
    console.error('Supabase signInWithOtp error:', error.message, error)
    return { error: error.message }
  }

  return { success: true, message: 'OTP sent successfully!' }
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = await createClient()

  const cleanPhone = phone.replace(/\s+/g, '')
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`

  if (!token || token.trim().length < 4) {
    return { error: 'Please enter the verification code' }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: token.trim(),
    type: 'sms',
  })

  if (error) {
    return { error: error.message || 'Invalid or expired OTP. Please try again.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

