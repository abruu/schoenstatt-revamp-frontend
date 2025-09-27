import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import { EventsPageContent } from "@/components/events-page-content"

export const metadata = {
  title: 'SLA Events & News | Latest Updates from Schoenstatt Language Academy',
  description: 'Stay updated with latest events, student achievements, and news from Schoenstatt Language Academy Kerala. Cultural programs, graduations, and success stories.',
  keywords: 'SLA events and news, German language events Kerala, SLA updates, student achievements, cultural programs',
  openGraph: {
    title: 'SLA Events & News | Schoenstatt Language Academy Updates',
    description: 'Discover the latest happenings at SLA Kerala. Student achievements, cultural events, and academy updates.',
    images: ['/og/sla-events-news.jpg']
  },
  alternates: { canonical: '/events' }
}

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
