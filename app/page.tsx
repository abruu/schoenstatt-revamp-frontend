"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/hero-section"
import { CoursesSection } from "@/components/courses-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { BranchesSection } from "@/components/branches-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { EnhancedGallerySection } from "@/components/enhanced-gallery-section"
import { EnhancedGraduatesSection } from "@/components/enhanced-graduates-section"
import { EnhancedNewsSection } from "@/components/enhanced-news-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { LoadingScreen } from "@/components/common/loading-screen"
import { NoticeBoard } from "@/components/common/notice-board"
import { ScrollAnimations } from "@/components/common/scroll-animations"
import { GallerySection } from "@/components/gallery-section"
// import { GallerySection } from "@/components/gallery-section" // Empty component file
// Using EnhancedGallerySection instead which is already imported above

export default function HomePage() {
  // Handle hash navigation on component mount
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        // Wait for components to render
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        }, 500) // Increased delay to ensure all components are rendered
      }
    }

    // Handle initial load
    handleHashScroll()

    // Handle hash changes
    window.addEventListener("hashchange", handleHashScroll)

    return () => {
      window.removeEventListener("hashchange", handleHashScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <LoadingScreen />
      <ParticleBackground />
      <NoticeBoard />
      <ScrollAnimations />

      <div className="relative z-10">
        <Header />
        <main>
          <section id="home">
            <HeroSection />
          </section>
          <div className="container mx-auto px-4 space-y-32">
            <section id="courses" className="scroll-animate fade-up">
              <CoursesSection />
            </section>
            <section id="about" className="scroll-animate fade-up">
              <WhyChooseUsSection />
            </section>
            <section id="centers" className="scroll-animate fade-right">
              <BranchesSection />
            </section>
            <div className="scroll-animate fade-left">
              <TestimonialsSection />
            </div>
            {/* <section id="gallery">
              <EnhancedGallerySection />
            </section> */}
            <div>
              <EnhancedGraduatesSection />
            </div>
            <div>
              <EnhancedNewsSection />
            </div>
            <section id="gallery" className="scroll-animate fade-up"> <GallerySection /> </section>
            <section id="contact" className="scroll-animate fade-up">
              <ContactSection />
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
