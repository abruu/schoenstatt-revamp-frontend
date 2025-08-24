"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { AboutPageContent } from "@/components/about-page-content"
import { ScrollAnimations } from "@/components/common/scroll-animations"

export const metadata = {
  title: 'About SLA - Premier German Language Institute in Kerala',
  description: 'Discover Schoenstatt Language Academy\'s mission to provide world-class German education in Kerala. Telc certified center with expert faculty and proven methodology.',
  keywords: 'German language institute Kerala, Schoenstatt Language Academy history, German language faculty Kerala, Telc certified center India',
  openGraph: {
    title: 'About Schoenstatt Language Academy - German Education Excellence',
    description: 'Learn about Kerala\'s leading German language institute. Our mission, vision, and commitment to student success.',
    images: ['/og/about-sla-team.jpg']
  },
  alternates: { canonical: '/about' }
}

export default function AboutPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      <ScrollAnimations />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <AboutPageContent />
        </main>
        <Footer />
      </div>
    </div>
  )
}
