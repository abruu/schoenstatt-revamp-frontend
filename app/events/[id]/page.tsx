import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { EventDetailContent } from "@/components/event-detail-content"

// Now using API-based event fetching with documentId

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const documentId = params.id // This is now the documentId from the URL

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <EventDetailContent documentId={documentId} />
        </main>
        <Footer />
      </div>
    </div>
  )
}
