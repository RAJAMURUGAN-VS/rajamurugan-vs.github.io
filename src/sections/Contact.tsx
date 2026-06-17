'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { Mail } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { SITE_META } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { SOUND_DEFINES_DOWN, SOUND_DEFINES_UP } from '@/components/ui/keyboard'

/* ── React Input Value Setter Helper ────────────────────────────── */

const setReactInputValue = (input: HTMLTextAreaElement, newVal: string, selectionStart: number, selectionEnd: number) => {
  if (typeof window === 'undefined') return
  const proto = typeof HTMLTextAreaElement !== 'undefined' ? HTMLTextAreaElement.prototype : null
  if (!proto) return
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(proto, "value")?.set
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, newVal)
  } else {
    input.value = newVal
  }
  input.setSelectionRange(selectionStart, selectionEnd)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

/* ── Icon components ────────────────────────────────────────────── */

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/* ── Typewriter placeholders ────────────────────────────────────── */

const INPUT_PLACEHOLDERS = [
  "Open to internships — let's connect.",
  "Have a project idea? Tell me about it.",
  "Looking for a GenAI engineer?",
  "Want to collaborate on something real?",
  "Drop your email or message here…",
]

/* ── Key code → character mapping ───────────────────────────────── */

function keyCodeToChar(keyCode: string, shifted: boolean): string | null {
  // Letters
  if (keyCode.startsWith('Key')) {
    const letter = keyCode.slice(3)
    return shifted ? letter.toUpperCase() : letter.toLowerCase()
  }
  // Digits row
  const digitMap: Record<string, [string, string]> = {
    Digit1: ['1','!'], Digit2: ['2','@'], Digit3: ['3','#'], Digit4: ['4','$'],
    Digit5: ['5','%'], Digit6: ['6','^'], Digit7: ['7','&'], Digit8: ['8','*'],
    Digit9: ['9','('], Digit0: ['0',')'],
  }
  if (digitMap[keyCode]) return digitMap[keyCode][shifted ? 1 : 0]
  // Symbols
  const symMap: Record<string, [string, string]> = {
    Minus:        ['-','_'], Equal:       ['=','+'],
    BracketLeft:  ['[','{'], BracketRight:[']','}'],
    Backslash:    ['\\','|'], Semicolon:  [';',':'],
    Quote:        ["'",'"'],  Comma:      [',','<'],
    Period:       ['.', '>'], Slash:      ['/','?'],
    Backquote:    ['`','~'],
  }
  if (symMap[keyCode]) return symMap[keyCode][shifted ? 1 : 0]
  if (keyCode === 'Space') return ' '
  return null
}

/* ── Inline keyboard + input panel ─────────────────────────────── */

