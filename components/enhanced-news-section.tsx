"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ExternalLink, Zap, Users, BookOpen, Building, Camera, User, Clock } from "lucide-react"
import Link from "next/link"
import { getEventsForNewsSection } from "@/lib/unified-events-data"

export function EnhancedNewsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const newsArticles = getEventsForNewsSection()

  return (
    <section className="space-y-16 scroll-animate fade-left">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
          <Zap className="h-5 w-5 text-blue-400 mr-2" />
          <span className="text-blue-400 font-medium">LATEST NEWS & UPDATES</span>
        </div>

        <h2 className="text-4xl lg:text-6xl font-bold">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Stay Informed</span>
        </h2>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Discover the latest news, achievements, and developments from our dynamic language learning community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {newsArticles.map((article, index) => (
          <div
            key={article.id}
            className="relative group"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glowing background */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${article.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
            ></div>

            {/* Main card */}
            <div className="relative bg-white/5 card-blur-soft border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 h-full flex flex-col">
              {/* Article Image */}
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient background if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 items-center justify-center hidden">
                  <article.icon className="h-16 w-16 text-gray-600" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <Badge className={`bg-gradient-to-r ${article.gradient} text-white`}>{article.type}</Badge>
                  {article.isNew && <Badge className="bg-red-500 text-white animate-pulse">New</Badge>}
                </div>

                {/* Gallery indicator */}
                {article.hasGallery && (
                  <div className="absolute bottom-4 right-4 z-20">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Camera className="h-3 w-3 text-white" />
                      <span className="text-xs text-white">{article.galleryCount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">{article.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{article.excerpt}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {article.location}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link href={`/events/${article.id}`}>
                    <Button
                      className={`w-full justify-between text-white hover:bg-gradient-to-r hover:${article.gradient} hover:text-black transition-all duration-300 group/btn bg-white/5 hover:bg-white/10 border border-white/10`}
                    >
                      Read Full Article
                      <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/events">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-400/30 text-blue-400 hover:bg-blue-400/10 bg-transparent backdrop-blur-sm px-8 py-4 rounded-full hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
          >
            View All News & Updates
          </Button>
        </Link>
      </div>
    </section>
  )
}
