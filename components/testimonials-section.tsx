"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Arjun Krishnan",
      course: "B2 Level Graduate",
      location: "Thrissur",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      feedback:
        "SLA transformed my German learning journey completely. The teachers are incredibly supportive and the curriculum is perfectly structured. I successfully cleared my B2 exam and now I'm pursuing my masters in Germany!",
      achievement: "Now studying in Munich, Germany",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      name: "Priya Menon",
      course: "A2 Level Graduate",
      location: "Chalakudy",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      feedback:
        "The learning environment at SLA is exceptional. The smart classrooms and interactive teaching methods made learning German enjoyable. The cultural insights provided were invaluable for my preparation.",
      achievement: "Secured job in Berlin",
      gradient: "from-green-400 to-green-600",
    },
    {
      name: "Rohit Nair",
      course: "B1 Level Graduate",
      location: "Peravoor",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      feedback:
        "SLA's career guidance program is outstanding. They not only taught me German but also helped me with job applications and interview preparation. The hostel facilities made my learning journey comfortable.",
      achievement: "Working at BMW, Germany",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      name: "Sneha Pillai",
      course: "A1 Level Graduate",
      location: "Thrissur",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      feedback:
        "As a beginner, I was nervous about learning German. But SLA's supportive environment and excellent teaching methodology made it so easy. The affordable fees and flexible timings were perfect for me.",
      achievement: "Continuing to B2 Level",
      gradient: "from-yellow-400 to-yellow-600",
    },
    {
      name: "Amal George",
      course: "B2 Level Graduate",
      location: "Chalakudy",
      image: "/placeholder.svg?height=400&width=400",
      rating: 5,
      feedback:
        "The Telc exam preparation at SLA is top-notch. The mock tests and personalized feedback helped me achieve excellent scores. The connection with Sprachforum Augsburg adds great value to the certification.",
      achievement: "PhD in Frankfurt, Germany",
      gradient: "from-pink-400 to-pink-600",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const activeTestimonial = testimonials[currentTestimonial]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-500/20 border border-pink-400/30 backdrop-blur-sm">
            <Quote className="h-5 w-5 text-pink-400 mr-2" />
            <span className="text-pink-400 font-medium">TESTIMONIALS</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              What Our Students Say
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Hear from our successful graduates who have achieved their German language goals and are now thriving in
            Germany.
          </p>
        </div>

        {/* Main Testimonial - Redesigned */}
        <div className="relative max-w-5xl mx-auto">
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${activeTestimonial.gradient} rounded-3xl blur-xl opacity-20 transition-all duration-500`}
          ></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
              {/* Student Image Column */}
              <div className="md:col-span-1">
                <div className="relative aspect-square">
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${activeTestimonial.gradient} rounded-2xl blur-lg opacity-50 transition-all duration-500`}
                  ></div>
                  <Image
                    src={activeTestimonial.image || "/placeholder.svg"}
                    alt={activeTestimonial.name}
                    width={400}
                    height={400}
                    className="relative w-full h-full object-cover rounded-2xl border-2 border-white/20"
                  />
                </div>
              </div>

              {/* Testimonial Content Column */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-xl lg:text-2xl text-gray-200 leading-relaxed italic relative">
                  <Quote className="absolute -top-4 -left-6 h-12 w-12 text-white/10" />"{activeTestimonial.feedback}"
                </blockquote>

                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-white">{activeTestimonial.name}</h4>
                  <p className="text-gray-400">
                    {activeTestimonial.course} • {activeTestimonial.location}
                  </p>
                  <div
                    className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${activeTestimonial.gradient} text-white text-sm font-medium`}
                  >
                    {activeTestimonial.achievement}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 z-20"
            size="icon"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 z-20"
            size="icon"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Testimonial Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? `bg-white scale-125` : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-300 ${
                index === currentTestimonial ? "scale-105 ring-2 ring-white/50" : "hover:scale-105"
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${testimonial.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <h5 className="font-semibold text-white">{testimonial.name}</h5>
                    <p className="text-sm text-gray-400">{testimonial.course}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 line-clamp-3">{testimonial.feedback}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}
