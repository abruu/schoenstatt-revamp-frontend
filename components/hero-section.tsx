"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Award, Globe, Zap } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [counters, setCounters] = useState({ students: 0, success: 0, centers: 0 })

  useEffect(() => {
    setMounted(true)

    // Animate counters
    const animateCounter = (target: number, key: keyof typeof counters) => {
      let current = 0
      const increment = target / 100
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
      }, 20)
    }

    const timeout = setTimeout(() => {
      animateCounter(500, "students")
      animateCounter(95, "success")
      animateCounter(3, "centers")
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 text-sm font-medium">Next-Gen Language Learning</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Immerse Yourself In The World Of The{" "}
                </span>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                  German Language
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
              SLA is an Initiative of the Secular Institute of Schoenstatt Fathers, which offers German language courses, levels A1, A2, B1 and B2. Our branches are sited in Thrissur, Chalakudy and Peravoor. Our institute is founded in Germany with a charism to renew the church and the society through the covenant of love with our heavenly Mother.
              </p>
            </div>

            {/* Futuristic Stats */}
            <div className="grid grid-cols-3 gap-6 py-8">
              {[
                {
                  icon: Users,
                  value: counters.students,
                  suffix: "+",
                  label: "Students",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  icon: Award,
                  value: counters.success,
                  suffix: "%",
                  label: "Success Rate",
                  color: "from-green-400 to-green-600",
                },
                {
                  icon: Globe,
                  value: counters.centers,
                  suffix: "",
                  label: "Centers",
                  color: "from-purple-400 to-purple-600",
                },
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-500 hover:scale-105">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-8 py-4 rounded-full shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 group"
                onClick={() => {
                  const contactSection = document.getElementById("contact")
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full hover:border-white/40 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  const coursesSection = document.getElementById("courses")
                  if (coursesSection) {
                    coursesSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Explore Programs
              </Button>
            </div>
          </div>

          {/* Futuristic Image Container */}
          <div className="relative">
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

              {/* Main image container */}
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/Gallery/header_pic.jpg"
                  alt="SLA Students and Faculty"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2">
                  <span className="text-yellow-400 text-sm font-medium">Live Learning</span>
                </div>
              </div>

              {/* Floating geometric shapes */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-20 animate-bounce"></div>
              <div
                className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-30 animate-bounce"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
