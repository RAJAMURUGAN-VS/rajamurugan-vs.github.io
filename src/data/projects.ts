import { Project } from '@/types'

export interface ProjectCard {
  icon: string          // lucide icon name
  title: string
  subtitle: string
  tags: string[]
  outcome: string
  metrics: { label: string; value: string }[]
  accentHex: string
}

export interface FeaturedProject {
  id: string
  tabLabel: string
  shortLabel?: string
  panelLabel: string
  heading: string
  body: string
  bullets: string[]
  ctaText: string
  ctaHref: string
  imageUrl?: string
  cards: ProjectCard[]
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
    cards: [
      {
        icon: 'FileSearch',
        title: 'Document Intelligence',
        subtitle: 'PaddleOCR pipeline extracts structured data from unstructured claim documents.',
        tags: ['PaddleOCR', 'ICD/CPT', 'NLP'],
        outcome: 'Patient, prescription, and diagnosis data extracted in under 2 seconds.',
        metrics: [{ label: 'Accuracy', value: '97%+' }, { label: 'Extraction', value: 'Real-time' }],
        accentHex: '#0058BE',
      },
      {
        icon: 'GitMerge',
        title: 'Agent Orchestration',
        subtitle: 'LangGraph pipeline routes claims through specialist agents for validation and fraud detection.',
        tags: ['LangGraph', 'Multi-Agent', 'LLM'],
        outcome: 'End-to-end claim decision without human-in-the-loop for clean submissions.',
        metrics: [{ label: 'Pipeline', value: '5 Agents' }, { label: 'Decision', value: 'Automated' }],
        accentHex: '#0077B6',
      },
      {
        icon: 'ShieldCheck',
        title: 'Fraud Detection',
        subtitle: 'Dedicated fraud agent flags anomalous billing patterns before approval.',
        tags: ['Anomaly Detection', 'Rules Engine', 'Audit'],
        outcome: 'Full audit trail with explainable AI rationale for every decision.',
        metrics: [{ label: 'Audit Trail', value: 'Complete' }, { label: 'Explainability', value: 'LLM' }],
        accentHex: '#0096C7',
      },
      {
        icon: 'Database',
        title: 'FHIR Data Layer',
        subtitle: 'Structured output conforms to FHIR standards for downstream EHR integration.',
        tags: ['FHIR', 'PostgreSQL', 'MongoDB'],
        outcome: 'Interoperable structured output ready for EHR integration.',
        metrics: [{ label: 'Standard', value: 'FHIR R4' }, { label: 'Storage', value: 'Dual DB' }],
        accentHex: '#023E8A',
      },
    ],
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
    cards: [
      {
        icon: 'Users',
        title: 'Role-Based Dashboards',
        subtitle: 'Separate portals for students, faculty, HODs, and admins with scoped permissions.',
        tags: ['RBAC', 'Multi-role', 'Auth'],
        outcome: 'Zero cross-role data leakage with permission-scoped API layer.',
        metrics: [{ label: 'Roles', value: '4' }, { label: 'Auth', value: 'JWT + RBAC' }],
        accentHex: '#0058BE',
      },
      {
        icon: 'Zap',
        title: 'Real-time Notifications',
        subtitle: 'Redis pub/sub delivers approval status updates instantly across all user roles.',
        tags: ['Redis', 'Pub/Sub', 'WebSocket'],
        outcome: 'Sub-100ms notification delivery for all workflow state changes.',
        metrics: [{ label: 'Latency', value: '<100ms' }, { label: 'Channel', value: 'Redis' }],
        accentHex: '#0077B6',
      },
      {
        icon: 'FileText',
        title: 'AI Resume Generator',
        subtitle: 'LLM-powered resume generation from student academic and project records.',
        tags: ['OpenAI', 'PDF Export', 'Templates'],
        outcome: 'Structured resume generated from student profile in one click.',
        metrics: [{ label: 'Generation', value: 'One-click' }, { label: 'Format', value: 'PDF + JSON' }],
        accentHex: '#0096C7',
      },
      {
        icon: 'Search',
        title: 'Scholar Pipeline',
        subtitle: 'SerpAPI + Google Scholar integration builds faculty publication profiles automatically.',
        tags: ['SerpAPI', 'Scholar', 'Concurrency'],
        outcome: 'Faculty portfolios auto-populated from public academic records.',
        metrics: [{ label: 'Sources', value: 'Multi-API' }, { label: 'Merge', value: 'Conflict-aware' }],
        accentHex: '#023E8A',
      },
    ],
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
    cards: [
      {
        icon: 'Brain',
        title: 'Persona Injection',
        subtitle: 'Dynamic system prompt construction adapts the assistant\'s behavior per domain context.',
        tags: ['Prompting', 'Persona', 'LLM'],
        outcome: 'Assistant tone and depth shift seamlessly between domains.',
        metrics: [{ label: 'Personas', value: 'Dynamic' }, { label: 'Strategy', value: 'System Prompt' }],
        accentHex: '#0058BE',
      },
      {
        icon: 'MessageSquare',
        title: 'Context Management',
        subtitle: 'Sliding window + summarisation keeps long conversations coherent without token overflow.',
        tags: ['Context Window', 'Summarisation', 'Memory'],
        outcome: 'Coherent multi-turn conversations across 100+ message threads.',
        metrics: [{ label: 'Window', value: 'Sliding' }, { label: 'Memory', value: 'Summarised' }],
        accentHex: '#0077B6',
      },
      {
        icon: 'Wifi',
        title: 'Streaming Responses',
        subtitle: 'Token-by-token streaming via SSE gives users instant feedback as the model generates.',
        tags: ['SSE', 'Streaming', 'FastAPI'],
        outcome: 'Perceived latency near zero — first token in under 300ms.',
        metrics: [{ label: 'First Token', value: '<300ms' }, { label: 'Transport', value: 'SSE' }],
        accentHex: '#0096C7',
      },
      {
        icon: 'Layout',
        title: 'Embeddable Widget',
        subtitle: 'Ships as a standalone app or an iframe-embeddable widget with a single config object.',
        tags: ['Widget', 'Embed', 'TypeScript'],
        outcome: 'Drop-in deployment to any site with one script tag.',
        metrics: [{ label: 'Deploy Mode', value: 'Widget / App' }, { label: 'Config', value: 'Single Object' }],
        accentHex: '#023E8A',
      },
    ],
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
