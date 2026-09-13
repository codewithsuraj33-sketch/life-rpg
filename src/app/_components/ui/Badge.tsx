import { cn } from '@/app/_lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'success' | 'danger' | 'purple' | 'blue'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-white/5 text-slate-300 border-white/15',
    gold: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/15',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/15',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/15',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/15',
    blue: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/15',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
