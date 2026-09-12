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
    <div className={cn('w-full h-2.5 rounded-full bg-[var(--bg-primary)] overflow-hidden border border-[var(--border-default)]', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', !color && 'bg-gradient-to-r from-amber-500 to-yellow-400', barClassName)}
        style={{
          width: `${percentage}%`,
          backgroundColor: color || undefined,
        }}
      />
    </div>
  )
}
