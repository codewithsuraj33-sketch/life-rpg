import { createClient } from '@/app/_lib/supabase/server'
import { ShopClient } from '@/app/_components/game/ShopClient'
import { SHOP_ITEMS } from '@/app/_lib/shop'

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('coins')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
          <span>🏪</span> Rewards Market
        </h1>
        <p className="text-sm text-muted mt-1">
          Spend your earned bounty on game-changing boosters and bragging rights.
        </p>
      </div>

      <ShopClient items={SHOP_ITEMS} initialCoins={profile?.coins || 0} />
    </div>
  )
}
