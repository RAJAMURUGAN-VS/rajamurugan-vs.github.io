'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { timelineEntries } from '@/data/timeline'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SPELL_STYLES = `
  @keyframes spell-pulse {
    0%, 100% { opacity: 0.85; }
    50%       { opacity: 1; }
  }
`

export default function Timeline() {
  const reduced = useReducedMotion()

  const lineRef   = useRef<HTMLDivElement>(null)
  const dotRefs   = useRef<(HTMLDivElement | null)[]>([])

  // activeIndex: the last checkpoint the spell tip has reached (-1 = none)
  const [activeIndex, setActiveIndex] = useState(-1)
  // fillPx: pixel height of the glowing beam (snaps to dot positions)
  const [fillPx, setFillPx] = useState(0)

  const total = timelineEntries.length

  // ── Compute checkpoint pixel offsets from the line top ───────────────────────
  const getDotOffsets = useCallback((): number[] => {
    const line = lineRef.current
    if (!line) return []
    const lineTop = line.getBoundingClientRect().top + window.scrollY

    return dotRefs.current.map((dot) => {
      if (!dot) return 0
      const dotTop = dot.getBoundingClientRect().top + window.scrollY
      // Centre of the dot relative to the line's top
      return dotTop - lineTop + dot.offsetHeight / 2
    })
  }, [])

  // ── Scroll handler ────────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const line = lineRef.current
      if (!line) return

      const lineRect = line.getBoundingClientRect()

      const offsets = getDotOffsets()
      if (!offsets.length) return

      // Determine which checkpoint the reading line has passed
      // Each dot "activates" when fill progress fraction >= its fraction along the line
      // Trigger point: when the dot reaches 30vh from the top of the screen
      const triggerLine = window.innerHeight * 0.45

      let newActive = -1
      for (let i = 0; i < offsets.length; i++) {
        // Convert dot's page offset to viewport position
        const dotViewportY = lineRect.top + offsets[i]
        if (dotViewportY <= triggerLine) {
          newActive = i
        }
      }

      setActiveIndex(newActive)

      // Snap fill height to the active checkpoint's offset
      if (newActive < 0) {
        setFillPx(0)
      } else {
        setFillPx(offsets[newActive])
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [getDotOffsets])

  if (!timelineEntries.length) return null

  return (
    <section data-theme="dark" id="timeline" className="px-6 py-24 md:px-12 md:py-32 bg-[#080808]">
      {!reduced && <style>{SPELL_STYLES}</style>}

      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <ScrollReveal className="mb-16">
          <SectionLabel>Journey</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#f2f2f2]">
            How I got here.
          </h2>
        </ScrollReveal>

        <div className="relative flex flex-col gap-0">

          {/* ── Static background line ─────────────────────────────── */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{ background: 'rgba(255,255,255,0.08)', zIndex: 1 }}
            aria-hidden="true"
          />

          {/* ── Magical fill beam ──────────────────────────────────── */}
          <div
            ref={lineRef}
            className="absolute left-[7px] top-2 bottom-2"
            style={{ width: 14, zIndex: 0, pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                // Smooth step between checkpoints, not real-time continuous
                height: fillPx,
                transition: reduced ? 'none' : 'height 0.55s cubic-bezier(0.33, 1, 0.68, 1)',
                overflow: 'visible',
              }}
            >
              {fillPx > 0 && (
                <>
                  {/* Outer aura */}
                  <div style={{
                    position: 'absolute', top: 0, left: -6,
                    width: 14, height: '100%',
                    background: 'linear-gradient(to bottom, rgba(110,231,247,0.12), rgba(56,189,248,0.06))',
                    filter: 'blur(8px)', borderRadius: 7, zIndex: 2,
                  }} />

                  {/* Inner glow — gentle pulse */}
                  <div style={{
                    position: 'absolute', top: 0, left: -2,
                    width: 6, height: '100%',
                    background: 'linear-gradient(to bottom, rgba(110,231,247,0.45), rgba(56,189,248,0.25))',
                    filter: 'blur(3px)', borderRadius: 3, zIndex: 3,
                    animation: reduced ? 'none' : 'spell-pulse 2.4s ease-in-out infinite',
                  }} />

                  {/* Core beam */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: 2, height: '100%',
                    background: 'linear-gradient(to bottom, #6EE7F7, #38bdf8)',
                    opacity: 0.9, borderRadius: 1, zIndex: 4,
                  }} />

                  {/* Tip orb — sits at the bottom of the fill, always on a checkpoint */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 1,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#6EE7F7',
                    transform: 'translate(-50%, 50%)',
                    boxShadow: '0 0 8px 3px rgba(110,231,247,0.7), 0 0 18px 6px rgba(110,231,247,0.3)',
                    zIndex: 10,
                  }} />
                </>
              )}
            </div>
          </div>

          {/* ── Timeline entries ─────────────────────────────────────── */}
          {timelineEntries.map((entry, i) => {
            const isActive  = i <= activeIndex
            const isCurrent = i === activeIndex

            let dotBorder  = '2px solid rgba(255,255,255,0.15)'
            let dotBg      = '#080808'
            let dotShadow  = 'none'
            let dotScale   = 'scale(1)'

            if (isCurrent) {
              dotBorder = '2px solid #6EE7F7'
              dotBg     = 'rgba(110,231,247,0.08)'
              dotShadow = '0 0 6px 2px rgba(110,231,247,0.4)'
              dotScale  = 'scale(1.15)'
            } else if (isActive) {
              dotBorder = '2px solid #6EE7F7'
              dotShadow = '0 0 5px 1px rgba(110,231,247,0.3)'
            }

            return (
              <ScrollReveal key={`${entry.period}-${i}`} delay={i * 80} direction="up">
                <div className="relative flex gap-6 pb-20 last:pb-0">
                  {/* Dot — ref captured for offset measurement */}
                  <div
                    ref={el => { dotRefs.current[i] = el }}
                    aria-hidden="true"
                    style={{
                      position: 'relative',
                      zIndex: 20,
                      marginTop: 6,
                      width: 16,
                      height: 16,
                      flexShrink: 0,
                      borderRadius: '50%',
                      border: dotBorder,
                      background: dotBg,
                      boxShadow: dotShadow,
                      transform: dotScale,
                      transition: reduced ? 'none' : 'all 300ms ease',
                    }}
                  />

                  {/* Content */}
                  <div className="flex flex-col gap-1.5 mb-16">
                    <time
                      dateTime={entry.period}
                      className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#99dde8]"
                    >
                      {entry.period}
                    </time>
                    <h3 className="font-display text-[18px] font-semibold text-[#f2f2f2]">
                      {entry.title}
                    </h3>
                    <p className="text-[14px] font-medium text-accent">
                      {entry.organization}
                    </p>
                    <p className="text-[14px] leading-[1.7] text-[#aaaaaa]">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
