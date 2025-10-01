'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageSource {
  url?: string;
  formats?: {
    large?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    thumbnail?: { url: string; width: number; height: number };
  };
}

interface AdaptiveImageProps {
  image: string | ImageSource | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackContent?: React.ReactNode;
  priority?: boolean;
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
}

/**
 * A component that handles different image source formats
 * Works with both string URLs and Strapi image objects
 */
export function AdaptiveImage({
  image,
  alt,
  className = 'w-full h-full object-cover',
  fallbackClassName = 'w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center',
  fallbackContent,
  priority = false,
  size = 'medium',
}: AdaptiveImageProps) {
  const [error, setError] = useState(false);

  // Handle image loading error
  const handleError = () => {
    setError(true);
  };

  // Get the appropriate URL based on the image type and requested size
  const getImageUrl = (): string | undefined => {
    if (!image) return undefined;

    // If image is a string, return it directly
    if (typeof image === 'string') {
      return image;
    }

    // If image is an object with formats, try to get the requested size
    if (image.formats) {
      if (size === 'thumbnail' && image.formats.thumbnail) {
        return image.formats.thumbnail.url;
      }
      if (size === 'small' && image.formats.small) {
        return image.formats.small.url;
      }
      if (size === 'medium' && image.formats.medium) {
        return image.formats.medium.url;
      }
      if (size === 'large' && image.formats.large) {
        return image.formats.large.url;
      }
    }

    // Fallback to the main URL
    return image.url;
  };

  const imageUrl = getImageUrl();

  // If there's an error or no image URL, show fallback
  if (error || !imageUrl) {
    return <div className={fallbackClassName}>{fallbackContent}</div>;
  }

  // Determine if the URL is absolute or relative
  const isAbsoluteUrl = imageUrl.startsWith('http') || imageUrl.startsWith('//');
  
  // Add base URL for relative URLs if needed
  const fullUrl = isAbsoluteUrl 
    ? imageUrl 
    : `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace('/api', '') || ''}${imageUrl}`;

  return (
    <img
      src={fullUrl}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
