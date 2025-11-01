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
import { OrganizationSchema, FAQSchema } from "@/components/seo/structured-data"
import { PageEffects } from "@/components/common/page-effects"
// import { GallerySection } from "@/components/gallery-section" // Empty component file
// Using EnhancedGallerySection instead which is already imported above

export const metadata = {
  title: 'German Language Courses Kerala | Schoenstatt Language Academy',
  description: 'Learn German in Kerala with certified instructors. A1-B2 courses, Telc certification, 95% success rate. Join 500+ students at SLA Thrissur, Chalakudy, Peravoor.',
  keywords: 'German language courses Kerala, German classes Thrissur, Telc certification India, German language academy, B2 German course',
  openGraph: {
    title: 'German Language Courses Kerala | Schoenstatt Language Academy',
    description: 'Premier German language institute in Kerala offering A1-B2 courses with Telc certification. Expert faculty, modern facilities, proven results.',
    images: ['/og/homepage-hero.jpg']
  },
  alternates: { canonical: '/' }
}

export default function HomePage() {

  const faqData = [
    {
      question: "How long does it take to complete B2 German course?",
      answer: "Our comprehensive program takes approximately 10 months, covering A1 (2 months), A2 (2 months), B1 (2 months), B2 (3 months), plus 1 month exam preparation."
    },
    {
      question: "Is Telc certification accepted in Germany?",
      answer: "Yes, Telc certification is internationally recognized and accepted by German universities, employers, and immigration authorities."
    },
    {
      question: "What is the success rate at SLA?",
      answer: "We maintain a 95% success rate with over 500 students successfully certified in German language proficiency."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <PageEffects handleHashNavigation={true} />
      <OrganizationSchema
        name="Schoenstatt Language Academy"
        description="Premier German language institute in Kerala offering A1-B2 courses with Telc certification"
        url="https://sla.schoenstatt-fathers.in"
        logo="https://sla.schoenstatt-fathers.in/logo.png"
        address={[
          {
            addressLocality: "Thrissur",
            addressRegion: "Kerala",
            addressCountry: "IN"
          }
        ]}
        contactPoint={{
          telephone: "+91-XXX-XXX-XXXX",
          contactType: "customer service"
        }}
      />
      <FAQSchema questions={faqData} />
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
          <div className="container mx-auto px-4 space-y-20">
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
            {/* <div>
              <EnhancedGraduatesSection />
            </div> */}
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
