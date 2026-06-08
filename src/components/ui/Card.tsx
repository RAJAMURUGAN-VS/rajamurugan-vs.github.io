'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'rounded-[var(--radius-lg)] border border-[#ffffff22] bg-surface p-6 transition-colors duration-200 hover:border-[#ffffff44]',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export default Card
