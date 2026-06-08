import { Badge } from '@/components/ui/Badge'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { skillDomains } from '@/data/skills'

export default function Skills() {
  if (!skillDomains.length) return null

  return (
    <section id="skills" className="px-6 py-24 md:px-12 md:py-32 bg-[#080808]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16">
          <SectionLabel>Technical Skills</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#f2f2f2]">
            My toolkit.
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-[#888888]">
            Organized by domain, not sprayed across a page. Every skill here has been applied in a
            real project.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillDomains.map((domain, i) => (
            <ScrollReveal key={domain.domain} delay={i * 80} direction="up">
              <div className="flex flex-col gap-4">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#555555]">
                  {domain.domain}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {domain.skills.map((skill) => (
                    <Badge key={skill} label={skill} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
