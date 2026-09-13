import { createClient } from '@/app/_lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from '@/app/_components/game/SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, level, title, class_type')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <SettingsClient
      profile={profile}
      email={user.email || ''}
    />
  )
}
