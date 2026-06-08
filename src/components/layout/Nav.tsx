'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close mobile menu on resize to desktop
  if (typeof window !== 'undefined') {
    // handled via CSS (md:hidden) — no JS resize needed
  }

  return (
    <>
      {/* ── Floating card wrapper ───────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pt-4">
        <div
          className="w-full max-w-[1200px] flex items-center justify-between px-5 md:px-7"
          style={{
            height: 60,
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(10,10,12,0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            className="font-display text-base font-bold tracking-tight transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            style={{ color: '#6EE7F7' }}
          >
            RV
          </a>

          {/* Desktop nav links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] transition-colors duration-200 hover:text-[#e8e8e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-0.5"
                style={{ color: '#888888' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-5 py-2 text-[14px] font-medium rounded-[8px] border transition-colors duration-200 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                border: '1px solid rgba(255,255,255,0.75)',
                color: '#f2f2f2',
                background: 'transparent',
              }}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 transition-colors duration-200 hover:text-[#e8e8e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            style={{ color: '#f2f2f2' }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ──────────────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(12px)' }}
        >
          <button
            className="absolute top-6 right-6 p-2 text-[#888] hover:text-[#e8e8e8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
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
                className="text-[22px] font-display font-semibold transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2"
                style={{ color: '#f2f2f2' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center px-8 py-3 text-[15px] font-medium rounded-[8px] border transition-colors duration-200 hover:bg-white/8"
            style={{ border: '1px solid rgba(255,255,255,0.75)', color: '#f2f2f2' }}
          >
            Hire Me
          </a>
        </div>
      )}
    </>
  )
}
