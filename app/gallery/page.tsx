import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { GalleryPageContent } from "@/components/gallery-page-content"
import { PageEffects } from "@/components/common/page-effects"

export const metadata = {
  title: 'Photo Gallery | Schoenstatt Language Academy Kerala Facilities & Life',
  description: 'Explore SLA Kerala through our photo gallery. Modern classrooms, student activities, graduation ceremonies, and campus life at our German language centers.',
  keywords: 'SLA photo gallery, German language academy photos, SLA facilities Kerala, student life photos, classroom images',
  openGraph: {
    title: 'SLA Photo Gallery | Campus Life & Facilities Kerala',
    description: 'Take a visual tour of Schoenstatt Language Academy. Modern facilities, student activities, and vibrant campus life.',
    images: ['/og/sla-gallery-overview.jpg']
  },
  alternates: { canonical: '/gallery' }
}

export default function GalleryPage() {

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <PageEffects scrollToTop={true} />
      <ParticleBackground />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <GalleryPageContent />
        </main>
        <Footer />
      </div>
    </div>
  )
}
