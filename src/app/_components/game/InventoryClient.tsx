'use client'

import { useState } from 'react'
import { useItem } from '@/app/_actions/inventory'
import { SHOP_ITEMS } from '@/app/_lib/shop'
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/Card'
import { PackageOpen, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'

interface InventoryItem {
  id: string
  item_id: string
  quantity: number
}

export function InventoryClient({ items }: { items: InventoryItem[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleUseItem(inventoryId: string) {
    setLoadingId(inventoryId)
    setNotification(null)

    try {
      const res = await useItem(inventoryId)
      if (res.error) {
        setNotification({ type: 'error', message: res.error })
      } else {
        setNotification({ type: 'success', message: res.message || 'Item used!' })
      }
    } catch (e) {
      setNotification({ type: 'error', message: 'Failed to use item.' })
    } finally {
      setLoadingId(null)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const bagItems = items.map(invItem => {
    const def = SHOP_ITEMS.find(i => i.id === invItem.item_id)
    return { ...invItem, def }
  }).filter(i => i.def) // Only show items that exist in SHOP_ITEMS

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <PackageOpen className="w-5 h-5 text-amber-400" />
          My Bag / Inventory
        </CardTitle>
      </CardHeader>

      {/* Notifications */}
      {notification && (
        <div className={`mb-4 p-3 rounded-xl border flex items-center gap-2 text-xs animate-in fade-in ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {bagItems.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-[var(--border-default)] rounded-xl text-muted text-sm">
          <PackageOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Your bag is empty. Visit the Shop!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bagItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/50 box-hover">
              <div className="text-3xl p-2 rounded-lg bg-[var(--bg-primary)] border border-amber-500/20">
                {item.def?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[var(--text-primary)] truncate flex items-center gap-2">
                  {item.def?.name}
                  {item.quantity > 1 && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md font-mono">
                      x{item.quantity}
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-muted truncate">
                  {item.def?.category === 'potion' ? 'Consumable' : 'Cosmetic'}
                </p>
              </div>
              <button
                onClick={() => handleUseItem(item.id)}
                disabled={loadingId === item.id}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 text-amber-400 text-xs font-semibold transition-all flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loadingId === item.id ? '...' : item.def?.category === 'potion' ? 'Drink' : 'Equip'}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
