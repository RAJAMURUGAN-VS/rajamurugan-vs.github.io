'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'

export interface Carousel3DItem {
  id: string
  src: string
  alt: string
}

interface Carousel3DProps {
  items: Carousel3DItem[]
  activeIndex: number
  onIndexChange?: (index: number) => void
}

const DRAG_FACTOR = 0.3

export function Carousel3D({ items, activeIndex, onIndexChange }: Carousel3DProps) {
  const count = items.length
  const angleStep = 360 / count

  // Current rotation in degrees — negative so dragging right spins forward
  const [baseAngle, setBaseAngle] = useState(-activeIndex * angleStep)
  const dragX = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // Sync baseAngle when activeIndex changes from outside (sidebar click)
  useEffect(() => {
    const target = -activeIndex * angleStep
    // Snap to nearest equivalent angle to avoid spinning the long way round
    const current = baseAngle
    const diff = ((target - current) % 360 + 540) % 360 - 180
    const snapped = current + diff
    setBaseAngle(snapped)
    controls.start({ rotateY: snapped, transition: { type: 'spring', stiffness: 120, damping: 20 } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  // Total Y rotation = baseAngle + live drag offset
  const totalRotate = useTransform(dragX, (x) => baseAngle + x * DRAG_FACTOR)

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      const delta = info.offset.x * DRAG_FACTOR
      const newAngle = baseAngle + delta
      // Snap to nearest card
      const nearest = Math.round(newAngle / angleStep) * angleStep
      setBaseAngle(nearest)
      dragX.set(0)
      controls.start({ rotateY: nearest, transition: { type: 'spring', stiffness: 120, damping: 20 } })

      // Notify parent of new index
      const rawIndex = Math.round(-nearest / angleStep)
      const normalized = ((rawIndex % count) + count) % count
      onIndexChange?.(normalized)
    },
    [baseAngle, angleStep, count, dragX, controls, onIndexChange]
  )

  // Radius scales with container width
  const [radius, setRadius] = useState(280)
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        setRadius(Math.max(160, w * 0.38))
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{ perspective: '1100px', minHeight: 320 }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          rotateY: totalRotate,
          transformStyle: 'preserve-3d',
          width: 1,
          height: 1,
          position: 'relative',
          cursor: 'grab',
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {items.map((item, i) => {
          const cardAngle = i * angleStep
          return (
            <CarouselCard
              key={item.id}
              item={item}
              angle={cardAngle}
              radius={radius}
              totalCards={count}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

// ─── Single card positioned in 3D space ──────────────────────────────────────

function CarouselCard({
  item,
  angle,
  radius,
  totalCards,
}: {
  item: Carousel3DItem
  angle: number
  radius: number
  totalCards: number
}) {
  // Card size scales with radius
  const cardW = Math.min(320, radius * 1.1)
  const cardH = cardW * 0.65

  return (
    <div
      style={{
        position: 'absolute',
        width: cardW,
        height: cardH,
        left: -cardW / 2,
        top: -cardH / 2,
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        pointerEvents: 'none',
      }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover object-top"
        sizes={`${Math.round(320 / totalCards * 2)}vw`}
        draggable={false}
      />
      {/* Depth fade on non-front cards — handled by natural 3D perspective */}
    </div>
  )
}
