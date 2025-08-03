"use client"

import { useState } from "react"
import { GraduationCap, Home, Award, Users, DollarSign, Monitor, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button" // Assuming Button component is imported from a UI library

export function WhyChooseUsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: GraduationCap,
      title: "Telc Exams",
      description: "In cooperation with 'Sprachforum Augsburg' center.",
      gradient: "from-blue-400 to-blue-600",
      delay: "0ms",
    },
    {
      icon: Home,
      title: "Hostel Facilities",
      description: "Comfortable accommodation and delicious food.",
      gradient: "from-green-400 to-green-600",
      delay: "100ms",
    },
    {
      icon: Award,
      title: "Exam Preparation Course",
      description: "Preparation for B2 Telc certificate exam level.",
      gradient: "from-purple-400 to-purple-600",
      delay: "200ms",
    },
    {
      icon: Users,
      title: "Career Guidance",
      description: "Assistance with placements and support in Germany.",
      gradient: "from-orange-400 to-orange-600",
      delay: "300ms",
    },
    {
      icon: DollarSign,
      title: "Affordable Fee",
      description: "Fees customized to suit your budget constraints.",
      gradient: "from-yellow-400 to-yellow-600",
      delay: "400ms",
    },
    {
      icon: Monitor,
      title: "Smart Classrooms",
      description: "State-of-the-art technology for optimal learning.",
      gradient: "from-pink-400 to-pink-600",
      delay: "500ms",
    },
  ]

  return (
    <section className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-medium">WHY CHOOSE US</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Best Platform To Learn
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              German Language In Kerala
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            The students who come to us thereby greatly appreciate the classes in SLA. They learn not only the language,
            but also the German culture and life style, which are very important for those who aspire to go to Germany
            to work or to study. Our program serves as your gateway to effortless language mastery, providing the
            essential foundation for a successful academic experience overseas.
          </p>

          {/* Learn More Button */}
          <div className="mt-10 text-center">
            <Link href="/about">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 hover:scale-105"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: feature.delay }}
            >
              {/* Glowing background */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
              ></div>

              {/* Main card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 h-full">
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
