"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Award, Building, Camera, Filter, Search, ChevronRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export function EventsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")

  const events = [
    {
      id: 1,
      title: "New SLA Building at Kuttur, Thrissur",
      description:
        "Grand opening of our new state-of-the-art facility at Kuttur, Thrissur with modern classrooms, advanced language labs, and comfortable student facilities.",
      date: "January 15, 2025",
      category: "Infrastructure",
      type: "New Building",
      location: "Kuttur, Thrissur",
      image: "/placeholder.svg?height=300&width=400",
      icon: Building,
      gradient: "from-blue-400 to-blue-600",
      priority: "high",
      isNew: true,
      gallery: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    },
    {
      id: 2,
      title: "B2 Level Graduates - December 2024",
      description:
        "Celebrating the outstanding achievements of our B2 level graduates including Zahra Thasneem and Liya Sanju who successfully completed their Telc certification with excellent scores.",
      date: "December 20, 2024",
      category: "Graduation",
      type: "Certificate Ceremony",
      location: "All Centers",
      image: "/images/graduates-cert1.jpg",
      icon: Award,
      gradient: "from-yellow-400 to-yellow-600",
      priority: "high",
      isNew: true,
      gallery: [
        "/images/graduates-cert1.jpg",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    },
    {
      id: 3,
      title: "SLA Connects - Students in Germany",
      description:
        "Our successful students including Theresa Davis, Meera Xavier, Sabitha Jose, Calvin Vinesh, Joel Biju, and Amal K Sujit have secured excellent opportunities in Germany.",
      date: "December 15, 2024",
      category: "Success Story",
      type: "Achievement",
      location: "Germany",
      image: "/placeholder.svg?height=300&width=400",
      icon: Users,
      gradient: "from-green-400 to-green-600",
      priority: "medium",
      isNew: false,
      gallery: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    },
    {
      id: 4,
      title: "SLA Cares - Community Outreach Program",
      description:
        "Our faculty and students participated in various community service activities, strengthening bonds with the local community and giving back to society through meaningful initiatives.",
      date: "December 10, 2024",
      category: "Community",
      type: "Social Service",
      location: "All Centers",
      image: "/placeholder.svg?height=300&width=400",
      icon: Users,
      gradient: "from-purple-400 to-purple-600",
      priority: "medium",
      isNew: false,
      gallery: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    },
    {
      id: 5,
      title: "A2 Level Graduation Ceremony",
      description:
        "Proud celebration of our A2 level course completers who have successfully mastered the elementary level of German language with dedication and hard work.",
      date: "November 25, 2024",
      category: "Graduation",
      type: "Certificate Ceremony",
      location: "Chalakudy Center",
      image: "/placeholder.svg?height=300&width=400",
      icon: Award,
      gradient: "from-orange-400 to-red-500",
      priority: "medium",
      isNew: false,
      gallery: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    },
    {
      id: 6,
      title: "German Cultural Festival 2024",
      description:
        "Students and faculty came together to celebrate German traditions, food, music, and customs in a vibrant cultural event that showcased the rich heritage of Germany.",
      date: "October 15, 2024",
      category: "Cultural",
      type: "Festival",
      location: "Thrissur Center",
      image: "/placeholder.svg?height=300&width=400",
      icon: Users,
      gradient: "from-pink-400 to-purple-500",
      priority: "low",
      isNew: false,
      gallery: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
    },
  ]

  const categories = [
    { id: "all", name: "All Events", count: events.length },
    {
      id: "Infrastructure",
      name: "Infrastructure",
      count: events.filter((e) => e.category === "Infrastructure").length,
    },
    { id: "Graduation", name: "Graduations", count: events.filter((e) => e.category === "Graduation").length },
    {
      id: "Success Story",
      name: "Success Stories",
      count: events.filter((e) => e.category === "Success Story").length,
    },
    { id: "Community", name: "Community", count: events.filter((e) => e.category === "Community").length },
    { id: "Cultural", name: "Cultural", count: events.filter((e) => e.category === "Cultural").length },
  ]

  const filteredEvents = events
    .filter((event) => selectedCategory === "all" || event.category === selectedCategory)
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return (
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
        )
      }
      return a.title.localeCompare(b.title)
    })

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
          <Calendar className="h-5 w-5 text-blue-400 mr-2" />
          <span className="text-blue-400 font-medium">EVENTS & UPDATES</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            SLA Events & News
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Stay updated with all the latest events, achievements, and news from Schoenstatt Language Academy.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="space-y-6">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {category.name}
              <Badge className="bg-white/20 text-xs">{category.count}</Badge>
            </Button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400/50"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="priority">Sort by Priority</SelectItem>
              <SelectItem value="title">Sort by Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event, index) => (
          <div key={event.id} className="relative group">
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${event.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`}
            ></div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 h-full flex flex-col">
              {/* Event Image */}
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-600" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <Badge className={`bg-gradient-to-r ${event.gradient} text-white`}>{event.type}</Badge>
                  {event.isNew && <Badge className="bg-red-500 text-white animate-pulse">New</Badge>}
                </div>

                {/* Gallery indicator */}
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Camera className="h-3 w-3 text-white" />
                    <span className="text-xs text-white">{event.gallery.length}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className="border-white/20 text-gray-300">
                      {event.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">{event.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <Link href={`/events/${event.id}`} className="flex-1">
                    <Button
                      className={`w-full bg-gradient-to-r ${event.gradient} text-white hover:scale-105 transition-all duration-300`}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Button size="icon" className="bg-white/10 hover:bg-white/20 border border-white/20">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {filteredEvents.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-400/30 text-blue-400 hover:bg-blue-400/10 bg-transparent backdrop-blur-sm px-8 py-4 rounded-full hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
          >
            Load More Events
          </Button>
        </div>
      )}
    </div>
  )
}
