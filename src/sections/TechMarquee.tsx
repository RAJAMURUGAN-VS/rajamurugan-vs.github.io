import { Marquee } from '@/components/shared/Marquee'
import { marqueeItems } from '@/data/marquee'

export default function TechMarquee() {
  return (
    <section
      className="py-10 border-y border-[#ffffff08]"
      aria-label="Technologies and institutions"
    >
      <Marquee items={marqueeItems} speed={35} />
    </section>
  )
}
