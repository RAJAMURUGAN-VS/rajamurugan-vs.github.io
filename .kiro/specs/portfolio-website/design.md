# Design Document: Portfolio Website

## Overview

This document describes the technical design for Rajamurugan VS's personal portfolio website. The site is a single-page, scroll-driven application built with Next.js 14 (App Router), TypeScript, Tailwind CSS v3, and Framer Motion. It targets recruiters as the primary audience, prioritizing fast load times, polished motion, and clear conversion pathways. The design follows LangChain's near-monochrome dark aesthetic with a single electric cyan accent color.

The architecture is deliberately simple: one page (`app/page.tsx`) that composes all Sections in order, with all content sourced from typed data files. There is no backend, no CMS, and no database — just static generation at build time, deployed to Vercel.

---

## Architecture

### Rendering Strategy

The site uses Next.js 14 App Router with **static generation** (default for pages with no dynamic data). All content lives in TypeScript data files, so the entire page is pre-rendered at build time to HTML. This delivers the lowest possible LCP and FCP.

```
Build time → Static HTML + JS bundle → Vercel Edge CDN → Visitor's browser
```

Client components (`"use client"`) are used only for:
- Interactive components (Nav scroll behavior, AvailabilityBanner dismiss, ContactForm)
- Animation components (Framer Motion requires client context)
- Hooks that read browser APIs (scroll position, mouse position, media queries)

Server components (default) are used for:
- Page layout
- Static content sections that don't need interactivity

### Smooth Scroll Integration

Lenis is initialized in a client-side provider component wrapped around the page layout. It intercepts native scroll events and replaces them with its own smooth interpolation, passing scroll data to Framer Motion's `useScroll` for scroll-linked animations.

```
app/layout.tsx
└── LenisProvider (client, wraps children)
    └── page.tsx (server, composes sections)
        └── [Section components]
```

### Font Loading

All three fonts are loaded via `next/font/google` in `app/layout.tsx`. They are injected as CSS custom properties (`--font-syne`, `--font-dm-sans`, `--font-jetbrains-mono`) and referenced in `tailwind.config.ts`. This eliminates FOUT and render-blocking requests.

```typescript
// app/layout.tsx
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })
```

---

## Components and Interfaces

### Component Hierarchy

```
app/
├── layout.tsx          → RootLayout (LenisProvider, font vars, global styles)
└── page.tsx            → Home (composes all Sections in order)

components/
├── ui/
│   ├── Button.tsx       → Polymorphic button with variant/size props
│   ├── Badge.tsx        → Small label for tech stack items
│   ├── Card.tsx         → Base card with hover lift
│   └── SectionLabel.tsx → Small eyebrow label above section headings
│
├── layout/
│   ├── Nav.tsx          → Fixed nav with scroll-triggered bg transition
│   ├── Footer.tsx       → Simple footer (name | socials | built-with)
│   └── AvailabilityBanner.tsx → Dismissible top banner
│
└── shared/
    ├── AnimatedText.tsx  → Word-by-word text animation
    ├── CountUp.tsx       → Intersection-triggered count-up number
    ├── Marquee.tsx       → CSS-driven infinite scroll strip
    └── ScrollReveal.tsx  → Intersection-triggered fade+translateY wrapper

sections/
├── Hero.tsx
├── TechMarquee.tsx
├── Projects.tsx
├── ProjectCard.tsx
├── GenAIJourney.tsx
├── ImpactStats.tsx
├── Skills.tsx
├── About.tsx
├── Timeline.tsx
├── Certifications.tsx
└── Contact.tsx
```

### Key Component Interfaces

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  href?: string          // renders as <a> if provided
  download?: boolean     // triggers file download
  children: React.ReactNode
  className?: string
}

// components/ui/Badge.tsx
interface BadgeProps {
  label: string
  variant?: 'default' | 'accent'
}

// components/shared/ScrollReveal.tsx
interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number         // stagger offset in ms (default 0)
  direction?: 'up' | 'left' | 'right'  // translateY or translateX origin
  className?: string
}

// components/shared/AnimatedText.tsx
interface AnimatedTextProps {
  text: string           // full string; split on spaces into words
  className?: string
  staggerDelay?: number  // ms between each word (default 80)
}

