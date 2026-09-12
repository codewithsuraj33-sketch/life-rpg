'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/30 bg-[var(--bg-card)] p-6 shadow-2xl">
        
        {title && (
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)] mb-4">
            <h2 className="text-xl font-bold text-amber-400">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div>{children}</div>
      </div>
    </div>
  )
}
