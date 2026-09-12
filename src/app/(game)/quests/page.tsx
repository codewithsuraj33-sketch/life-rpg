import { createClient } from '@/app/_lib/supabase/server'
import { QuestBoardClient } from '@/app/_components/game/QuestBoardClient'

export default async function QuestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user's quests with associated stat metadata
  const [{ data: quests }, { data: stats }] = await Promise.all([
    supabase
      .from('quests')
      .select('*, stat:stats(name, icon)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('stats')
      .select('id, name, icon')
      .eq('user_id', user.id)
      .order('name'),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
          <span>📜</span> Quest Board
        </h1>
        <p className="text-sm text-muted mt-1">
          Complete daily tasks, build powerful habits, and claim your rewards.
        </p>
      </div>

      <QuestBoardClient initialQuests={quests || []} stats={stats || []} />
    </div>
  )
}
