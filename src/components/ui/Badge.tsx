import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'default' | 'accent'
  className?: string
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span
      data-testid="badge"
      className={cn(
        'inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-0.5 text-xs font-medium transition-colors',
        variant === 'accent'
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'bg-[#1a1a1a] text-[#999999] border border-[#ffffff22]',
        className
      )}
    >
      {label}
    </span>
  )
}

export default Badge
