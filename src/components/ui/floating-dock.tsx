'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DockItem {
  title: string
  icon: React.ReactNode
  href: string
  onClick?: () => void
}

export type DockTheme = 'dark' | 'light'

interface FloatingDockProps {
  items: DockItem[]
  theme?: DockTheme
  className?: string
  mobileClassName?: string
  /** Render only the mobile variant (no desktop pill bar) */
  mobileOnly?: boolean
  /** Render only the desktop variant (no mobile toggle) */
  desktopOnly?: boolean
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────

function getThemeTokens(theme: DockTheme) {
  if (theme === 'light') {
    return {
      dockBg: 'rgba(240, 244, 248, 0.88)',
      dockBorder: '1px solid rgba(0, 0, 0, 0.08)',
      dockShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04)',
      iconBg: 'rgba(10, 22, 40, 0.06)',
      iconHoverBg: 'rgba(10, 22, 40, 0.12)',
      iconColor: 'rgba(10, 22, 40, 0.8)',
      tooltipBg: 'rgba(10, 22, 40, 0.08)',
      tooltipBorder: '1px solid rgba(10, 22, 40, 0.2)',
      tooltipColor: '#0a1628',
      tooltipShadow: '0 4px 16px rgba(0,0,0,0.12)',
      mobileBg: 'rgba(240, 244, 248, 0.92)',
      mobileBorder: '1px solid rgba(0, 0, 0, 0.1)',
      mobileItemBg: 'rgba(240, 244, 248, 0.95)',
      mobileItemBorder: '1px solid rgba(0, 0, 0, 0.08)',
      mobileItemColor: 'rgba(10, 22, 40, 0.7)',
      hamburgerLine: 'rgba(10, 22, 40, 0.7)',
    }
  }
  return {
    dockBg: 'rgba(15, 15, 20, 0.75)',
    dockBorder: '1px solid rgba(255, 255, 255, 0.08)',
    dockShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.04)',
    iconBg: 'rgba(255, 255, 255, 0.05)',
    iconHoverBg: 'rgba(110, 231, 247, 0.1)',
    iconColor: 'rgba(255, 255, 255, 0.75)',
    tooltipBg: 'rgba(110, 231, 247, 0.12)',
    tooltipBorder: '1px solid rgba(110, 231, 247, 0.25)',
    tooltipColor: '#6EE7F7',
    tooltipShadow: '0 4px 20px rgba(0,0,0,0.4)',
    mobileBg: 'rgba(15, 15, 20, 0.85)',
    mobileBorder: '1px solid rgba(255, 255, 255, 0.1)',
    mobileItemBg: 'rgba(15, 15, 20, 0.9)',
    mobileItemBorder: '1px solid rgba(255, 255, 255, 0.08)',
    mobileItemColor: 'rgba(255, 255, 255, 0.6)',
    hamburgerLine: 'rgba(255, 255, 255, 0.7)',
  }
}

// ─── FloatingDock ─────────────────────────────────────────────────────────────

export function FloatingDock({
  items,
  theme = 'dark',
  className = '',
  mobileClassName = '',
  mobileOnly = false,
  desktopOnly = false,
}: FloatingDockProps) {
  return (
    <>
      {/* Desktop pill bar */}
      {!mobileOnly && (
        <FloatingDockDesktop items={items} theme={theme} className={className} />
      )}
      {/* Mobile radial fan */}
      {!desktopOnly && (
        <FloatingDockMobile items={items} theme={theme} className={mobileClassName} />
      )}
    </>
  )
}

// ─── Desktop Dock ─────────────────────────────────────────────────────────────

