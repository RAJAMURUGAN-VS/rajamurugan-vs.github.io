'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { featuredProjects, type FeaturedProject } from '@/data/projects'
import { Orbit3DCarousel, type OrbitItem } from '@/components/ui/EllipticalOrbit'

// Unsplash fallback images per project id
const FALLBACK_IMAGES: Record<string, string> = {
  aegisclaim:       'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80',
  campusflow:       'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80',
  infinix:          'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&q=80',
  roadmapai:        'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1400&q=80',
  'railway-defect': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1400&q=80',
  designsystem:     'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1400&q=80',
}

// Extra decorative orbit cards (not in the text panel list)
const EXTRA_ORBIT_CARDS = [
  { id: 'roadmapai',        label: 'RoadmapAI',      href: '#' },
  { id: 'railway-defect',   label: 'RailGuard',       href: '#' },
  { id: 'designsystem',     label: 'Design System',   href: '#' },
]

// ─── Section entrance only ────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

// ─── Individual project panel — always rendered, no show/hide ────────────────

function ProjectPanel({
  project,
  onEnterView,
  isLast,
}: {
  project: FeaturedProject
  onEnterView: () => void
  isLast: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEnterView()
      },
      {
        threshold: isLast ? 0.1 : 0.3,
        rootMargin: '-5% 0px -5% 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [onEnterView, isLast])

  return (
    <div ref={ref} id={project.id}>
      <div className="flex flex-col">
        <span
          className="text-[11px] font-semibold uppercase"
          style={{ letterSpacing: '0.1em', color: '#6EE7F7' }}
        >
          {project.panelLabel}
        </span>

        <h3
          className="font-display font-bold leading-[1.1] mt-4"
          style={{ fontSize: 'clamp(24px,3.5vw,40px)', color: '#f2f2f2' }}
        >
          {project.heading}
        </h3>

        <p className="mt-5" style={{ fontSize: 16, lineHeight: 1.75, color: '#999999' }}>
          {project.body}
        </p>

        <ul className="flex flex-col mt-6" style={{ gap: 10 }} role="list">
          {project.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-3" style={{ fontSize: 14, color: '#888888' }}>
              <span className="shrink-0 mt-px select-none" style={{ color: '#6EE7F7' }}>—</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <a
          href={project.ctaHref}
          className="mt-7 inline-flex items-center gap-1 w-fit hover:underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          style={{ fontSize: 14, color: '#6EE7F7' }}
        >
          {project.ctaText}
          <span aria-hidden="true"> →</span>
        </a>
      </div>

      {!isLast && (
        <div
          className="mt-20 lg:mt-28"
          style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ─── Vertical sidebar — scroll-spy only ──────────────────────────────────────

function Sidebar({
  projects,
  activeId,
  onItemClick,
}: {
  projects: FeaturedProject[]
  activeId: string
  onItemClick: (id: string) => void
}) {
  return (
    <aside
      className="hidden lg:flex flex-col h-fit relative"
      style={{ position: 'sticky', top: 88 }}
      aria-label="Project navigation"
    >
      {/* Full-height vertical line */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0"
        style={{ left: 4, width: 1, background: 'rgba(255,255,255,0.12)' }}
      />

      {projects.map((p) => {
        const isActive = p.id === activeId
        return (
          <button
            key={p.id}
            onClick={() => onItemClick(p.id)}
            className="relative flex items-center gap-4 py-3 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {/* Dot on the line */}
            <span
              aria-hidden="true"
              className="relative z-10 rounded-full flex-shrink-0"
              style={{
                width:      isActive ? 10 : 6,
                height:     isActive ? 10 : 6,
                marginLeft: isActive ? -1 : 1,
                background: isActive ? '#6EE7F7' : 'rgba(255,255,255,0.2)',
                transition: 'width 250ms ease, height 250ms ease, background-color 250ms ease, margin-left 250ms ease',
              }}
            />
            {/* Label — only color/weight changes */}
            <span
              className="text-[15px] whitespace-nowrap"
              style={{
                fontWeight: isActive ? 500 : 400,
                color:      isActive ? '#f2f2f2' : '#4a4a4a',
                transition: 'color 200ms ease',
              }}
            >
              {p.tabLabel}
            </span>
          </button>
        )
      })}
    </aside>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FeaturedProjects() {
  const [activeId, setActiveId] = useState(featuredProjects[0].id)
  const reduced = useReducedMotion()

  const activeIndex = featuredProjects.findIndex((p) => p.id === activeId)

  // Memoised per-project callback — stable reference so useEffect doesn't loop
  const handlers = useRef<Record<string, () => void>>({})
  featuredProjects.forEach((p) => {
    if (!handlers.current[p.id]) {
      handlers.current[p.id] = () => setActiveId(p.id)
    }
  })

  const handleSidebarClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88 - 24
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const handleCarouselIndex = useCallback((index: number) => {
    const p = featuredProjects[index]
    if (p) setActiveId(p.id)
  }, [])

  return (
    <motion.section
      id="projects"
      variants={reduced ? {} : sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className="px-6 md:px-12 py-24 md:py-32"
      style={{ background: '#080808' }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-14 md:mb-16">
          <span
            className="inline-block text-xs font-semibold uppercase mb-3"
            style={{ letterSpacing: '0.15em', color: '#6EE7F7' }}
          >
            Selected Work
          </span>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(32px,5vw,56px)', color: '#f2f2f2' }}
          >
            Projects that ship.
          </h2>
          <p className="mt-4 max-w-xl" style={{ fontSize: 16, lineHeight: 1.7, color: '#888888' }}>
            From multi-agent AI systems to full stack enterprise platforms — built end to end,
            deployed, and documented.
          </p>
        </div>

        {/* Mobile — project name pills */}
        <div
          className="flex lg:hidden overflow-x-auto gap-4 mb-10 pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {featuredProjects.map((p) => {
            const isActive = p.id === activeId
            return (
              <button
                key={p.id}
                onClick={() => handleSidebarClick(p.id)}
                className="shrink-0 pb-1.5 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                style={{
                  color:        isActive ? '#f2f2f2' : '#555555',
                  borderBottom: isActive ? '2px solid #6EE7F7' : '2px solid transparent',
                }}
              >
                {p.shortLabel ?? p.tabLabel}
              </button>
            )
          })}
        </div>

        {/* Three-column layout: sidebar | text panels | sticky carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_420px] gap-12 lg:gap-16 items-start">

          {/* Sticky sidebar */}
          <Sidebar
            projects={featuredProjects}
            activeId={activeId}
            onItemClick={handleSidebarClick}
          />

          {/* Text panels stacked */}
          <div className="min-w-0">
            {featuredProjects.map((p, i) => (
              <ProjectPanel
                key={p.id}
                project={p}
                onEnterView={handlers.current[p.id]}
                isLast={i === featuredProjects.length - 1}
              />
            ))}
          </div>

          {/* Sticky 3-D orbit carousel */}
          <div
            className="hidden lg:flex items-center justify-center"
            style={{ position: 'sticky', top: 88, height: '70vh' }}
          >
            <Orbit3DCarousel
              items={[
                // Featured project cards (linked to text panels)
                ...featuredProjects.map((p, i): OrbitItem => ({
                  key: p.id,
                  node: (
                    <a
                      href={p.ctaHref}
                      style={{ textDecoration: 'none', display: 'block' }}
                      tabIndex={-1}
                      aria-label={p.tabLabel}
                    >
                      <div
                        style={{
                          width: 260,
                          height: 185,
                          borderRadius: 16,
                          overflow: 'hidden',
                          border:
                            i === activeIndex
                              ? '2px solid #6EE7F7'
                              : '2px solid rgba(255,255,255,0.08)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                          background: '#111',
                          transition: 'border-color 0.3s ease',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={FALLBACK_IMAGES[p.id] ?? FALLBACK_IMAGES['aegisclaim']}
                          alt={`${p.tabLabel} screenshot`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          draggable={false}
                        />
                      </div>
                      <p
                        style={{
                          margin: '8px 0 0',
                          textAlign: 'center',
                          fontSize: 12,
                          fontWeight: 500,
                          color: i === activeIndex ? '#6EE7F7' : 'rgba(255,255,255,0.35)',
                          letterSpacing: '0.06em',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {p.tabLabel.toUpperCase()}
                      </p>
                    </a>
                  ),
                })),
                // Extra decorative orbit cards
                ...EXTRA_ORBIT_CARDS.map((card): OrbitItem => ({
                  key: card.id,
                  node: (
                    <a
                      href={card.href}
                      style={{ textDecoration: 'none', display: 'block' }}
                      tabIndex={-1}
                      aria-label={card.label}
                    >
                      <div
                        style={{
                          width: 260,
                          height: 185,
                          borderRadius: 16,
                          overflow: 'hidden',
                          border: '2px solid rgba(255,255,255,0.06)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                          background: '#111',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={FALLBACK_IMAGES[card.id] ?? FALLBACK_IMAGES['aegisclaim']}
                          alt={`${card.label} screenshot`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                          draggable={false}
                        />
                      </div>
                      <p
                        style={{
                          margin: '8px 0 0',
                          textAlign: 'center',
                          fontSize: 12,
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.22)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {card.label.toUpperCase()}
                      </p>
                    </a>
                  ),
                })),
              ]}
              orientation="horizontal"
              radius={270}
              scrollSpeed={0.04}
              baseTiltAngle={-14}
              mouseTiltIntensity={8}
              dragSpeed={0.25}
              cardScale={1}
              showCursor={true}
              cursorText="View"
              cursorBgColor="#6EE7F7"
              cursorTextColor="#080808"
            />
          </div>

        </div>
      </div>
    </motion.section>
  )
}
