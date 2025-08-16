"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Phone, Mail, MapPin, Clock, MessageCircle, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    center: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add scroll padding to account for fixed header
  useEffect(() => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.style.scrollMarginTop = "100px"
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      center: "",
      message: "",
    })
    setIsSubmitting(false)

    // Show success message (you can implement toast notification here)
    alert("Thank you for your inquiry! We'll get back to you soon.")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-xl opacity-20"></div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                    Get In Touch
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    Ready to start your German language journey? Fill out the form below and we'll get back to you
                    within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-400/50 focus:ring-green-400/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-400/50 focus:ring-green-400/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-400/50 focus:ring-green-400/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Course Interest</label>
                      <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-green-400/50">
                          <SelectValue placeholder="Select course level" />
                        </SelectTrigger>
                        <SelectContent className="order-white/10">
                          <SelectItem value="a1">A1 - Beginner</SelectItem>
                          <SelectItem value="a2">A2 - Elementary</SelectItem>
                          <SelectItem value="b1">B1 - Intermediate</SelectItem>
                          <SelectItem value="b2">B2 - Upper Intermediate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Preferred Center
                    </label>
                    <Select value={formData.center} onValueChange={(value) => handleInputChange("center", value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-green-400/50">
                        <SelectValue placeholder="Select preferred center" />
                      </SelectTrigger>
                      <SelectContent className=" border-white/10">
                        <SelectItem value="thrissur">SLA-Thrissur Center</SelectItem>
                        <SelectItem value="chalakudy">SLA-Chalakudy Center</SelectItem>
                        <SelectItem value="peravoor">SLA-Peravoor Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Message
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us about your goals and any questions you have..."
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-400/50 focus:ring-green-400/20 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 sm:py-4 rounded-full shadow-lg hover:shadow-green-400/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Get in Touch</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                We're here to help you achieve your German language goals. Reach out to us through any of the following
                channels.
              </p>
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
