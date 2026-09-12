'use client'

import { useState } from 'react'
import { Modal } from './ui/Modal'
import { setClassType } from '@/app/_actions/profile'
import { playSound } from '@/app/_lib/sound'
import { Shield, Book, Users } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ClassSelectionModalProps {
  currentClass: string
}

export function ClassSelectionModal({ currentClass }: ClassSelectionModalProps) {
  const [isOpen, setIsOpen] = useState(currentClass === 'Novice' || !currentClass)
  const [loading, setLoading] = useState(false)

  const handleSelectClass = async (classType: 'Warrior' | 'Mage' | 'Rogue') => {
    setLoading(true)
    const res = await setClassType(classType)
    if (res?.success) {
      playSound('levelup')
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } })
      setIsOpen(false)
    }
    setLoading(false)
  }

  if (currentClass !== 'Novice' && currentClass) return null

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Choose Your Path">
      <div className="text-center pb-2">
        <p className="text-muted mb-6 text-sm">
          Select a class to gain bonus XP for specific types of tasks. This choice is permanent!
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Warrior */}
          <button
            onClick={() => handleSelectClass('Warrior')}
            disabled={loading}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-900/40 hover:border-red-500 hover:-translate-y-1 transition-all"
          >
            <div className="p-3 bg-red-900/50 rounded-full text-red-400">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-red-400">Warrior</h3>
            <p className="text-[10px] text-muted">1.5x XP for Health & Fitness</p>
          </button>

          {/* Mage */}
          <button
            onClick={() => handleSelectClass('Mage')}
            disabled={loading}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-blue-500/30 bg-blue-950/20 border hover:bg-blue-900/40 hover:border-blue-500 hover:-translate-y-1 transition-all"
          >
            <div className="p-3 bg-blue-900/50 rounded-full text-blue-400">
              <Book className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-blue-400">Mage</h3>
            <p className="text-[10px] text-muted">1.5x XP for Study & Career</p>
          </button>

          {/* Rogue */}
          <button
            onClick={() => handleSelectClass('Rogue')}
            disabled={loading}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-emerald-500/30 bg-emerald-950/20 border hover:bg-emerald-900/40 hover:border-emerald-500 hover:-translate-y-1 transition-all"
          >
            <div className="p-3 bg-emerald-900/50 rounded-full text-emerald-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-emerald-400">Rogue</h3>
            <p className="text-[10px] text-muted">1.5x XP for Social & Fun</p>
          </button>
        </div>
      </div>
    </Modal>
  )
}
