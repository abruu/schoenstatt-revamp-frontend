"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ExternalLink, Zap, Users, BookOpen } from "lucide-react"

export function UpdatesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const updates = [
    {
      title: "Visit of Fr. Francisco Sobral",
      date: "March 2025",
      location: "Thrissur Center",
      type: "Special Visit",
      description:
        "We were honored to host Fr. Francisco Sobral for a special visit to our Thrissur center, where he interacted with students and faculty.",
      isNew: true,
      icon: Users,
      gradient: "from-purple-400 to-pink-500",
      category: "Event",
    },
    {
      title: "Students in Koblenz, Germany",
      date: "February 2025",
      location: "Koblenz, Germany",
      type: "Study Abroad",
      description:
        "Our successful graduates are now pursuing their higher studies in Germany, representing SLA with excellence.",
      isNew: true,
      icon: MapPin,
      gradient: "from-green-400 to-blue-500",
      category: "Achievement",
    },
    {
      title: "New B1 Batch Enrollment",
      date: "January 2025",
      location: "All Centers",
      type: "Enrollment",
      description: "Registration is now open for our new B1 level German language course across all three centers.",
      isNew: false,
      icon: BookOpen,
      gradient: "from-yellow-400 to-orange-500",
      category: "Enrollment",
    },
  ]

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
          <Zap className="h-5 w-5 text-blue-400 mr-2" />
          <span className="text-blue-400 font-medium">Latest Updates</span>
        </div>

        <h2 className="text-4xl lg:text-6xl font-bold">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SLA Updates</span>
        </h2>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Stay connected with the latest news, events, and achievements from our futuristic language learning ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {updates.map((update, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glowing background */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${update.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
            ></div>

            {/* Main card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 h-full flex flex-col">
              {/* Header */}
              <div className={`bg-gradient-to-r ${update.gradient} p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <update.icon className="h-6 w-6 text-white" />
                    </div>
                    {update.isNew && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">New</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">{update.title}</h3>
                  <Badge className="bg-white/20 text-white border-white/30">{update.category}</Badge>
                </div>

                {/* Animated elements */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className="border-white/20 text-gray-300">
                      {update.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {update.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {update.location}
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed flex-1">{update.description}</p>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between text-white hover:bg-gradient-to-r hover:${update.gradient} hover:text-black transition-all duration-300 group/btn`}
                >
                  Read More
                  <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          className="border-2 border-blue-400/30 text-blue-400 hover:bg-blue-400/10 bg-transparent backdrop-blur-sm px-8 py-4 rounded-full hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
        >
          View All Updates
        </Button>
      </div>
    </section>
  )
}
