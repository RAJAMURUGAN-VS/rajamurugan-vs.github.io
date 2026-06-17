'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const QUOTES = [
  { text: "Systems that are intelligent by design — not by accident.", author: "Design Philosophy" },
  { text: "The analytical mind thinks; the generative mind creates; the agentic system executes.", author: "AI Paradigm" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Code is like poetry; it should be short, precise, and beautiful.", author: "Software Craftsmanship" }
]

// Letter-by-letter reveal animation variants
const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
}

const letterVariants = {
  hidden: { y: '110%', rotateX: 45, opacity: 0 },
  visible: {
    y: '0%',
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hasPointer = useMediaQuery('(pointer: fine)')
  const prefersReducedMotion = useReducedMotion()
  const mouse = useMousePosition(heroRef)

  const [quoteIndex, setQuoteIndex] = useState(0)

  // Cycle quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Canvas interactive particle background
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }> = []

    const particleCount = Math.min(60, Math.floor((width * height) / 20000))

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 1,
      })
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(110, 231, 247, 0.35)'
      ctx.strokeStyle = 'rgba(110, 231, 247, 0.04)'
      ctx.lineWidth = 1

      // Track mouse in canvas coords
      const mouseX = mouse.x + width / 2
      const mouseY = mouse.y + height / 2

      particles.forEach((p, idx) => {
        // Gravitate slightly towards mouse if close
        if (hasPointer) {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.hypot(dx, dy)
          if (dist < 250) {
            p.vx += (dx / dist) * 0.005
            p.vy += (dy / dist) * 0.005
          }
        }

        // Apply velocities & friction
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98

        // Boundary wrap
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mouse, hasPointer, prefersReducedMotion])

  const parallaxStyle =
    hasPointer && !prefersReducedMotion
      ? {
          transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)`,
        }
      : {}

  // Helper to split text into characters while preserving spaces
  const renderAnimatedWord = (word: string) => {
    return (
      <span className="inline-block whitespace-nowrap mr-[0.2em]">
        {Array.from(word).map((char, index) => (
          <span key={index} className="inline-block overflow-hidden vertical-align-bottom">
            <motion.span
              variants={letterVariants}
              className="inline-block origin-bottom"
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          </span>
        ))}
      </span>
    )
  }

  const nameWords = "Rajamurugan".split(" ")
  const lastNameWords = "VS.".split(" ")

  return (
    <section
      data-theme="dark"
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-32 bg-[#080808]"
    >
      {/* Particle Canvas */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ zIndex: 1 }}
        />
      )}

      {/* Decorative background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #6EE7F7 1px, transparent 1px), linear-gradient(to bottom, #6EE7F7 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          ...parallaxStyle,
          zIndex: 0,
        }}
      />

      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110,231,247,0.05) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Full Stack Developer &amp; GenAI Engineer
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 font-display text-[clamp(44px,9vw,92px)] font-extrabold leading-[1.0] text-[#f2f2f2] perspective-[1000px]"
        >
          <span className="text-accent">
            {nameWords.map((word, i) => (
              <span key={i}>{renderAnimatedWord(word)}</span>
            ))}
          </span>
          <br />
          {lastNameWords.map((word, i) => (
            <span key={i}>{renderAnimatedWord(word)}</span>
          ))}
        </motion.h1>

        {/* Value proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8 max-w-xl text-[17px] md:text-[18px] leading-[1.7] text-[#888888]"
        >
          I build systems that are intelligent by design — not by accident.
          Full stack foundations, GenAI depth, agentic architecture.
        </motion.p>

        {/* Rotating Quotes Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-12 max-w-xl p-5 rounded-xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
          
          <div className="h-[76px] md:h-[64px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="flex flex-col gap-1.5"
              >
                <q className="text-[14px] md:text-[15px] italic text-[#e0e0e0] font-medium leading-relaxed">
                  {QUOTES[quoteIndex].text}
                </q>
                <cite className="text-[11px] font-mono uppercase tracking-wider text-accent/80 not-italic">
                  — {QUOTES[quoteIndex].author}
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
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
