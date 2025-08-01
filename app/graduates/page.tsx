import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GraduatesPageContent } from "@/components/graduates-page-content"
import { ParticleBackground } from "@/components/layout/particle-background"
import { LoadingScreen } from "@/components/common/loading-screen"

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
