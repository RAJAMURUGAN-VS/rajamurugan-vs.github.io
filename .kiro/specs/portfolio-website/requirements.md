# Requirements Document

## Introduction

This document defines requirements for a world-class personal portfolio website for Rajamurugan VS, a Full Stack Developer & GenAI Engineer. The portfolio is a motion-rich, recruiter-optimized single-page application inspired by LangChain's design philosophy. It uses a near-monochrome dark aesthetic with an electric cyan accent, built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. The primary conversion goal is for recruiters to form a strong impression within 8 seconds and take action (contact or download resume) within 90 seconds.

## Glossary

- **Portfolio_Site**: The Next.js 14 single-page application described in this document
- **Visitor**: Any person who loads the portfolio website in a browser
- **Recruiter**: A Visitor whose primary goal is evaluating Rajamurugan VS for a role or internship
- **Section**: A distinct full-width content block within the single-page layout
- **Scroll_Reveal**: An animation that triggers when a Section enters the viewport
- **Marquee**: A continuously auto-scrolling horizontal strip of logos/text
- **Hero**: The first full-viewport Section visible on page load
- **CTA**: Call-to-action button or link (e.g., "Hire Me", "Send Message", "Download Resume")
- **Design_Token**: A named CSS custom property or Tailwind config value representing a design decision
- **Reduced_Motion**: The `prefers-reduced-motion: reduce` CSS media query preference
- **App_Router**: Next.js 14 App Router architecture using the `app/` directory
- **LCP**: Largest Contentful Paint — a Core Web Vitals performance metric
- **CLS**: Cumulative Layout Shift — a Core Web Vitals performance metric
- **FCP**: First Contentful Paint — a Core Web Vitals performance metric

---

## Requirements

### Requirement 1: Design System and Visual Identity

**User Story:** As a Visitor, I want the site to have a consistent, polished visual identity, so that I immediately perceive Rajamurugan VS as a professional, high-caliber engineer.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use `#080808` as the primary background color across all Sections.
2. THE Portfolio_Site SHALL use `#6EE7F7` (electric cyan) as the sole accent color for interactive elements, highlights, and CTAs.
3. THE Portfolio_Site SHALL apply Syne as the display/hero typeface, DM Sans as the body typeface, and JetBrains Mono as the code/monospaced typeface.
4. THE Portfolio_Site SHALL define all spacing using a 4px base unit system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px).
5. THE Portfolio_Site SHALL define border radius tokens: 4px (subtle), 8px (card), 12px (large card), 9999px (pill/full-round).
6. THE Portfolio_Site SHALL define a typographic scale with hero text at 80–96px, section headings at 48–64px, subsection headings at 32–40px, body text at 16–18px, and captions at 12px.
7. THE Portfolio_Site SHALL implement all Design_Tokens as CSS custom properties referenced throughout the codebase.

---

### Requirement 2: Availability Banner

**User Story:** As a Recruiter, I want to immediately see Rajamurugan VS's availability status, so that I know right away whether to pursue outreach.

#### Acceptance Criteria

1. WHEN the Portfolio_Site loads, THE Portfolio_Site SHALL display a dismissible top banner reading "Currently open to internships" (or equivalent availability message).
2. WHEN a Visitor clicks the dismiss button on the banner, THE Portfolio_Site SHALL hide the banner and reclaim the vertical space without layout shift.
3. THE Portfolio_Site SHALL display a pulsing green dot or equivalent visual indicator alongside the availability text to signal active status.

---

### Requirement 3: Navigation