function KeyboardPanel({
  inputRef,
  onInputChange,
  keyboardOpen,
}: {
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  onInputChange: (val: string) => void
  keyboardOpen: boolean
}) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const [soundLoaded, setSoundLoaded] = useState(false)

  // Initialize Audio
  useEffect(() => {
    if (typeof window === 'undefined') return
    const initAudio = async () => {
      try {
        const AudioCtx = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AudioCtx) return
        audioContextRef.current = new AudioCtx()
        const response = await fetch("/sounds/sound.ogg")
        if (!response.ok) { console.warn("Sound file not available"); return }
        const arrayBuffer = await response.arrayBuffer()
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer)
        setSoundLoaded(true)
      } catch (error) {
        console.warn("Failed to load sound:", error)
      }
    }
    initAudio()
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  const playSoundDown = useCallback((keyCode: string) => {
    if (!soundLoaded || !audioContextRef.current || !audioBufferRef.current) return
    const soundDef = SOUND_DEFINES_DOWN[keyCode]
    if (!soundDef) return
    const [startMs, durationMs] = soundDef
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume()
    }
    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBufferRef.current
    source.connect(audioContextRef.current.destination)
    source.start(0, startMs / 1000, durationMs / 1000)
  }, [soundLoaded])

  const playSoundUp = useCallback((keyCode: string) => {
    if (!soundLoaded || !audioContextRef.current || !audioBufferRef.current) return
    const soundDef = SOUND_DEFINES_UP[keyCode]
    if (!soundDef) return
    const [startMs, durationMs] = soundDef
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume()
    }
    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBufferRef.current
    source.connect(audioContextRef.current.destination)
    source.start(0, startMs / 1000, durationMs / 1000)
  }, [soundLoaded])

  // Add global keydown/keyup listeners to highlight virtual keys when typing physically
  useEffect(() => {
    if (!keyboardOpen) return

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => new Set(prev).add(e.code))
      playSoundDown(e.code)
    }

    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      playSoundUp(e.code)
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'CapsLock') {
        setPressedKeys(prev => {
          const next = new Set(prev)
          if (e.shiftKey) {
            next.add('ShiftLeft')
          } else {
            next.delete('ShiftLeft')
            next.delete('ShiftRight')
          }
          if (e.getModifierState('CapsLock')) {
            next.add('CapsLock')
          } else {
            next.delete('CapsLock')
          }
          return next
        })
        return
      }
      setPressedKeys(prev => {
        const next = new Set(prev)
        next.delete(e.code)
        return next
      })
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    window.addEventListener('keyup', handleGlobalKeyUp)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
      window.removeEventListener('keyup', handleGlobalKeyUp)
    }
  }, [keyboardOpen, playSoundDown, playSoundUp])

  const isShifted = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight')
  const isCapsLock = pressedKeys.has('CapsLock')
  const isUppercase = isShifted !== isCapsLock // XOR shift and caps lock

  const handleKeyDown = useCallback((keyCode: string) => {
    playSoundDown(keyCode)

    // Check if input is focused, refocus if not
    const input = inputRef.current
    if (input && document.activeElement !== input) {
      input.focus()
    }

    if (keyCode === 'ShiftLeft' || keyCode === 'ShiftRight') {
      setPressedKeys(prev => {
        const next = new Set(prev)
        if (next.has(keyCode)) {
          next.delete(keyCode)
        } else {
          next.add(keyCode)
        }
        return next
      })
      return
    }

    if (keyCode === 'CapsLock') {
      setPressedKeys(prev => {
        const next = new Set(prev)
        if (next.has('CapsLock')) {
          next.delete('CapsLock')
        } else {
          next.add('CapsLock')
        }
        return next
      })
      return
    }

    if (!input) return

    if (keyCode === 'Backspace') {
      const start = input.selectionStart ?? input.value.length
      const end = input.selectionEnd ?? input.value.length
      let newVal: string
      if (start !== end) {
        newVal = input.value.slice(0, start) + input.value.slice(end)
        setReactInputValue(input, newVal, start, start)
      } else if (start > 0) {
        newVal = input.value.slice(0, start - 1) + input.value.slice(start)
        setReactInputValue(input, newVal, start - 1, start - 1)
      } else {
        return
      }
      onInputChange(input.value)
      return
    }

    if (keyCode === 'Enter') {
      // Virtual keyboard Enter = submit the form (same as physical Enter)
      input.form?.requestSubmit()
      return
    }

    // Modifier keys with no text output
    if (['ControlLeft','AltLeft','MetaLeft','MetaRight','AltRight','Fn','Tab','Escape',
         ...Array.from({length:12},(_,i)=>`F${i+1}`)].includes(keyCode)) return

    if (keyCode === 'ArrowLeft') {
      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0
      const newPos = start === end ? Math.max(0, start - 1) : start
      input.setSelectionRange(newPos, newPos)
      return
    }

    if (keyCode === 'ArrowRight') {
      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0
      const newPos = start === end ? Math.min(input.value.length, start + 1) : end
      input.setSelectionRange(newPos, newPos)
      return
    }

    const char = keyCodeToChar(keyCode, isUppercase)
    if (!char) return

    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? input.value.length
    const newVal = input.value.slice(0, start) + char + input.value.slice(end)
    setReactInputValue(input, newVal, start + char.length, start + char.length)
    onInputChange(input.value)

    // Auto-release shift after typing a character
    if (pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight')) {
      setPressedKeys(prev => {
        const next = new Set(prev)
        next.delete('ShiftLeft')
        next.delete('ShiftRight')
        return next
      })
    }
  }, [inputRef, onInputChange, pressedKeys, isUppercase, playSoundDown])

  const handleKeyUp = useCallback((keyCode: string) => {
    playSoundUp(keyCode)
    if (keyCode === 'ShiftLeft' || keyCode === 'ShiftRight' || keyCode === 'CapsLock') return
    setPressedKeys(prev => { const n = new Set(prev); n.delete(keyCode); return n })
  }, [playSoundUp])

  return (
    <div className="w-full overflow-x-auto pb-2 pt-1">
      {/* Hint */}
      <p className="text-center text-[11px] font-mono text-[#2a2a2a] uppercase tracking-[0.18em] mb-3 select-none">
        Try it — click or type
      </p>
      {/* Scale down keyboard to fit without scrolling */}
      <div className="flex justify-center">
        <div className="[zoom:0.8] sm:[zoom:1.1] md:[zoom:1.3] lg:[zoom:1.5] xl:[zoom:1.7]">
          <KeypadWired
            pressedKeys={pressedKeys}
            isUppercase={isUppercase}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Wired Keypad — passes press state down to keys ─────────────── */

function KeypadWired({
  pressedKeys,
  isUppercase,
  onKeyDown,
  onKeyUp,
}: {
  pressedKeys: Set<string>
  isUppercase: boolean
  onKeyDown: (k: string) => void
  onKeyUp: (k: string) => void
}) {
  const K = ({ keyCode, className, childrenClassName, containerClassName, children }: {
    keyCode?: string; className?: string; childrenClassName?: string
    containerClassName?: string; children?: React.ReactNode
  }) => {
    const isPressed = keyCode ? pressedKeys.has(keyCode) : false
    return (
      <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); if (keyCode) onKeyDown(keyCode) }}
          onMouseUp={() => { if (keyCode) setTimeout(() => onKeyUp(keyCode), 120) }}
          onMouseLeave={() => { if (keyCode && isPressed) setTimeout(() => onKeyUp(keyCode), 120) }}
          className={cn(
            "flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] bg-gray-100 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,1)_inset] transition-all duration-100 active:scale-[0.98]",
            isPressed && "scale-[0.98] bg-cyan-100 shadow-[0px_0px_8px_2px_rgba(6,182,212,0.6),0px_1px_1px_0px_rgba(0,0,0,0.2)] border border-cyan-400/50",
            className
          )}
        >
          <div className={cn("flex h-full w-full flex-col items-center justify-center text-[5px] text-neutral-700 transition-colors duration-100", isPressed && "text-cyan-800", childrenClassName)}>
            {children}
          </div>
        </button>
      </div>
    )
  }

  const MK = ({ keyCode, className, containerClassName, children }: {
    keyCode?: string; className?: string; containerClassName?: string; children?: React.ReactNode
  }) => {
    const isPressed = keyCode ? pressedKeys.has(keyCode) : false
    return (
      <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); if (keyCode) onKeyDown(keyCode) }}
          onMouseUp={() => { if (keyCode) setTimeout(() => onKeyUp(keyCode), 120) }}
          onMouseLeave={() => { if (keyCode && isPressed) setTimeout(() => onKeyUp(keyCode), 120) }}
          className={cn(
            "flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] bg-gray-100 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,1)_inset] transition-all duration-100 active:scale-[0.98]",
            isPressed && "scale-[0.98] bg-cyan-100 shadow-[0px_0px_8px_2px_rgba(6,182,212,0.6),0px_1px_1px_0px_rgba(0,0,0,0.2)] border border-cyan-400/50",
            className
          )}
        >
          <div className={cn("flex h-full w-full flex-col items-start justify-between p-1 text-[5px] text-neutral-700 transition-colors duration-100", isPressed && "text-cyan-800")}>
            {children}
          </div>
        </button>
      </div>
    )
  }

  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">{children}</div>
  )

  const OptionKey = ({ className }: { className?: string }) => (
    <svg fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
      <rect stroke="currentColor" strokeWidth={2} x="18" y="5" width="10" height="2" />
      <polygon stroke="currentColor" strokeWidth={2} points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25" />
    </svg>
  )

  // Digit row labels change with shift
  const digits: [string, string, string][] = [
    ['Backquote','~','`'],['Digit1','!','1'],['Digit2','@','2'],['Digit3','#','3'],
    ['Digit4','$','4'],['Digit5','%','5'],['Digit6','^','6'],['Digit7','&','7'],
    ['Digit8','*','8'],['Digit9','(','9'],['Digit0',')','0'],
    ['Minus','—','_'],['Equal','+','='],
  ]

  return (
    <div className="h-full w-fit rounded-xl bg-neutral-200 p-1 shadow-sm ring-1 shadow-black/5 ring-black/5">
      {/* Function Row */}
      <Row>
        <K keyCode="Escape" containerClassName="rounded-tl-xl" className="w-10 rounded-tl-lg" childrenClassName="items-start justify-end pb-[2px] pl-[4px]"><span>esc</span></K>
        <K keyCode="F1"><span className="mt-1">F1</span></K>
        <K keyCode="F2"><span className="mt-1">F2</span></K>
        <K keyCode="F3"><span className="mt-1">F3</span></K>
        <K keyCode="F4"><span className="mt-1">F4</span></K>
        <K keyCode="F5"><span className="mt-1">F5</span></K>
        <K keyCode="F6"><span className="mt-1">F6</span></K>
        <K keyCode="F7"><span className="mt-1">F7</span></K>
        <K keyCode="F8"><span className="mt-1">F8</span></K>
        <K keyCode="F9"><span className="mt-1">F9</span></K>
        <K keyCode="F10"><span className="mt-1">F10</span></K>
        <K keyCode="F11"><span className="mt-1">F11</span></K>
        <K keyCode="F12"><span className="mt-1">F12</span></K>
        <K containerClassName="rounded-tr-xl" className="rounded-tr-lg">
          <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-300 via-neutral-200 to-neutral-300 p-px">
            <div className="h-full w-full rounded-full bg-neutral-100" />
          </div>
        </K>
      </Row>
      {/* Number Row */}
      <Row>
        {digits.map(([code, top, bottom]) => (
          <K key={code} keyCode={code}><span>{top}</span><span>{bottom}</span></K>
        ))}
        <K keyCode="Backspace" className="w-10" childrenClassName="items-end justify-end pr-[4px] pb-[2px]"><span>delete</span></K>
      </Row>
      {/* QWERTY */}
      <Row>
        <K keyCode="Tab" className="w-10" childrenClassName="items-start justify-end pb-[2px] pl-[4px]"><span>tab</span></K>
        {['Q','W','E','R','T','Y','U','I','O','P'].map(l => <K key={l} keyCode={`Key${l}`}>{isUppercase ? l : l.toLowerCase()}</K>)}
        <K keyCode="BracketLeft"><span>{'{'}</span><span>{'['}</span></K>
        <K keyCode="BracketRight"><span>{'}'}</span><span>{']'}</span></K>
        <K keyCode="Backslash"><span>{'|'}</span><span>{'\\'}</span></K>
      </Row>
      {/* Home Row */}
      <Row>
        <K keyCode="CapsLock" className="w-[2.8rem]" childrenClassName="items-start justify-end pb-[2px] pl-[4px]"><span>caps</span></K>
        {['A','S','D','F','G','H','J','K','L'].map(l => <K key={l} keyCode={`Key${l}`}>{isUppercase ? l : l.toLowerCase()}</K>)}
        <K keyCode="Semicolon"><span>:</span><span>;</span></K>
        <K keyCode="Quote"><span>{'"'}</span><span>{"'"}</span></K>
        <K keyCode="Enter" className="w-[2.85rem]" childrenClassName="items-end justify-end pr-[4px] pb-[2px]"><span>return</span></K>
      </Row>
      {/* Bottom */}
      <Row>
        <K keyCode="ShiftLeft" className="w-[3.65rem]" childrenClassName="items-start justify-end pb-[2px] pl-[4px]"><span>shift</span></K>
        {['Z','X','C','V','B','N','M'].map(l => <K key={l} keyCode={`Key${l}`}>{isUppercase ? l : l.toLowerCase()}</K>)}
        <K keyCode="Comma"><span>{'<'}</span><span>,</span></K>
        <K keyCode="Period"><span>{'>'}</span><span>.</span></K>
        <K keyCode="Slash"><span>?</span><span>/</span></K>
        <K keyCode="ShiftRight" className="w-[3.65rem]" childrenClassName="items-end justify-end pr-[4px] pb-[2px]"><span>shift</span></K>
      </Row>
      {/* Modifiers */}
      <Row>
        <MK keyCode="Fn" containerClassName="rounded-bl-xl" className="rounded-bl-lg"><span>fn</span></MK>
        <MK keyCode="ControlLeft"><span>ctrl</span></MK>
        <MK keyCode="AltLeft"><OptionKey className="h-[6px] w-[6px]" /><span>opt</span></MK>
        <MK keyCode="MetaLeft" className="w-8"><span>cmd</span></MK>
        <K keyCode="Space" className="w-[8.2rem]" />
        <MK keyCode="MetaRight" className="w-8"><span>cmd</span></MK>
        <MK keyCode="AltRight"><OptionKey className="h-[6px] w-[6px]" /><span>opt</span></MK>
        <div className="flex h-6 w-[4.9rem] items-center justify-end rounded-[4px] p-[0.5px]">
          <K keyCode="ArrowLeft" className="h-6 w-6"><span>←</span></K>
          <div className="flex flex-col">
            <K keyCode="ArrowUp" className="h-3 w-6"><span>↑</span></K>
            <K keyCode="ArrowDown" className="h-3 w-6"><span>↓</span></K>
          </div>
          <K keyCode="ArrowRight" containerClassName="rounded-br-xl" className="h-6 w-6 rounded-br-lg"><span>→</span></K>
        </div>
      </Row>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────── */

export default function Contact() {
  const [inputValue, setInputValue] = useState('')
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  // Email popup state
  const [emailPopupOpen, setEmailPopupOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [sendError, setSendError] = useState('')
  const [messageError, setMessageError] = useState(false)
  const senderEmailRef = useRef<HTMLInputElement>(null)

  // Exposed input ref so keyboard can inject characters
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const keyboardRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Track scroll position of the contact section for scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Buttery-smooth spring progress for text entry animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001
  })

  const textY = useTransform(smoothProgress, [0.05, 0.45], [150, 0])
  const textOpacity = useTransform(smoothProgress, [0.05, 0.45], [0, 1])

  useEffect(() => {
    if (keyboardOpen && keyboardRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setKeyboardHeight(entry.target.getBoundingClientRect().height)
        }
      })
      observer.observe(keyboardRef.current)
      return () => observer.disconnect()
    } else {
      setKeyboardHeight(0)
    }
  }, [keyboardOpen])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    if (e.target.value.trim()) setMessageError(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim()) {
      setMessageError(true)
      // Auto-clear the error after 3s
      setTimeout(() => setMessageError(false), 3000)
      return
    }
    setKeyboardOpen(false)
    setMessageError(false)
    // Store message and open the email popup
    setPendingMessage(inputValue.trim())
    setSenderEmail('')
    setSendStatus('idle')
    setSendError('')
    setEmailPopupOpen(true)
    setTimeout(() => senderEmailRef.current?.focus(), 350)
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      setSendError('Please enter a valid email address.')
      return
    }
    setSendStatus('sending')
    setSendError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: senderEmail.trim(), message: pendingMessage }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to send.')
      setSendStatus('success')
      // Auto-close after 3s on success
      setTimeout(() => {
        setEmailPopupOpen(false)
        setInputValue('')
        setPendingMessage('')
        setSendStatus('idle')
        if (inputRef.current) {
          inputRef.current.value = ''
          inputRef.current.style.height = 'auto'
          inputRef.current.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }, 3000)
    } catch (err) {
      setSendStatus('error')
      setSendError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const closeEmailPopup = () => {
    if (sendStatus === 'sending') return
    setEmailPopupOpen(false)
    setSendStatus('idle')
    setSendError('')
    // Always clear the message when the popup is dismissed without sending
    if (sendStatus !== 'success') {
      setInputValue('')
      setPendingMessage('')
      if (inputRef.current) {
        inputRef.current.value = ''
        inputRef.current.style.height = 'auto'
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }
  }

  const handleInputChange = useCallback((val: string) => {
    setInputValue(val)
  }, [])

  const isFixed = keyboardOpen && keyboardHeight > 0

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      id="contact"
      className="relative bg-[#080808] overflow-hidden"
    >
      {/* Backdrop scrim */}
      <AnimatePresence>
        {keyboardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000] z-40 backdrop-blur-sm"
            onClick={() => {
              setKeyboardOpen(false)
              inputRef.current?.blur()
            }}
          />
        )}
      </AnimatePresence>

      {/* ── PART 1: Lamp header ───────────────────────────────────── */}
      <LampContainer scrollProgress={scrollYProgress}>
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[#6EE7F7]">
            Get in Touch
          </p>
          <h2 className="font-display text-[clamp(40px,7vw,80px)] font-extrabold leading-[1.05] text-[#f2f2f2]">
            Let&apos;s Build
            <br />
            <span className="text-[#6EE7F7]">Something.</span>
          </h2>
          <p className="mt-6 text-[17px] leading-[1.7] text-[#888888] max-w-xl mx-auto">
            I&apos;m currently open to internships, collaborations, and interesting projects.
            If you have something worth building, I want to hear about it.
          </p>
        </motion.div>
      </LampContainer>

      {/* ── PART 2: Input + CTA + Social ─────────────────────────── */}
      <div className="px-6 md:px-12 pt-2 pb-8 flex flex-col items-center">
        <ScrollReveal direction="up" className="w-full max-w-2xl text-center">
          <p className="text-center text-[13px] font-medium text-[#888888] uppercase tracking-[0.12em] mb-4">
            Start the conversation
          </p>
        </ScrollReveal>

        {/* Input container outside ScrollReveal to prevent transform hierarchy bug */}
        <div className="w-full max-w-2xl my-2 relative min-h-[48px] flex items-center justify-center">
          {keyboardOpen && <div className="h-12 w-full invisible" />}
          
          <motion.div
            layout
            style={{
              position: isFixed ? 'fixed' : 'relative',
              bottom: isFixed ? `${keyboardHeight}px` : 'auto',
              left: isFixed ? 0 : 'auto',
              right: isFixed ? 0 : 'auto',
              margin: isFixed ? '0 auto' : '0',
              zIndex: isFixed ? 50 : 'auto',
            }}
            className={cn(
              "w-full max-w-2xl transition-all duration-300",
              isFixed
                ? "px-6 py-4 bg-[#0d0d0d] border-t border-white/10 shadow-2xl rounded-t-2xl"
                : "px-0 py-0 bg-transparent"
            )}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
          >
            <PlaceholdersAndVanishInput
              placeholders={INPUT_PLACEHOLDERS}
              onChange={handleChange}
              onSubmit={handleSubmit}
              inputRef={inputRef}
              onFocus={() => setKeyboardOpen(true)}
            />
          </motion.div>
        </div>

        <ScrollReveal direction="up" delay={50} className="w-full max-w-2xl text-center">
          <p className="text-center text-[12px] text-[#555555] mt-3 font-mono">
            Press Enter or click ↵ — we&apos;ll ask for your email next
          </p>
          {/* Empty message indicator */}
          <AnimatePresence>
            {messageError && (
              <motion.p
                key="msg-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-2 text-[12px] font-mono"
                style={{ color: 'rgba(251,191,36,0.85)' }}
              >
                ∅ &nbsp;Nothing to send yet — share what&apos;s on your mind first.
              </motion.p>
            )}
          </AnimatePresence>
        </ScrollReveal>

        {/* CTA buttons */}
        <ScrollReveal delay={150} className="mt-6 w-full max-w-2xl">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (!inputValue.trim()) {
                  setMessageError(true)
                  setTimeout(() => setMessageError(false), 3000)
                  inputRef.current?.focus()
                  return
                }
                setMessageError(false)
                setPendingMessage(inputValue.trim())
                setSenderEmail('')
                setSendStatus('idle')
                setSendError('')
                setEmailPopupOpen(true)
                setTimeout(() => senderEmailRef.current?.focus(), 350)
              }}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-[var(--radius-md)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg bg-accent text-[#080808] hover:bg-[#a5f0fa]"
            >
              Send a Message
            </button>
            <Button href="/resume.pdf" variant="secondary" size="lg" download>
              Download Resume
            </Button>
          </div>
        </ScrollReveal>

        {/* Social links */}
        <ScrollReveal delay={250} className="mt-6">
          <div className="flex items-center justify-center gap-6 text-[#555555]">
            <a
              href={`mailto:${SITE_META.email}`}
              className="inline-flex items-center gap-2 text-sm hover:text-[#888888] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EE7F7] rounded"
            >
              <Mail size={15} />
              {SITE_META.email}
            </a>
            <a href={SITE_META.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"
              className="hover:text-[#888888] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EE7F7] rounded p-1">
              <GitHubIcon size={18} />
            </a>
            <a href={SITE_META.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"
              className="hover:text-[#888888] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EE7F7] rounded p-1">
              <LinkedInIcon size={18} />
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* ── PART 3: Keyboard — slides up when input is focused ───── */}
      <AnimatePresence>
        {keyboardOpen && (
          <motion.div
            ref={keyboardRef}
            key="keyboard-panel"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
            className="w-full overflow-hidden fixed bottom-0 left-0 right-0 z-50"
            style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Dismiss strip */}
            <div className="flex items-center justify-between px-6 pt-3 pb-1 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono text-[#444] uppercase tracking-[0.15em] select-none">
                Keyboard
              </span>
              <button
                type="button"
                onClick={() => { setKeyboardOpen(false); inputRef.current?.blur() }}
                className="text-[11px] font-mono text-[#888] hover:text-white transition-colors px-2 py-1 rounded"
                aria-label="Dismiss keyboard"
              >
                Done
              </button>
            </div>
            <div className="pb-8 px-4">
              <KeyboardPanel inputRef={inputRef} onInputChange={handleInputChange} keyboardOpen={keyboardOpen} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Email popup — slides up from bottom ──────────────────── */}
      <AnimatePresence>
        {emailPopupOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="email-backdrop"
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeEmailPopup}
            />

            {/* Sheet */}
            <motion.div
              key="email-sheet"
              className="fixed bottom-0 left-0 right-0 z-[70] w-full"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.85 }}
            >
              <div
                className="mx-auto w-full max-w-lg rounded-t-2xl px-6 pt-5 pb-10"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Drag handle */}
                <div className="flex justify-center mb-5">
                  <div className="w-10 h-1 rounded-full bg-white/10" />
                </div>

                {sendStatus === 'success' ? (
                  /* ── Success state ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-6 text-center"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
                      style={{ background: 'rgba(110,231,247,0.1)', border: '1px solid rgba(110,231,247,0.25)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6EE7F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-[17px] font-semibold text-[#f2f2f2]">Message sent!</p>
                    <p className="text-[13px] text-[#555]">
                      I&apos;ll get back to you at <span className="text-[#6EE7F7]">{senderEmail}</span> soon.
                    </p>
                  </motion.div>
                ) : (
                  /* ── Form state ── */
                  <form onSubmit={handleSendEmail} noValidate>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6EE7F7] mb-1">
                          One last thing
                        </p>
                        <h3 className="text-[17px] font-semibold text-[#f2f2f2] leading-snug">
                          Where should I reply?
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={closeEmailPopup}
                        className="text-[#444] hover:text-[#888] transition-colors p-1 rounded"
                        aria-label="Close"
                        disabled={sendStatus === 'sending'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Message preview */}
                    <div className="mb-4 px-3 py-2.5 rounded-lg text-[13px] text-[#555] italic line-clamp-2"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      &ldquo;{pendingMessage}&rdquo;
                    </div>

                    {/* Email input */}
                    <div className="mb-4">
                      <label htmlFor="sender-email" className="block text-[12px] font-medium text-[#444] mb-2 uppercase tracking-[0.1em]">
                        Your email address
                      </label>
                      <input
                        ref={senderEmailRef}
                        id="sender-email"
                        type="email"
                        value={senderEmail}
                        onChange={e => { setSenderEmail(e.target.value); setSendError('') }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={sendStatus === 'sending'}
                        className="w-full h-11 px-4 rounded-xl text-[14px] text-white placeholder:text-[#333] outline-none transition-all duration-200 disabled:opacity-50"
                        style={{
                          background: '#1a1a1a',
                          border: sendError ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: sendError ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
                        }}
                        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(110,231,247,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(110,231,247,0.08)' }}
                        onBlur={e => { if (!sendError) { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' } }}
                      />
                      {sendError && (
                        <p className="mt-1.5 text-[12px] text-red-400 font-mono">{sendError}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sendStatus === 'sending'}
                      className="w-full h-11 rounded-xl text-[14px] font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: '#6EE7F7', color: '#080808' }}
                    >
                      {sendStatus === 'sending' ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Mail size={15} />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-[#333] mt-3 font-mono">
                      Your message will be sent to rajamurugan.dev@gmail.com
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
