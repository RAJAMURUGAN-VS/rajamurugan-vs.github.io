import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Card } from '@/components/ui/Card'
import { certifications } from '@/data/certifications'
import { ExternalLink } from 'lucide-react'

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function Certifications() {
  if (!certifications.length) return null

  return (
    <section id="certifications" className="px-6 py-24 md:px-12 md:py-32 bg-[#111111]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16">
          <SectionLabel>Credentials</SectionLabel>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-bold text-[#f2f2f2]">
            Certified. Verified.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, i) => (
            <ScrollReveal key={cert.name} delay={i * 80} direction="up">
              <Card className="h-full flex flex-col gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#555555]">
                    {cert.issuer}
                  </p>
                  <h3 className="font-display text-[15px] font-semibold text-[#f2f2f2] leading-[1.4]">
                    {cert.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <time
                    dateTime={cert.date}
                    className="text-[12px] text-[#555555]"
                  >
                    {formatDate(cert.date)}
                  </time>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View credential for ${cert.name}`}
                      className="text-accent hover:text-[#a5f0fa] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
