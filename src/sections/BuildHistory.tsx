'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Types matching jogruber API shape ────────────────────────────────────────

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
  total: Record<string, number>   // { "2025": 441, "lastYear": 370, ... }
  contributions: ContributionDay[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '#1a1a1a',
  1: '#0e3d2e',
  2: '#1a6644',
  3: '#25a065',
  4: '#2dd4a0',
}

// Group flat day array into Sun-aligned weeks for grid rendering
function toWeeks(days: ContributionDay[]): ContributionDay[][] {
  if (!days.length) return []
  const weeks: ContributionDay[][] = []
  let week: ContributionDay[] = []

  // Pad start so first day lands on correct weekday (0=Sun)
  const firstDow = new Date(days[0].date).getDay()
  for (let i = 0; i < firstDow; i++) {
    week.push({ date: '', count: 0, level: 0 })
  }

  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) {
    while (week.length < 7) week.push({ date: '', count: 0, level: 0 })
    weeks.push(week)
  }
  return weeks
}

// Extract month label positions from weeks
function getMonthLabels(weeks: ContributionDay[][]): { label: string; wi: number }[] {
  const labels: { label: string; wi: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const day = week.find((d) => d.date)
    if (!day) return
    const month = new Date(day.date).getMonth()
    if (month !== lastMonth) {
      labels.push({
        label: new Date(day.date).toLocaleString('default', { month: 'short' }),
        wi,
      })
      lastMonth = month
    }
  })
  return labels
}

