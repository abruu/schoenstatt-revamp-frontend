"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function CoursesSection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-25 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-block">
                <span className="text-yellow-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">OUR COURSES</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                We Offer German A1, A2, B1, B2 Courses
              </h2>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              A1-B2 courses have a period of 10 months. We have a excellent faculty, among which we have priests, who were trained in Germany and have many years of experience studying and working in Germany. Our students learn not only the language, but also the German culture and life style, which are very important for those who aspire to go to Germany in order to work or to study
              </p>
            </div>

            <div>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                >
                  Apply For Next Batch
                </Button>
              </Link>
            </div>
          </div>

          {/* Course Card */}
           <div className="relative">
                      <div className="relative group">
                        {/* Glowing border effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                        {/* Main image container */}
                        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                          <Image
                            src="/images/Gallery/Our-Courses.webp"
                            alt="SLA Students and Faculty"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                          {/* Floating elements */}
                          {/* <div className="absolute top-4 right-4 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2">
                            <span className="text-yellow-400 text-sm font-medium">Live Learning</span>
                          </div> */}
                        </div>

                        {/* Floating geometric shapes */}

                      </div>
                    </div>
        </div>
      </div>
    </section>
  )
}
