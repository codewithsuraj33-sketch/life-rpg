'use client'

import { useState } from 'react'
import { buyItem } from '@/app/_actions/shop'
import { ShopItem } from '@/app/_lib/shop'
import { Coins, Sparkles, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

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
        
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        })
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-amber-500/30">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🛒</span> Adventurer's Bazaar
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Exchange your hard-earned gold coins for power-ups, cosmetic titles, and legendary avatars.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Your Gold</p>
            <p className="text-base font-black font-mono text-amber-400">{coins} Coins</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
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
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] overflow-x-auto no-scrollbar max-w-full">
        {(['all', 'potion', 'avatar', 'title'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
              categoryFilter === cat
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-muted hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Items' : cat + 's'}
          </button>
        ))}
      </div>

      {/* Item Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const canAfford = coins >= item.price
          const isLoading = loadingId === item.id

          return (
            <div
              key={item.id}
              className="relative group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 backdrop-blur-sm flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-default)]">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize bg-[var(--bg-secondary)] text-muted border border-[var(--border-default)]">
                    {item.category}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[var(--text-primary)] mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-muted mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]/60">
                <div className="flex items-center gap-1 font-mono font-bold text-sm text-amber-400">
                  <Coins className="w-4 h-4" />
                  <span>{item.price}</span>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={isLoading || !canAfford}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    canAfford
                      ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-sm'
                      : 'bg-[var(--bg-secondary)] text-dim border border-[var(--border-default)] cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {isLoading ? 'Purchasing...' : canAfford ? 'Buy' : 'Need Gold'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
