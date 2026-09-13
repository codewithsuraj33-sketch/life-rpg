'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6 shadow-2xl animate-fade-in mx-auto mt-10">
        
        {title && (
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)] mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-[var(--text-primary)] transition-colors cursor-pointer p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted hover:text-[var(--text-primary)] transition-colors cursor-pointer p-1"
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
