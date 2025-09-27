import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { B2ExamContent } from "@/components/b2-exam-content"
import { CourseSchema, BreadcrumbSchema } from "@/components/seo/structured-data"
import { PageEffects } from "@/components/common/page-effects"

export const metadata = {
  title: 'B2 German Exam Preparation | Telc Certification at SLA Kerala',
  description: 'Master B2 German with expert preparation at SLA Kerala. Telc certified center, 95% success rate, comprehensive 16-week program. Enroll for B2 exam coaching now!',
  keywords: 'B2 German exam preparation Kerala, Telc B2 certification, German B2 course, B2 exam coaching, German proficiency test',
  openGraph: {
    title: 'B2 German Exam Preparation | Telc Certification Kerala',
    description: 'Achieve B2 German proficiency with our comprehensive exam preparation program. Expert coaching, mock tests, proven results.',
    images: ['/og/b2-exam-preparation.jpg']
  },
  alternates: { canonical: '/b2-exam' }
}

export default function B2ExamPage() {

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "B2 Exam", url: "/b2-exam" }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <PageEffects scrollToTop={true} />
      <CourseSchema
        name="B2 German Exam Preparation Course"
        description="Comprehensive 16-week preparation program for Telc B2 German certification"
        provider="Schoenstatt Language Academy"
        courseCode="B2-PREP"
        educationalLevel="Upper Intermediate"
        timeRequired="P16W"
        price="22000"
        currency="INR"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ParticleBackground />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <B2ExamContent />
        </main>
        <Footer />
      </div>
    </div>
  )
}
