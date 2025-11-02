"use client"

import { GalleryPageContent } from "./gallery-page-content"

export function GallerySection() {
  return (
    <GalleryPageContent 
      showCategories={false}
      maxImages={6}
      showViewAllButton={true}
      isPreview={true}
    />
  )
}








