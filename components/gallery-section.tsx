"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Users,
  GraduationCap,
  Building,
  ZoomIn,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const galleryImages = [
    {
      id: 1,
      src: "/images/Gallery/4C445242-D0CB-4EE6-8488-E18095CDDD61.JPG",
      alt: "Modern Smart Classroom",
      category: "classrooms",
      title: "Smart Classroom Technology",
      description: "State-of-the-art interactive learning environment",
    },
    {
      id: 2,
      src: "/images/Gallery/PHOTO-2024-08-01-02-29-37.jpg",
      alt: "Students in Class",
      category: "students",
      title: "Interactive Learning Session",
      description: "Students engaged in German conversation practice",
    },
    {
      id: 3,
      src: "/images/Gallery/PHOTO-2025-03-13-08-41-32 6.jpg",
      alt: "B2 Graduation Ceremony",
      category: "graduation",
      title: "B2 Level Graduation",
      description: "Celebrating successful B2 Telc exam graduates",
    },
    {
      id: 4,
      src: "/images/Gallery/PHOTO-2025-04-01-12-41-51.jpg",
      alt: "Language Lab",
      category: "classrooms",
      title: "Advanced Language Laboratory",
      description: "Digital language learning facilities",
    },
    {
      id: 5,
      src: "/images/Gallery/PHOTO-2025-06-18-14-18-10.jpg",
      alt: "Cultural Event",
      category: "students",
      title: "German Cultural Festival",
      description: "Students celebrating German traditions",
    },
    {
      id: 6,
      src: "/images/Gallery/PHOTO-2025-06-30-20-29-03.jpg",
      alt: "A2 Graduates",
      category: "graduation",
      title: "A2 Level Achievement",
      description: "Proud A2 level course completers",
    },
  ]

  const categories = [
    // { id: "all", name: "All", icon: Camera },
    // { id: "classrooms", name: "Classrooms", icon: Building },
    // { id: "students", name: "Students", icon: Users },
    // { id: "graduation", name: "Graduation", icon: GraduationCap },
  ]

  const filteredImages =
    selectedCategory === "all" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory)

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
    if (selectedImage !== null) {
      setImageLoaded(false)
      setSelectedImage((selectedImage + 1) % filteredImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setImageLoaded(false)
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length)
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

  const currentImage = selectedImage !== null ? filteredImages[selectedImage] : null

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 space-y-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-500/20 border border-purple-400/30 backdrop-blur-sm">
            <Camera className="h-5 w-5 text-purple-400 mr-2" />
            <span className="text-purple-400 font-medium">GALLERY</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Glimpses of Our Journey
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our vibrant learning environment, modern facilities, and the success stories of our students.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id ? "bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg hover:scale-105" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"}`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div key={image.id} className="relative group cursor-pointer" onClick={() => openLightbox(index)}>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                  <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                        <ZoomIn className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">View Image</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-1">{image.title}</h4>
                  <p className="text-sm text-gray-400">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> <div className="text-center mt-20">
        <Link href="/gallery">
        <Button
          variant="outline"
          size="lg"
          className="border-2 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 bg-transparent backdrop-blur-sm px-8 py-4 rounded-full hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
        >
          View All Photos
        </Button></Link>
      </div>
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
                <div className="flex-grow overflow-y-auto p-6 pt-0">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    More Photos ({selectedImage !== null ? selectedImage + 1 : 0} / {filteredImages.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredImages.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${index === selectedImage ? "border-purple-400 scale-105" : "border-transparent hover:border-white/50"}`}
                      >
                        <img src={img.src || "/placeholder.svg"} alt={img.alt} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>,
          document.body,
        )}
    </section>
  )
}