**User Story:** As a Visitor, I want a clear, accessible navigation bar, so that I can jump to any Section of the portfolio instantly.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a fixed-position navigation bar that remains visible throughout the entire scroll experience.
2. WHEN the Visitor has not scrolled (scroll position = 0), THE Portfolio_Site SHALL render the navigation bar with a fully transparent background.
3. WHEN the Visitor scrolls beyond 50px from the top, THE Portfolio_Site SHALL transition the navigation bar background to a dark, opaque style within 300ms.
4. THE Portfolio_Site SHALL include a "Hire Me" CTA button in the navigation bar styled with the accent color.
5. THE Portfolio_Site SHALL include anchor links in the navigation bar for each major Section.
6. WHEN a navigation anchor link is clicked, THE Portfolio_Site SHALL smooth-scroll to the target Section using Lenis smooth scroll.

---

### Requirement 4: Hero Section

**User Story:** As a Visitor, I want an impactful, animated hero that instantly communicates who Rajamurugan VS is and what he offers, so that I understand his value within seconds of landing on the page.

#### Acceptance Criteria

1. THE Hero SHALL occupy 100% of the viewport height on initial load.
2. WHEN the Hero loads, THE Portfolio_Site SHALL animate the headline text word-by-word (each word fading and translating into view sequentially).
3. THE Hero SHALL display Rajamurugan VS's name, role ("Full Stack Developer & GenAI Engineer"), and a value proposition statement.
4. THE Hero SHALL include two CTAs: a primary "View Projects" CTA and a secondary "Download Resume" CTA.
5. WHEN a Visitor moves the mouse over the Hero, THE Portfolio_Site SHALL apply a subtle parallax effect to the hero background or decorative elements.
6. WHERE the Visitor's device supports pointer events, THE Portfolio_Site SHALL enable the mouse parallax effect on the Hero.

---

### Requirement 5: Tech Credibility Marquee

**User Story:** As a Recruiter, I want to see a quick overview of Rajamurugan VS's tech stack and institutional affiliations, so that I can rapidly assess his background.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a continuously auto-scrolling horizontal Marquee strip immediately below the Hero.
2. THE Marquee SHALL scroll infinitely without interruption using a CSS animation (not JavaScript-driven frame updates).
3. THE Marquee SHALL display logos or text labels for technologies and institutions (e.g., Next.js, Python, AWS, university name).
4. WHEN a Visitor hovers over the Marquee, THE Portfolio_Site SHALL pause the scrolling animation.
5. THE Marquee SHALL contain a duplicate set of items to ensure seamless looping with no visible gap.

---

### Requirement 6: Featured Projects Section

**User Story:** As a Recruiter, I want to see Rajamurugan VS's most impressive projects with clear context, so that I can evaluate the depth and breadth of his technical work.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display 3 to 4 featured projects in the Projects Section.
2. THE Portfolio_Site SHALL lay out projects in alternating left-right rows (odd rows: image left, text right; even rows: text left, image right).
3. WHEN a project row enters the viewport, THE Portfolio_Site SHALL trigger a horizontal slide-in animation (left-origin for odd rows, right-origin for even rows).
4. EACH project entry SHALL display a project title, short description, tech stack badges, and links to a live demo and/or GitHub repository.
5. WHEN a Visitor hovers over a project card, THE Portfolio_Site SHALL apply a `translateY(-4px)` lift animation.
6. THE Portfolio_Site SHALL source all project data from a TypeScript data file (`src/data/projects.ts`) rather than hardcoded JSX.

---

### Requirement 7: GenAI Progression Arc Section

**User Story:** As a Recruiter specializing in AI/ML roles, I want to see a visual narrative of Rajamurugan VS's journey through AI and GenAI tools, so that I can assess his depth and trajectory in the field.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a dedicated GenAI Progression Arc Section that visually communicates progression through AI and GenAI tools and concepts.
2. THE GenAI Progression Arc SHALL display milestones or stages in a visually distinct layout (e.g., connected timeline or staged cards).
3. WHEN each GenAI Progression Arc element enters the viewport, THE Portfolio_Site SHALL trigger a Scroll_Reveal animation.
4. THE Portfolio_Site SHALL source all GenAI progression data from a TypeScript data file.

---

### Requirement 8: Impact Stats Section

