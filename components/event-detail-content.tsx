"use client"
import Image from 'next/image'
import { type BlocksContent } from '@strapi/blocks-react-renderer';
import { useState, useEffect } from "react"
import {
  Calendar,
  MapPin,
  User,
  Clock,
  Tag,
  ArrowLeft,
  Camera,
  ZoomIn,
  BookOpen,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { UnifiedEvent, getRelatedArticles, mapApiEventsToUnifiedFormat } from "@/lib/unified-events-data"
import { getIconComponent } from "@/lib/icon-mapping"
import { useApiStore } from "@/lib/stores/api-store"
import { SkeletonLoader } from "@/components/common/skeleton-loader"
import { DateDisplay } from "@/components/common/date-display"
import { RichContentRenderer } from "@/components/common/rich-content-renderer"
import { ImageLightbox, type LightboxImage } from "@/components/common/image-lightbox"

interface EventDetailContentProps {
  documentId: string
}

export function EventDetailContent({ documentId }: EventDetailContentProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // API store integration
  const { 
    currentEvent, 
    currentEventLoading, 
    currentEventError, 
    fetchEventByDocumentId, 
    clearError 
  } = useApiStore();

  // Convert API event to UnifiedEvent format
  const event: UnifiedEvent | null = currentEvent ? mapApiEventsToUnifiedFormat([currentEvent])[0] : null;

  // Define functions for lightbox
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  // Effects
  useEffect(() => {
    if (documentId) {
      fetchEventByDocumentId(documentId);
    }
  }, [documentId, fetchEventByDocumentId]);

  // Convert gallery items to lightbox format
  const lightboxImages: LightboxImage[] = event?.galleryItems?.map((item: any) => ({
    id: item.id,
    src: item.src || "/placeholder.svg",
    alt: item.alt || "",
    title: item.title,
    description: item.description
  })) || []

  // Handle loading state
  if (currentEventLoading) {
    return (
      <SkeletonLoader 
        show={currentEventLoading} 
        variant="event-detail"
      />
    );
  }

  // Handle error state
  if (currentEventError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-red-500 font-medium">Error loading event: {currentEventError}</div>
            <Button onClick={() => {
              clearError();
              fetchEventByDocumentId(documentId);
            }} variant="outline">
              Try Again
            </Button>
            <Link href="/events">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle not found state
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-gray-400 font-medium text-lg">Event not found</div>
            <p className="text-gray-500">The event you're looking for doesn't exist or has been removed.</p>
            <Link href="/events">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Back button - positioned as a floating element */}
      <div className="sticky top-4 z-40 mb-6 pt-4">
        <Link href="/events">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 bg-black/20 backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Events</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      <article className="space-y-8 pb-16">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* <Badge className={`bg-gradient-to-r ${event.gradient} text-white`}>{event.category}</Badge> */}
            {/* <Badge variant="outline" className="border-white/20 text-gray-300">
              {event.type}
            </Badge> */}
            {/* {event.isNew && <Badge className="bg-red-500 text-white animate-pulse">New</Badge>} */}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{event.title}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
            
              <DateDisplay date={event.date} />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.branch?.header}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {event.author}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {event.readTime}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-white/20 text-gray-300">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            )) || null}
          </div>
          {/* <div className="flex justify-end">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div> */}
        </header>

       
          <div className="relative group " >
            <div className="aspect-video bg-black border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
            <Image
  src={event.coverImage?.formats?.medium?.url || "/placeholder.svg"}
  alt={event.coverImage?.name || "Placeholder"}
  width={event.coverImage?.formats?.medium?.width || 800} // fallback width
  height={event.coverImage?.formats?.medium?.height || 600} // fallback height
  className="w-full h-full object-cover"
/>
            </div>
            {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-2xl">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
              </div>
            </div> */}
            {/* <p className="text-center text-gray-400 text-sm mt-2">{event.galleryItems[0].title}</p> */}
          </div>
       

        <RichContentRenderer content={event.fullContent as BlocksContent} />

        {event.galleryItems && event.galleryItems.length > 0 && (
          <section className="space-y-8">
            <div className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Camera className="h-6 w-6" />
                Image Gallery ({event.galleryItems.length} photos)
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.galleryItems.map((image: any, index: number) => (
                  <div key={image.id} className="relative group cursor-pointer" onClick={() => openLightbox(index)}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-100">
                      <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                              <ZoomIn className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-white text-sm font-medium">View Full Size</p>
                          </div>
                        </div>
                      </div>

                      {(image.title || image.description) && (
  <div className="p-4">
    {image.title && (
      <h4 className="font-semibold text-white mb-1 text-sm">{image.title}</h4>
    )}
    {image.description && (
      <p className="text-xs text-gray-400">{image.description}</p>
    )}
  </div>
)}





                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Articles Section */}
        {event.related_articles && event.related_articles.length > 0 && (
        <section className="border-t border-white/10 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.related_articles?.map((article) => {
              const IconComponent = getIconComponent(article?.icon)
              return (
                <Link key={article.id} href={`/events/${article.documentId || article.id}`}>
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
                    <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-30 rounded-2xl blur-lg transition-all duration-500" style={{backgroundImage: article.gradient}}></div>
                    <div className="relative">
                      <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                        <img
                          src={article.coverImage?.formats?.medium?.url || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        {/* <div className={`absolute inset-0 bg-gradient-to-r ${article.gradient?.className} flex items-center justify-center hidden`}>
                          <IconComponent className="h-12 w-12 text-white" />
                        </div> */}
                        {/* <div className="absolute top-3 right-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${article.gradient?.className} rounded-full flex items-center justify-center`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                        </div> */}
                        {article.isNew && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-red-500 text-white text-xs animate-pulse">New</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`bg-gradient-to-r ${article.gradient?.className} text-white text-xs`}>
                            {article.category?.name}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-gray-400 text-xs">
                            {article.eventType}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-white mb-2 text-sm group-hover:text-blue-300 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{article.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            {/* <Calendar className="h-3 w-3" /> */}
                            <DateDisplay date={article.date} />
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime} read
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
      </article>
    {/* )} */}

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        isOpen={isLightboxOpen}
        initialIndex={selectedImageIndex}
        onClose={closeLightbox}
        showThumbnails={true}
        showImageInfo={true}
      />
    </div>
  )
}
