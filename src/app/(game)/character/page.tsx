import { createClient } from '@/app/_lib/supabase/server'
import { CharacterClient } from '@/app/_components/game/CharacterClient'

export default async function CharacterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [{ data: profile }, { data: stats }, { data: inventory }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('stats').select('*').eq('user_id', user.id).order('name'),
    supabase.from('inventory').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  if (!profile) return null

  return <CharacterClient profile={profile} stats={stats || []} inventory={inventory || []} />
}
