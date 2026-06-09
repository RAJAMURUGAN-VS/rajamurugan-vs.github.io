import type { MarqueeItem } from '@/types'

interface MarqueeProps {
  items: MarqueeItem[]
  speed?: number
  light?: boolean
}

export function Marquee({ items, speed = 30, light = false }: MarqueeProps) {
  const track = [...items, ...items]

  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((item, i) => (
          <span
            key={`${item.label}-${i}`}
            className="mx-6 whitespace-nowrap text-sm font-medium transition-colors duration-200"
            style={{ color: light ? '#4a5568' : '#555555' }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
