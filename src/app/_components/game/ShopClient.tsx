'use client'

import { useState } from 'react'
import { buyItem } from '@/app/_actions/shop'
import { ShopItem } from '@/app/_lib/shop'
import { Coins, Sparkles, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react'

export function ShopClient({
  items,
  initialCoins,
}: {
  items: ShopItem[]
  initialCoins: number
}) {
  const [coins, setCoins] = useState(initialCoins)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'potion' | 'avatar' | 'title'>('all')

  const filteredItems = items.filter((item) => {
    if (categoryFilter === 'all') return true
    return item.category === categoryFilter
  })

  async function handleBuy(item: ShopItem) {
    if (coins < item.price) {
      setNotification({
        type: 'error',
        message: `Insufficient gold! You need ${item.price - coins} more coins.`,
      })
      setTimeout(() => setNotification(null), 3500)
      return
    }

    setLoadingId(item.id)
    setNotification(null)

    try {
      const res = await buyItem(item.id)
      if (res.error) {
        setNotification({ type: 'error', message: res.error })
      } else {
        setCoins((prev) => prev - item.price)
        setNotification({ type: 'success', message: res.message || 'Purchased!' })
        
        import('canvas-confetti').then((m) => {
          m.default({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
          })
        }).catch(() => {})
      }
    } catch (e) {
      setNotification({ type: 'error', message: 'Purchase failed. Try again.' })
    } finally {
      setLoadingId(null)
      setTimeout(() => setNotification(null), 4000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[var(--bg-secondary)] via-[#151006] to-[var(--bg-primary)] border border-amber-500/40 shadow-[0_0_25px_rgba(245,166,35,0.15)]">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>🛒</span> Adventurer's Bazaar
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Exchange your hard-earned gold coins for game-changing boosters, rare cosmetic titles, and legendary avatars.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-3 shadow-lg shadow-amber-500/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl shadow-inner">
            <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-extrabold">Available Bounty</p>
            <p className="text-lg font-black font-mono text-amber-300" style={{ textShadow: '0 0 10px rgba(245,166,35,0.5)' }}>
              {coins.toLocaleString()} Coins
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/10'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-x-auto no-scrollbar max-w-full">
        {(['all', 'potion', 'avatar', 'title'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat === 'all' ? 'All Items' : cat + 's'}
          </button>
        ))}
      </div>

      {/* Item Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const canAfford = coins >= item.price
          const isLoading = loadingId === item.id

          return (
            <div
              key={item.id}
              className="rpg-sheen relative group rounded-2xl border border-purple-500/25 bg-[#0d0d26]/95 p-5 backdrop-blur-md flex flex-col justify-between hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.15)] transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="text-3xl p-3 rounded-2xl bg-[var(--bg-primary)] border-2 border-purple-500/30 group-hover:scale-105 group-hover:border-amber-400/50 transition-all shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full capitalize bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {item.category}
                  </span>
                </div>

                <h4 className="font-bold text-base text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-white/10">
                <div className="flex items-center gap-1.5 font-mono font-black text-sm text-amber-300" style={{ textShadow: '0 0 8px rgba(245,166,35,0.4)' }}>
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{item.price.toLocaleString()} Gold</span>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={isLoading || !canAfford}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-md shadow-amber-500/25 hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {isLoading ? 'Purchasing...' : canAfford ? 'Claim Reward' : 'Need Gold'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
