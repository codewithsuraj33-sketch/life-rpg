import { createClient } from '@/app/_lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/app/_components/game/Sidebar'
import { TopBar } from '@/app/_components/game/TopBar'

export default async function GameLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, level, xp, coins, title, current_hp, max_hp')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar profile={profile} />
        <main className="flex-1 overflow-y-auto px-3.5 py-4 sm:p-6 md:p-8 scroll-smooth relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
