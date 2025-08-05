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
import { ImageSlider } from "./common/image-slider"

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const gallery = [
    "/images/Gallery/4C445242-D0CB-4EE6-8488-E18095CDDD61.JPG",
    "/images/Gallery/Our-Courses.webp",
    "/images/Gallery/PHOTO-2024-08-01-02-29-37.jpg",
    "/images/Gallery/PHOTO-2024-08-03-01-55-10.jpg",
    "/images/Gallery/PHOTO-2025-01-28-02-06-53.jpg",
    "/images/Gallery/PHOTO-2025-01-29-15-38-17 2.jpg",
    "/images/Gallery/PHOTO-2025-03-13-08-41-32 2.jpg",
    "/images/Gallery/PHOTO-2025-03-13-08-41-32 6.jpg",
    "/images/Gallery/PHOTO-2025-03-13-08-41-32 7.jpg",
    "/images/Gallery/PHOTO-2025-03-13-08-41-32 8.jpg",
    "/images/Gallery/PHOTO-2025-03-25-08-13-28 3.jpg",
    "/images/Gallery/PHOTO-2025-03-25-08-13-28 4.jpg",
    "/images/Gallery/PHOTO-2025-03-25-08-13-28 6.jpg",
    "/images/Gallery/PHOTO-2025-03-25-08-13-28 7.jpg",
    "/images/Gallery/PHOTO-2025-03-25-08-13-28 8.jpg",
    "/images/Gallery/PHOTO-2025-03-25-08-13-28.jpg",
    "/images/Gallery/PHOTO-2025-04-01-12-41-51.jpg",
    "/images/Gallery/PHOTO-2025-05-08-19-53-27 2.jpg",
    "/images/Gallery/PHOTO-2025-05-08-19-53-27 3.jpg",
    "/images/Gallery/PHOTO-2025-05-08-19-53-27 4.jpg",
    "/images/Gallery/PHOTO-2025-05-08-19-53-27.jpg",
    "/images/Gallery/PHOTO-2025-05-13-18-43-35.jpg",
    "/images/Gallery/PHOTO-2025-05-22-08-34-29 2.jpg",
    "/images/Gallery/PHOTO-2025-05-22-08-34-29.jpg",
    "/images/Gallery/PHOTO-2025-06-18-14-18-09.jpg",
    "/images/Gallery/PHOTO-2025-06-18-14-18-10.jpg",
    "/images/Gallery/PHOTO-2025-06-19-05-03-42.jpg",
    "/images/Gallery/PHOTO-2025-06-19-05-03-44.jpg",
    "/images/Gallery/PHOTO-2025-06-19-05-03-45.jpg",
    "/images/Gallery/PHOTO-2025-06-30-20-29-03 2.jpg",
    "/images/Gallery/PHOTO-2025-06-30-20-29-03.jpg",
    "/images/Gallery/download.webp",
    "/images/Gallery/header_pic.jpg"
  ]
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
      description: "State-of-the-art interactive learning environment",
    },
    {
      id: 2,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Students in Class",
      category: "students",
      title: "Interactive Learning Session",
      description: "Students engaged in German conversation practice",
    },
    {
      id: 3,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "B2 Graduation Ceremony",
      category: "graduation",
      title: "B2 Level Graduation",
      description: "Celebrating successful B2 Telc exam graduates",
    },
    {
      id: 4,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Language Lab",
      category: "classrooms",
      title: "Advanced Language Laboratory",
      description: "Digital language learning facilities",
    },
    {
      id: 5,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "Cultural Event",
      category: "students",
      title: "German Cultural Festival",
      description: "Students celebrating German traditions",
    },
    {
      id: 6,
      src: "/placeholder.svg?height=800&width=1200",
      alt: "A2 Graduates",
      category: "graduation",
      title: "A2 Level Achievement",
      description: "Proud A2 level course completers",
    },
  ]

  const categories = [
    { id: "all", name: "All", icon: Camera },
    { id: "classrooms", name: "Classrooms", icon: Building },
    { id: "students", name: "Students", icon: Users },
    { id: "graduation", name: "Graduation", icon: GraduationCap },
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
      <div className="container mx-auto px-4 relative z-10 space-y-16">
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


      </div>

<div className=" mt-10"><ImageSlider
                           key={'selectedBranch'}
                           images={gallery}
                           altPrefix={'text'}
                         /></div>

      </section>


  )
}
