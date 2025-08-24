import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GraduatesPageContent } from "@/components/graduates-page-content"
import { ParticleBackground } from "@/components/layout/particle-background"
import { LoadingScreen } from "@/components/common/loading-screen"

export const metadata = {
  title: 'Our Graduates | Success Stories from SLA Kerala',
  description: 'Meet our successful German language graduates from Schoenstatt Language Academy Kerala. B2 certified students now working and studying in Germany.',
  keywords: 'SLA graduates, German language success stories, B2 graduates Kerala, students in Germany, SLA alumni',
  openGraph: {
    title: 'SLA Graduates | Success Stories Kerala',
    description: 'Discover the success stories of our German language graduates who are now thriving in Germany.',
    images: ['/og/sla-graduates-success.jpg']
  },
  alternates: { canonical: '/graduates' }
}

export default function GraduatesPage() {
  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white relative overflow-hidden">
        <ParticleBackground />
        <Header />
        <main className="relative z-10">
          <GraduatesPageContent />
        </main>
        <Footer />
      </div>
    </>
  )
}
