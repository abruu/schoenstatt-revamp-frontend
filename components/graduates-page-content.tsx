"use client"
import { ImageSlider } from "@/components/common/image-slider"

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
} from "lucide-react"

interface Graduate {
  id: string
  name: string
  course: string
  level: string
  batch: string
  year: string
  center: string
  score: string
  certification: string
  currentStatus: string
  image: string
  achievement: string
  testimonial: string
  gradient: string
  icon: any
}

const graduatesData: Graduate[] = [
  {
    id: "1",
    name: "Maria Joseph",
    course: "German B2",
    level: "B2",
    batch: "June 2025",
    year: "2025",
    center: "Thrissur",
    score: "95%",
    certification: "Telc B2",
    currentStatus: "Working in Germany",
    image: "/placeholder.svg?height=120&width=120",
    achievement: "Highest Score in B2 Telc Exam",
    testimonial: "SLA provided excellent training that helped me achieve my dream of working in Germany.",
    gradient: "from-yellow-400 to-orange-500",
    icon: Trophy,
  },
  {
    id: "2",
    name: "John Sebastian",
    course: "German B2",
    level: "B2",
    batch: "June 2025",
    year: "2025",
    center: "Chalakudy",
    score: "92%",
    certification: "Telc B2",
    currentStatus: "Studying in Germany",
    image: "/placeholder.svg?height=120&width=120",
    achievement: "Outstanding Performance",
    testimonial: "The faculty at SLA are exceptional. They made learning German enjoyable and effective.",
    gradient: "from-blue-400 to-purple-500",
    icon: Award,
  },
  {
    id: "3",
    name: "Anna Thomas",
    course: "German A2",
    level: "A2",
    batch: "April 2025",
    year: "2025",
    center: "Peravoor",
    score: "89%",
    certification: "Course Completion",
    currentStatus: "Preparing for B1",
    image: "/placeholder.svg?height=120&width=120",
    achievement: "Best Student Award",
    testimonial: "SLA's teaching methodology is outstanding. I'm now confident in German communication.",
    gradient: "from-green-400 to-teal-500",
    icon: Medal,
  },
  {
    id: "4",
    name: "David Wilson",
    course: "German B1",
    level: "B1",
    batch: "March 2025",
    year: "2025",
    center: "Thrissur",
    score: "91%",
    certification: "Telc B1",
    currentStatus: "Job Training in Germany",
    image: "/placeholder.svg?height=120&width=120",
    achievement: "Excellence in Speaking",
    testimonial: "The practical approach at SLA helped me communicate effectively in German workplace.",
    gradient: "from-purple-400 to-pink-500",
    icon: Star,
  },
  {
    id: "5",
    name: "Sarah Matthew",
    course: "German A1",
    level: "A1",
    batch: "February 2025",
    year: "2025",
    center: "Chalakudy",
    score: "87%",
    certification: "Course Completion",
    currentStatus: "Continuing to A2",
    image: "/placeholder.svg?height=120&width=120",
    achievement: "Most Improved Student",
    testimonial: "Starting from zero, SLA helped me build a strong foundation in German language.",
    gradient: "from-red-400 to-orange-500",
    icon: GraduationCap,
  },
  {
    id: "6",
    name: "Michael George",
    course: "German B2",
    level: "B2",
    batch: "January 2025",
    year: "2025",
    center: "Peravoor",
    score: "94%",
    certification: "Telc B2",
    currentStatus: "Employed in Munich",
    image: "/placeholder.svg?height=120&width=120",
    achievement: "Perfect Grammar Score",
    testimonial: "SLA's comprehensive curriculum prepared me perfectly for life and work in Germany.",
    gradient: "from-indigo-400 to-blue-500",
    icon: Trophy,
  },
]

const gallery=[
  "https://static.vecteezy.com/system/resources/previews/010/938/844/non_2x/tropical-purple-butterfly-illustration-beautiful-butterfly-vector.jpg",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
]

