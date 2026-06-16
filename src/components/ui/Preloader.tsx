'use client'

import { useEffect, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KEYWORDS = [
  'DEVELOP',
  'DESIGN',
  'GEN AI',
  'AGENTIC',
  'SOLUTIONS',
  'RAJAMURUGAN VS'
]

export default function Preloader() {
  const [percentage, setPercentage] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading')
  const [, startTransition] = useTransition()
  
  // Animate the percentage counter from 0 to 100
  useEffect(() => {
    if (phase !== 'loading') return

    const duration = 2400 // 2.4s total load time
    const intervalTime = 20
    const totalSteps = duration / intervalTime
    const stepIncrement = 100 / totalSteps
    
    let currentPercent = 0
    const timer = setInterval(() => {
      currentPercent += stepIncrement
      if (currentPercent >= 100) {
        currentPercent = 100
        clearInterval(timer)
        setPercentage(100)
        setTimeout(() => {
          startTransition(() => {
            setPhase('exiting')
          })
        }, 300)
      } else {
        setPercentage(Math.floor(currentPercent))
      }
    }, intervalTime)

    return () => clearInterval(timer)
  }, [phase])

  // Prevent scroll during loading
  useEffect(() => {
    if (phase !== 'done') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  if (phase === 'done') return null

  // Determine current word based on percentage
  const wordIndex = Math.min(
    Math.floor((percentage / 100) * KEYWORDS.length),
    KEYWORDS.length - 1
  )
  const currentWord = KEYWORDS[wordIndex]

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#080808] p-8 md:p-16"
      initial={{ y: '0%' }}
      animate={phase === 'exiting' ? { y: '-100%' } : { y: '0%' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (phase === 'exiting') {
          startTransition(() => {
            setPhase('done')
          })
        }
      }}
    >
      {/* Top layout - simple decoration */}
      <div className="flex justify-between items-center text-[10px] md:text-xs font-mono tracking-widest text-[#888888]">
        <div>PORTFOLIO / 2026</div>
        <div>STATUS / INITIALIZING</div>
      </div>

      {/* Center layout - cycling text and big counter */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        {/* Ambient Background Glow */}
        <div 
          className="absolute pointer-events-none w-[350px] h-[350px] rounded-full opacity-30 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #6EE7F7 0%, transparent 70%)'
          }}
        />

        {/* Keyword display */}
        <div className="h-16 flex items-center justify-center overflow-hidden relative z-10">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={currentWord}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[#f2f2f2]"
            >
              {currentWord === 'RAJAMURUGAN VS' ? (
                <>
                  RAJAMURUGAN <span className="text-accent">VS.</span>
                </>
              ) : (
                currentWord
              )}
            </motion.span>
          </AnimatePresence>
        </div>
        
        {/* Subtitle / Loader Indicator */}
        <div className="font-mono text-sm tracking-wider text-accent relative z-10">
          {percentage}%
        </div>
      </div>

      {/* Bottom layout - progress bar & design details */}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between text-[10px] font-mono tracking-widest text-[#888888]">
          <div>SYSTEM CHECK: OK</div>
          <div>@RAJAMURUGAN-VS</div>
        </div>
        {/* The progress bar wrapper */}
        <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            style={{ 
              width: `${percentage}%`,
              boxShadow: '0 0 8px rgba(110, 231, 247, 0.5)'
            }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
