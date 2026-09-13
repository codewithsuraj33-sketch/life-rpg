'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  // Route change completed
  useEffect(() => {
    if (loading) {
      setProgress(100)
      const t1 = setTimeout(() => {
        setVisible(false)
        setLoading(false)
        setProgress(0)
      }, 250)
      return () => clearTimeout(t1)
    }
  }, [pathname, searchParams])

  // Progress animation incrementing
  useEffect(() => {
    if (!loading) return

    setVisible(true)
    setProgress(20)

    const t1 = setTimeout(() => setProgress(45), 120)
    const t2 = setTimeout(() => setProgress(75), 350)
    const t3 = setTimeout(() => setProgress(88), 900)

    // Safety timeout in case navigation aborted or unchanged
    const safety = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        setLoading(false)
        setProgress(0)
      }, 200)
    }, 6000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(safety)
    }
  }, [loading])

  // Global click interception on internal links for 0ms instant touch feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Ignore external, anchors, download, mailto, tel, target="_blank"
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.getAttribute('target') === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return
      }

      // Ignore if clicking same route
      const currentUrl = window.location.pathname + window.location.search
      if (href === currentUrl) return

      // Start progress immediately on touch/click
      setLoading(true)
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Laser progress track */}
      <div
        className="h-full bg-gradient-to-r from-[var(--purple)] via-[var(--cyan)] to-[var(--gold)] transition-all duration-200 ease-out relative"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 12px rgba(34, 211, 238, 0.9), 0 0 24px rgba(139, 92, 246, 0.7)',
        }}
      >
        {/* Leading edge neon spark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_12px_#fff,0_0_20px_#22d3ee]" />
      </div>
    </div>
  )
}