**User Story:** As a Recruiter, I want to see quantified achievements at a glance, so that I can quickly understand the scale of Rajamurugan VS's impact.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display an Impact Stats Section containing at minimum: number of problems solved, hackathons participated in, internships completed, and projects shipped.
2. WHEN the Impact Stats Section enters the viewport, THE Portfolio_Site SHALL animate each stat value from 0 to its final number (count-up animation).
3. THE count-up animation SHALL complete within 1500ms of the Section entering the viewport.
4. THE Portfolio_Site SHALL source all stat values from a TypeScript data file (`src/data/stats.ts`).

---

### Requirement 9: Skills Section

**User Story:** As a Recruiter, I want to see Rajamurugan VS's skills organized by domain, so that I can quickly assess his fit for a specific role.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a Skills Section that organizes skills into named domain groups (e.g., "Frontend", "Backend", "AI/ML", "DevOps").
2. THE Skills Section SHALL NOT organize skills alphabetically.
3. EACH skill item SHALL be displayed as a Badge component with consistent styling.
4. THE Portfolio_Site SHALL source all skills data from a TypeScript data file (`src/data/skills.ts`).

---

### Requirement 10: About Section

**User Story:** As a Visitor, I want a concise personal statement, so that I can understand who Rajamurugan VS is beyond his technical resume.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render an About Section containing a short personal statement from Rajamurugan VS.
2. THE About Section SHALL be concise (no more than 3–4 short paragraphs or equivalent).

---

### Requirement 11: Timeline Section

**User Story:** As a Recruiter, I want to see Rajamurugan VS's education and key milestones in chronological order, so that I can understand his background and trajectory.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a vertical Timeline Section displaying education history and key career milestones.
2. EACH Timeline entry SHALL display a date/period, title, institution/organization, and brief description.
3. WHEN each Timeline entry enters the viewport, THE Portfolio_Site SHALL trigger a Scroll_Reveal animation.
4. THE Portfolio_Site SHALL source all timeline data from a TypeScript data file (`src/data/timeline.ts`).

---

### Requirement 12: Certifications Section

**User Story:** As a Recruiter, I want to see Rajamurugan VS's certifications, so that I can verify his formal credentials in key areas.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a Certifications Section as a card grid.
2. EACH certification card SHALL display the certification name, issuing organization, and date obtained.
3. WHEN a Visitor hovers over a certification card, THE Portfolio_Site SHALL apply a card hover lift animation (`translateY(-4px)`).
4. THE Portfolio_Site SHALL source all certification data from a TypeScript data file (`src/data/certifications.ts`).

---

### Requirement 13: Contact / Final CTA Section

**User Story:** As a Recruiter, I want a clear, compelling final call-to-action, so that I know exactly how to reach Rajamurugan VS and feel motivated to do so.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a Contact Section with the heading "Let's Build Something" (or equivalent compelling CTA headline).
2. THE Contact Section SHALL include a "Send Message" CTA button and a "Download Resume" CTA button.
3. WHEN a Visitor clicks "Download Resume", THE Portfolio_Site SHALL trigger a file download of Rajamurugan VS's resume PDF.
4. THE Contact Section SHALL include Rajamurugan VS's email address and links to social profiles (LinkedIn, GitHub).

---

### Requirement 14: Footer

**User Story:** As a Visitor, I want a clean footer with quick social access, so that I can easily find Rajamurugan VS's profiles without scrolling back up.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a Footer with Rajamurugan VS's name on the left, social profile links in the center, and a "Built with Next.js" attribution on the right.
2. THE Footer SHALL be visually simple and not compete with Section content for attention.

---

### Requirement 15: Animation System

