'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'

// ─── Hook: detect nav theme from current section ──────────────────────────────

function useNavTheme(): 'dark' | 'light' {
  const [navTheme, setNavTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[data-theme]')
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          const theme = visible[0].target.getAttribute('data-theme') as 'dark' | 'light'
          setNavTheme(theme)
        }
      },
      { rootMargin: '-0% 0px -80% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return navTheme
}

// ─── Hook: hide on scroll-down, show on scroll-up ────────────────────────────

function useScrollVisibility() {
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        // Always show at the very top
        if (y < 60) {
          setVisible(true)
        } else if (y > lastY.current + 6) {
          // Scrolling down — hide
          setVisible(false)
        } else if (y < lastY.current - 4) {
          // Scrolling up — show
          setVisible(true)
        }
        lastY.current = y
        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return visible
}

// ─── Hook: track active section ──────────────────────────────────────────────

function useActiveSection(): string {
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return active
}

// ─── Nav component ────────────────────────────────────────────────────────────

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navTheme = useNavTheme()
  const visible = useScrollVisibility()
  const activeSection = useActiveSection()
  const isDark = navTheme === 'dark'

  // Theme tokens
  const navBg     = isDark ? 'rgba(10,10,14,0.85)'              : 'rgba(240,244,248,0.88)'
  const navBorder = isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.08)'
  const logoColor = isDark ? '#ffffff'                           : '#0a1628'
  const linkColor = isDark ? 'rgba(255,255,255,0.55)'           : 'rgba(10,22,40,0.55)'
  const linkActive= isDark ? '#ffffff'                           : '#0a1628'
  const ctaBg     = isDark ? '#6EE7F7'                          : '#0a1628'
  const ctaText   = isDark ? '#080808'                          : '#ffffff'
  const iconColor = isDark ? '#ffffff'                           : '#0a1628'

  return (
    <>
      {/* ── Floating pill bar ───────────────────────────────────── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pt-4"
        initial={false}
        animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="w-full max-w-[1200px] flex items-center justify-between px-4 md:px-6"
          style={{
            height: 56,
            borderRadius: 14,
            border: navBorder,
            background: navBg,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            transition: 'background-color 300ms ease, border-color 300ms ease',
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            className="font-display text-[15px] font-bold tracking-tight hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded flex-shrink-0"
            style={{ color: logoColor, transition: 'color 300ms ease' }}
          >
            RV
          </a>

          {/* Desktop nav — scrollable on mid-sizes, wraps on large */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 justify-center px-4"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex-shrink-0"
                  style={{
                    color: isActive ? linkActive : linkColor,
                    background: isActive
                      ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(10,22,40,0.07)'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = linkActive }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? linkActive : linkColor }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: '#6EE7F7' }}
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold rounded-[8px] flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap transition-all duration-200 hover:opacity-85"
            style={{ background: ctaBg, color: ctaText }}
          >
            Hire Me
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            style={{ color: iconColor, background: 'none', border: 'none', transition: 'color 300ms ease' }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile overlay ───────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{
              background: isDark ? 'rgba(8,8,8,0.97)' : 'rgba(240,244,248,0.97)',
              backdropFilter: 'blur(16px)',
            }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="absolute top-6 right-6 p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              style={{ color: isDark ? '#888' : '#4a5568' }}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>

            <nav className="flex flex-col items-center gap-2 w-full px-8">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.href.replace('#', '')
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full text-center py-3 text-[18px] font-display font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    style={{
                      color: isActive ? '#6EE7F7' : isDark ? '#f2f2f2' : '#0a1628',
                      background: isActive
                        ? isDark ? 'rgba(110,231,247,0.06)' : 'rgba(10,22,40,0.05)'
                        : 'transparent',
                    }}
                  >
                    {link.label}
                  </motion.a>
                )
              })}
            </nav>

            <motion.a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.04, duration: 0.3 }}
              className="inline-flex items-center justify-center px-10 py-3 text-[15px] font-semibold rounded-[10px] mt-2"
              style={{ background: ctaBg, color: ctaText }}
            >
              Hire Me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide scrollbar on nav */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </>
  )
}
