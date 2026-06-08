import { CountUp } from '@/components/shared/CountUp'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { stats } from '@/data/stats'

export default function ImpactStats() {
  if (!stats.length) return null

  return (
    <section
      id="impact"
      className="px-6 py-24 md:px-12 md:py-32 bg-[#111111]"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16 text-center">
          <SectionLabel>By the Numbers</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#f2f2f2]">
            Impact that speaks.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100} direction="up">
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className="font-display font-extrabold text-[#f2f2f2]"
                  style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1 }}
                >
                  <CountUp end={stat.value} duration={1500} suffix={stat.suffix ?? ''} />
                </div>
                <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#555555]">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
