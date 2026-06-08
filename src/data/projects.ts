import { Project } from '@/types'

export interface FeaturedProject {
  id: string
  tabLabel: string
  shortLabel?: string       // mobile-shortened tab label
  panelLabel: string
  heading: string
  body: string
  bullets: string[]
  ctaText: string
  ctaHref: string
  imageUrl?: string         // optional — shows placeholder if missing
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'aegisclaim',
    tabLabel: 'AegisClaim',
    shortLabel: 'Aegis',
    panelLabel: 'MULTI-AGENT AI',
    heading: 'Automate prior authorization end to end',
    body: 'Health insurance prior authorization is one of the most friction-heavy processes in healthcare — manual, slow, and error-prone. AegisClaim replaces that with a LangGraph-orchestrated multi-agent pipeline that processes claims from raw document to final decision in seconds.',
    bullets: [
      'PaddleOCR document intelligence pipeline extracts patient, ICD/CPT, and prescription data',
      'LangGraph agents: OCR → clarification → policy validation → fraud detection → decision',
      'FHIR-style structured output with full audit trail',
      'Explainable AI decisions with LLM-generated claim summaries',
      'FastAPI backend · MongoDB + PostgreSQL · Redis · Docker',
    ],
    ctaText: 'View case study',
    ctaHref: '/projects/aegisclaim',
    imageUrl: '/images/projects/aegisclaim.jpg',
  },
  {
    id: 'campusflow',
    tabLabel: 'CampusFlow',
    shortLabel: 'Campus',
    panelLabel: 'FULL STACK PLATFORM',
    heading: 'One platform for every campus workflow',
    body: 'Academic approval processes — OD requests, leave, faculty portfolios — were scattered across emails and paper. CampusFlow centralizes everything into a role-based workflow system with real-time notifications, audit logging, and AI-powered resume generation.',
    bullets: [
      'Multi-role modules: students, faculty, HODs, admins — separate dashboards per role',
      'SerpAPI + Google Scholar pipeline with concurrency control and conflict-aware data merging',
      'AI-powered resume generation built into the student portal',
      'Real-time notifications with Redis pub/sub',
      'React + TypeScript · Node.js · PostgreSQL · Prisma · Tailwind CSS',
    ],
    ctaText: 'View case study',
    ctaHref: '/projects/campusflow',
    imageUrl: '/images/projects/campusflow.jpg',
  },
  {
    id: 'infinix',
    tabLabel: 'Infinix',
    shortLabel: 'Infinix',
    panelLabel: 'CONVERSATIONAL AI',
    heading: 'An AI assistant that adapts to its domain',
    body: 'Most chatbots have one fixed personality. Infinix switches persona, context depth, and response style based on the domain it\'s operating in — making it genuinely useful across different use cases, not just technically capable.',
    bullets: [
      'Dynamic persona injection via system prompting strategies',
      'Context window management across long multi-turn conversations',
      'Streaming responses with real-time token rendering',
      'React + TypeScript frontend · FastAPI backend',
      'Deployable as an embeddable widget or standalone app',
    ],
    ctaText: 'View case study',
    ctaHref: '/projects/infinix',
    imageUrl: '/images/projects/infinix.jpg',
  },
]

// Legacy projects array kept for any other consumers
export const projects: Project[] = [
  {
    id: 'aegisclaim',
    title: 'AegisClaim',
    description: 'LangGraph-orchestrated multi-agent pipeline for insurance prior authorization. Processes claims from raw document to final decision in seconds.',
    techStack: ['FastAPI', 'LangGraph', 'OpenAI API', 'PostgreSQL', 'Redis', 'Docker'],
    imageUrl: '/images/projects/aegisclaim.jpg',
    githubUrl: 'https://github.com/rajamuruganvs/aegisclaim',
    featured: true,
  },
  {
    id: 'campusflow',
    title: 'CampusFlow',
    description: 'Role-based campus management platform with real-time notifications and AI-powered resume generation.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis'],
    imageUrl: '/images/projects/campusflow.jpg',
    githubUrl: 'https://github.com/rajamuruganvs/campusflow',
    featured: true,
  },
  {
    id: 'infinix',
    title: 'Infinix',
    description: 'Domain-adaptive conversational AI assistant with dynamic persona injection and streaming responses.',
    techStack: ['React', 'TypeScript', 'FastAPI', 'OpenAI API'],
    imageUrl: '/images/projects/infinix.jpg',
    githubUrl: 'https://github.com/rajamuruganvs/infinix',
    featured: false,
  },
]
