"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { AboutPageContent } from "@/components/about-page-content"
import { ScrollAnimations } from "@/components/common/scroll-animations"

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
