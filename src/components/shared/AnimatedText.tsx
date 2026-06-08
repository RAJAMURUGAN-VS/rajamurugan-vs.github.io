'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { staggerContainer, wordVariant, noMotionVariant } from '@/animations/variants'
import { cn } from '@/lib/utils'

interface AnimatedTextProps {
  text: string
  className?: string
  staggerDelay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function AnimatedText({
  text,
  className,
  staggerDelay = 0.08,
  as = 'span',
}: AnimatedTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const words = text.split(/\s+/).filter(Boolean)

  const Tag = motion[as] as typeof motion.span
  const container = prefersReducedMotion
    ? noMotionVariant
    : { ...staggerContainer, visible: { transition: { staggerChildren: staggerDelay } } }
  const word = prefersReducedMotion ? noMotionVariant : wordVariant

  return (
    <Tag
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn('inline', className)}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          className="inline-block"
          style={{ marginRight: '0.3em' }}
        >
          {w}
        </motion.span>
      ))}
    </Tag>
  )
}

export default AnimatedText
