"use client"
import React, { useState, useEffect } from 'react';
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  id: string | number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
  showThumbnails?: boolean;
  showImageInfo?: boolean;
}

export function ImageLightbox({
  images,
  isOpen,
  initialIndex = 0,
  onClose,
  showThumbnails = true,
  showImageInfo = true
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentIndex];

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update current index when initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImageLoaded(false);
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = "hidden";
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        handleClose();
      }
      
      if (hasMultipleImages) {
        if (e.key === "ArrowLeft") {
          goToPrevious();
        }
        if (e.key === "ArrowRight") {
          goToNext();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, currentIndex, hasMultipleImages]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      document.body.style.overflow = "unset";
    }, 300);
  };

  const goToNext = () => {
    if (hasMultipleImages) {
      setImageLoaded(false);
      setCurrentIndex((currentIndex + 1) % images.length);
    }
  };

  const goToPrevious = () => {
    if (hasMultipleImages) {
      setImageLoaded(false);
      setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    }
  };

  const goToImage = (index: number) => {
    setImageLoaded(false);
    setCurrentIndex(index);
  };

  if (!isClient || !isOpen || !currentImage) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-7xl h-full max-h-[90vh] bg-black/50 border border-white/10 rounded-2xl flex flex-col lg:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          onClick={handleClose}
          className="absolute top-3 right-3 z-[51] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
          size="icon"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Main Image Area */}
        <div className="flex-grow flex items-center justify-center p-4 lg:p-8 relative">
          {/* Previous Button - Only show if multiple images */}
          {hasMultipleImages && (
            <Button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-[51] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 lg:w-12 lg:h-12"
              size="icon"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Image Container */}
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
              className={`object-contain w-auto h-auto max-w-full max-h-full transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Next Button - Only show if multiple images */}
          {hasMultipleImages && (
            <Button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-[51] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 lg:w-12 lg:h-12"
              size="icon"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Sidebar - Only show if showImageInfo is true or has multiple images with thumbnails */}
        {(showImageInfo || (hasMultipleImages && showThumbnails)) && (
          <div className="w-full lg:w-[350px] flex-shrink-0 bg-black/30 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col">
            {/* Image Info */}
            {showImageInfo && (currentImage.title || currentImage.description) && (
              <div className="p-6 border-b border-white/10">
                {currentImage.title && (
                  <h3 className="text-xl font-bold text-white mb-2">{currentImage.title}</h3>
                )}
                {currentImage.description && (
                  <p className="text-gray-300 text-sm leading-relaxed">{currentImage.description}</p>
                )}
              </div>
            )}

            {/* Thumbnails - Only show if multiple images and showThumbnails is true */}
            {hasMultipleImages && showThumbnails && (
              <div className="flex-grow overflow-y-auto p-6 pt-0">
                <h4 className="text-lg font-semibold text-white mb-4">
                  More Photos ({currentIndex + 1} / {images.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => goToImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${
                        index === currentIndex
                          ? "border-purple-400 scale-105"
                          : "border-transparent hover:border-white/50"
                      }`}
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
        )}
      </div>
    </div>,
    document.body
  );
}
