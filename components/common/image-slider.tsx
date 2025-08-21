"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageSliderProps {
  images: string[]
  altPrefix?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
  showThumbnails?: boolean
}

export function ImageSlider({
  images,
  altPrefix = "Image",
  autoPlay = true,
  autoPlayInterval = 4000,
  className = "w-full aspect-[16/10] rounded-2xl",
  showThumbnails = true,
}: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const thumbnailsPerView = 5 // Number of thumbnails visible at once

  const handleNextImage = useCallback(() => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }
  }, [images.length])

  const handlePrevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const scrollThumbnailsLeft = () => {
    setThumbnailStartIndex(prev => Math.max(0, prev - 1))
  }

  const scrollThumbnailsRight = () => {
    setThumbnailStartIndex(prev => Math.min(images.length - thumbnailsPerView, prev + 1))
  }

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return
    const timer = setTimeout(handleNextImage, autoPlayInterval)
    return () => clearTimeout(timer)
  }, [currentImageIndex, autoPlay, autoPlayInterval, images.length, handleNextImage])

  // Auto-scroll thumbnails to keep current image visible
  useEffect(() => {
    if (showThumbnails && images.length > thumbnailsPerView) {
      const currentIndex = currentImageIndex
      const startIndex = thumbnailStartIndex
      const endIndex = startIndex + thumbnailsPerView - 1
      
      if (currentIndex < startIndex) {
        setThumbnailStartIndex(currentIndex)
      } else if (currentIndex > endIndex) {
        setThumbnailStartIndex(Math.max(0, currentIndex - thumbnailsPerView + 1))
      }
    }
  }, [currentImageIndex, showThumbnails, images.length, thumbnailStartIndex, thumbnailsPerView])

  if (!images || images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-black/20", className)}>
        <p className="text-gray-400">No images available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 ">
      <div className={cn("relative overflow-hidden group bg-black/20 backdrop-blur-xl", className)}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src || "/placeholder.svg"}
            alt={`${altPrefix} ${index + 1}`}
            className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {images.length > 1 && (
          <>
            {/* Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePrevImage}
                className="bg-black/20 text-white rounded-full hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleNextImage}
                className="bg-black/20 text-white rounded-full hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentImageIndex === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>


      {showThumbnails && images.length > 1 && (
        <div className="relative flex items-center justify-center gap-2">
          {/* Left Arrow */}
          {images.length > thumbnailsPerView && thumbnailStartIndex > 0 && (
            <Button
              size="icon"
              variant="ghost"
              onClick={scrollThumbnailsLeft}
              className="bg-black/20 text-white rounded-full hover:bg-black/40 transition-all flex-shrink-0"
              aria-label="Previous thumbnails"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {/* Thumbnails Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex justify-center gap-2 md:gap-4 overflow-hidden p-2 pb-2 -mb-2"
          >
            {images
              .slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView)
              .map((src, displayIndex) => {
                const actualIndex = thumbnailStartIndex + displayIndex
                return (
                  <button
                    key={`thumb-${actualIndex}`}
                    ref={(el) => {
                      thumbnailRefs.current[actualIndex] = el
                    }}
                    onClick={() => selectImage(actualIndex)}
                    className={cn(
                      "flex-shrink-0 w-16 h-10 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ease-in-out focus:outline-none ring-offset-2 ring-offset-background",
                      currentImageIndex === actualIndex ? "ring-2 ring-yellow-400 opacity-100" : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Thumbnail ${altPrefix} ${actualIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                )
              })}
          </div>
          
          {/* Right Arrow */}
          {images.length > thumbnailsPerView && thumbnailStartIndex + thumbnailsPerView < images.length && (
            <Button
              size="icon"
              variant="ghost"
              onClick={scrollThumbnailsRight}
              className="bg-black/20 text-white rounded-full hover:bg-black/40 transition-all flex-shrink-0"
              aria-label="Next thumbnails"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