function FloatingDockDesktop({
  items,
  theme,
  className,
}: {
  items: DockItem[]
  theme: DockTheme
  className?: string
}) {
  const mouseX = useMotionValue(Infinity)
  const tokens = getThemeTokens(theme)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-end gap-3 px-4 py-3 rounded-2xl ${className}`}
      animate={{
        background: tokens.dockBg,
        border: tokens.dockBorder,
        boxShadow: tokens.dockShadow,
      }}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {items.map((item) => (
        <DockIcon mouseX={mouseX} key={item.title} item={item} theme={theme} />
      ))}
    </motion.div>
  )
}

// ─── Smooth scroll helper ────────────────────────────────────────────────────

// Ease: expo-out — fast start, silky deceleration
const easeExpoOut = (t: number) => 1 - Math.pow(2, -10 * t)

// ─── Dock Icon (with magnification) ──────────────────────────────────────────

function DockIcon({
  mouseX,
  item,
  theme,
}: {
  mouseX: MotionValue<number>
  item: DockItem
  theme: DockTheme
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const tokens = getThemeTokens(theme)
  const lenis = useLenis()

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40])

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 })
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 })

  const y = useTransform(distance, [-150, 0, 150], [0, -12, 0])
  const ySpring = useSpring(y, { mass: 0.1, stiffness: 150, damping: 12 })

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href?.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(item.href)
      if (target) {
        lenis?.scrollTo(target as HTMLElement, {
          offset: -80,
          duration: 1.4,
          easing: easeExpoOut,
        })
      }
    }
    item.onClick?.()
  }

  return (
    <a
      href={item.href}
      onClick={handleClick}
      aria-label={item.title}
      className="relative flex items-center justify-center focus-visible:outline-none"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap pointer-events-none z-50"
            style={{
              background: tokens.tooltipBg,
              border: tokens.tooltipBorder,
              color: tokens.tooltipColor,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: tokens.tooltipShadow,
              letterSpacing: '0.02em',
            }}
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        style={{ width, height, y: ySpring }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center justify-center rounded-xl cursor-pointer"
        animate={{ background: tokens.iconBg }}
        whileHover={{ background: tokens.iconHoverBg }}
        whileTap={{ scale: 0.93 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          style={{ width: '55%', height: '55%' }}
          animate={{ color: tokens.iconColor }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {item.icon}
        </motion.div>
      </motion.div>
    </a>
  )
}

// ─── Mobile Dock (top-right, radial fan menu) ─────────────────────────────────

// Two concentric arcs (inner & outer) for 10 items total, each covering a
// quarter-circle from left (top edge) to down (right edge).
const INNER_RADIUS = 95
const OUTER_RADIUS = 165
const ITEM_SIZE = 40

// ─── Mobile Arc Item (with styled tooltip) ───────────────────────────────────

type TokenMap = ReturnType<typeof getThemeTokens>

function MobileArcItem({
  item,
  pos,
  delay,
  tokens,
  onClose,
}: {
  item: DockItem
  pos: { x: number; y: number }
  delay: number
  tokens: TokenMap
  onClose: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const lenis = useLenis()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href?.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(item.href)
      if (target) {
        lenis?.scrollTo(target as HTMLElement, {
          offset: -80,
          duration: 1.4,
          easing: easeExpoOut,
        })
      }
    }
    item.onClick?.()
    onClose()
  }

  // Tooltip direction logic:
  // - Items along top edge (|x| > |y|): show tooltip below the icon
  // - Items along right edge (|y| > |x|): show tooltip to the left
  const isMoreHorizontal = Math.abs(pos.x) > Math.abs(pos.y)

  return (
    <motion.a
      href={item.href}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute flex items-center justify-center rounded-xl cursor-pointer focus-visible:outline-none"
      style={{
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        top: pos.y - ITEM_SIZE / 2,
        right: -pos.x - ITEM_SIZE / 2,
        background: tokens.mobileItemBg,
        border: tokens.mobileItemBorder,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        // Elevate the hovered item above all siblings so its tooltip is never clipped
        zIndex: hovered ? 50 : 1,
      }}
      aria-label={item.title}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Styled tooltip — extreme z-index so it always floats above all arc items */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: isMoreHorizontal ? 4 : 0, x: isMoreHorizontal ? 0 : 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none whitespace-nowrap"
            style={{
              zIndex: 9999,
              ...(isMoreHorizontal
                ? { top: ITEM_SIZE + 6, left: '50%', transform: 'translateX(-50%)' }
                : { right: ITEM_SIZE + 6, top: '50%', transform: 'translateY(-50%)' }
              ),
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.02em',
              background: tokens.tooltipBg,
              border: tokens.tooltipBorder,
              color: tokens.tooltipColor,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: tokens.tooltipShadow,
            }}
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>

      <div style={{ width: 18, height: 18, color: tokens.iconColor }} className="flex items-center justify-center">
        {item.icon}
      </div>
    </motion.a>
  )
}

// ─── Arc position helper ──────────────────────────────────────────────────────

function getArcPosition(index: number, total: number, radius: number) {
  // 180° = pure left (top edge), 90° = pure down (right edge)
  const startAngle = 180
  const endAngle = 90
  const angle = startAngle + (index / (total - 1)) * (endAngle - startAngle)
  const rad = (angle * Math.PI) / 180
  return {
    x: Math.cos(rad) * radius, // negative = left from button
    y: Math.sin(rad) * radius, // positive = down from button
  }
}

function FloatingDockMobile({
  items,
  theme,
  className,
}: {
  items: DockItem[]
  theme: DockTheme
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const tokens = getThemeTokens(theme)

  // Split items into inner ring (first 5) and outer ring (remaining)
  const innerItems = items.slice(0, Math.ceil(items.length / 2))
  const outerItems = items.slice(Math.ceil(items.length / 2))

  return (
    <div className={`relative ${className}`}>
      {/* Radial fan items */}
      <AnimatePresence>
        {open && (
          <>
            {/* Inner arc */}
            {innerItems.map((item, i) => {
              const pos = getArcPosition(i, innerItems.length, INNER_RADIUS)
              return (
                <MobileArcItem
                  key={item.title}
                  item={item}
                  pos={pos}
                  delay={i * 0.045}
                  tokens={tokens}
                  onClose={() => setOpen(false)}
                />
              )
            })}
            {/* Outer arc */}
            {outerItems.map((item, i) => {
              const pos = getArcPosition(i, outerItems.length, OUTER_RADIUS)
              return (
                <MobileArcItem
                  key={item.title}
                  item={item}
                  pos={pos}
                  delay={0.05 + i * 0.045}
                  tokens={tokens}
                  onClose={() => setOpen(false)}
                />
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center focus-visible:outline-none"
        style={{
          background: tokens.mobileBg,
          border: tokens.mobileBorder,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: open
            ? '0 0 0 3px rgba(110,231,247,0.2)'
            : '0 4px 20px rgba(0,0,0,0.25)',
        }}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="4"    width="14" height="1.5" rx="0.75" fill={tokens.hamburgerLine} />
            <rect x="2" y="8.25" width="14" height="1.5" rx="0.75" fill={tokens.hamburgerLine} />
            <rect x="2" y="12.5" width="14" height="1.5" rx="0.75" fill={tokens.hamburgerLine} />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  )
}
