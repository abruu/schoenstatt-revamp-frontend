"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  Calendar,
  MapPin,
  User,
  Clock,
  Tag,
  Share2,
  ArrowLeft,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { UnifiedEvent, getRelatedArticles } from "@/lib/unified-events-data"
import { getIconComponent } from "@/lib/icon-mapping"

interface EventDetailContentProps {
  event: UnifiedEvent
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setImageLoaded(false)
    setIsLightboxOpen(true)
    setTimeout(() => setIsVisible(true), 10)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsLightboxOpen(false)
      document.body.style.overflow = "unset"
    }, 300)
  }

  const nextImage = () => {
    if (selectedImage !== null && event.galleryItems) {
      setImageLoaded(false)
      setSelectedImage((selectedImage + 1) % event.galleryItems.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null && event.galleryItems) {
      setImageLoaded(false)
      setSelectedImage((selectedImage - 1 + event.galleryItems.length) % event.galleryItems.length)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isLightboxOpen, selectedImage])

  const currentImage = selectedImage !== null && event.galleryItems ? event.galleryItems[selectedImage] : null

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <Link href="/events">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      <article className="space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`bg-gradient-to-r ${event.gradient} text-white`}>{event.category}</Badge>
            <Badge variant="outline" className="border-white/20 text-gray-300">
              {event.type}
            </Badge>
            {event.isNew && <Badge className="bg-red-500 text-white animate-pulse">New</Badge>}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{event.title}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {event.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
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
          <div className="flex justify-end">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div>
        </header>

        {event.hasGallery && event.galleryItems && event.galleryItems.length > 0 && (
          <div className="relative group cursor-pointer" onClick={() => openLightbox(0)}>
            <div className="aspect-video bg-black border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={event.galleryItems[0].src || "/placeholder.svg"}
                alt={event.galleryItems[0].alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-2xl">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400 text-sm mt-2">{event.galleryItems[0].title}</p>
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: event.fullContent || '' }}
          />
        </div>

        {event.hasGallery && event.galleryItems && event.galleryItems.length > 1 && (
          <section className="space-y-8">
            <div className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Camera className="h-6 w-6" />
                Image Gallery ({event.galleryItems.length} photos)
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.galleryItems.map((image, index) => (
                  <div key={image.id} className="relative group cursor-pointer" onClick={() => openLightbox(index)}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
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
                      <div className="p-4">
                        <h4 className="font-semibold text-white mb-1 text-sm">{image.title}</h4>
                        <p className="text-xs text-gray-400">{image.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Articles Section */}
        <section className="border-t border-white/10 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRelatedArticles(event.id).map((article) => {
              const IconComponent = getIconComponent(article.icon)
              return (
                <Link key={article.id} href={`/events/${article.id}`}>
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
                    <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-30 rounded-2xl blur-lg transition-all duration-500" style={{backgroundImage: article.gradient}}></div>
                    <div className="relative">
                      <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${article.gradient} flex items-center justify-center hidden`}>
                          <IconComponent className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${article.gradient} rounded-full flex items-center justify-center`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        {article.isNew && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-red-500 text-white text-xs animate-pulse">New</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`bg-gradient-to-r ${article.gradient} text-white text-xs`}>
                            {article.category}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-gray-400 text-xs">
                            {article.type}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-white mb-2 text-sm group-hover:text-blue-300 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {article.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
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
      </article>

      {isClient &&
        isLightboxOpen &&
        currentImage &&
        createPortal(
          <div
            className={`fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeLightbox}
          >
            <div
              className="relative w-full max-w-7xl h-full max-h-[90vh] bg-black/50 border border-white/10 rounded-2xl flex flex-col lg:flex-row overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={closeLightbox}
                className="absolute top-3 right-3 z-[51] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
                size="icon"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="flex-grow flex items-center justify-center p-4 lg:p-8 relative">
                <Button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-[51] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 lg:w-12 lg:h-12"
                  size="icon"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="relative w-full h-full flex items-center justify-center">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    key={currentImage.id}
                    src={currentImage.src || "/placeholder.svg"}
                    alt={currentImage.alt}
                    className={`object-contain w-auto h-auto max-w-full max-h-full transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>

                <Button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-[51] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 lg:w-12 lg:h-12"
                  size="icon"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="w-full lg:w-[350px] flex-shrink-0 bg-black/30 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">{currentImage.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{currentImage.description}</p>
                </div>
                <div className="p-6 flex gap-3">
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                {event.galleryItems && event.galleryItems.length > 1 && (
                  <div className="flex-grow overflow-y-auto p-6 pt-0">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      More Photos ({selectedImage !== null ? selectedImage + 1 : 0} / {event.galleryItems.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {event.galleryItems.map((img, index) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${index === selectedImage ? "border-purple-400 scale-105" : "border-transparent hover:border-white/50"}`}
                        >
                          <img
                            src={img.src || "/placeholder.svg"}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
