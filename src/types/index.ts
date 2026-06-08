export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  imageUrl: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export interface SkillDomain {
  domain: string
  skills: string[]
}

export interface TimelineEntry {
  period: string
  title: string
  organization: string
  description: string
  type: 'education' | 'milestone'
}

export interface Certification {
  name: string
  issuer: string
  date: string  // ISO date string "YYYY-MM"
  credentialUrl?: string
}

export interface StatItem {
  label: string
  value: number
  suffix?: string
}

export interface GenAIStage {
  stage: number
  title: string
  description: string
  tools: string[]
}

export interface MarqueeItem {
  label: string
  logoUrl?: string
}
