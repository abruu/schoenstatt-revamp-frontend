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
  Search,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function GalleryPageContent() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const galleryImages = [
    {
      id: 1,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Modern Smart Classroom",
      category: "classrooms",
      title: "Smart Classroom Technology",
      description:
        "State-of-the-art interactive learning environment with digital boards and modern seating arrangements",
      date: "January 2025",
      location: "Thrissur Center",
      tags: ["technology", "modern", "interactive"],
    },
    {
      id: 2,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Students in Class",
      category: "students",
      title: "Interactive Learning Session",
      description: "Students engaged in German conversation practice with native speaker methodology",
      date: "December 2024",
      location: "Chalakudy Center",
      tags: ["learning", "conversation", "practice"],
    },
    {
      id: 3,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "B2 Graduation Ceremony",
      category: "graduation",
      title: "B2 Level Graduation Ceremony",
      description: "Celebrating successful B2 Telc exam graduates with certificates and achievements",
      date: "December 2024",
      location: "All Centers",
      tags: ["graduation", "b2", "telc", "certificates"],
    },
    {
      id: 4,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Language Lab",
      category: "classrooms",
      title: "Advanced Language Laboratory",
      description: "Digital language learning facilities with individual workstations and audio equipment",
      date: "November 2024",
      location: "Peravoor Center",
      tags: ["language lab", "digital", "audio"],
    },
    {
      id: 5,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Cultural Event",
      category: "students",
      title: "German Cultural Festival",
      description: "Students celebrating German traditions, food, and customs in a vibrant cultural event",
      date: "October 2024",
      location: "Thrissur Center",
      tags: ["culture", "festival", "traditions"],
    },
    {
      id: 6,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "A2 Graduates",
      category: "graduation",
      title: "A2 Level Achievement Ceremony",
      description: "Proud A2 level course completers receiving their certificates with family and faculty",
      date: "November 2024",
      location: "Chalakudy Center",
      tags: ["graduation", "a2", "achievement"],
    },
    {
      id: 7,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Library",
      category: "classrooms",
      title: "German Literature Library",
      description: "Extensive collection of German books, magazines, and digital resources for students",
      date: "September 2024",
      location: "All Centers",
      tags: ["library", "books", "literature"],
    },
    {
      id: 8,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Study Group",
      category: "students",
      title: "Collaborative Learning Session",
      description: "Students working together on German projects and assignments in group study format",
      date: "December 2024",
      location: "Peravoor Center",
      tags: ["collaboration", "group study", "projects"],
    },
    {
      id: 9,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Exam Preparation",
      category: "students",
      title: "Telc Exam Preparation",
      description: "Intensive exam preparation sessions with mock tests and individual feedback",
      date: "January 2025",
      location: "All Centers",
      tags: ["exam", "preparation", "telc", "mock tests"],
    },
    {
      id: 10,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "New Building Exterior",
      category: "classrooms",
      title: "New SLA Building at Kuttur",
      description: "The impressive facade of our new state-of-the-art facility at Kuttur, Thrissur",
      date: "January 2025",
      location: "Kuttur, Thrissur",
      tags: ["new building", "kuttur", "modern"],
    },
    {
      id: 11,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Faculty Meeting",
      category: "students",
      title: "Faculty Development Session",
      description: "Teachers participating in professional development and training programs",
      date: "December 2024",
      location: "Thrissur Center",
      tags: ["faculty", "training", "development"],
    },
    {
      id: 12,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Student Activities",
      category: "graduation",
      title: "Extracurricular Activities",
      description: "Students participating in various cultural and educational activities beyond regular classes",
      date: "November 2024",
      location: "All Centers",
      tags: ["activities", "extracurricular", "culture"],
    },
  ]

  const categories = [
    { id: "all", name: "All Photos", icon: Camera, count: galleryImages.length },
    {
      id: "classrooms",
      name: "Classrooms",
      icon: Building,
      count: galleryImages.filter((i) => i.category === "classrooms").length,
    },
    {
      id: "students",
      name: "Students",
      icon: Users,
      count: galleryImages.filter((i) => i.category === "students").length,
    },
    {
      id: "graduation",
      name: "Graduation",
      icon: GraduationCap,
      count: galleryImages.filter((i) => i.category === "graduation").length,
    },
  ]

  const filteredImages = galleryImages
    .filter((img) => selectedCategory === "all" || img.category === selectedCategory)
    .filter(
      (img) =>
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
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
    if (selectedImageIndex !== null) {
      setImageLoaded(false)
      setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setImageLoaded(false)
      setSelectedImageIndex((selectedImageIndex - 1 + filteredImages.length) % filteredImages.length)
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
  }, [isLightboxOpen, selectedImageIndex])

  const currentImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-500/20 border border-purple-400/30 backdrop-blur-sm">
          <Camera className="h-5 w-5 text-purple-400 mr-2" />
          <span className="text-purple-400 font-medium">PHOTO GALLERY</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Glimpses of Our Journey
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Explore our vibrant learning environment, modern facilities, and the success stories of our students.
        </p>
      </div>

      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-400/50"
            />
          </div>
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
              <Badge className="bg-white/20 text-xs">{category.count}</Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-400">
          Showing {filteredImages.length} of {galleryImages.length} photos
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <div key={image.id} className="relative group cursor-pointer" onClick={() => openLightbox(index)}>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-black flex items-center justify-center relative overflow-hidden">
                <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                      <ZoomIn className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-white font-medium">View Full Size</p>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/50 text-white text-xs capitalize">{image.category}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1 text-sm line-clamp-1">{image.title}</h4>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{image.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{image.date}</span>
                  <span>{image.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No photos found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {isClient &&
        isLightboxOpen &&
        currentImage &&
        createPortal(
          <div
            className={`fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeLightbox}
          >
            <div
              className="relative w-full max-w-7xl h-full max-h-[90vh] bg-black/50 border border-white/10 rounded-2xl flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
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
                  <div className="text-xs text-gray-400 mt-4 space-y-1">
                    <p>
                      <b>Date:</b> {currentImage.date}
                    </p>
                    <p>
                      <b>Location:</b> {currentImage.location}
                    </p>
                  </div>
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
                    More Photos ({selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / {filteredImages.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredImages.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${index === selectedImageIndex ? "border-purple-400 scale-105" : "border-transparent hover:border-white/50"}`}
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
    </div>
  )
}
