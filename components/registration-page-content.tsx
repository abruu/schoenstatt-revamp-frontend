"use client"

import { useState } from "react"
import { User, Send, ArrowLeft, Home, Upload, Calendar, Mail, Phone, MapPin, Users, CreditCard, Building, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/layout/footer"
import { ParticleBackground } from "@/components/layout/particle-background"
import Link from "next/link"

export function RegistrationPageContent() {
  const [formData, setFormData] = useState({
    photo: null as File | null,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    parentName: "",
    parentContact: "",
    aadhaarNumber: "",
    center: "",
    courseLevel: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reset form
    setFormData({
      photo: null,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      address: "",
      parentName: "",
      parentContact: "",
      aadhaarNumber: "",
      center: "",
      courseLevel: "",
    })
    setIsSubmitting(false)

    // Show success message
    alert("Registration successful! We'll contact you soon with more details.")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, photo: file }))
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <section className="relative z-10 py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Enhanced Back to Home Button - Always Visible */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white/90 hover:text-white transition-all duration-300 group shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 backdrop-blur-sm">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-medium text-xs sm:text-sm">STUDENT REGISTRATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold px-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Register Now
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Complete your registration for our German language courses. Please fill in all required information accurately to process your enrollment.
            </p>
          </div>

          {/* Registration Form */}
          <div className="relative mx-4 sm:mx-0">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Photo Upload */}
                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="photo" className="text-sm font-medium text-white block flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Photo *
                  </label>
                  <div className="relative">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">Choose a recent passport size photo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* First Name */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="firstName" className="text-sm font-medium text-white block">
                      First Name *
                    </label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="lastName" className="text-sm font-medium text-white block">
                      Last Name *
                    </label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Date of Birth */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium text-white block flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="email" className="text-sm font-medium text-white block flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email (e.g. name@example.com)"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Phone Number */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="phone" className="text-sm font-medium text-white block flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Aadhaar Number */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="aadhaarNumber" className="text-sm font-medium text-white block flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Aadhaar Card Number *
                    </label>
                    <div className="relative">
                      <Input
                        id="aadhaarNumber"
                        type="text"
                        placeholder="Enter your Aadhaar card number"
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="address" className="text-sm font-medium text-white block flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Residential Address *
                  </label>
                  <div className="relative">
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Parent's Name */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="parentName" className="text-sm font-medium text-white block flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Parent's Name *
                    </label>
                    <div className="relative">
                      <Input
                        id="parentName"
                        type="text"
                        placeholder="Enter parent/guardian's full name"
                        value={formData.parentName}
                        onChange={(e) => handleInputChange("parentName", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Parent's Contact */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="parentContact" className="text-sm font-medium text-white block flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Parent's Contact Number *
                    </label>
                    <div className="relative">
                      <Input
                        id="parentContact"
                        type="tel"
                        placeholder="Enter parent/guardian's phone number"
                        value={formData.parentContact}
                        onChange={(e) => handleInputChange("parentContact", e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Training Center */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="center" className="text-sm font-medium text-white block flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Training Center *
                    </label>
                    <div className="relative">
                      <Select value={formData.center} onValueChange={(value) => handleInputChange("center", value)} required>
                        <SelectTrigger className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base">
                          <SelectValue placeholder="Select your training center" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20 text-white">
                          <SelectItem value="thrissur">SLA-Thrissur Center</SelectItem>
                          <SelectItem value="chalakudy">SLA-Chalakudy Center</SelectItem>
                          <SelectItem value="peravoor">SLA-Peravoor Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Course Level */}
                  <div className="space-y-2 sm:space-y-3">
                    <label htmlFor="courseLevel" className="text-sm font-medium text-white block flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Course Level *
                    </label>
                    <div className="relative">
                      <Select value={formData.courseLevel} onValueChange={(value) => handleInputChange("courseLevel", value)} required>
                        <SelectTrigger className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base">
                          <SelectValue placeholder="Select your level (A1, A2, B1, B2)" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20 text-white">
                          <SelectItem value="a1">A1 - Beginner</SelectItem>
                          <SelectItem value="a2">A2 - Elementary</SelectItem>
                          <SelectItem value="b1">B1 - Intermediate</SelectItem>
                          <SelectItem value="b2">B2 - Upper Intermediate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 sm:pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base sm:text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span className="text-sm sm:text-base">Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">Complete Registration</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              {/* Additional Information */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">What happens next?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">1</span>
                      </div>
                      <p>We'll review your registration</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">2</span>
                      </div>
                      <p>Contact you with course details</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold text-xs sm:text-sm">3</span>
                      </div>
                      <p>Begin your German journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <p className="text-xs text-gray-500 text-center mt-6 sm:mt-8 px-2">
                By registering, you agree to our terms and conditions. We'll contact you with course details and enrollment information.
                Your personal information will be handled according to our privacy policy.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
