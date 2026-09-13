import { cn } from '@/app/_lib/utils'

interface ProgressBarProps {
  progress: number // 0 to 1
  className?: string
  barClassName?: string
  color?: string
}

export function ProgressBar({ progress, className, barClassName, color }: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100)

  return (
    <div className={cn('w-full h-2.5 rounded-full bg-black/60 overflow-hidden border border-purple-500/30 p-0.5 shadow-inner', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-700 relative overflow-hidden',
          !color && 'bg-gradient-to-r from-purple-500 via-[var(--cyan)] to-amber-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]',
          barClassName
        )}
        style={{
          width: `${percentage}%`,
          backgroundColor: color || undefined,
          boxShadow: color ? `0 0 8px ${color}60` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      </div>
    </div>
  )
}
