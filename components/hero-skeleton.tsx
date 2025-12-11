import { Skeleton } from "@/components/ui/skeleton"

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-24 sm:pt-28 sm:pb-28 relative z-10">
        <div className="max-w-8xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 xl:gap-20">
            {/* Content Skeleton */}
            <div className="space-y-6 sm:space-y-8">
              {/* Badge Skeleton */}
              <Skeleton className="h-10 w-64 rounded-full" />

              {/* Heading Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-12 sm:h-16 w-full" />
                <Skeleton className="h-12 sm:h-16 w-3/4" />
              </div>

              {/* Description Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Skeleton className="h-12 w-full sm:w-40 rounded-full" />
                <Skeleton className="h-12 w-full sm:w-40 rounded-full" />
              </div>

              {/* Testimonial Skeleton */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-white/10">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <Skeleton className="h-10 w-20 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>

              {/* Trust Indicators Skeleton */}
              <div className="flex items-center space-x-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Image Skeleton */}
            <div className="relative mt-6">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 rounded-[2rem] blur-2xl opacity-20"></div>
                
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/30 rounded-[2rem] overflow-hidden">
                  <div className="relative aspect-square">
                    <Skeleton className="w-full h-full" />
                  </div>

                  {/* Navigation Arrows Skeleton */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>

                  {/* Indicators Skeleton */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-3 h-3 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