// components/shared/CountUp.tsx
interface CountUpProps {
  end: number
  duration?: number      // ms, default 1500
  suffix?: string        // e.g. "+" or "x"
}

// components/shared/Marquee.tsx
interface MarqueeProps {
  items: MarqueeItem[]
  speed?: number         // animation-duration in seconds (default 30)
}

interface MarqueeItem {
  label: string
  logo?: string          // path to logo image (optional)
}
```

---

## Data Models

All content is defined in TypeScript files under `src/data/`. Components import these directly; there is no API layer.

```typescript
// src/types/index.ts

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
  domain: string          // e.g. "Frontend", "AI/ML"
  skills: string[]
}

export interface TimelineEntry {
  period: string          // e.g. "2021 – 2025"
  title: string
  organization: string
  description: string
  type: 'education' | 'milestone'
}

export interface Certification {
  name: string
  issuer: string
  date: string            // ISO date string "YYYY-MM"
  credentialUrl?: string
}

export interface StatItem {
  label: string
  value: number
  suffix?: string         // e.g. "+"
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
```

### Data Files

| File | Exports | Consumed by |
|---|---|---|
| `src/data/projects.ts` | `projects: Project[]` | `sections/Projects.tsx` |
| `src/data/skills.ts` | `skillDomains: SkillDomain[]` | `sections/Skills.tsx` |
| `src/data/timeline.ts` | `timelineEntries: TimelineEntry[]` | `sections/Timeline.tsx` |
| `src/data/certifications.ts` | `certifications: Certification[]` | `sections/Certifications.tsx` |
| `src/data/stats.ts` | `stats: StatItem[]` | `sections/ImpactStats.tsx` |
| `src/data/marquee.ts` | `marqueeItems: MarqueeItem[]` | `sections/TechMarquee.tsx` |
| `src/data/genai.ts` | `genAIStages: GenAIStage[]` | `sections/GenAIJourney.tsx` |

---

## Design System Implementation

### CSS Custom Properties (`globals.css`)

```css
:root {
  /* Colors */
  --color-bg:        #080808;
  --color-surface:   #111111;
  --color-border:    #1f1f1f;
  --color-text:      #e8e8e8;
  --color-muted:     #888888;
  --color-accent:    #6EE7F7;

  /* Fonts */
  --font-display:    var(--font-syne), sans-serif;
  --font-body:       var(--font-dm-sans), sans-serif;
  --font-mono:       var(--font-jetbrains-mono), monospace;

  /* Spacing (4px base) */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;
  --space-32: 128px;

  /* Border Radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-full: 9999px;

  /* Typography Scale */
  --text-hero:    clamp(56px, 8vw, 96px);
  --text-h1:      clamp(36px, 5vw, 64px);
  --text-h2:      clamp(28px, 4vw, 40px);
  --text-body-lg: 18px;
  --text-body:    16px;
  --text-caption: 12px;
}
```

### Tailwind Config Extension

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
    }
  }
}
```

---

## Animation System

### Framer Motion Variants (`src/animations/variants.ts`)

```typescript
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }  // expo ease-out
  }
}

export const slideInLeftVariant = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

export const slideInRightVariant = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }  // 100ms stagger
  }
}

export const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
}
```

### Reduced Motion

The `useReducedMotion` hook from Framer Motion is used in all animation components. When reduced motion is preferred, variants collapse to `{ hidden: {}, visible: {} }` (no visual change), preserving functionality.

```typescript
// components/shared/ScrollReveal.tsx
const prefersReducedMotion = useReducedMotion()
const activeVariant = prefersReducedMotion ? noMotionVariant : fadeUpVariant
```

### CSS Marquee Animation

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

### Intersection Observer via Framer Motion

`ScrollReveal` uses Framer Motion's `whileInView` prop with `viewport={{ once: true, margin: "-100px" }}` to trigger animations when elements enter the viewport. This avoids manual IntersectionObserver wiring.

### CountUp Implementation

`CountUp` uses `useInView` from Framer Motion to detect when the stat section enters the viewport, then starts a `requestAnimationFrame` loop that increments the displayed value using an easing function over the configured duration (default 1500ms).

### Nav Scroll Behavior

```typescript
// components/layout/Nav.tsx
const [scrolled, setScrolled] = useState(false)
useEffect(() => {
  const unsubscribe = lenis.on('scroll', ({ scroll }) => {
    setScrolled(scroll > 50)
  })
  return unsubscribe
}, [])
```

The nav background transitions from `transparent` to `bg-[#080808]/90 backdrop-blur-md` using a Tailwind class toggle, driven by `scrolled` state.

---

## Section Designs

### Hero

```
┌─────────────────────────────────────────────┐
│  [Decorative grid / noise texture bg]        │
│                                              │
│   Rajamurugan VS                             │  ← Syne, hero scale, accent color name
│   Full Stack Developer                       │  ← Animated word-by-word
│   & GenAI Engineer                           │
│                                              │
│   [Value proposition — 1 line]               │  ← DM Sans, muted color
│                                              │
│   [View Projects ▸]  [Download Resume ↓]     │  ← Primary + secondary Button
│                                              │
└─────────────────────────────────────────────┘
```

Mouse parallax is implemented with `useMousePosition` hook tracking `mousemove` on the hero section, applying `transform: translate(x * 0.02, y * 0.02)` to the decorative background layer.

### Projects (Alternating Layout)

```
Row 1 (odd):  [Image ────────] [Title, Desc, Badges, Links]
Row 2 (even): [Title, Desc, Badges, Links] [────────── Image]
Row 3 (odd):  [Image ────────] [Title, Desc, Badges, Links]
```

On mobile, both columns stack vertically (image on top, content below).

### GenAI Progression Arc

Displayed as a horizontal connected-stage layout on desktop, vertical on mobile. Each stage has a number indicator, title, description, and associated tool badges. Uses `ScrollReveal` with progressive stagger delays.

### Impact Stats

Four stat counters displayed in a 2×2 grid (mobile) or 4-column row (desktop). Each `CountUp` component is independently triggered when the section enters the viewport.

---

## Error Handling

### Missing Data Gracefully

All data arrays are typed and initialized with content. Components that render lists (`Projects`, `Skills`, etc.) render `null` if the array is empty rather than crashing. This prevents broken sections if data files are accidentally emptied.

### Image Load Failures

`next/image` components include `onError` handlers that swap to a placeholder gradient background, preventing broken image icons in the Projects and Certifications sections.

### Resume Download

The "Download Resume" button uses a standard `<a href="/resume.pdf" download>` pattern. If the file is missing, the browser navigates to a 404 — no special error handling is needed at the component level. The file's presence is a deployment responsibility.

### Lenis Initialization

Lenis is initialized inside a `useEffect` with proper cleanup (`lenis.destroy()` on unmount) to prevent memory leaks and double-initialization in React Strict Mode.

---

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific examples and edge cases with property-based tests for universal correctness properties. Both are necessary and complementary.

**Unit tests** cover:
- Specific rendering examples (correct HTML output for known data inputs)
- Edge cases (empty arrays, missing optional fields, zero stat values)
- Integration between data files and components

**Property-based tests** cover:
- Universal properties that should hold for any valid input data
- Animation variant correctness across arbitrary inputs
- Data transformation functions

### Testing Framework

- **Test runner**: Vitest
- **Component testing**: React Testing Library + jsdom
- **Property-based testing**: fast-check (TypeScript-native PBT library)
- **Minimum iterations per property test**: 100

Each property test is tagged with a comment referencing its design property:
```typescript
// Feature: portfolio-website, Property N: [property description]
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: AnimatedText word splitting

*For any* non-empty string passed to `AnimatedText`, the number of rendered word `<span>` elements should equal the number of whitespace-separated tokens in that string.

**Validates: Requirements 4.2**

---

### Property 2: Marquee item duplication

*For any* array of N marquee items, the rendered Marquee track should contain exactly 2N item elements (the original set plus one duplicate set) to ensure seamless looping.

**Validates: Requirements 5.5**

---

### Property 3: Project slide direction by index

*For any* array of projects rendered in the Projects section, the animation direction assigned to a project at index `i` should be `left` (slideInLeft) when `i` is even (0, 2, ...) and `right` (slideInRight) when `i` is odd (1, 3, ...).

**Validates: Requirements 6.3**

---

### Property 4: ProjectCard renders all required fields

*For any* `Project` object with valid title, description, techStack array, and at least one URL, the rendered `ProjectCard` should contain visible text matching the title, the description, each tech stack item as a badge, and at least one anchor link.

**Validates: Requirements 6.4**

---

### Property 5: CountUp reaches final value

*For any* integer `end` value ≥ 0 and a positive `duration`, the `CountUp` component should display a value of `end` once the animation duration has elapsed (simulated with fake timers).

**Validates: Requirements 8.2, 8.3**

---

### Property 6: Skills rendered as Badge components

*For any* array of `SkillDomain` objects, every skill string within every domain should be rendered inside a `Badge` component (identifiable by the badge test id or class).

**Validates: Requirements 9.3**

---

### Property 7: TimelineEntry renders all required fields

*For any* `TimelineEntry` object with a period, title, organization, and description, the rendered Timeline component should contain visible text matching all four fields.

**Validates: Requirements 11.2**

---

### Property 8: Certification card renders all required fields

*For any* `Certification` object with a name, issuer, and date, the rendered certification card should contain visible text matching all three fields.

**Validates: Requirements 12.2**

---

### Property 9: Reduced motion disables transforms

*For any* `ScrollReveal` component, when `useReducedMotion` returns `true`, the applied Framer Motion variant should have no `y`, `x`, or `opacity` transitions in its `hidden` state (i.e., `hidden` and `visible` states are visually identical).

**Validates: Requirements 15.6, 17.5**

---

### Property 10: Non-decorative images have non-empty alt text

*For any* `Project` object rendered in a `ProjectCard`, the `next/image` element should have a non-empty, non-placeholder `alt` attribute.

**Validates: Requirements 17.1**

---

## Error Handling

### Missing Data Gracefully

All data arrays are typed and initialized with content. Components that render lists (`Projects`, `Skills`, etc.) render `null` if the array is empty rather than crashing. This prevents broken sections if data files are accidentally emptied.

### Image Load Failures

`next/image` components include `onError` handlers that swap to a placeholder gradient background, preventing broken image icons in the Projects and Certifications sections.

### Resume Download

The "Download Resume" button uses a standard `<a href="/resume.pdf" download>` pattern. If the file is missing, the browser navigates to a 404 — no special error handling is needed at the component level. The file's presence is a deployment responsibility.

### Lenis Initialization

Lenis is initialized inside a `useEffect` with proper cleanup (`lenis.destroy()` on unmount) to prevent memory leaks and double-initialization in React Strict Mode.

---

## Testing Strategy

### Dual Testing Approach

Unit tests and property tests are complementary and both required.

**Unit tests** cover specific examples and edge cases:
- Design token values are correct (color hex codes, font families, spacing values)
- Nav renders with transparent background at scroll=0 and dark background at scroll>50
- AvailabilityBanner dismisses correctly on button click
- Hero renders both CTAs with correct labels
- Marquee has the `animation` CSS class applied to the track
- Resume download button has `href="/resume.pdf"` and `download` attribute
- `fadeUpVariant` has correct `opacity: 0, y: 30` hidden state and `duration: 0.6` visible transition
- `staggerContainer` has `staggerChildren` in range [0.08, 0.12]
- Color contrast ratio of `#e8e8e8` on `#080808` is ≥ 4.5:1
- Button components have `tabIndex` and `focus-visible` styling

**Property-based tests** cover universal correctness properties (Properties 1–10 above).

### Testing Framework

- **Test runner**: Vitest
- **Component testing**: React Testing Library + jsdom
- **Property-based testing**: fast-check (TypeScript-native PBT library)
- **Minimum iterations per property test**: 100

Each property test is tagged with a comment:
```typescript
// Feature: portfolio-website, Property N: [property description]
```

### Test File Organization

```
src/
└── __tests__/
    ├── unit/
    │   ├── design-tokens.test.ts
    │   ├── Nav.test.tsx
    │   ├── AvailabilityBanner.test.tsx
    │   ├── Hero.test.tsx
    │   ├── animations.test.ts
    │   └── accessibility.test.ts
    └── property/
        ├── AnimatedText.property.test.tsx
        ├── Marquee.property.test.tsx
        ├── Projects.property.test.tsx
        ├── CountUp.property.test.tsx
        ├── Skills.property.test.tsx
        ├── Timeline.property.test.tsx
        ├── Certifications.property.test.tsx
        ├── ScrollReveal.property.test.tsx
        └── Images.property.test.tsx
```
