"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Award, Globe, Zap, Star, BookOpen, Play, ChevronDown } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [counters, setCounters] = useState({ students: 0, success: 0, centers: 0 })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

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

    // Enhanced scroll effects
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Check if hero section is in view
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        setIsInView(inView)
      }
    }

    // Intersection Observer for more precise visibility detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current) {
            setIsInView(entry.isIntersecting)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    // Smooth scroll listener with throttling
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      clearTimeout(timeout)
      clearInterval(testimonialInterval)
      window.removeEventListener('scroll', throttledScroll)
      observer.disconnect()
    }
  }, [])

  if (!mounted) return null

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
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

      <div className="w-full h-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-24 sm:pt-28 pb-16 sm:pb-20 relative z-10 flex items-center">
        <div className="max-w-8xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 xl:gap-16 items-center h-full">
          {/* Enhanced Content */}
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-orange-500/20 border border-yellow-400/40 backdrop-blur-lg shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2 sm:mr-3 animate-pulse" />
              <span className="text-yellow-400 text-xs sm:text-sm font-semibold tracking-wide">Next-Gen Language Learning</span>
            </div>

            {/* Dynamic Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Immerse Yourself In The World Of The{" "}
                </span>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                  German Language
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
              SLA is an Initiative of the Secular Institute of Schoenstatt Fathers, which offers German language courses, levels A1, A2, B1 and B2. Our branches are sited in Thrissur, Chalakudy and Peravoor. Our institute is founded in Germany with a charism to renew the church and the society through the covenant of love with our heavenly Mother.
              </p>
            </div>

            {/* Rotating Testimonial */}
            <div className="">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full border-2 border-white/20"></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white/20"></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white/20"></div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-white/90 italic mb-2 sm:mb-3 text-sm sm:text-lg leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-gray-400 font-medium text-sm">— {testimonials[currentTestimonial].author}</p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10">
              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-1">
                  {counters.students}+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm font-medium">Happy Students</div>
              </div>
              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-1">
                  {counters.success}%
                </div>
                <div className="text-gray-400 text-xs sm:text-sm font-medium">Success Rate</div>
              </div>
              <div className="text-center group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-1">
                  {counters.centers}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm font-medium">Learning Centers</div>
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 group text-sm sm:text-base w-full sm:w-auto"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 group text-sm sm:text-base w-full sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
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

          {/* Enhanced Image Section with Advanced Scroll Effects */}
          <div 
            ref={imageRef}
            className="relative group animate-fade-in-right"
            style={{
              transform: `translateY(${scrollY * 0.1}px) scale(${isInView ? 1 : 0.95})`,
              opacity: isInView ? 1 : 0.8,
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
          >
            {/* Enhanced Glow effect with scroll interaction */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 rounded-[2rem] blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500"
              style={{
                transform: `scale(${1 + scrollY * 0.0002})`,
                opacity: Math.max(0.3, 0.75 - scrollY * 0.001)
              }}
            ></div>
            
            {/* Floating elements with enhanced scroll physics */}
            <div 
              className="absolute -top-12 -left-12 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl opacity-30 shadow-2xl transition-all duration-300"
              style={{
                transform: `translateY(${scrollY * -0.15}px) rotate(${scrollY * 0.05}deg)`,
                opacity: Math.max(0.1, 0.3 - scrollY * 0.0008)
              }}
            ></div>
            <div 
              className="absolute -bottom-12 -right-12 w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl opacity-40 shadow-2xl transition-all duration-300"
              style={{
                transform: `translateY(${scrollY * 0.12}px) rotate(${scrollY * -0.03}deg)`,
                opacity: Math.max(0.15, 0.4 - scrollY * 0.0006)
              }}
            ></div>
            <div 
              className="absolute top-1/2 -right-4 sm:-right-6 md:-right-8 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-25 transition-all duration-300"
              style={{
                transform: `translateY(${scrollY * -0.08}px) scale(${1 + Math.sin(scrollY * 0.01) * 0.1})`,
                opacity: Math.max(0.1, 0.25 - scrollY * 0.0005)
              }}
            ></div>

            {/* Main enhanced image container with advanced scroll effects */}
            <div 
              className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/30 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02]"
              style={{
                transform: `perspective(1000px) rotateX(${scrollY * 0.02}deg) rotateY(${scrollY * 0.01}deg)`,
                boxShadow: `0 ${20 + scrollY * 0.05}px ${40 + scrollY * 0.1}px rgba(0,0,0,0.3)`
              }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src="/images/Gallery/header_pic.jpg"
                  alt="SLA Students and Faculty"
                  width={700}
                  height={500}
                  className="w-full h-auto object-cover transition-transform duration-700"
                  style={{
                    transform: `scale(${1.05 + scrollY * 0.0001}) translateY(${scrollY * -0.05}px)`,
                    filter: `brightness(${Math.max(0.8, 1 - scrollY * 0.0003)}) contrast(${Math.max(0.9, 1 + scrollY * 0.0002)})`
                  }}
                />
              </div>
              
              {/* Enhanced overlay gradients with scroll interaction */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300"
                style={{ opacity: Math.min(0.6, 0.3 + scrollY * 0.0008) }}
              ></div>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-blue-600/10 transition-opacity duration-300"
                style={{ opacity: Math.max(0.05, 0.1 - scrollY * 0.0003) }}
              ></div>

              {/* Enhanced floating badges with responsive design */}
              <div 
                className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-lg border border-yellow-400/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 shadow-lg transition-all duration-300"
                style={{
                  transform: `translateY(${scrollY * -0.03}px) scale(${Math.max(0.8, 1 - scrollY * 0.0002)})`,
                  opacity: Math.max(0.6, 1 - scrollY * 0.0008)
                }}
              >
                <span className="text-yellow-300 text-xs sm:text-sm font-bold flex items-center">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-pulse" />
                  <span className="hidden sm:inline">Live Interactive Classes</span>
                  <span className="sm:hidden">Live Classes</span>
                </span>
              </div>
              
              {/* Mobile-optimized bottom badge */}
              <div 
                className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 bg-gradient-to-r from-blue-500/30 to-purple-600/30 backdrop-blur-lg border border-blue-400/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 shadow-lg transition-all duration-300"
                style={{
                  transform: `translateY(${scrollY * 0.02}px) scale(${Math.max(0.8, 1 - scrollY * 0.0002)})`,
                  opacity: Math.max(0.6, 1 - scrollY * 0.0008)
                }}
              >
                <span className="text-blue-300 text-xs sm:text-sm font-bold flex items-center">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">German Certification</span>
                  <span className="sm:hidden">Certified</span>
                </span>
              </div>

              {/* Interactive scroll progress indicator */}
              <div 
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-blue-600 transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (scrollY / (typeof window !== 'undefined' ? window.innerHeight : 800)) * 100)}%`,
                  opacity: scrollY > 50 ? 0.8 : 0
                }}
              ></div>
            </div>

            {/* Mobile touch interaction hint */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 md:hidden">
              <div className="flex items-center space-x-2 text-white/60 text-xs animate-pulse">
                <ChevronDown className="h-4 w-4" />
                <span>Scroll to explore</span>
                <ChevronDown className="h-4 w-4" />
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
