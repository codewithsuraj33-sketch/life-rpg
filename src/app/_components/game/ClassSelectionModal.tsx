'use client'

import { useState } from 'react'
import { Modal } from '@/app/_components/ui/Modal'
import { setClassType } from '@/app/_actions/profile'
import { playSound } from '@/app/_lib/sound'
import { Shield, Book, Users, Loader2 } from 'lucide-react'

interface ClassSelectionModalProps {
  currentClass: string
}

export function ClassSelectionModal({ currentClass }: ClassSelectionModalProps) {
  const [isOpen, setIsOpen] = useState(currentClass === 'Novice' || !currentClass)
  const [loadingClass, setLoadingClass] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSelectClass = async (classType: 'Warrior' | 'Mage' | 'Rogue') => {
    setLoadingClass(classType)
    setErrorMsg(null)
    
    // ⚡ Instant feedback: play sound and trigger confetti immediately
    playSound('levelup')
    import('canvas-confetti').then((module) => {
      const confetti = module.default
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } })
    }).catch(() => {})

    // Optimistically close modal so user on laptop/mobile doesn't wait for server roundtrip
    setIsOpen(false)

    try {
      const res = await setClassType(classType)
      if (res?.error) {
        // If failed, reopen and show error
        setIsOpen(true)
        setErrorMsg("Database not updated! Please run the update.sql file in Supabase first.")
      }
    } catch {
      setIsOpen(true)
      setErrorMsg("Network error. Please try again.")
    } finally {
      setLoadingClass(null)
    }
  }

  if (currentClass !== 'Novice' && currentClass) return null

  const isLoading = loadingClass !== null

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Choose Your Path">
      <div className="text-center pb-2">
        <p className="text-muted mb-6 text-sm">
          Select a class to gain bonus XP for specific types of tasks. This choice is permanent!
        </p>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500 rounded text-red-400 text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Warrior */}
          <button
            onClick={() => handleSelectClass('Warrior')}
            disabled={isLoading}
            className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-900/40 hover:border-red-500 hover:-translate-y-1 transition-all tap-flash active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="p-3 bg-red-900/50 rounded-full text-red-400">
              {loadingClass === 'Warrior' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Shield className="w-8 h-8" />}
            </div>
            <h3 className="font-bold text-red-400">{loadingClass === 'Warrior' ? 'Selecting...' : 'Warrior'}</h3>
            <p className="text-[10px] text-muted">1.5x XP for Health & Fitness</p>
          </button>

          {/* Mage */}
          <button
            onClick={() => handleSelectClass('Mage')}
            disabled={isLoading}
            className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-xl border-blue-500/30 bg-blue-950/20 border hover:bg-blue-900/40 hover:border-blue-500 hover:-translate-y-1 transition-all tap-flash active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="p-3 bg-blue-900/50 rounded-full text-blue-400">
              {loadingClass === 'Mage' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Book className="w-8 h-8" />}
            </div>
            <h3 className="font-bold text-blue-400">{loadingClass === 'Mage' ? 'Selecting...' : 'Mage'}</h3>
            <p className="text-[10px] text-muted">1.5x XP for Study & Career</p>
          </button>

          {/* Rogue */}
          <button
            onClick={() => handleSelectClass('Rogue')}
            disabled={isLoading}
            className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-xl border-emerald-500/30 bg-emerald-950/20 border hover:bg-emerald-900/40 hover:border-emerald-500 hover:-translate-y-1 transition-all tap-flash active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="p-3 bg-emerald-900/50 rounded-full text-emerald-400">
              {loadingClass === 'Rogue' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Users className="w-8 h-8" />}
            </div>
            <h3 className="font-bold text-emerald-400">{loadingClass === 'Rogue' ? 'Selecting...' : 'Rogue'}</h3>
            <p className="text-[10px] text-muted">1.5x XP for Social & Fun</p>
          </button>
        </div>
      </div>
    </Modal>
  )
}

