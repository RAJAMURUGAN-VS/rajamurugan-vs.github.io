'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { genaiJourneySteps } from '@/data/genai'

// ─── Variants ─────────────────────────────────────────────────────────────────

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.3, staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const cardVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function DeploymentBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors duration-200 hover:border-accent/60"
      style={{
        border: '1px solid rgba(110,231,247,0.3)',
        background: 'rgba(110,231,247,0.06)',
        color: '#6EE7F7',
      }}
    >
      <span>🤗</span>
      Deployed on Hugging Face Spaces
    </a>
  )
}

function NotebookBadge() {
  return (
    <span
      className="inline-block mt-4 text-[12px] font-mono"
      style={{ color: '#555555' }}
    >
      Learning repo · Hands-on notebooks
    </span>
  )
}

function StatusBadge() {
  return (
    <span
      className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-[12px] font-medium"
      style={{
        border: '1px solid rgba(251,191,36,0.3)',
        background: 'rgba(251,191,36,0.06)',
        color: '#fbbf24',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" aria-hidden="true" />
      Currently Learning
    </span>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function GenAIJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const reduced = useReducedMotion()

  const activeCardVariants = reduced ? cardVariantsReduced : cardVariants

  return (
    <section
      ref={sectionRef}
      id="genai-journey"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: '#080808' }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Heading */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-14 md:mb-16"
        >
          <span
            className="inline-block text-xs font-semibold uppercase mb-3"
            style={{ letterSpacing: '0.15em', color: '#6EE7F7' }}
          >
            GenAI Progression
          </span>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{ fontSize: 'clamp(28px,5vw,52px)', color: '#f2f2f2' }}
          >
            I didn&apos;t learn these tools.
            <br />
            <span style={{ color: '#6EE7F7' }}>I built my way through them.</span>
          </h2>
        </motion.div>

        {/* Cards grid with stagger */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {genaiJourneySteps.map((step) => (
            <motion.div
              key={step.number}
              variants={activeCardVariants}
              className="flex flex-col rounded-xl p-5"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: '#111111',
              }}
            >
              {/* Step number */}
              <span
                className="font-display font-extrabold mb-4"
                style={{ fontSize: 32, color: 'rgba(110,231,247,0.2)', lineHeight: 1 }}
              >
                {step.number}
              </span>

              {/* Title */}
              <h3
                className="font-display font-semibold leading-[1.3] mb-3"
                style={{ fontSize: 16, color: '#f2f2f2' }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="flex-1"
                style={{ fontSize: 13, lineHeight: 1.7, color: '#777777' }}
              >
                {step.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-0.5 rounded text-[11px] font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#666666',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Badge */}
              {step.deploymentUrl && <DeploymentBadge href={step.deploymentUrl} />}
              {step.isNotebook && <NotebookBadge />}
              {step.isLearning && <StatusBadge />}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
