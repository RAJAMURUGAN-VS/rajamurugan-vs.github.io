'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileSearch, GitMerge, ShieldCheck, Database,
  Users, Zap, FileText, Search,
  Brain, MessageSquare, Wifi, Layout,
  ArrowRight, LucideIcon,
} from 'lucide-react'
import type { ProjectCard } from '@/data/projects'

// ─── Icon registry ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  FileSearch, GitMerge, ShieldCheck, Database,
  Users, Zap, FileText, Search,
  Brain, MessageSquare, Wifi, Layout,
}

// ─── Stack layout ─────────────────────────────────────────────────────────────

const STACK_SLOTS = [
  { widthFactor: 0.70, yOffset: -150 },
  { widthFactor: 0.80, yOffset: -100 },
  { widthFactor: 0.90, yOffset: -50 },
  { widthFactor: 1.00, yOffset: 0 },
]

const SPRING = { type: 'spring' as const, bounce: 0.18, duration: 0.45 }

// ─── Component ────────────────────────────────────────────────────────────────

interface RollingCardStackProps {
  cards: ProjectCard[]
}

export default function RollingCardStack({ cards }: RollingCardStackProps) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i))
  // Suppress first-load animation flash: cards snap into position silently,
  // then animate only on user interaction.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const textColor = '#0a2540'

  const handleAdvance = () => {
    setOrder(prev => {
      const next = [...prev]
      const front = next.pop()!
      next.unshift(front)
      return next
    })
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-end" style={{ minHeight: 500 }}>
      <div className="relative w-full" style={{ height: 450 }}>
        {order.map((cardIdx, stackPos) => {
          const slotIdx = stackPos - (order.length - 4)
          const isVisible = slotIdx >= 0
          const slot = isVisible ? STACK_SLOTS[slotIdx] : STACK_SLOTS[0]
          const isFront = slotIdx === 3
          const card = cards[cardIdx]
          const Icon = ICON_MAP[card.icon] ?? ShieldCheck

          return (
            <motion.div
              key={cardIdx}
              layout
              layoutId={`card-${cardIdx}`}
              initial={mounted ? undefined : {
                width: `${slot.widthFactor * 100}%`,
                y: slot.yOffset,
                opacity: isVisible ? 1 : 0,
                zIndex: isVisible ? slotIdx + 1 : 0,
              }}
              animate={{
                width: `${slot.widthFactor * 100}%`,
                y: slot.yOffset,
                opacity: isVisible ? 1 : 0,
                zIndex: isVisible ? slotIdx + 1 : 0,
              }}
              transition={mounted ? SPRING : { duration: 0 }}
              style={{
                position: 'absolute', bottom: 0, left: '50%', x: '-50%',
                maxWidth: 700,
                cursor: isVisible ? 'pointer' : 'default',
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              onClick={() => {
                if (isFront) {
                  handleAdvance()
                } else {
                  setOrder(prev => {
                    const idx = prev.indexOf(cardIdx)
                    return [...prev.slice(idx + 1), ...prev.slice(0, idx + 1)]
                  })
                }
              }}
              whileHover={isVisible ? { y: slot.yOffset - 5 } : undefined}
              className="select-none"
            >
              <div
                className="relative overflow-hidden rounded-2xl flex flex-col"
                style={{
                  background: '#ffffff',
                  boxShadow: isFront ? '0 20px 60px rgba(0,0,0,0.08)' : '0 4px 14px rgba(0,0,0,0.04)',
                  border: `1px solid ${isFront ? `${card.accentHex}18` : '#e2e8f0'}`,
                  height: 400,
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-5 flex-shrink-0 border-b"
                  style={{ borderColor: '#f0f4f8', background: '#fafbfc', minHeight: 50, paddingTop: 10, paddingBottom: 10 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${card.accentHex}14` }}
                    >
                      <Icon size={14} style={{ color: card.accentHex }} />
                    </div>
                    <p className="text-[13px] font-semibold leading-tight tracking-tight" style={{ color: textColor }}>
                      {card.title}
                    </p>
                  </div>
                  {isFront && (
                    <div
                      className="flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase"
                      style={{ color: card.accentHex, opacity: 0.8 }}
                    >
                      Next <ArrowRight size={11} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 px-5 pt-3 pb-4 gap-3 overflow-hidden">
                  <p
                    className="text-[11.5px] leading-snug flex-shrink-0"
                    style={{ color: '#3a5f8a' }}
                  >
                    {card.subtitle}
                  </p>

                  {/* Visual diagram placeholder — accent-tinted block */}
                  <div
                    className="w-full rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ height: 140, background: `${card.accentHex}08`, border: `1px solid ${card.accentHex}18` }}
                  >
                    <Icon size={48} style={{ color: card.accentHex, opacity: 0.18 }} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                    {card.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-medium"
                        style={{ background: `${card.accentHex}0d`, color: card.accentHex, border: `1px solid ${card.accentHex}22` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    className="flex-shrink-0 rounded-lg px-3 py-2"
                    style={{ background: `${card.accentHex}07`, borderLeft: `3px solid ${card.accentHex}60` }}
                  >
                    <p className="text-[10px] leading-relaxed" style={{ color: '#3a5f8a' }}>{card.outcome}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t flex-shrink-0 mt-auto" style={{ borderColor: '#f0f4f8' }}>
                    {card.metrics.map(m => (
                      <div key={m.label}>
                        <p className="text-[13px] font-bold leading-none tracking-tight" style={{ color: textColor }}>{m.value}</p>
                        <p className="text-[8.5px] font-semibold uppercase tracking-widest mt-1" style={{ color: '#94a3b8' }}>{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Progress dots */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 items-center">
        {cards.map((_, i) => {
          const frontIdx = order[order.length - 1]
          const isActive = i === frontIdx
          return (
            <motion.div
              key={i}
              animate={{ width: isActive ? 22 : 5, opacity: isActive ? 1 : 0.28 }}
              transition={SPRING}
              className="h-[3px] rounded-full"
              style={{ background: isActive ? cards[frontIdx].accentHex : '#b0bec5' }}
            />
          )
        })}
      </div>
    </div>
  )
}
