'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  IconHome,
  IconBriefcase,
  IconBrandReact,
  IconBrandGithub,
  IconBrain,
  IconCode,
  IconUser,
  IconTimeline,
  IconCertificate,
  IconMail,
} from '@tabler/icons-react'
import { FloatingDock, type DockItem, type DockTheme } from '@/components/ui/floating-dock'

// ─── Hook: detect nav theme from current section ──────────────────────────────
// Uses scroll-position vs section offsetTop/offsetHeight for precise,
// direction-agnostic theme detection.

function useNavTheme(): DockTheme {
  const [navTheme, setNavTheme] = useState<DockTheme>('dark')

  useEffect(() => {
    const detectTheme = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('section[data-theme]')
      )
      if (!sections.length) return

      // Use the center of the viewport as the probe point
      const viewportMid = window.scrollY + window.innerHeight * 0.5

      let matched: DockTheme = 'dark'
      for (const section of sections) {
        const top = section.offsetTop
        const bottom = top + section.offsetHeight
        if (viewportMid >= top && viewportMid < bottom) {
          matched = (section.getAttribute('data-theme') as DockTheme) ?? 'dark'
          break
        }
      }
      setNavTheme(matched)
    }

    detectTheme() // run on mount
    window.addEventListener('scroll', detectTheme, { passive: true })
    window.addEventListener('resize', detectTheme, { passive: true })
    return () => {
      window.removeEventListener('scroll', detectTheme)
      window.removeEventListener('resize', detectTheme)
    }
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
        if (y < 60) {
          setVisible(true)
        } else if (y > lastY.current + 6) {
          setVisible(false)
        } else if (y < lastY.current - 4) {
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

// ─── Dock items ────────────────────────────────────────────────────────────────

const iconCls = 'h-full w-full'

const DOCK_ITEMS: DockItem[] = [
  { title: 'Home',        icon: <IconHome        className={iconCls} />, href: '#hero'          },
  { title: 'Projects',    icon: <IconBriefcase   className={iconCls} />, href: '#projects'      },
  { title: 'React',       icon: <IconBrandReact  className={iconCls} />, href: '#react-journey' },
  { title: 'GitHub',      icon: <IconBrandGithub className={iconCls} />, href: '#build-history' },
  { title: 'GenAI',       icon: <IconBrain       className={iconCls} />, href: '#genai-journey' },
  { title: 'Skills',      icon: <IconCode        className={iconCls} />, href: '#skills'        },
  { title: 'About',       icon: <IconUser        className={iconCls} />, href: '#about'         },
  { title: 'Timeline',    icon: <IconTimeline    className={iconCls} />, href: '#timeline'      },
  { title: 'Credentials', icon: <IconCertificate className={iconCls} />, href: '#credentials'  },
  { title: 'Contact',     icon: <IconMail        className={iconCls} />, href: '#contact'       },
]

// ─── Nav component ────────────────────────────────────────────────────────────

export default function Nav() {
  const visible = useScrollVisibility()
  const theme = useNavTheme()

  return (
    <>
      {/* ── Desktop: fixed bottom-center, hides/shows on scroll ── */}
      <motion.div
        className="fixed bottom-6 left-0 right-0 z-50 hidden md:flex justify-center items-end pointer-events-none"
        initial={false}
        animate={{
          y: visible ? 0 : 120,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pointer-events-auto">
          <FloatingDock items={DOCK_ITEMS} theme={theme} desktopOnly />
        </div>
      </motion.div>

      {/* ── Mobile: fixed top-right corner, hides/shows on scroll ── */}
      <motion.div
        className="fixed top-5 right-5 z-50 md:hidden pointer-events-none"
        initial={false}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pointer-events-auto">
          <FloatingDock items={DOCK_ITEMS} theme={theme} mobileOnly desktopOnly={false} />
        </div>
      </motion.div>
    </>
  )
}
