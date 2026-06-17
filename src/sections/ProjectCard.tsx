'use client'
import React from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types'

function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

interface ProjectCardProps {
  project: Project
  imageLeft?: boolean
}

export default function ProjectCard({ project, imageLeft = true }: ProjectCardProps) {
  const [imgError, setImgError] = React.useState(false)

  // FIX: Replace motion.article whileHover with CSS transition on a plain article.
  // Root cause of the first-load glitch: Framer Motion's whileHover initializes
  // its gesture state on mount, which triggers a brief layout recalculation that
  // causes the card to visually jump (translateY flicker) before settling.
  // CSS transform transitions don't have this initialization cost — they only
  // activate on actual pointer events, so there is zero first-paint side effect.
  return (
    <article className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center group/card">

      {/* Image */}
      <div className={`${imageLeft ? 'md:order-1' : 'md:order-2'} order-1`}>
        <div
          // FIX: The hover lift is now pure CSS — no JS involved on mount.
          // transition-transform with will-change keeps it GPU-composited.
          className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-[#ffffff14] bg-[#111111] transition-transform duration-200 ease-out group-hover/card:-translate-y-1"
          style={{ willChange: 'transform' }}
        >
          {!imgError ? (
            <Image
              src={project.imageUrl}
              alt={`Screenshot of ${project.title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0f0f0f 100%)',
              }}
            >
              <span className="text-4xl font-display font-bold text-[#333333]">
                {project.title[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`${imageLeft ? 'md:order-2' : 'md:order-1'} order-2 flex flex-col gap-4`}>
        <h3 className="font-display text-[clamp(22px,3vw,32px)] font-bold text-[#f2f2f2]">
          {project.title}
        </h3>
        <p className="text-[16px] leading-[1.7] text-[#888888]">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} label={tech} />
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-[#a5f0fa] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#e8e8e8] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <GitHubIcon size={14} />
              Source Code
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