const YEAR_OPTIONS = ['lastYear', '2026', '2025', '2024', '2023']
const YEAR_LABELS: Record<string, string> = {
  lastYear: 'Last Year',
  '2026': '2026',
  '2025': '2025',
  '2024': '2024',
  '2023': '2023',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BuildHistory() {
  const [selectedYear, setSelectedYear] = useState('lastYear')
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  useEffect(() => {
    setLoading(true)
    setError(false)

    const yearParam = selectedYear === 'lastYear' ? 'last' : selectedYear
    fetch(`https://github-contributions-api.jogruber.de/v4/RAJAMURUGAN-VS?y=${yearParam}`)
      .then((r) => { if (!r.ok) throw new Error('failed'); return r.json() })
      .then((d: ApiResponse) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [selectedYear])

  // Derived values
  const allDays    = data?.contributions ?? []
  const weeks      = toWeeks(allDays)
  const monthLabels = getMonthLabels(weeks)
  const total      = data?.total?.[selectedYear] ?? data?.total?.lastYear ?? 0
  const activeDays = allDays.filter((d) => d.count > 0).length

  let longestStreak = 0, cur = 0
  for (const d of allDays) {
    cur = d.count > 0 ? cur + 1 : 0
    longestStreak = Math.max(longestStreak, cur)
  }

  return (
    <motion.section
      ref={sectionRef}
      data-theme="dark"
      id="build-history"
      className="w-full py-24 lg:py-32 px-6"
      style={{ background: '#080808' }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-[916px] mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6EE7F7] mb-3 block">
              GitHub Activity
            </span>
            <h2
              className="font-display font-black tracking-tight leading-[1.1] text-[#f2f2f2] mb-4"
              style={{ fontSize: 'clamp(32px,5vw,56px)' }}
            >
              Build History
            </h2>
            <p className="text-[#888888] text-base" style={{ lineHeight: 1.7 }}>
              Every square is something shipped.
            </p>
          </div>

          {/* Year pills */}
          <div className="flex flex-wrap gap-1.5 bg-[#111] border border-white/[0.07] rounded-full p-1 self-start sm:self-auto">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className="px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200"
                style={
                  selectedYear === y
                    ? { background: '#6EE7F7', color: '#080808' }
                    : { color: '#555555' }
                }
              >
                {YEAR_LABELS[y]}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap card */}
        <div
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" style={{ zIndex: 1 }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(110,231,247,0.015) 40%, rgba(110,231,247,0.04) 50%, rgba(110,231,247,0.015) 60%, transparent)',
              animation: 'shimmer 3s infinite linear',
            }} />
          </div>

          <style>{`
            @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            @keyframes pulse-l3 { 0%,100% { background-color: #25a065; } 50% { background-color: #2dc47c; } }
            @keyframes pulse-l4 { 0%,100% { background-color: #2dd4a0; box-shadow: 0 0 3px rgba(45,212,160,.35); } 50% { background-color: #6EE7F7; box-shadow: 0 0 12px rgba(110,231,247,.6); } }
            .cell-l3 { animation: pulse-l3 3.5s ease-in-out infinite; }
            .cell-l4 { animation: pulse-l4 3.5s ease-in-out infinite; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {loading ? (
            <div className="flex gap-[3px] animate-pulse">
              {Array.from({ length: 53 }).map((_, wi) => (
                <div key={wi} className="grid grid-rows-7 gap-[3px]">
                  {Array.from({ length: 7 }).map((_, di) => (
                    <div key={di} className="w-[13px] h-[13px] rounded-[3px]" style={{ backgroundColor: '#1a1a1a' }} />
                  ))}
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-[#555] text-sm font-mono py-8 text-center">Could not load contribution data.</p>
          ) : (
            <div className="w-full overflow-x-auto no-scrollbar pb-2" style={{ position: 'relative', zIndex: 2 }}>
              <div className="flex min-w-[630px] sm:min-w-0 items-start">

                {/* Day labels */}
                <div className="w-8 sm:w-10 pr-2 flex-shrink-0">
                  <div className="h-4 mb-2" />
                  <div className="grid gap-[3px]" style={{ gridTemplateRows: 'repeat(7,1fr)', height: 109 }}>
                    {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                      <span key={i} className="text-[11px] text-[#444] font-semibold leading-none select-none text-right">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  {/* Month labels */}
                  <div className="flex gap-[3px] h-4 mb-2 select-none">
                    {weeks.map((_, wi) => {
                      const ml = monthLabels.find((m) => m.wi === wi)
                      return (
                        <div key={wi} className="w-[13px] flex-shrink-0 relative">
                          {ml && (
                            <span className="absolute left-[1px] -top-[2px] text-[11px] text-[#555] font-semibold whitespace-nowrap">
                              {ml.label}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Cells */}
                  <div className="flex gap-[3px]">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="grid gap-[3px]" style={{ gridTemplateRows: 'repeat(7,1fr)' }}>
                        {week.map((day, di) => {
                          const delay = (wi * 7 + di) * 0.008
                          return (
                            <div
                              key={di}
                              title={day.date ? `${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}` : undefined}
                              className={[
                                'w-[10px] h-[10px] sm:w-[13px] sm:h-[13px] rounded-[3px]',
                                day.date ? 'cursor-help transition-transform duration-150 hover:scale-[1.4] hover:z-30' : '',
                                day.level === 3 ? 'cell-l3' : '',
                                day.level === 4 ? 'cell-l4' : '',
                              ].join(' ')}
                              style={{
                                backgroundColor: COLORS[day.level],
                                animationDelay: day.level >= 3 ? `${delay}s` : undefined,
                              }}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-y-1 mt-6 text-[13px] text-[#555555] select-none items-center font-mono">
          <span className="text-[#6EE7F7] font-semibold">{total.toLocaleString()}</span>
          <span className="ml-1">contributions {selectedYear === 'lastYear' ? 'in the last year' : `in ${selectedYear}`}</span>
          <span className="text-[#2a2a2a] mx-3">·</span>
          <span className="text-[#f2f2f2] font-semibold">{longestStreak}</span>
          <span className="ml-1">day longest streak</span>
          <span className="text-[#2a2a2a] mx-3">·</span>
          <span className="text-[#f2f2f2] font-semibold">{activeDays}</span>
          <span className="ml-1">active days</span>
        </div>

        {/* Legend + link */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-[11px] text-[#444] font-mono">Less</span>
          {([0, 1, 2, 3, 4] as const).map((l) => (
            <div key={l} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: COLORS[l] }} />
          ))}
          <span className="text-[11px] text-[#444] font-mono">More</span>
          <a
            href="https://github.com/RAJAMURUGAN-VS"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[12px] text-[#444] hover:text-[#6EE7F7] transition-colors duration-200 font-mono flex items-center gap-1"
          >
            View on GitHub
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </a>
        </div>

      </div>
    </motion.section>
  )
}

export default BuildHistory
