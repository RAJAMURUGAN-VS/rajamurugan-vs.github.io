import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { SITE_META } from '@/lib/constants'
import { Mail } from 'lucide-react'

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 py-32 md:px-12 md:py-40 bg-[#080808] text-center"
    >
      <div className="max-w-2xl mx-auto">
        <ScrollReveal direction="up">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-accent">
            Get in Touch
          </p>
          <h2 className="font-display text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.05] text-[#f2f2f2]">
            Let&apos;s Build
            <br />
            <span className="text-accent">Something.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="mt-6 text-[17px] leading-[1.7] text-[#888888]">
            I&apos;m currently open to internships, collaborations, and interesting projects.
            If you have something worth building, I want to hear about it.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              href={`mailto:${SITE_META.email}`}
              variant="primary"
              size="lg"
            >
              Send a Message
            </Button>
            <Button
              href="/resume.pdf"
              variant="secondary"
              size="lg"
              download
            >
              Download Resume
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={450}>
          <div className="mt-12 flex items-center justify-center gap-6 text-[#555555]">
            <a
              href={`mailto:${SITE_META.email}`}
              className="inline-flex items-center gap-2 text-sm hover:text-[#888888] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <Mail size={15} />
              {SITE_META.email}
            </a>
            <a
              href={SITE_META.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="hover:text-[#888888] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-1"
            >
              <GitHubIcon size={18} />
            </a>
            <a
              href={SITE_META.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="hover:text-[#888888] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-1"
            >
              <LinkedInIcon size={18} />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
