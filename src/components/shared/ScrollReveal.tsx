'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  fadeUpVariant,
  slideInLeftVariant,
  slideInRightVariant,
  noMotionVariant,
} from '@/animations/variants'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  const variantMap = {
    up: fadeUpVariant,
    left: slideInLeftVariant,
    right: slideInRightVariant,
  }

  const activeVariant = prefersReducedMotion ? noMotionVariant : variantMap[direction]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={activeVariant}
      transition={{ delay: delay / 1000 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
