'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import data from '@/data/certificates.json'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Certificate {
  id: string
  title: string
  issuer: string
  year: string
  image: string
  credentialUrl?: string | null
  skills?: string[]
}

interface Category {
  id: string
  title: string
  certificates: Certificate[]
}

// ─── Filter config ──────────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'ALL',                    label: 'All' },
  { id: 'hackathons',             label: 'Hackathons' },
  { id: 'nxtwave-certifications', label: 'NxtWave' },
  { id: 'workshops',              label: 'Workshops' },
]

const COLS = 4 // matches lg:grid-cols-4

// ─── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-4xl"
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-[13px] text-[#666] hover:text-white transition-colors duration-150"
          aria-label="Close lightbox"
        >
          <X size={16} />
          Close
        </button>

        {/* Certificate image */}
        <div
          className="relative w-full rounded-xl overflow-hidden border border-white/[0.08]"
          style={{ aspectRatio: '1.414 / 1' }}
        >
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-contain bg-[#0a0a0a]"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
            unoptimized
          />
        </div>

        {/* Meta below image */}
        <div className="flex items-center justify-between mt-4 px-1">
          <div>
            <p className="text-[15px] font-semibold text-[#f2f2f2]">{cert.title}</p>
            <p className="text-[13px] text-[#555] mt-0.5">
              {cert.issuer} · {cert.year}
            </p>
          </div>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-[#6EE7F7] hover:underline"
            >
              Verify credential
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Certificate Card ───────────────────────────────────────────────────────────
// Mirrors ReactJourney's ProjectCard: animates only when `revealed` flips true

function CertCard({
  cert,
  delay,
  revealed,
  reduced,
  onClick,
}: {
  cert: Certificate
  delay: number
  revealed: boolean
  reduced: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
      animate={
        revealed || reduced
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 16, scale: 0.97 }
      }
      transition={
        reduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 80, damping: 16, delay }
      }
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl overflow-hidden
        border border-white/[0.07] hover:border-white/[0.15]
        bg-[#0f0f0f] transition-[border-color,transform,box-shadow] duration-250
        hover:-translate-y-[3px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.5)]"
    >
      {/* Certificate image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1.414 / 1' }}>
        <Image
          src={cert.image}
          alt={cert.title}
          fill
          className="object-cover transition-transform duration-400 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[13px] font-medium text-white border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/5">
            View certificate
          </span>
        </div>

        {/* External link badge */}
        {cert.credentialUrl && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
              <ExternalLink size={11} className="text-[#6EE7F7]" />
            </div>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="p-3.5">
        <p className="text-[13px] font-semibold text-[#e0e0e0] leading-snug line-clamp-2 group-hover:text-white transition-colors duration-150">
          {cert.title}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[11px] text-[#99dde8] font-medium">{cert.issuer}</p>
          <p className="text-[11px] text-[#333] font-mono">{cert.year}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Category group — owns its own IntersectionObserver + revealed state ────────

function CategoryGroup({
  category,
  showHeading,
  reduced,
  onCardClick,
}: {
  category: Category
  showHeading: boolean
  reduced: boolean
  onCardClick: (cert: Certificate) => void
}) {
  const [revealed, setRevealed] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Observe the grid; reveal once when it enters the viewport
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    if (reduced) { setRevealed(true); return }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])

  return (
    <div>
      {/* Category heading — only in "All" view */}
      {showHeading && (
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#6EE7F7]">
            {category.title}
          </h3>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-[12px] text-[#333] font-mono tabular-nums">
            {category.certificates.length}
          </span>
        </div>
      )}

      {/* Cards grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
      >
        {category.certificates.map((cert, idx) => {
          const col = idx % COLS
          const row = Math.floor(idx / COLS)
          // Diagonal stagger: top-left → bottom-right, same as ReactJourney
          const diagonalDelay = (col + row) * 0.06

          return (
            <CertCard
              key={cert.id}
              cert={cert}
              delay={diagonalDelay}
              revealed={revealed}
              reduced={reduced}
              onClick={() => onCardClick(cert)}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Section ───────────────────────────────────────────────────────────────

export default function Certifications() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [lightboxCert, setLightboxCert] = useState<Certificate | null>(null)
  const reduced = useReducedMotion()

  const categories: Category[] = data.categories

  const filteredCategories =
    activeFilter === 'ALL'
      ? categories
      : categories.filter((cat) => cat.id === activeFilter)

  const showCategoryHeadings = activeFilter === 'ALL'

  const totalCount = categories.reduce((sum, cat) => sum + cat.certificates.length, 0)

  return (
    <>
      <section
        data-theme="dark"
        id="credentials"
        className="px-6 py-24 md:px-12 md:py-32 bg-[#080808]"
      >
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <ScrollReveal className="mb-12">
            <SectionLabel>Credentials</SectionLabel>
            <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#f2f2f2]">
              Certifications &amp; Recognition.
            </h2>
            <p className="mt-4 text-[16px] text-[#aaaaaa] max-w-xl leading-[1.6]">
              {totalCount} certificates across hackathons, technical certifications, and workshops.
            </p>
          </ScrollReveal>

          {/* Filter tab bar */}
          <ScrollReveal className="mb-12">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    px-4 py-2 text-[13px] font-semibold rounded-full
                    border transition-all duration-200
                    ${
                      activeFilter === filter.id
                        ? 'bg-[#6EE7F7] text-black border-[#6EE7F7]'
                        : 'bg-transparent text-[#555] border-white/[0.08] hover:text-[#aaa] hover:border-white/[0.15]'
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Certificate grid(s) */}
          <motion.div layout className="space-y-16">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                    delay: catIndex * 0.05,
                  }}
                >
                  <CategoryGroup
                    category={category}
                    showHeading={showCategoryHeadings}
                    reduced={reduced}
                    onCardClick={setLightboxCert}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Lightbox — outside section for correct z-index stacking */}
      <AnimatePresence>
        {lightboxCert && (
          <Lightbox
            cert={lightboxCert}
            onClose={() => setLightboxCert(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
