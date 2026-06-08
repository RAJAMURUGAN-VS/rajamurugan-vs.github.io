import type { MarqueeItem } from '@/types'

interface MarqueeProps {
  items: MarqueeItem[]
  speed?: number
}

export function Marquee({ items, speed = 30 }: MarqueeProps) {
  // Duplicate items for seamless loop
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
            className="mx-6 whitespace-nowrap text-sm font-medium text-[#555555] transition-colors duration-200 hover:text-[#888888]"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
