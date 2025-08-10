"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Award, Globe, Zap, Star, BookOpen, Play, ChevronDown } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [counters, setCounters] = useState({ students: 0, success: 0, centers: 0 })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    { text: "Best German learning experience!", author: "Maria K." },
    { text: "Excellent teaching methodology", author: "John D." },
    { text: "Achieved B2 level in 8 months", author: "Sarah L." }
  ]

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

    // Testimonial rotation
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => {
      clearTimeout(timeout)
      clearInterval(testimonialInterval)
    }
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
      
        {/* Subtle gradient orbs matching site style */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-16 pt-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Enhanced Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-orange-500/20 border border-yellow-400/40 backdrop-blur-lg shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
              <Zap className="h-5 w-5 text-yellow-400 mr-3 animate-pulse" />
              <span className="text-yellow-400 text-sm font-semibold tracking-wide">Next-Gen Language Learning</span>
            </div>

            {/* Dynamic Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
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

            {/* Rotating Testimonial */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center space-x-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="text-gray-300">
                  "{testimonials[currentTestimonial].text}"
                  <span className="text-yellow-400 font-semibold ml-2">- {testimonials[currentTestimonial].author}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-3 gap-4 py-8">
              {[
                {
                  icon: Users,
                  value: counters.students,
                  suffix: "+",
                  label: "Happy Students",
                  color: "from-blue-400 via-blue-500 to-blue-600",
                  bgColor: "from-blue-500/20 to-blue-600/20"
                },
                {
                  icon: Award,
                  value: counters.success,
                  suffix: "%",
                  label: "Success Rate",
                  color: "from-green-400 via-green-500 to-green-600",
                  bgColor: "from-green-500/20 to-green-600/20"
                },
                {
                  icon: Globe,
                  value: counters.centers,
                  suffix: "",
                  label: "Learning Centers",
                  color: "from-purple-400 via-purple-500 to-purple-600",
                  bgColor: "from-purple-500/20 to-purple-600/20"
                },
              ].map((stat, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <div className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:scale-110 transition-all duration-500 hover:border-white/40 shadow-lg hover:shadow-2xl`}>
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 text-black font-bold px-10 py-6 rounded-2xl shadow-2xl shadow-yellow-400/40 hover:shadow-yellow-400/60 transition-all duration-300 hover:scale-105 group text-lg border-2 border-yellow-300/50"
                  onClick={() => {
                    const contactSection = document.getElementById("contact")
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  Start Your Journey
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/15 bg-white/10 backdrop-blur-lg px-10 py-6 rounded-2xl hover:border-white/50 transition-all duration-300 hover:scale-105 group text-lg shadow-lg"
                  onClick={() => {
                    const coursesSection = document.getElementById("courses")
                    if (coursesSection) {
                      coursesSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <BookOpen className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  Explore Courses
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Classes Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Certified Instructors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Job Placement Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Visual Section */}
          <div className="relative animate-fade-in-right">
            <div className="relative group">
              {/* Enhanced glowing effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-blue-500 via-purple-600 to-yellow-400 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-gradient-x"></div>
              
              {/* Floating elements around image */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl opacity-30 animate-float shadow-2xl"></div>
              <div className="absolute -bottom-12 -right-12 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl opacity-40 animate-float-delayed shadow-2xl"></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-25 animate-bounce"></div>

              {/* Main enhanced image container */}
              <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/30 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/Gallery/header_pic.jpg"
                  alt="SLA Students and Faculty"
                  width={700}
                  height={500}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Enhanced overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-blue-600/10"></div>

                {/* Enhanced floating badges */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-lg border border-yellow-400/50 rounded-2xl px-6 py-3 shadow-lg">
                  <span className="text-yellow-300 text-sm font-bold flex items-center">
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Live Interactive Classes
                  </span>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-500/30 to-purple-600/30 backdrop-blur-lg border border-blue-400/50 rounded-2xl px-6 py-3 shadow-lg">
                  <span className="text-blue-300 text-sm font-bold flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    German Certification
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-8deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; background-size: 200% 200%; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 2s; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.8s ease-out 0.2s both; }
      `}</style>
    </section>
  )
}