**User Story:** As a Visitor, I want smooth, purposeful animations throughout the site, so that the experience feels premium and polished.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL implement Scroll_Reveal animations using opacity 0→1 and translateY 30px→0, with 600ms duration and ease-out exponential easing.
2. WHEN multiple child elements animate in sequence, THE Portfolio_Site SHALL apply a stagger delay of 80–120ms between each child.
3. THE Portfolio_Site SHALL implement all non-Marquee animations using Framer Motion.
4. THE Portfolio_Site SHALL implement the Marquee animation using CSS keyframe animation (not JavaScript frame updates).
5. ALL GPU-composited properties (transform, opacity) SHALL be used for animations to avoid layout thrashing.
6. IF a Visitor has `prefers-reduced-motion: reduce` set, THEN THE Portfolio_Site SHALL disable or minimize all motion animations while preserving functionality and layout.

---

### Requirement 16: Performance

**User Story:** As a Visitor, I want the portfolio to load instantly, so that I'm not waiting and my first impression is positive.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL achieve a Largest Contentful Paint (LCP) of less than 1.5 seconds on a simulated fast 3G connection.
2. THE Portfolio_Site SHALL achieve a Cumulative Layout Shift (CLS) score below 0.05.
3. THE Portfolio_Site SHALL achieve a First Contentful Paint (FCP) of less than 0.8 seconds on a simulated fast 3G connection.
4. THE Portfolio_Site SHALL self-host all fonts (Syne, DM Sans, JetBrains Mono) using `next/font` to eliminate render-blocking font requests.
5. THE Portfolio_Site SHALL use `next/image` with explicit `width` and `height` attributes for all images to prevent layout shift.
6. THE Portfolio_Site SHALL use GPU-composited CSS properties (transform, opacity) exclusively for animations, avoiding properties that trigger layout recalculation.

---

### Requirement 17: Accessibility

**User Story:** As a Visitor using assistive technologies, I want the portfolio to be navigable and readable, so that I'm not excluded from the experience.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL provide descriptive `alt` text for all non-decorative images.
2. THE Portfolio_Site SHALL maintain a minimum color contrast ratio of 4.5:1 for all body text against its background.
3. THE Portfolio_Site SHALL ensure all interactive elements (buttons, links) are keyboard-focusable and have visible focus indicators.
4. THE Portfolio_Site SHALL use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`, `<h1>`–`<h6>`) throughout.
5. IF a Visitor has `prefers-reduced-motion: reduce` set, THEN THE Portfolio_Site SHALL respect that preference as specified in Requirement 15.6.

---

### Requirement 18: Responsiveness

**User Story:** As a Visitor on a mobile device, I want the portfolio to look and work great on my screen, so that I have a full experience regardless of device.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL be fully responsive across viewport widths from 320px to 2560px.
2. THE Portfolio_Site SHALL use a mobile-first Tailwind CSS breakpoint strategy.
3. WHEN rendered on mobile viewports (< 768px), THE Portfolio_Site SHALL display project rows in a single-column stacked layout instead of alternating two-column rows.
4. WHEN rendered on mobile viewports (< 768px), THE Portfolio_Site SHALL collapse the navigation into a hamburger menu or equivalent mobile-friendly pattern.

---

### Requirement 19: Tech Stack and Architecture

**User Story:** As a developer maintaining the portfolio, I want a well-structured codebase, so that updates are easy to make without introducing regressions.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL be implemented using Next.js 14 with the App Router and TypeScript.
2. THE Portfolio_Site SHALL use Tailwind CSS v3 for utility-based styling.
3. THE Portfolio_Site SHALL use Framer Motion for all component-level animations (excluding the Marquee).
4. THE Portfolio_Site SHALL integrate Lenis for smooth scroll behavior.
5. THE Portfolio_Site SHALL use Lucide React for all iconography.
6. THE Portfolio_Site SHALL follow the folder architecture: `src/app/`, `src/components/ui/`, `src/components/layout/`, `src/components/shared/`, `src/sections/`, `src/animations/`, `src/hooks/`, `src/data/`, `src/types/`, `src/lib/`.
7. THE Portfolio_Site SHALL store all content (projects, skills, timeline, certifications, stats) in TypeScript data files under `src/data/`, not as hardcoded JSX strings.
