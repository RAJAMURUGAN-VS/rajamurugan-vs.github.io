'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'

function useNavTheme(): 'dark' | 'light' {
  const [navTheme, setNavTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[data-theme]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry that is intersecting and closest to the top
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

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navTheme = useNavTheme()
  const isDark = navTheme === 'dark'

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const navBg      = isDark ? 'rgba(10,10,14,0.80)'       : 'rgba(240,244,248,0.82)'
  const navBorder  = isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.08)'
  const logoColor  = isDark ? '#ffffff'                    : '#0a1628'
  const linkColor  = isDark ? 'rgba(255,255,255,0.80)'     : 'rgba(10,22,40,0.70)'
  const linkHover  = isDark ? '#ffffff'                    : '#0a1628'
  const ctaBg      = isDark ? '#ffffff'                    : '#0a1628'
  const ctaText    = isDark ? '#0a0a0e'                    : '#ffffff'
  const iconColor  = isDark ? '#ffffff'                    : '#0a1628'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pt-4">
        <div
          className="w-full max-w-[1200px] flex items-center justify-between px-5 md:px-7"
          style={{
            height: 60,
            borderRadius: 14,
            border: navBorder,
            background: navBg,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'background-color 300ms ease, border-color 300ms ease',
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            className="font-display text-base font-bold tracking-tight hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            style={{ color: logoColor, transition: 'color 300ms ease' }}
          >
            RV
          </a>

          {/* Desktop nav links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-0.5"
                style={{ color: linkColor, transition: 'color 300ms ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = linkHover }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-5 py-2 text-[14px] font-semibold rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                background: ctaBg,
                color: ctaText,
                border: 'none',
                transition: 'background-color 300ms ease, color 300ms ease',
              }}
            >
              Hire Me
            </a>
          </div>

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
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{
            background: isDark ? 'rgba(10,10,14,0.97)' : 'rgba(240,244,248,0.97)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            className="absolute top-6 right-6 p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            style={{ color: isDark ? '#888888' : '#4a5568' }}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

          <nav className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[22px] font-display font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2"
                style={{ color: isDark ? '#f2f2f2' : '#0a1628' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center px-8 py-3 text-[15px] font-semibold rounded-[8px]"
            style={{ background: ctaBg, color: ctaText }}
          >
            Hire Me
          </a>
        </div>
      )}
    </>
  )
}
