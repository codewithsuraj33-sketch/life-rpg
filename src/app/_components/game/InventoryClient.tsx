'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useItem } from '@/app/_actions/inventory'
import { SHOP_ITEMS } from '@/app/_lib/shop'
import { Card, CardHeader, CardTitle } from '@/app/_components/ui/Card'
import { PackageOpen, Sparkles, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

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
    } catch {
      setNotification({ type: 'error', message: 'Failed to use item.' })
    } finally {
      setLoadingId(null)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const bagItems = items
    .map((invItem) => {
      const def = SHOP_ITEMS.find((i) => i.id === invItem.item_id)
      return { ...invItem, def }
    })
    .filter((i) => i.def) // Only show items that exist in SHOP_ITEMS

  return (
    <Card className="border border-purple-500/25 bg-[#0e0e28]/90 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-white">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <PackageOpen className="w-4 h-4" />
          </div>
          <span>Adventurer Satchel</span>
        </CardTitle>
      </CardHeader>

      {/* Notifications */}
      {notification && (
        <div
          className={`mb-4 p-3 rounded-xl border flex items-center gap-2 text-xs animate-in fade-in font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
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

      {bagItems.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-white/10 rounded-2xl bg-black/20">
          <PackageOpen className="w-10 h-10 mx-auto mb-2 text-slate-500" />
          <p className="text-sm font-bold text-white">Your satchel is empty</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Collect gold from quests and acquire potions or equipment from the Bazaar.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            <span>Visit Bazaar Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {bagItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-white/10 bg-black/30 hover:border-amber-500/40 transition-all group"
            >
              <div className="text-3xl p-2.5 rounded-xl bg-black/40 border border-amber-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                {item.def?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white truncate flex items-center gap-2">
                  <span>{item.def?.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-md font-mono font-bold">
                      x{item.quantity}
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.def?.category === 'potion' ? '🧪 Consumable Potion' : '🛡️ Gear / Cosmetic'}
                </p>
              </div>
              <button
                onClick={() => handleUseItem(item.id)}
                disabled={loadingId === item.id}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex-shrink-0 cursor-pointer disabled:opacity-50"
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
