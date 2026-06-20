'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SITE_META } from '@/lib/constants'

// ─── Rotating roles ───────────────────────────────────────────────────────────
const ROLES = [
  'Full Stack Developer',
  'GenAI Engineer',
  'Problem Solver',
]

// ─── Letter-by-letter title animation ────────────────────────────────────────
const titleContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
}

const letterVariants = {
  hidden: { y: '110%', rotateX: 45, opacity: 0 },
  visible: {
    y: '0%',
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
}

// ─── Social link icons ────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function HuggingFaceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-2.5 5.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5S11 9.828 11 9s-.672-1.5-1.5-1.5zm5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5S16 9.828 16 9s-.672-1.5-1.5-1.5zm-7.25 5s.75 3.5 4.75 3.5 4.75-3.5 4.75-3.5H7.25z" />
    </svg>
  )
}

// ─── Render animated word ─────────────────────────────────────────────────────
function AnimatedWord({ word }: { word: string }) {
  return (
    <span className="inline-block whitespace-nowrap mr-[0.15em]">
      {Array.from(word).map((char, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom' }}>
          <motion.span variants={letterVariants} className="inline-block origin-bottom">
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hasPointer = useMediaQuery('(pointer: fine)')
  const prefersReducedMotion = useReducedMotion()
  const mouse = useMousePosition(heroRef)

  const [roleIndex, setRoleIndex] = useState(0)

  // Cycle roles
  useEffect(() => {
    const t = setInterval(() => setRoleIndex(p => (p + 1) % ROLES.length), 2800)
    return () => clearInterval(t)
  }, [])

  // Canvas particle background (unchanged)
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const pts = Array.from({ length: Math.min(60, Math.floor((w * h) / 20000)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 1,
    }))

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(110,231,247,0.35)'
      ctx.strokeStyle = 'rgba(110,231,247,0.04)'
      ctx.lineWidth = 1
      const mx = mouse.x + w / 2, my = mouse.y + h / 2
      pts.forEach((p, i) => {
        if (hasPointer) {
          const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy)
          if (d < 250) { p.vx += dx / d * 0.005; p.vy += dy / d * 0.005 }
        }
        p.x += p.vx; p.y += p.vy; p.vx *= 0.98; p.vy *= 0.98
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y)
          if (d < 120) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke() }
        }
      })
      raf = requestAnimationFrame(render)
    }
    render()
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [mouse, hasPointer, prefersReducedMotion])

  const parallaxStyle = hasPointer && !prefersReducedMotion
    ? { transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)` } : {}

  return (
    <section
      data-theme="dark"
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-32 bg-[#080808]"
    >
      {/* Particle canvas */}
      {!prefersReducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" style={{ zIndex: 1 }} />
      )}

      {/* Grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(to right,#6EE7F7 1px,transparent 1px),linear-gradient(to bottom,#6EE7F7 1px,transparent 1px)',
          backgroundSize: '48px 48px',
          ...parallaxStyle, zIndex: 0,
        }}
      />

      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle,rgba(110,231,247,0.05) 0%,transparent 70%)', zIndex: 0 }}
      />

      {/* ── Two-column layout ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

          {/* ── LEFT COLUMN ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] sm:text-[12px] font-medium"
              style={{
                border: '1px solid rgba(110,231,247,0.25)',
                background: 'rgba(110,231,247,0.06)',
                color: '#6EE7F7',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7F7] animate-pulse" aria-hidden="true" />
              Available for internships · 2025
            </motion.div>

            {/* Name + mobile photo — side by side on mobile, stacked on lg+ */}
            <div className="flex items-center justify-between gap-4 lg:block mb-3">
              {/* Headline */}
              <motion.h1
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                className="font-display font-extrabold leading-[1.05] text-[#f2f2f2]"
                style={{ fontSize: 'clamp(22px,6vw,56px)', perspective: '1000px' }}
              >
                <AnimatedWord word="Rajamurugan" />
                <span className="text-[#6EE7F7]">
                  <AnimatedWord word="VS." />
                </span>
              </motion.h1>

              {/* Mobile-only photo + social links — sits right of name, hidden on lg+ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-shrink-0 lg:hidden flex flex-col items-center gap-2"
              >
                {/* Photo */}
                <div
                  className="relative rounded-full overflow-hidden"
                  style={{
                    width: 'clamp(72px, 18vw, 110px)',
                    height: 'clamp(72px, 18vw, 110px)',
                    border: '2px solid rgba(110,231,247,0.35)',
                    boxShadow: '0 0 0 4px rgba(110,231,247,0.06), 0 0 20px rgba(110,231,247,0.12)',
                  }}
                >
                  <Image
                    src="https://res.cloudinary.com/dydplsxdj/image/upload/v1781425059/ChatGPT_Image_Jun_14_2026_01_44_51_PM_xhcd58.png"
                    alt="Rajamurugan VS"
                    fill
                    className="object-cover object-top"
                    sizes="110px"
                    priority
                    unoptimized
                  />
                </div>
                {/* Social icons below photo — mobile only */}
                <div className="flex items-center gap-3">
                  {[
                    { href: SITE_META.github, label: 'GitHub', icon: <GitHubIcon /> },
                    { href: SITE_META.linkedin, label: 'LinkedIn', icon: <LinkedInIcon /> },
                    { href: 'https://huggingface.co/RAJAMURUGAN-VS', label: 'HuggingFace', icon: <HuggingFaceIcon /> },
                  ].map(({ href, label, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-[#444] hover:text-[#aaa] transition-colors duration-200"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Rotating role descriptor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mb-5 h-6 overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                <motion.p 
                  key={roleIndex}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[12px] sm:text-[13px] md:text-[14px] font-semibold uppercase tracking-[0.16em] text-[#6EE7F7]"
                >
                  {ROLES[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Value proposition */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mb-6 max-w-lg text-[14px] sm:text-[15px] md:text-[16px] leading-[1.75] text-[#888888]"
            >
              I build systems that are intelligent by design — not by accident.
              Full stack foundations, GenAI depth, agentic architecture.
            </motion.p>

            {/* Stat row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.88 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-7 text-[11px] sm:text-[12px] md:text-[13px] font-mono text-[#555555]"
            >
              <span><span className="text-[#f2f2f2] font-semibold">43</span> React Projects</span>
              <span className="text-[#2a2a2a]">·</span>
              <span><span className="text-[#f2f2f2] font-semibold">5</span> AI Systems</span>
              <span className="text-[#2a2a2a]">·</span>
              <span><span className="text-[#f2f2f2] font-semibold">5</span> Hackathons</span>
            </motion.div>

            {/* CTAs — always a row, smaller on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-row items-center gap-3 mb-7"
            >
              <Button href="#projects" variant="primary" size="sm" className="sm:!px-6 sm:!py-3 sm:!text-base">
                View Projects
              </Button>
              <Button href="/resume.pdf" variant="secondary" size="sm" className="sm:!px-6 sm:!py-3 sm:!text-base" download>
                Download Resume
              </Button>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — desktop photo + social links ──────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col lg:w-[300px] xl:w-[340px] flex-shrink-0 items-center justify-center gap-6"
          >
            {/* Photo */}
            <div
              className="relative rounded-full"
              style={{ width: 'clamp(400px, 20vw, 260px)', height: 'clamp(400px, 20vw, 260px)' }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: '0 0 0 2px rgba(110,231,247,0.3), 0 0 32px 8px rgba(110,231,247,0.14)',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
              <div className="absolute inset-0 rounded-full overflow-hidden" style={{ zIndex: 1 }}>
                <Image
                  src="https://res.cloudinary.com/dydplsxdj/image/upload/v1781425059/ChatGPT_Image_Jun_14_2026_01_44_51_PM_xhcd58.png"
                  alt="Rajamurugan VS"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1280px) 20vw, 260px"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Social links — desktop, below photo */}
            <div className="flex items-center gap-5">
              {[
                { href: SITE_META.github, label: 'GitHub', icon: <GitHubIcon /> },
                { href: SITE_META.linkedin, label: 'LinkedIn', icon: <LinkedInIcon /> },
                { href: 'https://huggingface.co/RAJAMURUGAN-VS', label: 'HuggingFace', icon: <HuggingFaceIcon /> },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-1.5 text-[13px] text-[#444] hover:text-[#aaa] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  {icon}
                  <span className="font-mono">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
