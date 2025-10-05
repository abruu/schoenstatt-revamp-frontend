"use client"

import { cn } from "@/lib/utils"

/**
 * Reusable skeleton loading component for various card types
 * 
 * Usage examples:
 * 
 * // Basic news card skeleton (default)
 * <SkeletonLoader count={4} show={isLoading} />
 * 
 * // Event card skeleton
 * <SkeletonLoader count={6} show={isLoading} variant="event-card" />
 * 
 * // Notice card skeleton
 * <SkeletonLoader count={3} show={isLoading} variant="notice-card" />
 * 
 * // Custom styling
 * <SkeletonLoader 
 *   count={2} 
 *   show={isLoading} 
 *   variant="news-card"
 *   className="grid-cols-1 lg:grid-cols-3 gap-6" 
 * />
 */

interface SkeletonLoaderProps {
  /** Number of skeleton cards to render */
  count?: number
  /** Whether to show the skeleton loader */
  show?: boolean
  /** Additional CSS classes */
  className?: string
  /** Variant of skeleton (news-card, event-card, etc.) */
  variant?: 'news-card' | 'event-card' | 'notice-card' | 'event-detail' | 'graduate-card'
}

interface SkeletonProps {
  className?: string
}

// Base skeleton component for individual elements
const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-white/10",
      className
    )}
  />
)

// News card skeleton that matches the EnhancedNewsSection card design
const NewsCardSkeleton = () => (
  <div className="relative group">
    {/* Glowing background placeholder */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-3xl blur-xl opacity-20"></div>

    {/* Main card */}
    <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col">
      {/* Article Image Skeleton */}
      <div className="aspect-video relative overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        {/* Badges Skeleton */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Gallery indicator skeleton */}
        <div className="absolute bottom-4 right-4 z-20">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Meta Information Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-14" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Location Skeleton */}
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Action Button Skeleton */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  </div>
)

// Event card skeleton that matches the EventsPageContent card design
const EventCardSkeleton = () => (
  <div className="relative group">
    {/* Glowing background placeholder */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-3xl blur-lg opacity-20"></div>

    {/* Main card */}
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col">
      {/* Event Image Skeleton */}
      <div className="aspect-video relative overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        {/* Badges Skeleton */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Gallery indicator skeleton */}
        <div className="absolute bottom-4 right-4 z-20">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Meta Information Skeleton */}
          <div className="flex items-center justify-between text-sm">
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Location Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  </div>
)

// Notice card skeleton (for future use)
const NoticeCardSkeleton = () => (
  <div className="relative">
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  </div>
)

// Graduate card skeleton that matches the GraduatesPageContent card design
const GraduateCardSkeleton = () => (
  <div className="relative group">
    {/* Glowing background placeholder */}
    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl opacity-20"></div>

    {/* Main card */}
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col">
      {/* Header with gradient skeleton */}
      <div className="bg-gradient-to-r from-yellow-400/30 to-orange-500/30 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center">
          {/* Profile image skeleton */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 overflow-hidden">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
          {/* Name skeleton */}
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          {/* Badges skeleton */}
          <div className="flex justify-center gap-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4 flex-1">
        {/* Achievement and score skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Details skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Current status skeleton */}
        <div className="pt-2 border-t border-white/10">
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    </div>
  </div>
)

// Event detail skeleton that matches the EventDetailContent structure
const EventDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-16 max-w-4xl">
    {/* Back button skeleton */}
    <div className="mb-8">
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>

    <article className="space-y-8">
      {/* Header section skeleton */}
      <header className="space-y-6">
        {/* Badges skeleton */}
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
        </div>
        
        {/* Meta information skeleton */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>
      </header>

      {/* Featured image skeleton */}
      <div className="relative group">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="absolute bottom-4 left-4">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Gallery section skeleton */}
      <section className="space-y-8">
        <div className="border-t border-white/10 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="relative group">
                <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related articles section skeleton */}
      <section className="border-t border-white/10 pt-8 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="relative group">
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  </div>
)

export function SkeletonLoader({ 
  count = 4, 
  show = true, 
  className,
  variant = 'news-card'
}: SkeletonLoaderProps) {
  if (!show) return null

  const renderSkeleton = () => {
    switch (variant) {
      case 'news-card':
        return <NewsCardSkeleton />
      case 'event-card':
        return <EventCardSkeleton />
      case 'notice-card':
        return <NoticeCardSkeleton />
      case 'event-detail':
        return <EventDetailSkeleton />
      case 'graduate-card':
        return <GraduateCardSkeleton />
      default:
        return <NewsCardSkeleton />
    }
  }

  // For event-detail variant, render directly without grid wrapper
  if (variant === 'event-detail') {
    return <EventDetailSkeleton />
  }

  return (
    <div className={cn(
      variant === 'graduate-card' 
        ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
        : "grid md:grid-cols-2 gap-8", 
      className
    )}>
      {Array.from({ length: count }, (_, index) => (
        <div key={`skeleton-${index}`}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

export { Skeleton }
