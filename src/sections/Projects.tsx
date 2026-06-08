import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import ProjectCard from './ProjectCard'
import { projects } from '@/data/projects'

export default function Projects() {
  const featured = projects.filter((p) => p.featured)

  if (!featured.length) return null

  return (
    <section id="projects" className="px-6 py-24 md:px-12 md:py-32">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16">
          <SectionLabel>Featured Work</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#f2f2f2]">
            Projects that ship.
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-[#888888]">
            Each project is a system built with intention — a real problem, an engineering approach,
            a measurable outcome.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-20 md:gap-28">
          {featured.map((project, i) => (
            <ScrollReveal
              key={project.id}
              direction={i % 2 === 0 ? 'left' : 'right'}
              delay={100}
            >
              <ProjectCard project={project} imageLeft={i % 2 === 0} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