export function GraduatesPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCenter, setSelectedCenter] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGraduate, setSelectedGraduate] = useState<Graduate | null>(null)

  const itemsPerPage = 6

  const filteredGraduates = useMemo(() => {
    return graduatesData.filter((graduate) => {
      const matchesSearch =
        graduate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        graduate.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        graduate.achievement.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = selectedLevel === "all" || graduate.level === selectedLevel
      const matchesCenter = selectedCenter === "all" || graduate.center === selectedCenter
      const matchesYear = selectedYear === "all" || graduate.year === selectedYear

      return matchesSearch && matchesLevel && matchesCenter && matchesYear
    })
  }, [searchTerm, selectedLevel, selectedCenter, selectedYear])

  const totalPages = Math.ceil(filteredGraduates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedGraduates = filteredGraduates.slice(startIndex, startIndex + itemsPerPage)

  const stats = {
    total: graduatesData.length,
    b2: graduatesData.filter((g) => g.level === "B2").length,
    employed: graduatesData.filter((g) => g.currentStatus.includes("Germany")).length,
    avgScore: Math.round(graduatesData.reduce((acc, g) => acc + Number.parseInt(g.score), 0) / graduatesData.length),
  }

  return (
    <div className="pt-24 pb-16">
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search graduates by name, course, or achievement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-32 bg-white/10 border-white/20 text-white">
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
                <SelectTrigger className="w-full sm:w-36 bg-white/10 border-white/20 text-white">
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
                <SelectTrigger className="w-full sm:w-28 bg-white/10 border-white/20 text-white">
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

        {/* Graduates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedGraduates.map((graduate) => (
            <div
              key={graduate.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedGraduate(graduate)}
            >
              {/* Glowing background */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${graduate.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
              ></div>

              {/* Main card */}
              <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${graduate.gradient} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        <img
                          src={graduate.image || "/placeholder.svg"}
                          alt={graduate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{graduate.name}</h3>
                      <div className="flex justify-center gap-2">
                        <Badge className="bg-white/20 text-white border-white/30 text-xs">{graduate.level}</Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs">{graduate.center}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <graduate.icon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">{graduate.achievement}</span>
                      </div>
                      <Badge variant="outline" className="border-green-400/30 text-green-400 text-xs">
                        {graduate.score}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{graduate.batch}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>{graduate.certification}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <p className="text-sm text-gray-300 font-medium">{graduate.currentStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "bg-yellow-400 text-black hover:bg-yellow-500"
                      : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Graduate Detail Modal */}
        {selectedGraduate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className={`bg-gradient-to-r ${selectedGraduate.gradient} p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={selectedGraduate.image || "/placeholder.svg"}
                          alt={selectedGraduate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedGraduate.name}</h2>
                        <div className="flex gap-2">
                          <Badge className="bg-white/20 text-white border-white/30">{selectedGraduate.course}</Badge>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {selectedGraduate.center} Center
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGraduate(null)}
                      className="text-white hover:bg-white/20"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Achievement</h4>
                      <p className="text-white">{selectedGraduate.achievement}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Score</h4>
                      <p className="text-green-400 font-bold">{selectedGraduate.score}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Certification</h4>
                      <p className="text-white">{selectedGraduate.certification}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Batch</h4>
                      <p className="text-white">{selectedGraduate.batch}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Current Status</h4>
                      <p className="text-white">{selectedGraduate.currentStatus}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Testimonial</h4>
                  <blockquote className="text-gray-300 italic border-l-4 border-yellow-400 pl-4">
                    "{selectedGraduate.testimonial}"
                  </blockquote>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="w-full lg:w-9/12 mx-auto ">
       <ImageSlider
                      key={'selectedBranch'}
                      images={gallery}
                      altPrefix={'text'}
                    /></div>
      </div>
    </div>
  )
}
