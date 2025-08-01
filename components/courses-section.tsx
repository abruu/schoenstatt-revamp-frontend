"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function CoursesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase">OUR COURSES</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                We Offer German A1, A2, B1, B2 Courses
              </h2>

              <p className="text-lg text-gray-300 leading-relaxed">
              A1-B2 courses have a period of 10 months. We have a excellent faculty, among which we have priests, who were trained in Germany and have many years of experience studying and working in Germany. Our students learn not only the language, but also the German culture and life style, which are very important for those who aspire to go to Germany in order to work or to study
              </p>
            </div>

            <div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold px-8 py-4 rounded-lg shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  const contactSection = document.getElementById("contact")
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Apply For Next Batch
              </Button>
            </div>
          </div>

          {/* Course Card */}
          <div className="relative">
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

              {/* Main card container */}
              <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-3xl overflow-hidden shadow-2xl border border-blue-700/50">
                {/* Header with logo and title */}
                <div className="p-8 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-yellow-400 font-bold text-lg">SLA</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">SCHOENSTATT</h3>
                        <p className="text-yellow-400 font-semibold">LANGUAGE ACADEMY</p>
                      </div>
                    </div>
                    <div className="w-20 h-16 bg-white/10 rounded-lg overflow-hidden">
                      <Image
                        src="/images/hero-group.jpg"
                        alt="Students"
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <p className="text-blue-200 text-sm mb-6">AN INSTITUTE FOR GERMAN LANGUAGE STUDIES</p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-blue-200 mb-6">
                    <div className="space-y-2">
                      <p>• Experienced faculty with German training</p>
                      <p>• Cultural immersion programs</p>
                      <p>• Comprehensive language curriculum</p>
                    </div>
                    <div className="space-y-2">
                      <p>• Interactive learning methods</p>
                      <p>• Small batch sizes for personal attention</p>
                      <p>• Career guidance and placement support</p>
                    </div>
                  </div>

                  {/* Locations */}
                  <p className="text-blue-300 text-sm mb-4">
                    Kuttur (Thrissur) | Aloor (Chalakudy) | Peravaoor (Kannur)
                  </p>
                </div>

                {/* Bottom banner */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
                  <h4 className="text-yellow-400 text-2xl font-bold mb-2">Admission starts</h4>
                  <p className="text-white text-xl font-semibold">German A1, A2, B1, B2</p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400/20 rounded-full"></div>
                <div className="absolute bottom-20 left-4 w-6 h-6 bg-blue-400/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
