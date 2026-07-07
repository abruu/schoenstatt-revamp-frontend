"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  GraduationCap,
  Trophy,
  Award,
  Medal,
  Star,
  Users,
} from "lucide-react";
import { memo } from "react";
import { getStrapiBaseUrl } from "@/lib/constants";

// Helper to prefix relative Strapi URLs
const withStrapiUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${getStrapiBaseUrl()}${url}`;
};

// Graduate interface matching the API response
interface Graduate {
  id: number;
  documentId: string;
  StudenName: string;
  course?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  GraduateDate: string;
  score_percentage: number;
  certification: string;
  currentStatus: string;
  achievement: string;
  testimonial: string;
  language_certification_level: {
    id: number;
    documentId: string;
    LabelFull: string;
    LabelShort: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  branch: {
    id: number;
    documentId: string;
    name: string;
    header: string;
    phone: string;
    callno: string;
    email: string;
    timings: string;
    students: string;
    established: string;
    instagram: string;
    facebook: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    address: string;
  };
  StudentProfileImage?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats: {
      large?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      thumbnail?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  gradient?: {
    id: number;
    documentId: string;
    name: string;
    className: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  certificate?: any;
}

interface GraduateCardProps {
  graduate: Graduate;
  onClick?: (graduate: Graduate) => void;
  className?: string;
}

// Icon mapping function based on achievement or level
const getGraduateIcon = (achievement: string, level: string) => {
  const achievementLower = achievement?.toLowerCase();
  const levelLower = level.toLowerCase();

  if (
    achievementLower?.includes("highest") ||
    achievementLower?.includes("top")
  )
    return Trophy;
  if (
    achievementLower?.includes("excellence") ||
    achievementLower?.includes("outstanding")
  )
    return Award;
  if (
    achievementLower?.includes("best") ||
    achievementLower?.includes("perfect")
  )
    return Medal;
  if (levelLower.includes("b2") || levelLower.includes("c1")) return Star;
  return GraduationCap;
};

// Gradient mapping function
const getGradientClass = (gradientName?: string) => {
  if (!gradientName) return "from-blue-400 to-purple-500";

  const name = gradientName.toLowerCase();
  if (name.includes("red")) return "from-red-400 to-red-600";
  if (name.includes("blue")) return "from-blue-400 to-blue-600";
  if (name.includes("green")) return "from-green-400 to-green-600";
  if (name.includes("yellow")) return "from-yellow-400 to-yellow-600";
  if (name.includes("purple")) return "from-purple-400 to-purple-600";
  if (name.includes("orange")) return "from-orange-400 to-orange-600";

  return "from-blue-400 to-purple-500";
};

// Format date function
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return dateString;
  }
};

// Get image URL with fallback
const getImageUrl = (image?: Graduate["StudentProfileImage"]) => {
  if (!image) return "/placeholder.svg";

  // Try different image sizes in order of preference
  if (image.formats?.thumbnail?.url)
    return withStrapiUrl(image.formats.thumbnail.url)!;
  if (image.formats?.small?.url) return withStrapiUrl(image.formats.small.url)!;
  if (image.url) return withStrapiUrl(image.url)!;

  return "/placeholder.svg";
};

export const GraduateCard = memo(
  ({ graduate, onClick, className }: GraduateCardProps) => {
    const Icon = getGraduateIcon(
      graduate.achievement,
      graduate.language_certification_level.LabelShort,
    );
    const gradientClass = graduate.gradient?.className;
    const imageUrl = getImageUrl(graduate.StudentProfileImage);

    return (
      <div
        className={`relative group cursor-pointer ${className || ""}`}
        onClick={() => onClick?.(graduate)}
      >
        {/* Glowing background */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${gradientClass} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
        />

        {/* Main card */}
        <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
          <CardContent className="p-0">
            {/* Header with gradient */}
            <div
              className={`bg-gradient-to-r ${gradientClass} p-6 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={graduate.StudenName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {graduate.StudenName}
                </h3>
                <div className="flex justify-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    {graduate.language_certification_level.LabelShort}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    {graduate.branch.header}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Achievement and Score - Only show if they exist */}
              {(graduate.achievement || graduate.score_percentage > 0) && (
                <div className="flex items-center justify-between">
                  {graduate.achievement && (
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">
                        {graduate.achievement}
                      </span>
                    </div>
                  )}
                  {graduate.score_percentage > 0 && (
                    <Badge
                      variant="outline"
                      className="border-green-400/30 text-green-400 text-xs"
                    >
                      {graduate.score_percentage}%
                    </Badge>
                  )}
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(graduate.GraduateDate)}</span>
                </div>
                {graduate.certification && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{graduate.certification}</span>
                  </div>
                )}
              </div>

              {/* Current Status - Only show if it exists */}
              {graduate.currentStatus && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm text-gray-300 font-medium">
                    {graduate.currentStatus}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

GraduateCard.displayName = "GraduateCard";
