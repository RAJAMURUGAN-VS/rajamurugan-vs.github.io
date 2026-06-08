import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'inline-block text-xs font-medium uppercase tracking-[0.15em] text-accent',
        className
      )}
    >
      {children}
    </span>
  )
}

export default SectionLabel
