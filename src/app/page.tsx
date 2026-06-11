import Hero from '@/sections/Hero'
import TechMarquee from '@/sections/TechMarquee'
import FeaturedProjects from '@/sections/FeaturedProjects'
import ReactJourney from '@/sections/ReactJourney'
import BuildHistory from '@/sections/BuildHistory'
import GenAIJourney from '@/sections/GenAIJourney'
import ImpactStats from '@/sections/ImpactStats'
import Skills from '@/sections/Skills'
import About from '@/sections/About'
import Timeline from '@/sections/Timeline'
import Certifications from '@/sections/Certifications'
import Contact from '@/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <TechMarquee />
      <FeaturedProjects />
      <ReactJourney />
      <BuildHistory />
      <GenAIJourney />
      <ImpactStats />
      <Skills />
      <About />
      <Timeline />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  )
}
