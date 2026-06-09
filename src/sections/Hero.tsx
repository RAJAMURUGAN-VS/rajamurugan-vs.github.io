'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { AnimatedText } from '@/components/shared/AnimatedText'
import { Button } from '@/components/ui/Button'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fadeUpVariant } from '@/animations/variants'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const hasPointer = useMediaQuery('(pointer: fine)')
  const prefersReducedMotion = useReducedMotion()
  const mouse = useMousePosition(heroRef)

  const parallaxStyle =
    hasPointer && !prefersReducedMotion
      ? {
          transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)`,
        }
      : {}

  return (
    <section
      data-theme="dark"
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-32"
    >
      {/* Decorative background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #6EE7F7 1px, transparent 1px), linear-gradient(to bottom, #6EE7F7 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          ...parallaxStyle,
        }}
      />

      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110,231,247,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Eyebrow */}
        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-accent"
        >
          Full Stack Developer &amp; GenAI Engineer
        </motion.p>

        {/* Headline */}
        <h1 className="mb-6 font-display text-[clamp(48px,8vw,96px)] font-extrabold leading-[1.0] text-[#f2f2f2]">
          <AnimatedText text="Rajamurugan" className="text-accent" as="span" />
          <br />
          <AnimatedText text="VS." as="span" />
        </h1>

        {/* Value proposition */}
        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="mb-10 max-w-xl text-[18px] leading-[1.7] text-[#888888]"
        >
          I build systems that are intelligent by design — not by accident.
          Full stack foundations, GenAI depth, agentic architecture.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-4"
        >
          <Button href="#projects" variant="primary" size="lg">
            View Projects
          </Button>
          <Button href="/resume.pdf" variant="secondary" size="lg" download>
            Download Resume
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
