import { Marquee } from '@/components/shared/Marquee'
import { marqueeItems } from '@/data/marquee'

export default function TechMarquee() {
  return (
    <section
      data-theme="dark"
      className="py-10"
      style={{ background: '#f0f4f8', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      aria-label="Technologies and institutions"
    >
      <Marquee items={marqueeItems} speed={35} light />
    </section>
  )
}
