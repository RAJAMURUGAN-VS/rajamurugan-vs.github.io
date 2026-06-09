import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'

export default function About() {
  return (
    <section data-theme="light" id="about" className="px-6 py-24 md:px-12 md:py-32" style={{ background: '#f0f4f8' }}>
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="mb-10">
          <SectionLabel className="text-[#1a56db]">About Me</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#0a1628]">
            Engineering by instinct.
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-5 text-[17px] leading-[1.8] text-[#374151]">
          <ScrollReveal delay={100}>
            <p>
              I&apos;m Rajamurugan VS — a final-year Computer Science student at Sri Eshwar College
              of Engineering who has spent the last three years obsessively building things that
              work. Not just apps. Systems.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p>
              My path started with full-stack fundamentals — React, Node.js, databases — and
              evolved naturally into AI and GenAI as the tools matured. I didn&apos;t pivot to AI
              because it was trending. I moved toward it because the problems it solves are the
              ones worth solving.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p>
              Today I work at the intersection of reliable full-stack engineering and emerging
              agentic architectures. I care about code that ships, systems that hold under pressure,
              and products that actually change someone&apos;s workflow.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p>
              When I&apos;m not building, I&apos;m competing — hackathons are my proving ground.
              Three of them, two podium finishes, and a growing confidence that the best way to
              learn is to build under pressure with real stakes.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
