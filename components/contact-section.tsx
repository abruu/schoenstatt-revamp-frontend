"use client"

import type React from "react"

import { useEffect } from "react"
import { Phone, Mail, MapPin, Clock, MessageCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ContactSection() {
  // Add scroll padding to account for fixed header
  useEffect(() => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.style.scrollMarginTop = "100px"
    }
  }, [])

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 799 4361 013"],
      gradient: "from-green-400 to-green-600",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["languageacademyschoenstatt@gmail.com"],
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Sion Centre, Kottekkad, Kuttoor, Thrissur, Kerala 680013"],
      gradient: "from-purple-400 to-purple-600",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
      gradient: "from-yellow-400 to-yellow-600",
    },
  ]

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 space-y-12 sm:space-y-16 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 backdrop-blur-sm">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" />
            <span className="text-green-400 font-medium text-sm sm:text-base">CONTACT US</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Start Your German Journey Today
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Ready to begin your German language adventure? Get in touch with us and take the first step towards your
            dreams in Germany.
          </p>
        </div>

        {/* Contact Information */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Get in Touch</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  We're here to help you achieve your German language goals. Reach out to us through any of the following
                  channels, or use our comprehensive registration form to get started.
                </p>
                <div className="pt-4">
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                      Register Now
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${info.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>

                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${info.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white text-sm sm:text-base">{info.title}</h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-400 text-sm sm:text-base break-words">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-lg sm:text-xl font-semibold text-white">Quick Actions</h4>
                <div className="grid gap-2 sm:gap-3">
                  <Button className="justify-start bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm sm:text-base py-2 sm:py-3">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule a Call
                  </Button>
                  <Button className="justify-start bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm sm:text-base py-2 sm:py-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Directions
                  </Button>
                  <Button className="justify-start bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm sm:text-base py-2 sm:py-3">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Brochure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
     
    </section>
  )
}
