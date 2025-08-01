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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface GalleryImage {
  id: number
  src: string
  alt: string
  title: string
  description: string
}

interface EventData {
  id: string
  title: string
  description: string
  fullContent: string
  date: string
  category: string
  type: string
  location: string
  author: string
  readTime: string
  tags: string[]
  gradient: string
  priority: string
  isNew: boolean
  hasGallery: boolean
  gallery?: GalleryImage[]
}

interface EventDetailContentProps {
  event: EventData
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
    if (selectedImage !== null && event.gallery) {
      setImageLoaded(false)
      setSelectedImage((selectedImage + 1) % event.gallery.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null && event.gallery) {
      setImageLoaded(false)
      setSelectedImage((selectedImage - 1 + event.gallery.length) % event.gallery.length)
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

  const currentImage = selectedImage !== null && event.gallery ? event.gallery[selectedImage] : null

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
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-white/20 text-gray-400 hover:text-white">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div>
        </header>

        {event.hasGallery && event.gallery && event.gallery.length > 0 && (
          <div className="relative group cursor-pointer" onClick={() => openLightbox(0)}>
            <div className="aspect-video bg-black border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={event.gallery[0].src || "/placeholder.svg"}
                alt={event.gallery[0].alt}
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
            <p className="text-center text-gray-400 text-sm mt-2">{event.gallery[0].title}</p>
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: event.fullContent }}
          />
        </div>

        {event.hasGallery && event.gallery && event.gallery.length > 1 && (
          <section className="space-y-8">
            <div className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Camera className="h-6 w-6" />
                Image Gallery ({event.gallery.length} photos)
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.gallery.map((image, index) => (
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

        <section className="border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white mb-3">Success Story</Badge>
              <h3 className="text-lg font-semibold text-white mb-2">SLA Students Excel in German Universities</h3>
              <p className="text-gray-400 text-sm mb-4">Our alumni continue to achieve remarkable success...</p>
              <Link href="/events/5">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Read More
                </Button>
              </Link>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white mb-3">Cultural</Badge>
              <h3 className="text-lg font-semibold text-white mb-2">German Cultural Festival 2024</h3>
              <p className="text-gray-400 text-sm mb-4">Students and faculty celebrated German traditions...</p>
              <Link href="/events/6">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Read More
                </Button>
              </Link>
            </div>
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
                {event.gallery && event.gallery.length > 1 && (
                  <div className="flex-grow overflow-y-auto p-6 pt-0">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      More Photos ({selectedImage !== null ? selectedImage + 1 : 0} / {event.gallery.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {event.gallery.map((img, index) => (
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
