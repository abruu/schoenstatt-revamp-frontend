"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  Camera,
  Users,
  GraduationCap,
  Building,
  ZoomIn,
  Search,
  MapPin,
  ImageOff,
} from "lucide-react";
import {
  ImageLightbox,
  LightboxImage,
} from "@/components/common/image-lightbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApiStore } from "@/lib/stores/api-store";
import { getStrapiBaseUrl } from "@/lib/constants";
import Link from "next/link";
import { DateDisplay } from "./common/date-display";
import { GalleryCardSkeleton } from "@/components/common/gallery-card-skeleton";
import { VirtualizedGalleryGrid } from "@/components/common/virtualized-gallery-grid";

interface GalleryPageContentProps {
  showCategories?: boolean;
  maxImages?: number;
  showViewAllButton?: boolean;
  isPreview?: boolean;
  className?: string;
}

interface GalleryImageCardProps {
  image: any;
  index: number;
  aspectRatioClass: string;
  onOpen: (index: number) => void;
}

// Memoized so that scrolling/loading more images doesn't re-render every
// previously mounted card - critical once the gallery holds 1000+ images.
const GalleryImageCard = memo(function GalleryImageCard({
  image,
  index,
  aspectRatioClass,
  onOpen,
}: GalleryImageCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => onOpen(index)}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
        <div
          className={`${aspectRatioClass} bg-black flex items-center justify-center relative overflow-hidden`}
        >
          {!loaded && !errored && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
          {errored ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <ImageOff className="h-8 w-8 text-gray-500" />
            </div>
          ) : (
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-medium">View Full Size</p>
            </div>
          </div>
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/50 text-white text-xs capitalize">
              {image.category}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-white mb-1 text-sm line-clamp-1">
            {image.title}
          </h4>
          <p className="text-xs text-gray-400 mb-2 line-clamp-2">
            {image.description}
          </p>
          <div className="flex mt-4 justify-between items-center text-xs text-gray-500">
            <span>
              <DateDisplay date={image.date} />
            </span>
            <span className="flex items-center gap-1">
              {" "}
              <MapPin className="h-4 w-4" /> {image.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export function GalleryPageContent({
  showCategories = true,
  maxImages,
  showViewAllButton = false,
  isPreview = false,
  className = "",
}: GalleryPageContentProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  const {
    categories: apiCategories,
    categoriesLoading,
    categoriesError,
    fetchCategories,
    galleries: apiGalleries,
    galleriesLoading,
    galleriesError,
    galleriesHasMore,
    galleriesLoadingMore,
    fetchGalleries,
    loadMoreGalleries,
    clearError,
  } = useApiStore();

  useEffect(() => {
    setIsClient(true);
    fetchCategories(false); // Fetch all categories with forceRefresh=false
    fetchGalleries(false); // Fetch all galleries with forceRefresh=false
  }, [fetchCategories, fetchGalleries]);

  // Transform API galleries into individual images
  // This flattens the nested structure: each gallery contains multiple images
  // We create a separate item for each image to enable smooth scrolling
  // Memoized: with 1000+ images this rebuild is expensive and previously ran
  // on every render (including scroll-triggered state updates).
  const galleryImages = useMemo(() => {
    if (apiGalleries.length === 0) return [];

    const images: any[] = [];

    apiGalleries.forEach((gallery) => {
      // Each gallery can have multiple images - we flatten them into individual items
      if (gallery?.image && Array.isArray(gallery.image)) {
        gallery.image.forEach((img, imageIndex) => {
          const imageUrl = img?.url || "";
          const fullImageUrl = imageUrl.startsWith("http")
            ? imageUrl
            : `${getStrapiBaseUrl()}${imageUrl}`;

          images.push({
            id: `${gallery?.id}-${img?.id}`,
            src: fullImageUrl,
            alt: img?.alternativeText || gallery?.title,
            category: gallery?.category?.slug || "general",
            title: gallery?.title,
            description: gallery?.description,
            date: gallery?.date,
            location: gallery?.branch?.header || "SLA Center",
            tags:
              gallery?.tags?.map((tag: any) => tag.name.toLowerCase()) || [],
            // Additional metadata for tracking
            galleryId: gallery?.id,
            imageIndex: imageIndex,
            totalImagesInGallery: gallery.image.length,
          });
        });
      }
    });

    return images;
  }, [apiGalleries]);

  // Icon mapping for categories
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      Classrooms: Building,
      Students: Users,
      Graduation: GraduationCap,
      classrooms: Building,
      students: Users,
      graduation: GraduationCap,
    };
    return iconMap[categoryName] || Camera;
  };

  // Build dynamic categories from API data with client-side filtering
  const categories = useMemo(() => {
    const allCategory = {
      id: "all",
      name: "All Photos",
      icon: Camera,
      count: galleryImages.length,
    };

    if (apiCategories.length === 0) {
      // Show loading or fallback categories
      return [
        allCategory,
        {
          id: "classrooms",
          name: "Classrooms",
          icon: Building,
          count: galleryImages.filter((i) => i.category === "classrooms")
            .length,
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
          count: galleryImages.filter((i) => i.category === "graduation")
            .length,
        },
      ];
    }

    // Filter categories by WhichPage='gallery' on the client side
    const galleryCategories = apiCategories.filter(
      (category) => category.WhichPage === "gallery",
    );

    // Build categories from filtered API data
    const dynamicCategories = galleryCategories.map((category) => ({
      id: category.slug,
      name: category.name,
      icon: getCategoryIcon(category.name),
      count: galleryImages.filter(
        (i) =>
          i.category === category.slug ||
          i.category === category.name.toLowerCase(),
      ).length,
    }));

    return [allCategory, ...dynamicCategories];
  }, [apiCategories, galleryImages]);

  const filteredImages = useMemo(() => {
    return galleryImages
      .filter((img) => {
        if (selectedCategory === "all") return true;

        // Find the selected category from API data
        const selectedCategoryData = apiCategories.find(
          (cat) => cat.slug === selectedCategory,
        );

        // If we found the category, filter by both slug and name; otherwise use the selectedCategory directly
        if (selectedCategoryData) {
          return (
            img.category === selectedCategoryData.slug ||
            img.category === selectedCategoryData.name.toLowerCase()
          );
        }

        return img.category === selectedCategory;
      })
      .filter(
        (img) =>
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )
      .slice(0, maxImages); // Limit images if maxImages is specified
  }, [galleryImages, selectedCategory, apiCategories, searchTerm, maxImages]);

  const openLightbox = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const currentImage =
    selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  const containerClass = isPreview
    ? `py-20 relative ${className}`
    : `container mx-auto px-4 py-16 space-y-12 ${className}`;

  const aspectRatioClass = isPreview ? "aspect-video" : "aspect-square";

  const content = (
    <>
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-500/20 border border-purple-400/30 backdrop-blur-sm">
          <Camera className="h-5 w-5 text-purple-400 mr-2" />
          <span className="text-purple-400 font-medium">
            {isPreview ? "GALLERY" : "PHOTO GALLERY"}
          </span>
        </div>
        <h1
          className={
            isPreview
              ? "text-4xl lg:text-6xl font-bold"
              : "text-4xl lg:text-6xl font-bold"
          }
        >
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Glimpses of Our Journey
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Explore our vibrant learning environment, modern facilities, and the
          success stories of our students.
        </p>
      </div>

      <div className="space-y-6">
        {/* <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-400/50"
            />
          </div>
        </div> */}
        <div className="flex flex-wrap justify-center gap-4">
          {categoriesLoading
            ? // Show skeleton buttons while loading categories
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 animate-pulse flex items-center gap-2"
                >
                  <div className="h-4 w-4 bg-white/10 rounded"></div>
                  <div className="h-4 w-20 bg-white/10 rounded"></div>
                  <div className="h-4 w-6 bg-white/10 rounded"></div>
                </div>
              ))
            : showCategories
              ? categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 md:px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-lg hover:scale-105"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{category.name}</span>
                  </Button>
                ))
              : null}
        </div>
      </div>

      {/* Error state for categories */}
      {categoriesError && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="text-red-500 font-medium">
            Error loading categories: {categoriesError}
          </div>
          <Button
            onClick={() => {
              clearError();
              fetchCategories(true); // Force refresh
            }}
            variant="outline"
            size="sm"
          >
            Retry Categories
          </Button>
        </div>
      )}

      {/* Error state for galleries */}
      {galleriesError && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="text-red-500 font-medium">
            Error loading galleries: {galleriesError}
          </div>
          <Button
            onClick={() => {
              clearError();
              fetchGalleries(true); // Force refresh
            }}
            variant="outline"
            size="sm"
          >
            Retry Galleries
          </Button>
        </div>
      )}

      {/* Virtualized gallery grid - only renders rows near the viewport,
          keeping scroll smooth even with 1000+ loaded images */}
      <VirtualizedGalleryGrid
        items={filteredImages}
        isLoading={galleriesLoading || (galleriesLoadingMore && !isPreview)}
        hasMore={galleriesHasMore && !isPreview}
        onLoadMore={loadMoreGalleries}
        columns={
          isPreview
            ? { default: 1, md: 2, lg: 3 }
            : { default: 1, md: 2, lg: 3, xl: 4 }
        }
        estimateSize={isPreview ? 340 : 400}
        aspectRatio={isPreview ? "video" : "square"}
        loadingComponent={
          <GalleryCardSkeleton
            count={8}
            aspectRatio={isPreview ? "video" : "square"}
          />
        }
        renderItem={(image: any, index) => (
          <GalleryImageCard
            image={image}
            index={index}
            aspectRatioClass={aspectRatioClass}
            onOpen={openLightbox}
          />
        )}
      />

      {!galleriesLoading && filteredImages.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No photos found
          </h3>
          <p className="text-gray-400 mb-4">
            {apiGalleries.length === 0
              ? "No gallery images available at the moment"
              : "Try adjusting your search or filter criteria"}
          </p>
          {apiGalleries.length === 0 && (
            <Button
              onClick={() => {
                clearError();
                fetchGalleries(true);
              }}
              variant="outline"
              size="sm"
            >
              Refresh Gallery
            </Button>
          )}
        </div>
      )}

      {/* Retry on load-more error */}
      {!isPreview && galleriesError && galleriesHasMore && (
        <div
          className="flex flex-col items-center justify-center py-8 space-y-4"
          role="alert"
        >
          <div className="text-red-500 font-medium">
            Failed to load more photos: {galleriesError}
          </div>
          <Button
            onClick={() => {
              clearError();
              loadMoreGalleries();
            }}
            variant="outline"
            size="sm"
          >
            Retry Now
          </Button>
        </div>
      )}

      {/* End of Gallery Indicator */}
      {!isPreview && !galleriesHasMore && filteredImages.length > 0 && (
        <div className="text-center py-8" role="status" aria-live="polite">
          <p className="text-gray-400">You've reached the end of the gallery</p>
        </div>
      )}

      {/* View All Photos Button for Preview Mode */}
      {showViewAllButton && (
        <div className="text-center mt-16">
          <Link href="/gallery">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 bg-transparent backdrop-blur-sm px-8 py-4 rounded-full hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
            >
              View All Photos
            </Button>
          </Link>
        </div>
      )}

      {/* Common ImageLightbox Component */}
      <ImageLightbox
        images={filteredImages.map((img) => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          title: img.title,
          description: img.description,
        }))}
        isOpen={isLightboxOpen}
        initialIndex={selectedImageIndex || 0}
        onClose={closeLightbox}
        showThumbnails={true}
        showImageInfo={true}
      />
    </>
  );

  if (isPreview) {
    return (
      <section className={containerClass}>
        {/* Background Effects for Preview Mode */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 space-y-8">
          {content}
        </div>
      </section>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
