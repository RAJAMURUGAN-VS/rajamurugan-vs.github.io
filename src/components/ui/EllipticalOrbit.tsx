'use client'

import React, {
  useRef,
  useEffect,
  useState,
  ReactNode,
} from 'react'

export interface OrbitItem {
  key?: string
  node: ReactNode   // the actual rendered card / image element
}

interface Orbit3DCarouselProps {
  items?: OrbitItem[]
  orientation?: 'horizontal' | 'vertical'
  radius?: number
  scrollSpeed?: number
  baseTiltAngle?: number
  mouseTiltIntensity?: number
  touchSpeed?: number
  cardScale?: number
  dragSpeed?: number
  showCursor?: boolean
  cursorText?: string
  cursorBgColor?: string
  cursorTextColor?: string
  cursorPadding?: string
  cursorBorderRadius?: number
}

export function Orbit3DCarousel({
  items = [],
  orientation = 'horizontal',
  radius = 600,
  scrollSpeed = 0.04,
  baseTiltAngle = -12,
  mouseTiltIntensity = 10,
  touchSpeed = 0.25,
  cardScale = 1,
  dragSpeed = 0.2,
  showCursor = true,
  cursorText = 'View',
  cursorBgColor = '#000000',
  cursorTextColor = '#FFFFFF',
  cursorPadding = '8px 16px',
  cursorBorderRadius = 100,
}: Orbit3DCarouselProps) {
  const itemCount = items.length

  const [rotation, setRotation] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [smoothCursor, setSmoothCursor] = useState({ x: 0, y: 0 })
  const [showCustomCursor, setShowCustomCursor] = useState(false)
  const [cursorOpacity, setCursorOpacity] = useState(0)

  const momentumRef = useRef(0)
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 })
  const touchRef = useRef({ active: false, lastY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  // ── Wheel (passive:false to allow preventDefault) ──────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (container.contains(e.target as Node)) {
        e.preventDefault()
        momentumRef.current += e.deltaY * scrollSpeed
        isScrollingRef.current = true
        setTimeout(() => { isScrollingRef.current = false }, 100)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [scrollSpeed])

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current.active = true
    dragRef.current.lastX = e.clientX
    dragRef.current.lastY = e.clientY
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.active) return
    if (orientation === 'horizontal') {
      const dx = e.clientX - dragRef.current.lastX
      dragRef.current.lastX = e.clientX
      setRotation((prev) => prev + dx * dragSpeed)
    } else {
      const dy = e.clientY - dragRef.current.lastY
      dragRef.current.lastY = e.clientY
      setRotation((prev) => prev + dy * dragSpeed)
    }
  }

  const handleMouseUp = () => { dragRef.current.active = false }

  // ── Touch handlers ─────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchRef.current.active = true
      touchRef.current.lastY = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current.active) return
    const dy = e.touches[0].clientY - touchRef.current.lastY
    touchRef.current.lastY = e.touches[0].clientY
    setRotation((prev) => prev + dy * touchSpeed)
    e.preventDefault()
  }

  const handleTouchEnd = () => { touchRef.current.active = false }

  // ── Momentum animation ─────────────────────────────────────────────────────
  useEffect(() => {
    let frame: number
    const animate = () => {
      if (Math.abs(momentumRef.current) > 0.01) {
        setRotation((p) => p + momentumRef.current)
        momentumRef.current *= 0.9
      } else {
        momentumRef.current = 0
      }
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [])

  // ── Mouse-tilt tracking ────────────────────────────────────────────────────
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      })
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // ── Smooth mouse tilt ──────────────────────────────────────────────────────
  useEffect(() => {
    let frame: number
    const animate = () => {
      setSmoothMouse((p) => ({
        x: p.x + (mousePos.x - p.x) * 0.07,
        y: p.y + (mousePos.y - p.y) * 0.07,
      }))
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [mousePos.x, mousePos.y])

  // ── Smooth cursor follow ───────────────────────────────────────────────────
  useEffect(() => {
    let frame: number
    const animate = () => {
      setSmoothCursor((p) => ({
        x: p.x + (cursorPosition.x - p.x) * 0.15,
        y: p.y + (cursorPosition.y - p.y) * 0.15,
      }))
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [cursorPosition.x, cursorPosition.y])

  // ── Cursor opacity fade ────────────────────────────────────────────────────
  useEffect(() => {
    let frame: number
    const target = showCustomCursor ? 1 : 0
    const animate = () => {
      setCursorOpacity((cur) => {
        const diff = target - cur
        if (Math.abs(diff) < 0.01) return target
        return cur + diff * 0.15
      })
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [showCustomCursor])

  // ── Empty state ────────────────────────────────────────────────────────────
  if (itemCount === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: '#9B8FD6' }}>
          No items
        </div>
      </div>
    )
  }

  const rotationAxis = orientation === 'horizontal' ? 'rotateY' : 'rotateX'
  const tiltAxis     = orientation === 'horizontal' ? 'rotateX' : 'rotateY'

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1400,
          touchAction: 'none',
          userSelect: 'none',
          cursor:
            showCursor && showCustomCursor
              ? 'none'
              : dragRef.current.active
              ? 'grabbing'
              : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setShowCustomCursor(false) }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: `${tiltAxis}(${
              baseTiltAngle + smoothMouse.y * mouseTiltIntensity
            }deg) ${
              orientation === 'horizontal'
                ? `rotateY(${smoothMouse.x * mouseTiltIntensity}deg)`
                : `rotateX(${-smoothMouse.x * mouseTiltIntensity}deg)`
            }`,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
            }}
          >
            {items.map((item, i) => {
              const angle = rotation + (360 / itemCount) * i
              return (
                <div
                  key={item.key ?? i}
                  style={{
                    position: 'absolute',
                    transformStyle: 'preserve-3d',
                    transform: `${rotationAxis}(${angle}deg) translateZ(${radius}px) scale(${cardScale})`,
                  }}
                  onMouseEnter={() => {
                    if (showCursor && !isScrollingRef.current)
                      setShowCustomCursor(true)
                  }}
                  onMouseLeave={() => setShowCustomCursor(false)}
                >
                  {item.node}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Custom cursor */}
      {showCursor && !dragRef.current.active && (
        <div
          style={{
            position: 'fixed',
            left: smoothCursor.x,
            top: smoothCursor.y,
            transform: 'translate(-50%, -50%)',
            backgroundColor: cursorBgColor,
            color: cursorTextColor,
            padding: cursorPadding,
            borderRadius: cursorBorderRadius,
            pointerEvents: 'none',
            zIndex: 10000,
            whiteSpace: 'nowrap',
            opacity: cursorOpacity,
            transition: 'opacity 0.2s ease-out',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {cursorText}
        </div>
      )}
    </>
  )
}
