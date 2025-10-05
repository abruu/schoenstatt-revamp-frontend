"use client"
import { ImageSlider } from "@/components/common/image-slider"
import { SkeletonLoader } from "@/components/common/skeleton-loader"
import { GraduateCard } from "@/components/common/graduate-card"
import { useGraduates } from "@/hooks/use-graduates"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Trophy,
  Award,
  Medal,
  Star,
  Users,
  Calendar,
  MapPin,
  GraduationCap,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

// Add fade-in animation styles
const fadeInStyles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
    opacity: 0;
  }
`

const gallery = [
  "/images/SLA gratuates/SLA gratuates 1.jpg",
  "/images/SLA gratuates/sla gratutes 2.jpg",
  "/images/SLA gratuates/SLA gratutes 3.jpg",
  "/images/SLA gratuates/gratues 1.jpg",
  "/images/SLA gratuates/gratues 2.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-00.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-01.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-02.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-03.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-04.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-05.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-06.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-07.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-08.jpg",
  "/images/SLA gratuates/PHOTO-2025-04-04-01-45-09.jpg",
  "/images/SLA gratuates/PHOTO-2025-06-23-21-08-10.jpg",
  "/images/SLA gratuates/PHOTO-2025-06-26-16-02-31.jpg",
  "/images/SLA gratuates/sep_8_25/WhatsApp Image 2025-09-08 at 10.38.12 AM.jpeg",
  "/images/SLA gratuates/sep_8_25/WhatsApp Image 2025-09-08 at 10.38.31 AM.jpeg",
  "/images/SLA gratuates/sep_8_25/WhatsApp Image 2025-09-08 at 10.38.44 AM.jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.16 PM.jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.17 PM (1).jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.17 PM (2).jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.17 PM.jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.18 PM.jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.30 PM (1).jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.30 PM (2).jpeg",
  "/images/SLA gratuates/8_29/WhatsApp Image 2025-08-29 at 2.24.31 PM.jpeg",
  "/images/SLA gratuates/9_14/1.jpeg",
  "/images/SLA gratuates/9_14/2.jpeg",
  "/images/SLA gratuates/9_14/3.jpeg",
  "/images/SLA gratuates/9_14/4.jpeg",
  "/images/SLA gratuates/9_14/5.jpeg",
]

export function GraduatesPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCenter, setSelectedCenter] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedGraduate, setSelectedGraduate] = useState<any>(null)

  // Use the custom hook for data management
  const {
    graduates,
    loading,
    error,
    hasMore,
    loadingMore,
    filteredGraduates,
    stats,
    actions
  } = useGraduates({
    searchTerm,
    selectedLevel,
    selectedCenter,
    selectedYear,
    autoFetch: true
  })

  // Infinite scroll setup
  const { loadingRef } = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: actions.loadMore,
    threshold: 300
  })

  return (
    <div className="pt-24 pb-16">
      {/* Inject fade-in animation styles */}
      <style jsx>{fadeInStyles}</style>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 backdrop-blur-sm">
            <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-medium">Success Stories</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Our Graduates</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Celebrating the achievements of our students who have successfully completed their German language journey
            and are now pursuing their dreams in Germany and beyond.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Graduates", value: stats.total, icon: Users, gradient: "from-blue-400 to-blue-600" },
            { label: "B2 Certified", value: stats.b2, icon: Trophy, gradient: "from-yellow-400 to-yellow-600" },
            {
              label: "Working in Germany",
              value: stats.employed,
              icon: MapPin,
              gradient: "from-green-400 to-green-600",
            },
            {
              label: "Average Score",
              value: `${stats.avgScore}%`,
              icon: Star,
              gradient: "from-purple-400 to-purple-600",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 mb-12">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search graduates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-10 text-sm">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-10 text-sm">
                  <SelectValue placeholder="Center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Centers</SelectItem>
                  <SelectItem value="Thrissur">Thrissur</SelectItem>
                  <SelectItem value="Chalakudy">Chalakudy</SelectItem>
                  <SelectItem value="Peravoor">Peravoor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-10 text-sm">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <SkeletonLoader 
            count={10} 
            show={loading} 
            variant="graduate-card"
            className="mb-12"
          />
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Graduates</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button 
                onClick={actions.refresh}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredGraduates.length === 0 && graduates.length > 0 && (
          <div className="text-center py-16 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Graduates Found</h3>
              <p className="text-gray-400 mb-6">
                No graduates match your current search and filter criteria. Try adjusting your filters.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedLevel("all")
                  setSelectedCenter("all")
                  setSelectedYear("all")
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && graduates.length === 0 && (
          <div className="text-center py-16 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Graduates Available</h3>
              <p className="text-gray-400 mb-6">
                There are no graduate records available at the moment. Please check back later.
              </p>
              <Button 
                onClick={actions.refresh}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Graduates Grid */}
        {!loading && !error && filteredGraduates.length > 0 && (
          <div className="space-y-8 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filteredGraduates.map((graduate, index) => (
                <div
                  key={graduate.documentId}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GraduateCard
                    graduate={graduate}
                    onClick={setSelectedGraduate}
                  />
                </div>
              ))}
            </div>

            {/* Infinite Scroll Loading Indicator */}
            {hasMore && (
              <div ref={loadingRef} className="flex justify-center py-8">
                {loadingMore ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more graduates...</span>
                  </div>
                ) : (
                  <div className="h-8" /> // Invisible trigger element
                )}
              </div>
            )}

            {/* End of Content Message */}
            {!hasMore && filteredGraduates.length > 10 && (
              <div className="text-center py-8">
                <p className="text-gray-400">You've reached the end of the graduates list</p>
              </div>
            )}
          </div>
        )}


        {/* Graduate Detail Modal */}
        {selectedGraduate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 pt-20 md:pt-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[80vh] md:max-h-[90vh] overflow-y-auto my-auto">
              <div className={`bg-gradient-to-r ${selectedGraduate.gradient?.className || 'from-blue-400 to-purple-500'} p-4 sm:p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={selectedGraduate.StudentProfileImage?.url || selectedGraduate.StudentProfileImage?.formats?.thumbnail?.url || "/placeholder.svg"}
                          alt={selectedGraduate.StudenName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center sm:text-left mt-2 sm:mt-0">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{selectedGraduate.StudenName}</h2>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">
                            {selectedGraduate.language_certification_level.LabelFull}
                          </Badge>
                          {/* <Badge className="bg-white/20 text-white border-white/30">
                            {selectedGraduate.branch.header}
                          </Badge> */}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGraduate(null)}
                      className="text-white hover:bg-white/20 absolute top-2 right-2"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    {selectedGraduate.achievement && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Achievement</h4>
                        <p className="text-white">{selectedGraduate.achievement}</p>
                      </div>
                    )}
                    {selectedGraduate.score_percentage > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Score</h4>
                        <p className="text-green-400 font-bold">{selectedGraduate.score_percentage}%</p>
                      </div>
                    )}
                    {selectedGraduate.certification && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Certification</h4>
                        <p className="text-white">{selectedGraduate.certification}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Graduate Date</h4>
                      <p className="text-white">{new Date(selectedGraduate.GraduateDate).toLocaleDateString()}</p>
                    </div>
                    {selectedGraduate.currentStatus && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Current Status</h4>
                        <p className="text-white">{selectedGraduate.currentStatus}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Center</h4>
                      <p className="text-white">{selectedGraduate.branch.name}</p>
                    </div>
                  </div>
                </div>

                {selectedGraduate.testimonial && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Testimonial</h4>
                    <blockquote className="text-gray-300 italic border-l-4 border-yellow-400 pl-4">
                      "{selectedGraduate.testimonial}"
                    </blockquote>
                  </div>
                )}

                <div className="flex justify-center sm:justify-start pt-4">
                  {selectedGraduate.certificate && (
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="w-full lg:w-9/12 mx-auto">
          <ImageSlider
          fullView={false}
            key={'selectedBranch'}
            images={gallery}
            altPrefix={'Graduate'}
            className="w-full h-[500px] rounded-2xl bg-black/10"
          />
        </div>
      </div>
    </div>
  )
}
