import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { EventsPageContent } from "@/components/events-page-content"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <EventsPageContent />
        </main>
        <Footer />
      </div>
    </div>
  )
}
