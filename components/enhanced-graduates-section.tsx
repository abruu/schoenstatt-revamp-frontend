"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Star, Award, Download, ExternalLink } from "lucide-react"

export function EnhancedGraduatesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const graduates = [
    {
      title: "B2 Level Graduates - December 2024",
      date: "December 2024",
      type: "Telc Certification",
      description:
        "Congratulations to our outstanding B2 level graduates including Zahra Thasneem and Liya Sanju who achieved excellent scores in their Telc examinations.",
      studentCount: 16,
      successRate: "100%",
      level: "B2",
      gradient: "from-yellow-400 to-orange-500",
      icon: Trophy,
      image: "/images/graduates-cert1.jpg",
      students: ["Zahra Thasneem", "Liya Sanju"],
    },
    {
      title: "A2 Level Graduates - November 2024",
      date: "November 2024",
      type: "Course Completion",
      description:
        "Celebrating the successful completion of A2 level German language course by our dedicated students with excellent performance.",
      studentCount: 24,
      successRate: "98%",
      level: "A2",
      gradient: "from-blue-400 to-purple-500",
      icon: Award,
      image: "/placeholder.svg?height=300&width=400",
      students: ["Multiple Students"],
    },
  ]

  return (
    <section className="space-y-16 scroll-animate fade-up">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 backdrop-blur-sm">
          <Star className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-yellow-400 font-medium">SLA GRADUATES</span>
        </div>

        <h2 className="text-4xl lg:text-6xl font-bold">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Success Stories</span>
        </h2>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Celebrating the achievements of our students who have successfully completed their German language journey
          with cutting-edge learning methodologies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {graduates.map((graduate, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glowing background */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${graduate.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
            ></div>

            {/* Main card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105">
              {/* Certificate Image */}
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <graduate.icon className="h-16 w-16 text-yellow-600 mx-auto" />
                    <h3 className="text-xl font-bold text-gray-800">Certificate Preview</h3>
                    <Badge className="bg-yellow-400 text-black">Level {graduate.level}</Badge>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-green-500 text-white animate-pulse">Certified</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-white/20 text-gray-300">
                    {graduate.type}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {graduate.studentCount} students
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      {graduate.successRate}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{graduate.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{graduate.description}</p>

                  {/* Featured Students */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Featured Graduates:</p>
                    <div className="flex flex-wrap gap-2">
                      {graduate.students.map((student, idx) => (
                        <Badge key={idx} className={`bg-gradient-to-r ${graduate.gradient} text-white`}>
                          {student}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-white font-medium">{graduate.successRate}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${graduate.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: hoveredCard === index ? graduate.successRate : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button size="sm" className={`bg-gradient-to-r ${graduate.gradient} text-white flex-1`}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          className="border-2 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 bg-transparent backdrop-blur-sm px-8 py-4 rounded-full hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
        >
          View All Graduates
        </Button>
      </div>
    </section>
  )
}
