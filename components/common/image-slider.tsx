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
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

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

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return
    const timer = setTimeout(handleNextImage, autoPlayInterval)
    return () => clearTimeout(timer)
  }, [currentImageIndex, autoPlay, autoPlayInterval, images.length, handleNextImage])

  // Removed automatic scrolling that was affecting the entire website
  // useEffect(() => {
  //   if (showThumbnails && thumbnailRefs.current[currentImageIndex]) {
  //     thumbnailRefs.current[currentImageIndex]?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "nearest",
  //       inline: "center",
  //     })
  //   }
  // }, [currentImageIndex, showThumbnails])

  if (!images || images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-black/20", className)}>
        <p className="text-gray-400">No images available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 backdrop-blur-xl">
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
        <div
          ref={thumbnailContainerRef}
          className="flex justify-center gap-2 md:gap-4 overflow-x-auto p-2  pb-2 -mb-2 custom-scrollbar"
        >
          {images.map((src, index) => (
            <button
              key={`thumb-${index}`}
              ref={(el) => {
                thumbnailRefs.current[index] = el
              }}
              onClick={() => selectImage(index)}
              className={cn(
                "flex-shrink-0 w-16 h-10 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ease-in-out focus:outline-none ring-offset-2 ring-offset-background",
                currentImageIndex === index ? "ring-2 ring-yellow-400 opacity-100" : "opacity-60 hover:opacity-100",
              )}
            >
              <img
                src={src || "/placeholder.svg"}
                alt={`Thumbnail ${altPrefix} ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
