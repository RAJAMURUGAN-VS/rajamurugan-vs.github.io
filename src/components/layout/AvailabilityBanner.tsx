'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function AvailabilityBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="flex items-center justify-center gap-3 px-4 bg-[#111111] border-b border-[#ffffff14]"
      style={{ height: '40px' }}
      role="banner"
    >
      {/* Pulsing green dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>

      <p className="text-[13px] text-[#888888]">
        Currently open to internships{' '}
        <span className="text-[#aaaaaa]">·</span>{' '}
        Summer 2025
      </p>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss availability banner"
        className="ml-2 p-0.5 text-[#666666] hover:text-[#aaaaaa] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
      >
        <X size={14} />
      </button>
    </div>
  )
}
