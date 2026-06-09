import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { timelineEntries } from '@/data/timeline'

export default function Timeline() {
  if (!timelineEntries.length) return null

  return (
    <section data-theme="dark" id="timeline" className="px-6 py-24 md:px-12 md:py-32 bg-[#080808]">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="mb-16">
          <SectionLabel>Journey</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#f2f2f2]">
            How I got here.
          </h2>
        </ScrollReveal>

        <div className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-[#ffffff14]"
            aria-hidden="true"
          />

          {timelineEntries.map((entry, i) => (
            <ScrollReveal key={`${entry.period}-${i}`} delay={i * 100} direction="up">
              <div className="relative flex gap-6 pb-12 last:pb-0">
                {/* Dot */}
                <div
                  className={[
                    'relative z-10 mt-1.5 flex h-4 w-4 shrink-0 rounded-full border-2',
                    entry.type === 'education'
                      ? 'border-accent bg-[#080808]'
                      : 'border-[#ffffff44] bg-[#080808]',
                  ].join(' ')}
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-1.5">
                  <time
                    dateTime={entry.period}
                    className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#555555]"
                  >
                    {entry.period}
                  </time>
                  <h3 className="font-display text-[18px] font-semibold text-[#f2f2f2]">
                    {entry.title}
                  </h3>
                  <p className="text-[14px] font-medium text-accent">
                    {entry.organization}
                  </p>
                  <p className="text-[14px] leading-[1.7] text-[#777777]">
                    {entry.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
