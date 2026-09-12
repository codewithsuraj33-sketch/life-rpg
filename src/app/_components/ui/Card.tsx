import React from 'react'
import { cn } from '@/app/_lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ className, glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'card p-5 transition-all',
        glow && 'border-[var(--gold)] shadow-[var(--shadow-gold)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between pb-3 border-b border-[var(--border-default)]/60 mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-bold text-lg text-[var(--text-primary)] flex items-center gap-2', className)} {...props}>
      {children}
    </h3>
  )
}
