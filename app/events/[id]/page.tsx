import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { EventDetailContent } from "@/components/event-detail-content"
import { notFound } from "next/navigation"
import { getEventById } from "@/lib/unified-events-data"

// Now using unified events data from lib/unified-events-data.ts

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id, 10)
  const event = getEventById(eventId)

  if (!event || isNaN(eventId)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <EventDetailContent event={event} />
        </main>
        <Footer />
      </div>
    </div>
  )
}
