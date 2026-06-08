'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { reactProjects, type ReactProject } from '@/data/reactProjects'

const PER_PAGE = 12
const TOTAL = reactProjects.length
const TOTAL_PAGES = Math.ceil(TOTAL / PER_PAGE)

const phaseLabels: Record<number, string> = {
  1: 'Phase 1 — React Fundamentals',
  2: 'Phase 2 — State & Interactivity',
  3: 'Phase 3 — Advanced Patterns',
  4: 'Phase 4 — Real-World Applications',
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  priority,
  reduced,
}: {
  project: ReactProject
  priority: boolean
  reduced: boolean
}) {
  const num = String(project.id).padStart(2, '0')

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-xl overflow-hidden bg-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 250ms ease, transform 250ms ease, box-shadow 250ms ease',
      }}
      onMouseEnter={(e) => {
        if (!reduced) {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)'
        }
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      {/* Number badge */}
      <span
        className="absolute top-2 left-2 z-20 font-mono text-[11px] px-2 py-0.5 rounded-sm"
        style={{ background: 'rgba(0,0,0,0.7)', color: '#6EE7F7' }}
      >
        {num}
      </span>

      {/* External link icon — shows on hover */}
      <span
        className="absolute top-2 right-2 z-20 p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        aria-hidden="true"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#6EE7F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          style={{ transition: reduced ? 'none' : 'transform 400ms ease' }}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />

        {/* Dark overlay + centred title on hover */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-3"
          style={{
            background: 'rgba(0,0,0,0)',
            transition: 'background 300ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.65)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)' }}
        >
          <span
            className="text-white text-[14px] font-medium text-center leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {project.title}
          </span>
        </div>
      </div>

      {/* Title below image */}
      <div className="px-3 py-2.5">
        <span
          className="block text-[13px] leading-tight"
          style={{
            color: '#aaaaaa',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {project.title}
        </span>
      </div>
    </a>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function ReactJourney() {
  const [page, setPage] = useState(1)
  const reduced = useReducedMotion()

  const startIdx = (page - 1) * PER_PAGE
  const pageProjects = reactProjects.slice(startIdx, startIdx + PER_PAGE)
  const showingEnd = Math.min(startIdx + PER_PAGE, TOTAL)

  const goToPage = (p: number) => {
    setPage(p)
    const el = document.getElementById('react-journey')
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88 - 16
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="react-journey"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-12">
          <span
            className="inline-block text-xs font-semibold uppercase mb-3"
            style={{ letterSpacing: '0.15em', color: '#6EE7F7' }}
          >
            React Journey
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(28px,4vw,48px)', color: '#f2f2f2' }}
          >
            43 projects. One progression.
          </h2>
          <p className="mt-4 max-w-xl" style={{ fontSize: 16, lineHeight: 1.7, color: '#888888' }}>
            Every project represents a concept learned and shipped — from rendering a banner to
            building a full-stack job portal. In order.
          </p>
        </div>

        {/* Phase label + showing count */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="font-mono text-[13px]" style={{ color: '#555555' }}>
            {phaseLabels[page]}
          </span>
          <span className="font-mono text-[13px]" style={{ color: '#333333' }}>
            Showing {startIdx + 1}–{showingEnd} of {TOTAL}
          </span>
        </div>

        {/* Grid with page transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
          >
            {pageProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                priority={page === 1 && p.id <= 4}
                reduced={reduced}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-3 mt-10">
          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded-md border transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#666666' }}
              onMouseEnter={(e) => { if (page !== 1) { e.currentTarget.style.color = '#cccccc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#666666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              ← Prev
            </button>

            {/* Page pills */}
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => goToPage(n)}
                className="w-9 h-9 rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                style={
                  page === n
                    ? { background: '#6EE7F7', color: '#080808', fontWeight: 600 }
                    : { background: 'rgba(255,255,255,0.05)', color: '#666666' }
                }
                onMouseEnter={(e) => { if (page !== n) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#cccccc' } }}
                onMouseLeave={(e) => { if (page !== n) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#666666' } }}
              >
                {n}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === TOTAL_PAGES}
              className="px-4 py-2 text-sm rounded-md border transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#666666' }}
              onMouseEnter={(e) => { if (page !== TOTAL_PAGES) { e.currentTarget.style.color = '#cccccc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#666666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' } }
            >
              Next →
            </button>
          </div>

          <span className="font-mono text-[12px]" style={{ color: '#444444' }}>
            Page {page} of {TOTAL_PAGES}
          </span>
        </div>

      </div>
    </section>
  )
}
